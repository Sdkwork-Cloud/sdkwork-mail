namespace Sdkwork.Mail.Sdk;

using System.Collections.Generic;
using System.Linq;

public sealed record MailProviderExtensionCatalogEntry(
    string extensionKey,
    string providerKey,
    string displayName,
    string surface,
    string access,
    string status
);

public static class MailProviderExtensionCatalog
{
    public static readonly IReadOnlyList<string> RecognizedSurfaces =
    [
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    ];

    public static readonly IReadOnlyList<string> RecognizedAccessModes =
    [
        "unwrap-only",
        "extension-object",
    ];

    public static readonly IReadOnlyList<string> RecognizedStatuses =
    [
        "reference-baseline",
        "reserved",
    ];

    public static readonly IReadOnlyList<MailProviderExtensionCatalogEntry> Entries =
    [
        new("smtp.transport", "smtp", "SMTP Transport", "runtime-bridge", "unwrap-only", "reserved"),
        new("imap.sync", "imap", "IMAP Sync", "runtime-bridge", "unwrap-only", "reserved"),
    ];

public static IReadOnlyList<MailProviderExtensionCatalogEntry> GetMailProviderExtensionCatalog() =>
        Entries;

    public static MailProviderExtensionCatalogEntry? GetMailProviderExtensionDescriptor(string extensionKey) =>
        Entries.FirstOrDefault(entry => entry.extensionKey == extensionKey);

    public static IReadOnlyList<MailProviderExtensionCatalogEntry> GetMailProviderExtensionsForProvider(string providerKey) =>
        Entries.Where(entry => entry.providerKey == providerKey).ToArray();

    public static IReadOnlyList<MailProviderExtensionCatalogEntry> GetMailProviderExtensions(IReadOnlyList<string> extensionKeys)
    {
        var entries = new List<MailProviderExtensionCatalogEntry>();
        foreach (var extensionKey in extensionKeys)
        {
            var entry = GetMailProviderExtensionDescriptor(extensionKey);
            if (entry is not null)
            {
                entries.Add(entry);
            }
        }

        return entries.ToArray();
    }

    public static bool HasMailProviderExtension(IReadOnlyList<string> extensionKeys, string extensionKey) =>
        extensionKeys.Contains(extensionKey) && GetMailProviderExtensionDescriptor(extensionKey) is not null;

}
