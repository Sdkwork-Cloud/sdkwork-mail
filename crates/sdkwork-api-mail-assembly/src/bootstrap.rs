//! Gateway bootstrap for sdkwork-mail.
//! Multi-surface assembly merges business routers only; listeners add infra via `service_router`.

use axum::Router;
use sdkwork_communication_mail_repository_sqlx::connect_mail_persistence_bootstrap_from_env;
use sdkwork_mail_adapter_smtp::build_mail_transport_from_env_arc;
use sdkwork_mail_service_host::MailProductService;
use std::sync::Arc;

pub struct ApiAssembly {
    pub router: Router,
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

    ApiAssembly {
        router: Router::new().merge(app_router).merge(backend_router),
    }
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
