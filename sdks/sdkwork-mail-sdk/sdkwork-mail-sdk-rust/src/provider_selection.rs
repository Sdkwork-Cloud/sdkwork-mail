use crate::provider_catalog::DEFAULT_mail_PROVIDER_KEY;

#[allow(non_snake_case)]
pub struct ParsedMailProviderUrl {
    pub providerKey: String,
    pub rawUrl: String,
}

#[allow(non_snake_case)]
pub struct MailProviderSelection {
    pub providerKey: String,
    pub source: &'static str,
}

#[derive(Default)]
#[allow(non_snake_case)]
pub struct MailProviderSelectionRequest {
    pub providerUrl: Option<String>,
    pub providerKey: Option<String>,
    pub tenantOverrideProviderKey: Option<String>,
    pub deploymentProfileProviderKey: Option<String>,
}

pub const mail_PROVIDER_SELECTION_SOURCES: [&str; 5] = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
];

pub const mail_PROVIDER_SELECTION_PRECEDENCE: [&str; 5] = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
];

fn has_mail_provider_selection_text(value: &Option<String>) -> bool {
    value.as_ref().is_some_and(|entry| !entry.trim().is_empty())
}

pub fn parse_mail_provider_url(provider_url: &str) -> ParsedMailProviderUrl {
    let trimmed = provider_url.trim();
    if !trimmed.starts_with("Mail:") || !trimmed.contains("://") {
        panic!("Invalid Mail provider URL: {provider_url}");
    }

    let provider_key = trimmed[4..]
        .split("://")
        .next()
        .unwrap_or(DEFAULT_mail_PROVIDER_KEY)
        .to_lowercase();

    ParsedMailProviderUrl {
        providerKey: provider_key,
        rawUrl: provider_url.to_string(),
    }
}

pub fn resolve_mail_provider_selection(
    request: &MailProviderSelectionRequest,
    default_provider_key: Option<&str>,
) -> MailProviderSelection {
    if has_mail_provider_selection_text(&request.providerUrl) {
        return MailProviderSelection {
            providerKey: parse_mail_provider_url(request.providerUrl.as_deref().unwrap()).providerKey,
            source: "provider_url",
        };
    }

    if has_mail_provider_selection_text(&request.providerKey) {
        return MailProviderSelection {
            providerKey: request.providerKey.as_deref().unwrap().trim().to_string(),
            source: "provider_key",
        };
    }

    if has_mail_provider_selection_text(&request.tenantOverrideProviderKey) {
        return MailProviderSelection {
            providerKey: request
                .tenantOverrideProviderKey
                .as_deref()
                .unwrap()
                .trim()
                .to_string(),
            source: "tenant_override",
        };
    }

    if has_mail_provider_selection_text(&request.deploymentProfileProviderKey) {
        return MailProviderSelection {
            providerKey: request
                .deploymentProfileProviderKey
                .as_deref()
                .unwrap()
                .trim()
                .to_string(),
            source: "deployment_profile",
        };
    }

    MailProviderSelection {
        providerKey: default_provider_key
            .unwrap_or(DEFAULT_mail_PROVIDER_KEY)
            .to_string(),
        source: "default_provider",
    }
}
