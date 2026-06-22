use std::error::Error;
use std::fmt;
use std::future::Future;
use std::pin::Pin;

use crate::models::{
    CreateMailMessageRequest, MailAccount, MailFolder, MailMessage, MailProviderAccount,
    MailThread, UpdateMailMessageRequest,
};

pub type MailPersistenceResult<T> = Result<T, MailPersistenceError>;
pub type MailPersistenceFuture<'a, T> =
    Pin<Box<dyn Future<Output = MailPersistenceResult<T>> + Send + 'a>>;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MailPersistenceError {
    Conflict(String),
    NotFound(String),
    Unavailable(String),
}

impl fmt::Display for MailPersistenceError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Conflict(message) | Self::NotFound(message) | Self::Unavailable(message) => {
                write!(formatter, "{message}")
            }
        }
    }
}

impl Error for MailPersistenceError {}

pub trait MailPersistencePort: Send + Sync {
    fn list_accounts<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        owner_user_id: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailAccount>>;

    fn list_folders<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        account_id: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailFolder>>;

    fn list_threads<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        folder_id: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailThread>>;

    fn list_messages<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        folder_id: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailMessage>>;

    fn retrieve_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        message_id: &'a str,
    ) -> MailPersistenceFuture<'a, MailMessage>;

    fn create_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        owner_user_id: &'a str,
        request: CreateMailMessageRequest,
    ) -> MailPersistenceFuture<'a, MailMessage>;

    fn update_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        message_id: &'a str,
        request: UpdateMailMessageRequest,
    ) -> MailPersistenceFuture<'a, MailMessage>;

    fn delete_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        message_id: &'a str,
    ) -> MailPersistenceFuture<'a, ()>;

    fn list_provider_accounts<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailProviderAccount>>;
}

#[derive(Clone, Copy, Debug, Default)]
pub struct NoopMailPersistencePort;

impl MailPersistencePort for NoopMailPersistencePort {
    fn list_accounts<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailAccount>> {
        Box::pin(async move { Ok(Vec::new()) })
    }

    fn list_folders<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailFolder>> {
        Box::pin(async move { Ok(Vec::new()) })
    }

    fn list_threads<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailThread>> {
        Box::pin(async move { Ok(Vec::new()) })
    }

    fn list_messages<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailMessage>> {
        Box::pin(async move { Ok(Vec::new()) })
    }

    fn retrieve_message<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        message_id: &'a str,
    ) -> MailPersistenceFuture<'a, MailMessage> {
        let message_id = message_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "message not found: {message_id}"
            )))
        })
    }

    fn create_message<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: &'a str,
        _: CreateMailMessageRequest,
    ) -> MailPersistenceFuture<'a, MailMessage> {
        Box::pin(async move {
            Err(MailPersistenceError::Unavailable(
                "persistence not configured".to_owned(),
            ))
        })
    }

    fn update_message<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        message_id: &'a str,
        _: UpdateMailMessageRequest,
    ) -> MailPersistenceFuture<'a, MailMessage> {
        let message_id = message_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "message not found: {message_id}"
            )))
        })
    }

    fn delete_message<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        message_id: &'a str,
    ) -> MailPersistenceFuture<'a, ()> {
        let message_id = message_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "message not found: {message_id}"
            )))
        })
    }

    fn list_provider_accounts<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, Vec<MailProviderAccount>> {
        Box::pin(async move { Ok(Vec::new()) })
    }
}
