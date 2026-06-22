use std::error::Error;
use std::fmt;
use std::future::Future;
use std::pin::Pin;

use crate::models::{
    CreateMailMessageRequest, CreateMailTemplateRequest, MailAccount, MailFolder, MailMessage,
    MailProviderAccount, MailTemplate, MailTemplateCategory, MailThread, MailTransactionalDelivery,
    MailVerificationPurpose, UpdateMailMessageRequest, UpdateMailTemplateRequest,
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

    fn list_templates<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        category: Option<MailTemplateCategory>,
        purpose: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, Vec<MailTemplate>>;

    fn retrieve_template<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        template_id: &'a str,
    ) -> MailPersistenceFuture<'a, MailTemplate>;

    fn retrieve_template_by_key<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        template_key: &'a str,
        locale: &'a str,
    ) -> MailPersistenceFuture<'a, MailTemplate>;

    fn create_template<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        request: CreateMailTemplateRequest,
    ) -> MailPersistenceFuture<'a, MailTemplate>;

    fn update_template<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        template_id: &'a str,
        request: UpdateMailTemplateRequest,
    ) -> MailPersistenceFuture<'a, MailTemplate>;

    fn delete_template<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        template_id: &'a str,
    ) -> MailPersistenceFuture<'a, ()>;

    fn create_verification_challenge<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        challenge_id: &'a str,
        recipient_email: &'a str,
        purpose: MailVerificationPurpose,
        code_hash: &'a str,
        expires_at: &'a str,
        delivery_id: Option<&'a str>,
        metadata: serde_json::Value,
    ) -> MailPersistenceFuture<'a, String>;

    fn find_active_verification_challenge<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        recipient_email: &'a str,
        purpose: MailVerificationPurpose,
        challenge_id: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, ActiveVerificationChallenge>;

    fn increment_verification_attempt<'a>(
        &'a self,
        challenge_id: &'a str,
    ) -> MailPersistenceFuture<'a, ()>;

    fn consume_verification_challenge<'a>(
        &'a self,
        challenge_id: &'a str,
        consumed_at: &'a str,
    ) -> MailPersistenceFuture<'a, ()>;

    fn create_transactional_delivery<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        template_id: Option<&'a str>,
        template_key: &'a str,
        business_kind: &'a str,
        recipient_email: &'a str,
        from_email: Option<&'a str>,
        subject: &'a str,
        correlation_id: Option<&'a str>,
        metadata: serde_json::Value,
    ) -> MailPersistenceFuture<'a, MailTransactionalDelivery>;

    fn mark_transactional_delivery_sent<'a>(
        &'a self,
        delivery_id: &'a str,
        sent_at: &'a str,
        provider_account_id: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, MailTransactionalDelivery>;

    fn mark_transactional_delivery_failed<'a>(
        &'a self,
        delivery_id: &'a str,
        last_error: &'a str,
    ) -> MailPersistenceFuture<'a, MailTransactionalDelivery>;

    fn list_transactional_deliveries<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        business_kind: Option<&'a str>,
        recipient_email: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, Vec<MailTransactionalDelivery>>;
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ActiveVerificationChallenge {
    pub id: String,
    pub recipient_email: String,
    pub purpose: MailVerificationPurpose,
    pub code_hash: String,
    pub expires_at: String,
    pub attempt_count: i32,
    pub max_attempts: i32,
    pub delivery_id: Option<String>,
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

    fn list_templates<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: Option<MailTemplateCategory>,
        _: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, Vec<MailTemplate>> {
        Box::pin(async move { Ok(Vec::new()) })
    }

    fn retrieve_template<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        template_id: &'a str,
    ) -> MailPersistenceFuture<'a, MailTemplate> {
        let template_id = template_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "template not found: {template_id}"
            )))
        })
    }

    fn retrieve_template_by_key<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        template_key: &'a str,
        locale: &'a str,
    ) -> MailPersistenceFuture<'a, MailTemplate> {
        let template_key = template_key.to_owned();
        let locale = locale.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "template not found: {template_key}:{locale}"
            )))
        })
    }

    fn create_template<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: CreateMailTemplateRequest,
    ) -> MailPersistenceFuture<'a, MailTemplate> {
        Box::pin(async move {
            Err(MailPersistenceError::Unavailable(
                "persistence not configured".to_owned(),
            ))
        })
    }

    fn update_template<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        template_id: &'a str,
        _: UpdateMailTemplateRequest,
    ) -> MailPersistenceFuture<'a, MailTemplate> {
        let template_id = template_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "template not found: {template_id}"
            )))
        })
    }

    fn delete_template<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        template_id: &'a str,
    ) -> MailPersistenceFuture<'a, ()> {
        let template_id = template_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "template not found: {template_id}"
            )))
        })
    }

    fn create_verification_challenge<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        challenge_id: &'a str,
        _: &'a str,
        _: MailVerificationPurpose,
        _: &'a str,
        _: &'a str,
        _: Option<&'a str>,
        _: serde_json::Value,
    ) -> MailPersistenceFuture<'a, String> {
        let challenge_id = challenge_id.to_owned();
        Box::pin(async move { Ok(challenge_id) })
    }

    fn find_active_verification_challenge<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: &'a str,
        _: MailVerificationPurpose,
        _: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, ActiveVerificationChallenge> {
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(
                "verification challenge not found".to_owned(),
            ))
        })
    }

    fn increment_verification_attempt<'a>(&'a self, _: &'a str) -> MailPersistenceFuture<'a, ()> {
        Box::pin(async move { Ok(()) })
    }

    fn consume_verification_challenge<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, ()> {
        Box::pin(async move { Ok(()) })
    }

    fn create_transactional_delivery<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: Option<&'a str>,
        _: &'a str,
        _: &'a str,
        _: &'a str,
        _: Option<&'a str>,
        _: &'a str,
        _: Option<&'a str>,
        _: serde_json::Value,
    ) -> MailPersistenceFuture<'a, MailTransactionalDelivery> {
        Box::pin(async move {
            Err(MailPersistenceError::Unavailable(
                "persistence not configured".to_owned(),
            ))
        })
    }

    fn mark_transactional_delivery_sent<'a>(
        &'a self,
        delivery_id: &'a str,
        _: &'a str,
        _: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, MailTransactionalDelivery> {
        let delivery_id = delivery_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "delivery not found: {delivery_id}"
            )))
        })
    }

    fn mark_transactional_delivery_failed<'a>(
        &'a self,
        delivery_id: &'a str,
        _: &'a str,
    ) -> MailPersistenceFuture<'a, MailTransactionalDelivery> {
        let delivery_id = delivery_id.to_owned();
        Box::pin(async move {
            Err(MailPersistenceError::NotFound(format!(
                "delivery not found: {delivery_id}"
            )))
        })
    }

    fn list_transactional_deliveries<'a>(
        &'a self,
        _: &'a str,
        _: &'a str,
        _: Option<&'a str>,
        _: Option<&'a str>,
    ) -> MailPersistenceFuture<'a, Vec<MailTransactionalDelivery>> {
        Box::pin(async move { Ok(Vec::new()) })
    }
}
