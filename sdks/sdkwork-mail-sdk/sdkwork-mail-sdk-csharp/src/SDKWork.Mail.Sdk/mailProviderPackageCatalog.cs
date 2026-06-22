namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed record MailProviderPackageCatalogEntry(
    string providerKey,
    string pluginId,
    string driverId,
    string packageIdentity,
    string manifestPath,
    string readmePath,
    string sourcePath,
    string sourceSymbol,
    bool builtin,
    bool rootPublic,
    string status,
    string runtimeBridgeStatus
);

public static class MailProviderPackageCatalog
{
    public static readonly IReadOnlyList<MailProviderPackageCatalogEntry> Entries =
    [
        new("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "Sdkwork.Mail.Sdk.Provider.Smtp", "providers/Sdkwork.Mail.Sdk.Provider.Smtp/Sdkwork.Mail.Sdk.Provider.Smtp.csproj", "providers/Sdkwork.Mail.Sdk.Provider.Smtp/README.md", "providers/Sdkwork.Mail.Sdk.Provider.Smtp/src/MailProviderSmtpPackageContract.cs", "MailProviderSmtpPackageContract", true, false, "future-runtime-bridge-only", "reserved"),
        new("imap", "Mail-imap", "sdkwork-mail-driver-imap", "Sdkwork.Mail.Sdk.Provider.Imap", "providers/Sdkwork.Mail.Sdk.Provider.Imap/Sdkwork.Mail.Sdk.Provider.Imap.csproj", "providers/Sdkwork.Mail.Sdk.Provider.Imap/README.md", "providers/Sdkwork.Mail.Sdk.Provider.Imap/src/MailProviderImapPackageContract.cs", "MailProviderImapPackageContract", true, false, "future-runtime-bridge-only", "reserved"),
    ];

public static MailProviderPackageCatalogEntry? GetMailProviderPackageByProviderKey(string providerKey) =>
        Entries.FirstOrDefault(entry => entry.providerKey == providerKey);

    public static MailProviderPackageCatalogEntry? GetMailProviderPackageByPackageIdentity(string packageIdentity) =>
        Entries.FirstOrDefault(entry => entry.packageIdentity == packageIdentity);

}
