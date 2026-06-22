//! IMAP transport adapter for Mail sync providers.

pub const MAIL_IMAP_PLUGIN_ID: &str = "mail-imap";

pub fn plugin_descriptor() -> &'static str {
    "sdkwork-mail-imap-transport"
}

mod config;
mod imap_sync;

pub use config::{ImapTransportConfig, build_imap_sync_from_env, resolve_secret_ref};
pub use imap_sync::ImapMailSync;
pub use sdkwork_communication_mail_service::MailSyncPort;

pub fn sync_state_digest(state: &str) -> String {
    sdkwork_utils_rust::sha256_hash(state.as_bytes())
}
