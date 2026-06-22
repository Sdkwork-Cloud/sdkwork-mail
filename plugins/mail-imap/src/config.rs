use std::sync::Arc;

use sdkwork_communication_mail_service::MailSyncPort;

use crate::imap_sync::ImapMailSync;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ImapTransportConfig {
    pub host: String,
    pub port: u16,
    pub use_tls: bool,
    pub username: String,
    pub password: Option<String>,
    pub mailbox: String,
}

pub fn resolve_secret_ref(secret_ref: &str) -> Option<String> {
    let trimmed = secret_ref.trim();
    if trimmed.is_empty() {
        return None;
    }
    if let Some(env_key) = trimmed.strip_prefix("env:") {
        return std::env::var(env_key)
            .ok()
            .filter(|value| !value.trim().is_empty());
    }
    if let Some(path) = trimmed.strip_prefix("secret://mail/") {
        let env_key = format!(
            "SDKWORK_MAIL_SECRET_{}",
            path.replace('/', "_").to_uppercase()
        );
        return std::env::var(env_key)
            .ok()
            .filter(|value| !value.trim().is_empty());
    }
    None
}

fn read_env_bool(key: &str, default: bool) -> bool {
    match std::env::var(key) {
        Ok(value) => matches!(
            value.trim().to_ascii_lowercase().as_str(),
            "1" | "true" | "yes"
        ),
        Err(_) => default,
    }
}

fn read_env_u16(key: &str, default: u16) -> u16 {
    std::env::var(key)
        .ok()
        .and_then(|value| value.trim().parse().ok())
        .unwrap_or(default)
}

pub fn build_imap_sync_from_env() -> Result<Arc<dyn MailSyncPort>, String> {
    let host = std::env::var("SDKWORK_MAIL_IMAP_HOST")
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .ok_or_else(|| "SDKWORK_MAIL_IMAP_HOST is not configured".to_owned())?;

    let username = std::env::var("SDKWORK_MAIL_IMAP_USERNAME")
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .ok_or_else(|| "SDKWORK_MAIL_IMAP_USERNAME is not configured".to_owned())?;

    Ok(Arc::new(ImapMailSync::new(ImapTransportConfig {
        host,
        port: read_env_u16("SDKWORK_MAIL_IMAP_PORT", 993),
        use_tls: read_env_bool("SDKWORK_MAIL_IMAP_USE_TLS", true),
        username,
        password: std::env::var("SDKWORK_MAIL_IMAP_PASSWORD")
            .ok()
            .map(|value| value.trim().to_owned())
            .filter(|value| !value.is_empty()),
        mailbox: std::env::var("SDKWORK_MAIL_IMAP_MAILBOX")
            .ok()
            .map(|value| value.trim().to_owned())
            .filter(|value| !value.is_empty())
            .unwrap_or_else(|| "INBOX".to_owned()),
    })))
}
