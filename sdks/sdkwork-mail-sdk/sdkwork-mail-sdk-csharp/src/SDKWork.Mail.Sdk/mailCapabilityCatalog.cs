namespace Sdkwork.Mail.Sdk;

using System.Collections.Generic;
using System.Linq;

public sealed record MailCapabilityCatalogEntry(
    string capabilityKey,
    string category,
    string surface
);

public static class MailCapabilityCatalog
{
    public static readonly IReadOnlyList<MailCapabilityCatalogEntry> Entries =
    [
        new("transport.connect", "required-baseline", "control-plane"),
        new("transport.authenticate", "required-baseline", "control-plane"),
        new("health", "required-baseline", "control-plane"),
        new("smtp.send", "optional-advanced", "runtime-bridge"),
        new("imap.sync", "optional-advanced", "runtime-bridge"),
        new("imap.folder-sync", "optional-advanced", "runtime-bridge"),
        new("imap.message-sync", "optional-advanced", "runtime-bridge"),
        new("transport.retry", "optional-advanced", "control-plane"),
        new("transport.pool", "optional-advanced", "control-plane"),
    ];

public static IReadOnlyList<MailCapabilityCatalogEntry> GetMailCapabilityCatalog() =>
        Entries;

    public static MailCapabilityCatalogEntry? GetMailCapabilityDescriptor(string capabilityKey) =>
        Entries.FirstOrDefault(entry => entry.capabilityKey == capabilityKey);

}
