namespace Sdkwork.Mail.Sdk;

using System;
using System.Collections.Generic;

public enum MailProviderSelectionSource
{
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider,
}

public sealed record ParsedMailProviderUrl(string providerKey, string rawUrl);

public sealed record MailProviderSelectionRequest(
    string? providerUrl = null,
    string? providerKey = null,
    string? tenantOverrideProviderKey = null,
    string? deploymentProfileProviderKey = null
);

public sealed record MailProviderSelection(
    string providerKey,
    MailProviderSelectionSource source
)
{
    public static readonly IReadOnlyList<string> MailProviderSelectionSources =
    [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ];

    public static readonly IReadOnlyList<string> MailProviderSelectionPrecedence =
    [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ];

    public static ParsedMailProviderUrl ParseMailProviderUrl(string providerUrl)
    {
        var trimmed = providerUrl.Trim();
        if (!trimmed.StartsWith("Mail:", StringComparison.OrdinalIgnoreCase) || !trimmed.Contains("://", StringComparison.Ordinal))
        {
            throw new ArgumentException($"Invalid Mail provider URL: {providerUrl}", nameof(providerUrl));
        }

        return new ParsedMailProviderUrl(
            trimmed[4..trimmed.IndexOf("://", StringComparison.Ordinal)].ToLowerInvariant(),
            providerUrl
        );
    }

    public static MailProviderSelection ResolveMailProviderSelection(
        MailProviderSelectionRequest? request = null,
        string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    )
    {
        request ??= new MailProviderSelectionRequest();

        if (HasText(request.providerUrl))
        {
            return new MailProviderSelection(
                ParseMailProviderUrl(request.providerUrl!).providerKey,
                MailProviderSelectionSource.provider_url
            );
        }

        if (HasText(request.providerKey))
        {
            return new MailProviderSelection(
                request.providerKey!.Trim(),
                MailProviderSelectionSource.provider_key
            );
        }

        if (HasText(request.tenantOverrideProviderKey))
        {
            return new MailProviderSelection(
                request.tenantOverrideProviderKey!.Trim(),
                MailProviderSelectionSource.tenant_override
            );
        }

        if (HasText(request.deploymentProfileProviderKey))
        {
            return new MailProviderSelection(
                request.deploymentProfileProviderKey!.Trim(),
                MailProviderSelectionSource.deployment_profile
            );
        }

        return new MailProviderSelection(
            defaultProviderKey,
            MailProviderSelectionSource.default_provider
        );
    }

    private static bool HasText(string? value) => !string.IsNullOrWhiteSpace(value);
}
