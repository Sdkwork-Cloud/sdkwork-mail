use std::sync::Arc;

use sdkwork_communication_mail_service::{
    MailOutboundMessage, MailTransportError, MailTransportPort,
};

pub const MAIL_SMTP_PLUGIN_ID: &str = "mail-smtp";

pub fn plugin_descriptor() -> &'static str {
    "sdkwork-mail-smtp-transport"
}

mod config;
mod logging_transport;
mod smtp_transport;

pub use config::{SmtpTransportConfig, build_mail_transport_from_env, resolve_secret_ref};
pub use logging_transport::LoggingMailTransport;
pub use smtp_transport::SmtpMailTransport;

pub fn build_mail_transport_from_env_arc() -> Arc<dyn MailTransportPort> {
    build_mail_transport_from_env()
        .unwrap_or_else(|_| Arc::new(sdkwork_communication_mail_service::UnconfiguredMailTransport))
}

pub fn build_smtp_transport(config: SmtpTransportConfig) -> Arc<dyn MailTransportPort> {
    Arc::new(SmtpMailTransport::new(config))
}

pub fn validate_outbound_message(message: &MailOutboundMessage) -> Result<(), MailTransportError> {
    if message.from_email.trim().is_empty() {
        return Err(MailTransportError::Configuration(
            "fromEmail is required".to_owned(),
        ));
    }
    if message.to_email.trim().is_empty() || !message.to_email.contains('@') {
        return Err(MailTransportError::Configuration(
            "toEmail is invalid".to_owned(),
        ));
    }
    if message.subject.trim().is_empty() {
        return Err(MailTransportError::Configuration(
            "subject is required".to_owned(),
        ));
    }
    if message.body_text.as_deref().unwrap_or("").is_empty()
        && message.body_html.as_deref().unwrap_or("").is_empty()
    {
        return Err(MailTransportError::Configuration(
            "message body is required".to_owned(),
        ));
    }
    Ok(())
}
