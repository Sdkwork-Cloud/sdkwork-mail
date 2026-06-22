#[allow(non_snake_case)]
pub struct MailProviderSupport {
    pub providerKey: String,
    pub status: &'static str,
    pub builtin: bool,
    pub official: bool,
    pub registered: bool,
}

#[allow(non_snake_case)]
pub struct MailProviderSupportStateRequest {
    pub providerKey: String,
    pub builtin: bool,
    pub official: bool,
    pub registered: bool,
}

pub const mail_PROVIDER_SUPPORT_STATUSES: [&str; 4] = [
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
];

pub fn resolve_mail_provider_support_status(
    request: &MailProviderSupportStateRequest,
) -> &'static str {
    if request.official && request.registered {
        return if request.builtin {
            "builtin_registered"
        } else {
            "official_registered"
        };
    }

    if request.official {
        return "official_unregistered";
    }

    "unknown"
}

pub fn create_mail_provider_support_state(
    request: MailProviderSupportStateRequest,
) -> MailProviderSupport {
    let status = resolve_mail_provider_support_status(&request);

    MailProviderSupport {
        providerKey: request.providerKey,
        status,
        builtin: request.builtin,
        official: request.official,
        registered: request.registered,
    }
}
