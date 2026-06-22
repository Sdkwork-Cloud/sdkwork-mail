use sdkwork_communication_mail_service::{
    MailImapSyncConfig, MailSyncError, MailSyncFuture, MailSyncPort,
};

use crate::config::ImapTransportConfig;

pub struct ImapMailSync {
    config: ImapTransportConfig,
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
}

impl MailSyncPort for ImapMailSync {
    fn ping<'a>(&'a self) -> MailSyncFuture<'a> {
        let config = self.to_sync_config();
        Box::pin(async move {
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
            Ok(())
        })
    }
}
