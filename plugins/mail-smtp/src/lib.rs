//! SMTP transport adapter for Mail delivery providers.

pub const MAIL_SMTP_PLUGIN_ID: &str = "mail-smtp";

pub fn plugin_descriptor() -> &'static str {
    "sdkwork-mail-smtp-transport"
}
