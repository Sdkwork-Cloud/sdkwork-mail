package Mailstandard

import "strings"

type ParsedMailProviderUrl struct {
    ProviderKey string
    RawUrl      string
}

type MailProviderSelection struct {
    ProviderKey string
    Source      string
}

type MailProviderSelectionRequest struct {
    ProviderUrl                  string
    ProviderKey                  string
    TenantOverrideProviderKey    string
    DeploymentProfileProviderKey string
}

var MailProviderSelectionSources = []string{
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
}

var MailProviderSelectionPrecedence = []string{
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
}

func hasMailProviderSelectionText(value string) bool {
    return strings.TrimSpace(value) != ""
}

func ParseMailProviderUrl(providerUrl string) ParsedMailProviderUrl {
    trimmed := strings.TrimSpace(providerUrl)
    if !strings.HasPrefix(trimmed, "Mail:") || !strings.Contains(trimmed, "://") {
        panic("Invalid Mail provider URL: " + providerUrl)
    }

    withoutPrefix := strings.TrimPrefix(trimmed, "Mail:")
    providerKey, _, _ := strings.Cut(withoutPrefix, "://")

    return ParsedMailProviderUrl{
        ProviderKey: strings.ToLower(providerKey),
        RawUrl:      providerUrl,
    }
}

func ResolveMailProviderSelection(
    request MailProviderSelectionRequest,
    defaultProviderKey string,
) MailProviderSelection {
    if hasMailProviderSelectionText(request.ProviderUrl) {
        return MailProviderSelection{
            ProviderKey: ParseMailProviderUrl(request.ProviderUrl).ProviderKey,
            Source:      "provider_url",
        }
    }

    if hasMailProviderSelectionText(request.ProviderKey) {
        return MailProviderSelection{
            ProviderKey: strings.TrimSpace(request.ProviderKey),
            Source:      "provider_key",
        }
    }

    if hasMailProviderSelectionText(request.TenantOverrideProviderKey) {
        return MailProviderSelection{
            ProviderKey: strings.TrimSpace(request.TenantOverrideProviderKey),
            Source:      "tenant_override",
        }
    }

    if hasMailProviderSelectionText(request.DeploymentProfileProviderKey) {
        return MailProviderSelection{
            ProviderKey: strings.TrimSpace(request.DeploymentProfileProviderKey),
            Source:      "deployment_profile",
        }
    }

    resolvedDefaultProviderKey := defaultProviderKey
    if !hasMailProviderSelectionText(resolvedDefaultProviderKey) {
        resolvedDefaultProviderKey = DEFAULT_mail_PROVIDER_KEY
    }

    return MailProviderSelection{
        ProviderKey: resolvedDefaultProviderKey,
        Source:      "default_provider",
    }
}
