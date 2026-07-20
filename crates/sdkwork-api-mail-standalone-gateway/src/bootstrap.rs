use std::sync::Arc;

use sdkwork_communication_mail_repository_sqlx::connect_mail_persistence_bootstrap_from_env;
use sdkwork_database_sqlx::DatabasePool;
use sdkwork_mail_adapter_smtp::build_mail_transport_from_env_arc;
use sdkwork_mail_service_host::{MailProductService, build_mail_drive_attachment_port_from_env};

pub struct MailApiBootstrap {
    pub service: Arc<MailProductService>,
    pub database_pool: Option<DatabasePool>,
}

pub async fn build_mail_api_bootstrap() -> anyhow::Result<MailApiBootstrap> {
    let mut service = MailProductService::new()
        .with_transport(build_mail_transport_from_env_arc())
        .with_drive_attachment_port(build_mail_drive_attachment_port_from_env());
    let mut database_pool = None;

    if let Some(bootstrap) = connect_mail_persistence_bootstrap_from_env()
        .await
        .map_err(|error| anyhow::anyhow!("connect mail persistence: {error}"))?
    {
        database_pool = bootstrap.pool;
        service = service.with_persistence(bootstrap.persistence);
    }

    Ok(MailApiBootstrap {
        service: Arc::new(service),
        database_pool,
    })
}
