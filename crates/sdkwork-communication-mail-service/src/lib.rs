//! SDKWork Mail domain service — accounts, folders, threads, messages, attachments.

pub mod error;
pub mod list_window;
pub mod models;
pub mod persistence;

pub use error::{MailResult, MailServiceError};
pub use list_window::{
    DEFAULT_LIST_PAGE_SIZE, MAX_LIST_PAGE_SIZE, MailListWindow, MailListWindowError,
    MailListWindowParams, apply_list_window, matches_query_tokens,
};
pub use models::*;
pub use persistence::{
    MailPersistenceError, MailPersistenceFuture, MailPersistencePort, MailPersistenceResult,
    NoopMailPersistencePort,
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
