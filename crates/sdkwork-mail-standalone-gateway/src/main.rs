use std::sync::Arc;

use sdkwork_mail_gateway_assembly::assemble_application_router_with_service;
use sdkwork_web_bootstrap::{ServiceRouterConfig, service_router};

mod bootstrap;
mod readiness;
use bootstrap::build_mail_api_bootstrap;
use readiness::MailDatabaseReadinessCheck;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let bootstrap = build_mail_api_bootstrap().await?;
    let assembly = assemble_application_router_with_service(bootstrap.service).await;

    let service_router_config = if let Some(pool) = bootstrap.database_pool {
        ServiceRouterConfig::default()
            .with_readiness_check(Arc::new(MailDatabaseReadinessCheck::new(pool)))
    } else {
        ServiceRouterConfig::default().with_always_ready()
    };

    let app = service_router(assembly.router, service_router_config);

    let bind_addr = std::env::var("SDKWORK_MAIL_APPLICATION_PUBLIC_INGRESS_BIND")
        .unwrap_or_else(|_| "127.0.0.1:18090".into());
    let listener = tokio::net::TcpListener::bind(bind_addr.as_str()).await?;
    tracing::info!(%bind_addr, "sdkwork-mail-standalone-gateway listening");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    tracing::info!("sdkwork-mail-standalone-gateway stopped");
    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }
}
