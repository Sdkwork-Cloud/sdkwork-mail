use std::error::Error;
use std::fmt;
use std::future::Future;
use std::pin::Pin;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailOutboundMessage {
    pub from_email: String,
    pub to_email: String,
    pub subject: String,
    pub body_text: Option<String>,
    pub body_html: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MailTransportError {
    Configuration(String),
    Delivery(String),
}

impl fmt::Display for MailTransportError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Configuration(message) | Self::Delivery(message) => {
                write!(formatter, "{message}")
            }
        }
    }
}

impl Error for MailTransportError {}

pub type MailTransportFuture<'a> =
    Pin<Box<dyn Future<Output = Result<(), MailTransportError>> + Send + 'a>>;

pub trait MailTransportPort: Send + Sync {
    fn send<'a>(&'a self, message: &'a MailOutboundMessage) -> MailTransportFuture<'a>;
}

pub struct UnconfiguredMailTransport;

impl MailTransportPort for UnconfiguredMailTransport {
    fn send<'a>(&'a self, _: &'a MailOutboundMessage) -> MailTransportFuture<'a> {
        Box::pin(async move {
            Err(MailTransportError::Configuration(
                "mail transport is not configured; set SDKWORK_MAIL_SMTP_HOST or SDKWORK_MAIL_TRANSPORT_MODE=log"
                    .to_owned(),
            ))
        })
    }
}
