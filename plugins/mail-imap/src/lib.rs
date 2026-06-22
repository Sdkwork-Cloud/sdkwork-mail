//! IMAP transport adapter for Mail sync providers.

pub const MAIL_IMAP_PLUGIN_ID: &str = "mail-imap";

pub fn plugin_descriptor() -> &'static str {
    "sdkwork-mail-imap-transport"
}

pub fn sync_state_digest(state: &str) -> String {
    sdkwork_utils_rust::sha256_hash(state.as_bytes())
}
