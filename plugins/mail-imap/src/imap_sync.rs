use std::sync::Arc;

use async_imap::Client;
use async_imap::Session;
use async_imap::imap_proto::types::Address;
use async_imap::types::Fetch;
use futures_util::Stream;
use futures_util::StreamExt;
use sdkwork_communication_mail_service::{
    MailImapFetchedMessage, MailImapSyncConfig, MailMailboxProbeResult, MailMailboxSyncParams,
    MailMailboxSyncResult, MailSyncError, MailSyncFuture, MailSyncPort,
};
use tokio::net::TcpStream;
use tokio_rustls::TlsConnector;
use tokio_rustls::client::TlsStream;
use tokio_rustls::rustls::pki_types::ServerName;
use tokio_rustls::rustls::{ClientConfig, RootCertStore};

use crate::config::ImapTransportConfig;

const DEFAULT_SYNC_LIMIT: u32 = 50;
const MAX_SYNC_LIMIT: u32 = 200;

pub struct ImapMailSync {
    config: ImapTransportConfig,
}

enum ImapSession {
    Plain(Session<TcpStream>),
    Tls(Session<TlsStream<TcpStream>>),
}

impl ImapSession {
    async fn select(&mut self, mailbox: &str) -> Result<async_imap::types::Mailbox, MailSyncError> {
        match self {
            Self::Plain(session) => session
                .select(mailbox)
                .await
                .map_err(|error| MailSyncError::Sync(format!("imap select failed: {error}"))),
            Self::Tls(session) => session
                .select(mailbox)
                .await
                .map_err(|error| MailSyncError::Sync(format!("imap select failed: {error}"))),
        }
    }

    async fn uid_fetch_messages(
        &mut self,
        uid_set: &str,
        since_uid: u32,
        limit: u32,
    ) -> Result<Vec<MailImapFetchedMessage>, MailSyncError> {
        match self {
            Self::Plain(session) => {
                let stream = session
                    .uid_fetch(uid_set, "UID ENVELOPE INTERNALDATE")
                    .await
                    .map_err(|error| {
                        MailSyncError::Sync(format!("imap uid fetch failed: {error}"))
                    })?;
                collect_fetched_messages(stream, since_uid, limit).await
            }
            Self::Tls(session) => {
                let stream = session
                    .uid_fetch(uid_set, "UID ENVELOPE INTERNALDATE")
                    .await
                    .map_err(|error| {
                        MailSyncError::Sync(format!("imap uid fetch failed: {error}"))
                    })?;
                collect_fetched_messages(stream, since_uid, limit).await
            }
        }
    }

    async fn logout(self) -> Result<(), MailSyncError> {
        match self {
            Self::Plain(mut session) => session
                .logout()
                .await
                .map_err(|error| MailSyncError::Sync(format!("imap logout failed: {error}"))),
            Self::Tls(mut session) => session
                .logout()
                .await
                .map_err(|error| MailSyncError::Sync(format!("imap logout failed: {error}"))),
        }
    }
}

impl ImapMailSync {
    pub fn new(config: ImapTransportConfig) -> Self {
        Self { config }
    }

    fn to_sync_config(&self) -> MailImapSyncConfig {
        MailImapSyncConfig {
            host: self.config.host.clone(),
            port: self.config.port,
            use_tls: self.config.use_tls,
            username: self.config.username.clone(),
            mailbox: self.config.mailbox.clone(),
        }
    }

    fn validated_credentials(&self) -> Result<(MailImapSyncConfig, String), MailSyncError> {
        let config = self.to_sync_config();
        if config.host.trim().is_empty() {
            return Err(MailSyncError::Configuration(
                "imap host is not configured".to_owned(),
            ));
        }
        if config.username.trim().is_empty() {
            return Err(MailSyncError::Configuration(
                "imap username is not configured".to_owned(),
            ));
        }
        let password = self.config.password.clone().ok_or_else(|| {
            MailSyncError::Configuration("imap password is not configured".to_owned())
        })?;
        Ok((config, password))
    }

    async fn connect_session(&self) -> Result<(ImapSession, MailImapSyncConfig), MailSyncError> {
        let (config, password) = self.validated_credentials()?;
        let address = format!("{}:{}", config.host, config.port);
        let tcp = TcpStream::connect(&address)
            .await
            .map_err(|error| MailSyncError::Sync(format!("imap tcp connect failed: {error}")))?;

        if config.use_tls {
            let mut root_store = RootCertStore::empty();
            root_store.extend(webpki_roots::TLS_SERVER_ROOTS.iter().cloned());
            let tls_config = ClientConfig::builder()
                .with_root_certificates(root_store)
                .with_no_client_auth();
            let connector = TlsConnector::from(Arc::new(tls_config));
            let host = config.host.clone();
            let server_name: ServerName<'static> = host
                .try_into()
                .map_err(|error| MailSyncError::Sync(format!("invalid imap host: {error}")))?;
            let tls = connector.connect(server_name, tcp).await.map_err(|error| {
                MailSyncError::Sync(format!("imap tls handshake failed: {error}"))
            })?;
            let client = Client::new(tls);
            let session = client
                .login(&config.username, password.as_str())
                .await
                .map_err(|(error, _)| MailSyncError::Sync(format!("imap login failed: {error}")))?;
            return Ok((ImapSession::Tls(session), config));
        }

        let client = Client::new(tcp);
        let session = client
            .login(&config.username, password.as_str())
            .await
            .map_err(|(error, _)| MailSyncError::Sync(format!("imap login failed: {error}")))?;
        Ok((ImapSession::Plain(session), config))
    }

    async fn ping_imap(&self) -> Result<(), MailSyncError> {
        let (session, _) = self.connect_session().await?;
        session.logout().await
    }

    pub async fn probe_mailbox(&self) -> Result<MailMailboxProbeResult, MailSyncError> {
        let (mut session, config) = self.connect_session().await?;
        let mailbox = session.select(&config.mailbox).await?;
        let result = MailMailboxProbeResult {
            mailbox: config.mailbox,
            exists: mailbox.exists,
            uid_validity: mailbox.uid_validity,
            uid_next: mailbox.uid_next,
        };
        session.logout().await?;
        Ok(result)
    }

    pub async fn sync_mailbox(
        &self,
        params: MailMailboxSyncParams,
    ) -> Result<MailMailboxSyncResult, MailSyncError> {
        let (mut session, config) = self.connect_session().await?;
        let mailbox_name = params
            .mailbox
            .clone()
            .unwrap_or_else(|| config.mailbox.clone());
        let mailbox = session.select(&mailbox_name).await?;

        let limit = normalize_sync_limit(params.limit);
        let since_uid = params.since_uid;
        let uid_set = if since_uid == 0 {
            "1:*".to_owned()
        } else {
            format!("{}:*", since_uid.saturating_add(1))
        };

        let fetched = session
            .uid_fetch_messages(&uid_set, since_uid, limit)
            .await?;
        let highest_uid = fetched.last().map(|message| message.uid);
        let synced_count = fetched.len() as u32;
        session.logout().await?;

        Ok(MailMailboxSyncResult {
            mailbox: mailbox_name,
            uid_validity: mailbox.uid_validity,
            synced_count,
            highest_uid,
            fetched,
        })
    }
}

impl MailSyncPort for ImapMailSync {
    fn ping<'a>(&'a self) -> MailSyncFuture<'a> {
        Box::pin(async move { self.ping_imap().await })
    }

    fn probe_mailbox<'a>(
        &'a self,
    ) -> sdkwork_communication_mail_service::MailMailboxProbeFuture<'a> {
        Box::pin(async move { self.probe_mailbox().await })
    }

    fn sync_mailbox<'a>(
        &'a self,
        params: MailMailboxSyncParams,
    ) -> sdkwork_communication_mail_service::MailMailboxSyncFuture<'a> {
        Box::pin(async move { self.sync_mailbox(params).await })
    }
}

fn normalize_sync_limit(limit: u32) -> u32 {
    if limit == 0 {
        DEFAULT_SYNC_LIMIT
    } else {
        limit.min(MAX_SYNC_LIMIT)
    }
}

async fn collect_fetched_messages<S>(
    mut stream: S,
    since_uid: u32,
    limit: u32,
) -> Result<Vec<MailImapFetchedMessage>, MailSyncError>
where
    S: Stream<Item = Result<Fetch, async_imap::error::Error>> + Unpin,
{
    let mut fetched = Vec::new();
    while let Some(item) = stream.next().await {
        let fetch =
            item.map_err(|error| MailSyncError::Sync(format!("imap fetch failed: {error}")))?;
        let uid = fetch
            .uid
            .ok_or_else(|| MailSyncError::Sync("imap fetch missing uid".to_owned()))?;
        if uid <= since_uid {
            continue;
        }

        let envelope = fetch.envelope().ok_or_else(|| {
            MailSyncError::Sync(format!("imap fetch missing envelope for uid {uid}"))
        })?;
        let (from_name, from_email) = envelope
            .from
            .as_ref()
            .and_then(|addresses| addresses.first())
            .map(address_to_email)
            .unwrap_or_else(|| (None, "unknown@mailbox".to_owned()));
        let subject = envelope
            .subject
            .as_ref()
            .and_then(|value| std::str::from_utf8(value).ok())
            .unwrap_or_default()
            .to_owned();
        let received_at = fetch
            .internal_date()
            .map(|value| value.to_rfc3339())
            .or_else(|| {
                envelope
                    .date
                    .as_ref()
                    .and_then(|value| std::str::from_utf8(value).ok())
                    .map(|value| value.to_owned())
            });
        let message_id_header = envelope
            .message_id
            .as_ref()
            .and_then(|value| std::str::from_utf8(value).ok())
            .map(|value| value.to_owned());

        fetched.push(MailImapFetchedMessage {
            uid,
            subject,
            from_name,
            from_email,
            received_at,
            message_id_header,
        });

        if fetched.len() as u32 >= limit {
            break;
        }
    }

    fetched.sort_by_key(|message| message.uid);
    Ok(fetched)
}

fn address_to_email(address: &Address<'_>) -> (Option<String>, String) {
    let name = address
        .name
        .as_ref()
        .and_then(|value| std::str::from_utf8(value).ok())
        .map(|value| value.to_owned());
    let mailbox_part = address
        .mailbox
        .as_ref()
        .and_then(|value| std::str::from_utf8(value).ok());
    let host_part = address
        .host
        .as_ref()
        .and_then(|value| std::str::from_utf8(value).ok());

    match (mailbox_part, host_part) {
        (Some(local), Some(domain)) if !local.is_empty() && !domain.is_empty() => {
            (name, format!("{local}@{domain}"))
        }
        (_, Some(host)) if host.contains('@') => (name, host.to_owned()),
        (_, Some(host)) => (name, host.to_owned()),
        _ => (name, "unknown@mailbox".to_owned()),
    }
}
