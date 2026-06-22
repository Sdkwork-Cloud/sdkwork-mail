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

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailMailboxProbeResult {
    pub mailbox: String,
    pub exists: u32,
    pub uid_validity: Option<u32>,
    pub uid_next: Option<u32>,
}

pub type MailMailboxProbeFuture<'a> =
    Pin<Box<dyn Future<Output = Result<MailMailboxProbeResult, MailSyncError>> + Send + 'a>>;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailMailboxSyncParams {
    pub since_uid: u32,
    pub limit: u32,
    pub mailbox: Option<String>,
}

impl Default for MailMailboxSyncParams {
    fn default() -> Self {
        Self {
            since_uid: 0,
            limit: 50,
            mailbox: None,
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailImapFetchedMessage {
    pub uid: u32,
    pub subject: String,
    pub from_name: Option<String>,
    pub from_email: String,
    pub received_at: Option<String>,
    pub message_id_header: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailMailboxSyncResult {
    pub mailbox: String,
    pub uid_validity: Option<u32>,
    pub synced_count: u32,
    pub highest_uid: Option<u32>,
    pub fetched: Vec<MailImapFetchedMessage>,
}

pub type MailMailboxSyncFuture<'a> =
    Pin<Box<dyn Future<Output = Result<MailMailboxSyncResult, MailSyncError>> + Send + 'a>>;

pub trait MailSyncPort: Send + Sync {
    fn ping<'a>(&'a self) -> MailSyncFuture<'a>;
    fn probe_mailbox<'a>(&'a self) -> MailMailboxProbeFuture<'a>;
    fn sync_mailbox<'a>(&'a self, params: MailMailboxSyncParams) -> MailMailboxSyncFuture<'a>;
}
