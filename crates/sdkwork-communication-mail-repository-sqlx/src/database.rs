use std::sync::Arc;

use sdkwork_communication_mail_service::MailPersistencePort;
use sdkwork_database_repository::health::{HealthCheckResult, HealthChecker, HealthStatus};
use sdkwork_database_sqlx::{DatabasePool, PoolError, create_pool_from_env};

use crate::persistence::MailPostgresPersistencePort;

#[derive(Clone)]
pub struct MailPersistenceBootstrap {
    pub persistence: Arc<dyn MailPersistencePort>,
    pub pool: Option<DatabasePool>,
}

const MAIL_DATABASE_ENV_KEYS: &[&str] = &[
    "SDKWORK_MAIL_DATABASE_URL",
    "SDKWORK_MAIL_DATABASE_FILE",
    "SDKWORK_MAIL_DATABASE_ENGINE",
    "SDKWORK_MAIL_DATABASE_HOST",
    "SDKWORK_MAIL_DATABASE_PORT",
    "SDKWORK_MAIL_DATABASE_NAME",
    "SDKWORK_MAIL_DATABASE_SCHEMA",
    "SDKWORK_MAIL_DATABASE_USERNAME",
    "SDKWORK_MAIL_DATABASE_PASSWORD",
    "SDKWORK_MAIL_DATABASE_PASSWORD_FILE",
    "SDKWORK_MAIL_DATABASE_SSL_MODE",
    "SDKWORK_MAIL_DATABASE_MODE",
    "SDKWORK_MAIL_DATABASE_TABLE_PREFIX",
    "SDKWORK_MAIL_DATABASE_MAX_CONNECTIONS",
    "SDKWORK_MAIL_DATABASE_MIN_CONNECTIONS",
    "SDKWORK_MAIL_DATABASE_ACQUIRE_TIMEOUT",
    "SDKWORK_MAIL_DATABASE_IDLE_TIMEOUT",
    "SDKWORK_MAIL_DATABASE_MAX_LIFETIME",
];

pub async fn connect_mail_persistence_from_env()
-> Result<Option<Arc<dyn MailPersistencePort>>, PoolError> {
    Ok(connect_mail_persistence_bootstrap_from_env()
        .await?
        .map(|bootstrap| bootstrap.persistence))
}

pub async fn connect_mail_persistence_bootstrap_from_env()
-> Result<Option<MailPersistenceBootstrap>, PoolError> {
    if !mail_database_env_explicitly_configured() {
        return Ok(None);
    }

    if let Some(host) = sdkwork_mail_database_host::installed_mail_database_host() {
        let pool = host.pool().clone();
        let pg_pool = pool.as_postgres().ok_or_else(|| {
            PoolError::DatabaseConfig("mail persistence requires a PostgreSQL pool".to_string())
        })?;
        let persistence = Arc::new(MailPostgresPersistencePort::new(pg_pool.clone()));
        return Ok(Some(MailPersistenceBootstrap {
            persistence,
            pool: Some(pool),
        }));
    }

    let Some(pool) = create_pool_from_env("MAIL").await? else {
        return Ok(None);
    };
    let persistence = persistence_from_database_pool(pool.clone())
        .await
        .map_err(|error| PoolError::DatabaseConfig(error.to_string()))?;
    Ok(Some(MailPersistenceBootstrap {
        persistence,
        pool: Some(pool),
    }))
}

pub fn mail_database_env_explicitly_configured() -> bool {
    mail_database_env_values_explicitly_configured(|key| std::env::var(key).ok())
}

pub fn mail_database_env_values_explicitly_configured(
    lookup: impl Fn(&str) -> Option<String>,
) -> bool {
    MAIL_DATABASE_ENV_KEYS.iter().any(|key| {
        lookup(key)
            .map(|value| !value.trim().is_empty())
            .unwrap_or(false)
    })
}

pub async fn persistence_from_database_pool(
    pool: DatabasePool,
) -> Result<Arc<dyn MailPersistencePort>, sqlx::Error> {
    match pool {
        DatabasePool::Postgres(ref pg_pool, _) => {
            sdkwork_mail_database_host::bootstrap_mail_database(pool.clone())
                .await
                .map_err(|error| sqlx::Error::Configuration(error.into()))?;
            Ok(Arc::new(MailPostgresPersistencePort::new(pg_pool.clone())))
        }
        DatabasePool::Sqlite(_, _) => Err(sqlx::Error::Configuration(
            "sqlite is not supported for mail persistence".into(),
        )),
    }
}

pub async fn check_mail_database_health(
    pool: DatabasePool,
) -> Result<HealthCheckResult, PoolError> {
    HealthChecker::new(pool)
        .check()
        .await
        .map_err(|error| PoolError::DatabaseConfig(error.to_string()))
}

pub fn is_mail_database_healthy(result: &HealthCheckResult) -> bool {
    matches!(
        result.status,
        HealthStatus::Healthy | HealthStatus::Degraded(_)
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn mail_database_env_is_not_configured_without_mail_prefixed_keys() {
        assert!(!mail_database_env_values_explicitly_configured(|_| None));
    }

    #[test]
    fn mail_database_env_is_configured_when_mail_database_url_is_set() {
        let values = HashMap::from([(
            "SDKWORK_MAIL_DATABASE_URL".to_string(),
            "postgres://localhost/mail".to_string(),
        )]);
        assert!(mail_database_env_values_explicitly_configured(|key| {
            values.get(key).cloned()
        }));
    }
}
