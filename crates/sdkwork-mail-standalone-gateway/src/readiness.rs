use std::future::Future;
use std::pin::Pin;

use sdkwork_communication_mail_repository_sqlx::{
    check_mail_database_health, is_mail_database_healthy,
};
use sdkwork_database_sqlx::DatabasePool;
use sdkwork_web_bootstrap::ReadinessCheck;

pub struct MailDatabaseReadinessCheck {
    pool: DatabasePool,
}

impl MailDatabaseReadinessCheck {
    pub fn new(pool: DatabasePool) -> Self {
        Self { pool }
    }
}

impl ReadinessCheck for MailDatabaseReadinessCheck {
    fn check(&self) -> Pin<Box<dyn Future<Output = Result<(), String>> + Send + '_>> {
        let pool = self.pool.clone();
        Box::pin(async move {
            let result = check_mail_database_health(pool)
                .await
                .map_err(|error| error.to_string())?;
            if is_mail_database_healthy(&result) {
                Ok(())
            } else {
                Err(format!("Mail database not ready: {:?}", result.status))
            }
        })
    }
}
