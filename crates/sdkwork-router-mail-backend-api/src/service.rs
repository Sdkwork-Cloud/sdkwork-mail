use std::future::Future;
use std::pin::Pin;

use sdkwork_communication_mail_service::MailProviderAccount;
use sdkwork_communication_mail_service::{
    CreateMailTemplateRequest, MailTemplate, MailTemplateCategory, MailTransactionalDelivery,
    UpdateMailTemplateRequest,
};
use serde::{Deserialize, Serialize};

pub type MailBackendApiFuture<T> =
    Pin<Box<dyn Future<Output = Result<T, MailBackendApiError>> + Send>>;

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailBackendListRequest {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailBackendListData<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MailBackendApiError {
    BadRequest(String),
    Forbidden(String),
    NotFound(String),
    Conflict(String),
    Unavailable(String),
    Internal(String),
}

impl MailBackendApiError {
    pub fn status_code(&self) -> axum::http::StatusCode {
        match self {
            Self::BadRequest(_) => axum::http::StatusCode::BAD_REQUEST,
            Self::Forbidden(_) => axum::http::StatusCode::FORBIDDEN,
            Self::NotFound(_) => axum::http::StatusCode::NOT_FOUND,
            Self::Conflict(_) => axum::http::StatusCode::CONFLICT,
            Self::Unavailable(_) => axum::http::StatusCode::SERVICE_UNAVAILABLE,
            Self::Internal(_) => axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn code(&self) -> &'static str {
        match self {
            Self::BadRequest(_) => "bad_request",
            Self::Forbidden(_) => "forbidden",
            Self::NotFound(_) => "not_found",
            Self::Conflict(_) => "conflict",
            Self::Unavailable(_) => "unavailable",
            Self::Internal(_) => "internal_error",
        }
    }

    pub fn message(&self) -> &str {
        match self {
            Self::BadRequest(message)
            | Self::Forbidden(message)
            | Self::NotFound(message)
            | Self::Conflict(message)
            | Self::Unavailable(message)
            | Self::Internal(message) => message.as_str(),
        }
    }
}

pub trait MailBackendApiService: Send + Sync + 'static {
    fn list_provider_accounts(
        &self,
        request: MailBackendListRequest,
    ) -> MailBackendApiFuture<MailBackendListData<MailProviderAccount>>;
    fn list_templates(
        &self,
        request: MailBackendListRequest,
        category: Option<MailTemplateCategory>,
        purpose: Option<String>,
    ) -> MailBackendApiFuture<MailBackendListData<MailTemplate>>;
    fn create_template(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        request: CreateMailTemplateRequest,
    ) -> MailBackendApiFuture<MailTemplate>;
    fn retrieve_template(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        template_id: String,
    ) -> MailBackendApiFuture<MailTemplate>;
    fn update_template(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        template_id: String,
        request: UpdateMailTemplateRequest,
    ) -> MailBackendApiFuture<MailTemplate>;
    fn delete_template(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        template_id: String,
    ) -> MailBackendApiFuture<()>;
    fn list_transactional_deliveries(
        &self,
        request: MailBackendListRequest,
        business_kind: Option<String>,
        recipient_email: Option<String>,
    ) -> MailBackendApiFuture<MailBackendListData<MailTransactionalDelivery>>;
}
