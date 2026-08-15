use sdkwork_api_mail_assembly::{
    assemble_api_router_with_bootstrap, bootstrap_mail_api_service_from_env,
};
use sdkwork_web_bootstrap::{service_router, ServiceRouterConfig};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let bootstrap = bootstrap_mail_api_service_from_env().await?;
    let assembly = assemble_api_router_with_bootstrap(bootstrap).await?;

    let app = service_router(
        assembly.router,
        ServiceRouterConfig::default().with_readiness_check(assembly.readiness_check),
    );

    let bind_addr = std::env::var("SDKWORK_MAIL_APPLICATION_PUBLIC_INGRESS_BIND")
        .unwrap_or_else(|_| "127.0.0.1:18090".into());
    let listener = tokio::net::TcpListener::bind(bind_addr.as_str()).await?;
    tracing::info!(%bind_addr, "sdkwork-api-mail-standalone-gateway listening");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    tracing::info!("sdkwork-api-mail-standalone-gateway stopped");
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
