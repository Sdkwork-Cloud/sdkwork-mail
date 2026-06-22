use sdkwork_communication_mail_service::{
    MAIL_APP_API_AUTHORITY, MAIL_APP_API_PREFIX, MAIL_APP_SDK_FAMILY, MAIL_DOMAIN, MAIL_OWNER,
};

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct MailAppRoute {
    pub method: &'static str,
    pub path: &'static str,
    pub tag: &'static str,
    pub operation_id: &'static str,
    pub owner: &'static str,
    pub permission: &'static str,
}

pub const MAIL_APP_ACCOUNTS_PATH: &str = "/app/v3/api/mail/accounts";
pub const MAIL_APP_FOLDERS_PATH: &str = "/app/v3/api/mail/folders";
pub const MAIL_APP_THREADS_PATH: &str = "/app/v3/api/mail/threads";
pub const MAIL_APP_MESSAGES_PATH: &str = "/app/v3/api/mail/messages";
pub const MAIL_APP_MESSAGE_PATH: &str = "/app/v3/api/mail/messages/{messageId}";

pub const MAIL_APP_ROUTES: &[MailAppRoute] = &[
    MailAppRoute {
        method: "GET",
        path: MAIL_APP_ACCOUNTS_PATH,
        tag: "mailAccounts",
        operation_id: "mail.accounts.list",
        owner: MAIL_OWNER,
        permission: "mail.accounts.read",
    },
    MailAppRoute {
        method: "GET",
        path: MAIL_APP_FOLDERS_PATH,
        tag: "mailFolders",
        operation_id: "mail.folders.list",
        owner: MAIL_OWNER,
        permission: "mail.folders.read",
    },
    MailAppRoute {
        method: "GET",
        path: MAIL_APP_THREADS_PATH,
        tag: "mailThreads",
        operation_id: "mail.threads.list",
        owner: MAIL_OWNER,
        permission: "mail.threads.read",
    },
    MailAppRoute {
        method: "GET",
        path: MAIL_APP_MESSAGES_PATH,
        tag: "mailMessages",
        operation_id: "mail.messages.list",
        owner: MAIL_OWNER,
        permission: "mail.messages.read",
    },
    MailAppRoute {
        method: "POST",
        path: MAIL_APP_MESSAGES_PATH,
        tag: "mailMessages",
        operation_id: "mail.messages.create",
        owner: MAIL_OWNER,
        permission: "mail.messages.write",
    },
    MailAppRoute {
        method: "GET",
        path: MAIL_APP_MESSAGE_PATH,
        tag: "mailMessages",
        operation_id: "mail.messages.retrieve",
        owner: MAIL_OWNER,
        permission: "mail.messages.read",
    },
    MailAppRoute {
        method: "PATCH",
        path: MAIL_APP_MESSAGE_PATH,
        tag: "mailMessages",
        operation_id: "mail.messages.update",
        owner: MAIL_OWNER,
        permission: "mail.messages.write",
    },
    MailAppRoute {
        method: "DELETE",
        path: MAIL_APP_MESSAGE_PATH,
        tag: "mailMessages",
        operation_id: "mail.messages.delete",
        owner: MAIL_OWNER,
        permission: "mail.messages.write",
    },
];

pub fn route_manifest_header() -> (
    &'static str,
    &'static str,
    &'static str,
    &'static str,
    &'static str,
) {
    (
        MAIL_DOMAIN,
        MAIL_APP_API_AUTHORITY,
        MAIL_APP_SDK_FAMILY,
        MAIL_APP_API_PREFIX,
        MAIL_OWNER,
    )
}
