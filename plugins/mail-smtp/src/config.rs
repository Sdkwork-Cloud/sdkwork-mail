use std::sync::Arc;

use sdkwork_communication_mail_service::MailTransportPort;

use crate::logging_transport::LoggingMailTransport;
use crate::smtp_transport::SmtpMailTransport;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SmtpTransportConfig {
    pub host: String,
    pub port: u16,
    pub use_tls: bool,
    pub username: Option<String>,
    pub password: Option<String>,
    pub from_email: String,
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

pub fn build_mail_transport_from_env() -> Result<Arc<dyn MailTransportPort>, String> {
    if matches!(
        std::env::var("SDKWORK_MAIL_TRANSPORT_MODE")
            .ok()
            .map(|value| value.trim().to_ascii_lowercase())
            .as_deref(),
        Some("log")
    ) {
        return Ok(Arc::new(LoggingMailTransport));
    }

    let host = std::env::var("SDKWORK_MAIL_SMTP_HOST")
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .ok_or_else(|| "SDKWORK_MAIL_SMTP_HOST is not configured".to_owned())?;

    let from_email = std::env::var("SDKWORK_MAIL_SMTP_FROM_EMAIL")
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .or_else(|| std::env::var("SDKWORK_MAIL_SMTP_USERNAME").ok())
        .filter(|value| !value.trim().is_empty())
        .ok_or_else(|| "SDKWORK_MAIL_SMTP_FROM_EMAIL is not configured".to_owned())?;

    let config = SmtpTransportConfig {
        host,
        port: read_env_u16("SDKWORK_MAIL_SMTP_PORT", 587),
        use_tls: read_env_bool("SDKWORK_MAIL_SMTP_USE_TLS", true),
        username: std::env::var("SDKWORK_MAIL_SMTP_USERNAME")
            .ok()
            .map(|value| value.trim().to_owned())
            .filter(|value| !value.is_empty()),
        password: std::env::var("SDKWORK_MAIL_SMTP_PASSWORD")
            .ok()
            .map(|value| value.trim().to_owned())
            .filter(|value| !value.is_empty()),
        from_email,
    };

    Ok(Arc::new(SmtpMailTransport::new(config)))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resolves_empty_secret_refs_to_none() {
        assert_eq!(resolve_secret_ref(""), None);
    }
}
