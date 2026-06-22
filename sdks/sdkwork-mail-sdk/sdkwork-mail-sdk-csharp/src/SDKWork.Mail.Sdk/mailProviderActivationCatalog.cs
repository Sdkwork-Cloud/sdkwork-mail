namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed record MailProviderActivationCatalogEntry(
    string providerKey,
    string pluginId,
    string driverId,
    string activationStatus,
    bool runtimeBridge,
    bool rootPublic,
    bool packageBoundary,
    bool builtin,
    string packageIdentity
);

public static class MailProviderActivationCatalog
{
    public static readonly IReadOnlyList<string> RecognizedActivationStatuses =
    [
        "package-boundary",
        "control-metadata-only",
    ];

    public static readonly IReadOnlyList<MailProviderActivationCatalogEntry> Entries =
    [
        new("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "package-boundary", true, false, true, true, "Sdkwork.Mail.Sdk.Provider.Smtp"),
        new("imap", "Mail-imap", "sdkwork-mail-driver-imap", "package-boundary", true, false, true, true, "Sdkwork.Mail.Sdk.Provider.Imap"),
    ];

public static MailProviderActivationCatalogEntry? GetMailProviderActivationByProviderKey(string providerKey) =>
        Entries.FirstOrDefault(entry => entry.providerKey == providerKey);

}
