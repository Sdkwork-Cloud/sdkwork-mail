//! SDKWork Mail domain service — accounts, folders, threads, messages, attachments.

pub mod drive_attachment;
pub mod error;
pub mod list_window;
pub mod models;
pub mod persistence;
pub mod sync;
pub mod transactional;
pub mod transport;

pub use drive_attachment::{
    LocalMailDriveAttachmentPort, MailDriveAttachmentError, MailDriveAttachmentFuture,
    MailDriveAttachmentPort, validate_mail_attachment_fields,
};
pub use error::{MailResult, MailServiceError};
pub use list_window::{
    DEFAULT_LIST_PAGE_SIZE, MAX_LIST_PAGE_SIZE, MailListWindow, MailListWindowError,
    MailListWindowParams, apply_list_window, matches_query_tokens,
};
pub use models::*;
pub use persistence::{
    ActiveVerificationChallenge, MailPersistenceError, MailPersistenceFuture, MailPersistencePort,
    MailPersistenceResult, NoopMailPersistencePort,
};
pub use sync::{
    MailImapFetchedMessage, MailImapSyncConfig, MailMailboxProbeFuture, MailMailboxProbeResult,
    MailMailboxSyncFuture, MailMailboxSyncParams, MailMailboxSyncResult, MailSyncError,
    MailSyncFuture, MailSyncPort,
};
pub use transactional::{
    DEFAULT_VERIFICATION_CODE_LENGTH, DEFAULT_VERIFICATION_MAX_ATTEMPTS,
    DEFAULT_VERIFICATION_TTL_MINUTES, build_verification_variables, empty_object,
    generate_numeric_verification_code, hash_verification_code, json_to_string_map,
    merge_template_variables, normalize_email, purpose_to_template_key, render_template,
    verification_purpose_key,
};
pub use transport::{
    MailOutboundMessage, MailTransportError, MailTransportFuture, MailTransportPort,
    UnconfiguredMailTransport,
};

pub const MAIL_OWNER: &str = "sdkwork-mail";
pub const MAIL_DOMAIN: &str = "mail";
pub const MAIL_APP_API_AUTHORITY: &str = "sdkwork-mail-app-api";
pub const MAIL_APP_SDK_FAMILY: &str = "sdkwork-mail-app-sdk";
pub const MAIL_APP_API_PREFIX: &str = "/app/v3/api";
pub const MAIL_BACKEND_API_AUTHORITY: &str = "sdkwork-mail-backend-api";
pub const MAIL_BACKEND_SDK_FAMILY: &str = "sdkwork-mail-backend-sdk";
pub const MAIL_BACKEND_API_PREFIX: &str = "/backend/v3/api";

pub fn utc_now_rfc3339_millis() -> String {
    sdkwork_utils_rust::format_datetime(sdkwork_utils_rust::now(), None)
}

pub use sdkwork_utils_rust::sha256_hash;
