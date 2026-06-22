use std::future::Future;
use std::pin::Pin;

use sdkwork_communication_mail_service::{
    CreateMailMessageRequest, MailAccount, MailFolder, MailMessage, MailThread,
    UpdateMailMessageRequest,
};
use serde::{Deserialize, Serialize};

pub type MailAppApiFuture<T> = Pin<Box<dyn Future<Output = Result<T, MailAppApiError>> + Send>>;

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailListRequest {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub owner_user_id: String,
    pub account_id: Option<String>,
    pub folder_id: Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
    pub cursor: Option<String>,
    pub q: Option<String>,
    pub sort: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailListData<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MailAppApiError {
    BadRequest(String),
    Forbidden(String),
    NotFound(String),
    Conflict(String),
    Unavailable(String),
    Internal(String),
}

impl MailAppApiError {
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

pub trait MailAppApiService: Send + Sync + 'static {
    fn list_accounts(
        &self,
        request: MailListRequest,
    ) -> MailAppApiFuture<MailListData<MailAccount>>;
    fn list_folders(&self, request: MailListRequest) -> MailAppApiFuture<MailListData<MailFolder>>;
    fn list_threads(&self, request: MailListRequest) -> MailAppApiFuture<MailListData<MailThread>>;
    fn list_messages(
        &self,
        request: MailListRequest,
    ) -> MailAppApiFuture<MailListData<MailMessage>>;
    fn retrieve_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        message_id: String,
    ) -> MailAppApiFuture<MailMessage>;
    fn create_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        owner_user_id: String,
        request: CreateMailMessageRequest,
    ) -> MailAppApiFuture<MailMessage>;
    fn update_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        message_id: String,
        request: UpdateMailMessageRequest,
    ) -> MailAppApiFuture<MailMessage>;
    fn delete_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        message_id: String,
    ) -> MailAppApiFuture<()>;
    fn send_verification_code(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        request: sdkwork_communication_mail_service::SendMailVerificationRequest,
    ) -> MailAppApiFuture<sdkwork_communication_mail_service::SendMailVerificationResult>;
    fn verify_verification_code(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        request: sdkwork_communication_mail_service::VerifyMailCodeRequest,
    ) -> MailAppApiFuture<sdkwork_communication_mail_service::VerifyMailCodeResult>;
    fn send_transactional_mail(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        request: sdkwork_communication_mail_service::SendTransactionalMailRequest,
    ) -> MailAppApiFuture<sdkwork_communication_mail_service::MailTransactionalDelivery>;
}
