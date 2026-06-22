use sdkwork_communication_mail_service::{
    MAIL_BACKEND_API_AUTHORITY, MAIL_BACKEND_API_PREFIX, MAIL_BACKEND_SDK_FAMILY, MAIL_DOMAIN,
    MAIL_OWNER,
};

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct MailBackendRoute {
    pub method: &'static str,
    pub path: &'static str,
    pub tag: &'static str,
    pub operation_id: &'static str,
    pub owner: &'static str,
    pub permission: &'static str,
}

pub const MAIL_BACKEND_PROVIDER_ACCOUNTS_PATH: &str = "/backend/v3/api/mail/provider_accounts";
pub const MAIL_BACKEND_PROVIDER_ACCOUNT_PING_PATH: &str =
    "/backend/v3/api/mail/provider_accounts/{account_id}/ping";
pub const MAIL_BACKEND_PROVIDER_ACCOUNT_SYNC_PATH: &str =
    "/backend/v3/api/mail/provider_accounts/{account_id}/sync";
pub const MAIL_BACKEND_PROVIDER_WEBHOOK_RECEIVE_PATH: &str =
    "/backend/v3/api/mail/provider_webhooks/{provider}/events";

pub const MAIL_BACKEND_ROUTES: &[MailBackendRoute] = &[
    MailBackendRoute {
        method: "GET",
        path: MAIL_BACKEND_PROVIDER_ACCOUNTS_PATH,
        tag: "mailProviderAccounts",
        operation_id: "mail.providerAccounts.list",
        owner: MAIL_OWNER,
        permission: "mail.provider_accounts.read",
    },
    MailBackendRoute {
        method: "POST",
        path: MAIL_BACKEND_PROVIDER_ACCOUNT_SYNC_PATH,
        tag: "mailProviderAccounts",
        operation_id: "mail.providerAccounts.sync",
        owner: MAIL_OWNER,
        permission: "mail.provider_accounts.write",
    },
    MailBackendRoute {
        method: "POST",
        path: MAIL_BACKEND_PROVIDER_WEBHOOK_RECEIVE_PATH,
        tag: "mailProviderWebhooks",
        operation_id: "mail.providerWebhooks.events.receive",
        owner: MAIL_OWNER,
        permission: "mail.provider_webhooks.receive",
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
        MAIL_BACKEND_API_AUTHORITY,
        MAIL_BACKEND_SDK_FAMILY,
        MAIL_BACKEND_API_PREFIX,
        MAIL_OWNER,
    )
}

pub fn match_backend_route(method: &str, path: &str) -> Option<&'static MailBackendRoute> {
    MAIL_BACKEND_ROUTES
        .iter()
        .find(|route| route.method == method && path_matches(route.path, path))
}

fn path_matches(template: &str, path: &str) -> bool {
    let template_segments: Vec<&str> = template
        .split('/')
        .filter(|segment| !segment.is_empty())
        .collect();
    let path_segments: Vec<&str> = path
        .split('/')
        .filter(|segment| !segment.is_empty())
        .collect();
    if template_segments.len() != path_segments.len() {
        return false;
    }

    template_segments
        .iter()
        .zip(path_segments.iter())
        .all(|(template_segment, path_segment)| {
            template_segment.starts_with('{') || template_segment == path_segment
        })
}
