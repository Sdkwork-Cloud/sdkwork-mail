use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailAccount {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub owner_user_id: String,
    pub email_address: String,
    pub display_name: Option<String>,
    pub provider_kind: String,
    pub status: MailAccountStatus,
    pub sync_enabled: bool,
    pub last_synced_at: Option<String>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailAccountStatus {
    Active,
    Disabled,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailFolder {
    pub id: String,
    pub account_id: String,
    pub folder_kind: MailFolderKind,
    pub name: String,
    pub parent_folder_id: Option<String>,
    pub unread_count: u32,
    pub total_count: u32,
    pub sort_order: i32,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailFolderKind {
    Inbox,
    Sent,
    Drafts,
    Trash,
    Archive,
    Spam,
    Custom,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailThread {
    pub id: String,
    pub account_id: String,
    pub folder_id: String,
    pub subject: String,
    pub snippet: Option<String>,
    pub participant_summary: Option<String>,
    pub message_count: u32,
    pub unread_count: u32,
    pub is_starred: bool,
    pub last_message_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailMessage {
    pub id: String,
    pub account_id: String,
    pub folder_id: String,
    pub thread_id: String,
    pub from_name: Option<String>,
    pub from_email: String,
    pub subject: String,
    pub snippet: Option<String>,
    pub body_text: Option<String>,
    pub body_html: Option<String>,
    pub is_read: bool,
    pub is_starred: bool,
    pub is_draft: bool,
    pub has_attachments: bool,
    pub sent_at: Option<String>,
    pub received_at: Option<String>,
    pub size_bytes: u64,
    pub recipients: Vec<MailMessageRecipient>,
    pub attachments: Vec<MailAttachment>,
    pub metadata: JsonValue,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailMessageRecipient {
    pub recipient_kind: MailRecipientKind,
    pub name: Option<String>,
    pub email_address: String,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailRecipientKind {
    To,
    Cc,
    Bcc,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailAttachment {
    pub id: String,
    pub message_id: String,
    pub file_name: String,
    pub content_type: String,
    pub size_bytes: u64,
    pub drive_node_id: Option<String>,
    pub checksum_sha256: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailLabel {
    pub id: String,
    pub account_id: String,
    pub name: String,
    pub color: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailProviderAccount {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub provider_kind: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub use_tls: bool,
    pub status: MailProviderAccountStatus,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailProviderAccountStatus {
    Active,
    Disabled,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateMailMessageRequest {
    pub account_id: String,
    pub folder_id: Option<String>,
    pub thread_id: Option<String>,
    pub subject: String,
    pub body_text: Option<String>,
    pub body_html: Option<String>,
    pub to: Vec<MailMessageRecipient>,
    pub cc: Vec<MailMessageRecipient>,
    pub bcc: Vec<MailMessageRecipient>,
    pub is_draft: bool,
    pub metadata: JsonValue,
}

#[derive(Clone, Debug, Default, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateMailMessageRequest {
    pub is_read: Option<bool>,
    pub is_starred: Option<bool>,
    pub folder_id: Option<String>,
    pub is_draft: Option<bool>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailTemplateCategory {
    Transactional,
    Marketing,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailTemplateStatus {
    Active,
    Disabled,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailTemplate {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub template_key: String,
    pub name: String,
    pub category: MailTemplateCategory,
    pub purpose: String,
    pub locale: String,
    pub subject_template: String,
    pub body_html_template: Option<String>,
    pub body_text_template: Option<String>,
    pub variable_schema: JsonValue,
    pub status: MailTemplateStatus,
    pub metadata: JsonValue,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateMailTemplateRequest {
    pub template_key: String,
    pub name: String,
    pub category: MailTemplateCategory,
    pub purpose: String,
    pub locale: Option<String>,
    pub subject_template: String,
    pub body_html_template: Option<String>,
    pub body_text_template: Option<String>,
    pub variable_schema: Option<JsonValue>,
    pub metadata: Option<JsonValue>,
}

#[derive(Clone, Debug, Default, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateMailTemplateRequest {
    pub name: Option<String>,
    pub category: Option<MailTemplateCategory>,
    pub purpose: Option<String>,
    pub subject_template: Option<String>,
    pub body_html_template: Option<String>,
    pub body_text_template: Option<String>,
    pub variable_schema: Option<JsonValue>,
    pub status: Option<MailTemplateStatus>,
    pub metadata: Option<JsonValue>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailVerificationPurpose {
    LoginVerification,
    PasswordReset,
    BindEmail,
    GenericOtp,
}

impl MailVerificationPurpose {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::LoginVerification => "login_verification",
            Self::PasswordReset => "password_reset",
            Self::BindEmail => "bind_email",
            Self::GenericOtp => "generic_otp",
        }
    }

    pub fn default_template_key(self) -> &'static str {
        match self {
            Self::LoginVerification => "login_verification",
            Self::PasswordReset => "password_reset",
            Self::BindEmail => "bind_email",
            Self::GenericOtp => "generic_otp",
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendMailVerificationRequest {
    pub recipient_email: String,
    pub purpose: MailVerificationPurpose,
    pub template_key: Option<String>,
    pub locale: Option<String>,
    pub variables: JsonValue,
    pub correlation_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendMailVerificationResult {
    pub challenge_id: String,
    pub delivery_id: String,
    pub expires_at: String,
    pub recipient_email: String,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerifyMailCodeRequest {
    pub recipient_email: String,
    pub purpose: MailVerificationPurpose,
    pub code: String,
    pub challenge_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerifyMailCodeResult {
    pub verified: bool,
    pub challenge_id: String,
    pub consumed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendTransactionalMailRequest {
    pub template_key: String,
    pub recipient_email: String,
    pub locale: Option<String>,
    pub variables: JsonValue,
    pub correlation_id: Option<String>,
    pub from_email: Option<String>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MailTransactionalDeliveryStatus {
    Queued,
    Sent,
    Failed,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailTransactionalDelivery {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub template_id: Option<String>,
    pub template_key: String,
    pub business_kind: String,
    pub recipient_email: String,
    pub from_email: Option<String>,
    pub subject: String,
    pub status: MailTransactionalDeliveryStatus,
    pub provider_account_id: Option<String>,
    pub correlation_id: Option<String>,
    pub last_error: Option<String>,
    pub sent_at: Option<String>,
    pub metadata: JsonValue,
    pub created_at: String,
}
