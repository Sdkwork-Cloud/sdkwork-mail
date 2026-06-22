use std::error::Error;
use std::fmt;
use std::future::Future;
use std::pin::Pin;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailImapSyncConfig {
    pub host: String,
    pub port: u16,
    pub use_tls: bool,
    pub username: String,
    pub mailbox: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MailSyncError {
    Configuration(String),
    Sync(String),
}

impl fmt::Display for MailSyncError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Configuration(message) | Self::Sync(message) => write!(formatter, "{message}"),
        }
    }
}

impl Error for MailSyncError {}

pub type MailSyncFuture<'a> = Pin<Box<dyn Future<Output = Result<(), MailSyncError>> + Send + 'a>>;

pub trait MailSyncPort: Send + Sync {
    fn ping<'a>(&'a self) -> MailSyncFuture<'a>;
}
