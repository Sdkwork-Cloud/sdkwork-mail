//! Gateway bootstrap for sdkwork-mail.
//! Multi-surface assembly merges business routers only; listeners add infra via `service_router`.
//!
//! The assembly exports the indivisible `ApiAssemblyContribution` contract
//! (API_ASSEMBLY_SPEC.md section 4); the platform cloud gateway composes the
//! contribution with its process-shared PostgreSQL pool.

use std::sync::Arc;

use axum::Router;
use sdkwork_communication_mail_repository_sqlx::{
    connect_mail_persistence_bootstrap_from_env, persistence_from_database_pool,
};
use sdkwork_database_sqlx::DatabasePool;
use sdkwork_mail_adapter_smtp::build_mail_transport_from_env_arc;
use sdkwork_mail_service_host::MailProductService;
use sdkwork_web_bootstrap::{
    ApiAssemblyContribution, DatabasePoolReadinessCheck, ReadinessCheck,
};
use sdkwork_web_core::HttpRouteManifest;

/// Indivisible host-neutral API assembly contribution (web-bootstrap contract).
pub type ApiAssembly = ApiAssemblyContribution;

fn combined_route_manifest() -> HttpRouteManifest {
    let manifests = [
        sdkwork_routes_mail_app_api::gateway_route_manifest(),
        sdkwork_routes_mail_backend_api::gateway_route_manifest(),
    ];
    HttpRouteManifest::from_owned_routes(
        manifests
            .into_iter()
            .flat_map(|manifest| manifest.routes().to_vec())
            .collect(),
    )
}

fn openapi_documents() -> Result<Vec<serde_json::Value>, String> {
    [
        (
            "sdkwork-mail-app-api",
            include_str!("../../../apis/app-api/communication/sdkwork-mail-app-api.openapi.json"),
        ),
        (
            "sdkwork-mail-backend-api",
            include_str!("../../../apis/backend-api/communication/sdkwork-mail-backend-api.openapi.json"),
        ),
    ]
    .into_iter()
    .map(|(owner, source)| {
        serde_json::from_str(source).map_err(|error| format!("invalid {owner} OpenAPI: {error}"))
    })
    .collect()
}

fn contribution_from(
    router: Router,
    readiness_check: Arc<dyn ReadinessCheck>,
) -> Result<ApiAssembly, String> {
    ApiAssemblyContribution::from_openapi_documents(
        "sdkwork-mail",
        "SDKWork Mail API",
        router,
        combined_route_manifest(),
        openapi_documents()?,
        vec![
            Arc::new(sdkwork_routes_mail_app_api::MailAppContextInjector),
            Arc::new(sdkwork_routes_mail_backend_api::MailBackendContextInjector),
        ],
        readiness_check,
    )
}

pub async fn assemble_api_router_with_service(
    service: Arc<MailProductService>,
) -> ApiAssembly {
    let app_router = sdkwork_routes_mail_app_api::wrap_router_with_web_framework_from_env(
        sdkwork_routes_mail_app_api::gateway_mount(service.clone()),
    )
    .await;
    let backend_router = sdkwork_routes_mail_backend_api::wrap_router_with_web_framework_from_env(
        sdkwork_routes_mail_backend_api::gateway_mount(service),
    )
    .await;

    contribution_from(
        Router::new().merge(app_router).merge(backend_router),
        Arc::new(sdkwork_web_bootstrap::AlwaysReady),
    )
    .expect("mail contribution contract is valid")
}

pub async fn assemble_api_router() -> anyhow::Result<ApiAssembly> {
    let mut service = MailProductService::new().with_transport(build_mail_transport_from_env_arc());

    if let Some(bootstrap) = connect_mail_persistence_bootstrap_from_env()
        .await
        .map_err(|error| anyhow::anyhow!("connect mail persistence: {error}"))?
    {
        service = service.with_persistence(bootstrap.persistence);
    }

    Ok(assemble_api_router_with_service(Arc::new(service)).await)
}

/// Assemble the Mail contribution against a caller-provided database pool so the
/// platform cloud gateway can share its process-wide PostgreSQL pool.
pub async fn assemble_api_router_with_pool(pool: DatabasePool) -> Result<ApiAssembly, String> {
    let persistence = persistence_from_database_pool(pool.clone())
        .await
        .map_err(|error| format!("connect mail persistence: {error}"))?;
    let service = Arc::new(
        MailProductService::new()
            .with_transport(build_mail_transport_from_env_arc())
            .with_persistence(persistence),
    );

    let router = Router::new()
        .merge(sdkwork_routes_mail_app_api::gateway_mount(service.clone()))
        .merge(sdkwork_routes_mail_backend_api::gateway_mount(service));
    contribution_from(
        router,
        Arc::new(DatabasePoolReadinessCheck::new(pool)),
    )
}
