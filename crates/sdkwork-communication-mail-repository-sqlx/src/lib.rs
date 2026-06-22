pub mod database;
pub mod persistence;

pub use database::{
    MailPersistenceBootstrap, check_mail_database_health,
    connect_mail_persistence_bootstrap_from_env, connect_mail_persistence_from_env,
    is_mail_database_healthy, mail_database_env_explicitly_configured,
    mail_database_env_values_explicitly_configured, persistence_from_database_pool,
};
pub use persistence::MailPostgresPersistencePort;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MailTableContract {
    pub table_name: &'static str,
}

pub const MAIL_TABLES: &[MailTableContract] = &[
    MailTableContract {
        table_name: "mail_account",
    },
    MailTableContract {
        table_name: "mail_folder",
    },
    MailTableContract {
        table_name: "mail_thread",
    },
    MailTableContract {
        table_name: "mail_message",
    },
    MailTableContract {
        table_name: "mail_message_recipient",
    },
    MailTableContract {
        table_name: "mail_attachment",
    },
    MailTableContract {
        table_name: "mail_label",
    },
    MailTableContract {
        table_name: "mail_message_label",
    },
    MailTableContract {
        table_name: "mail_provider_account",
    },
    MailTableContract {
        table_name: "mail_provider_credential",
    },
    MailTableContract {
        table_name: "mail_sync_state",
    },
    MailTableContract {
        table_name: "mail_outbox_event",
    },
    MailTableContract {
        table_name: "mail_audit_log",
    },
];
