namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed record MailProviderCatalogEntry(
    string providerKey,
    string pluginId,
    string driverId,
    bool defaultSelected
);

public static class MailProviderCatalog
{
    public const string DEFAULT_mail_PROVIDER_KEY = "smtp";

    public static readonly IReadOnlyList<MailProviderCatalogEntry> Entries =
    [
        new("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", true),
        new("imap", "Mail-imap", "sdkwork-mail-driver-imap", false),
    ];

public static MailProviderCatalogEntry? GetMailProviderByProviderKey(string providerKey) =>
        Entries.FirstOrDefault(entry => entry.providerKey == providerKey);

}
