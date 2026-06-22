package Mailstandard

type MailProviderExtensionCatalogEntry struct {
    ExtensionKey string
    ProviderKey  string
    DisplayName  string
    Surface      string
    Access       string
    Status       string
}

type MailProviderExtensionCatalog struct{}

var mail_PROVIDER_EXTENSION_SURFACES = []string{
    "control-plane",
    "runtime-bridge",
    "cross-surface",
}

var mail_PROVIDER_EXTENSION_ACCESSES = []string{
    "unwrap-only",
    "extension-object",
}

var mail_PROVIDER_EXTENSION_STATUSES = []string{
    "reference-baseline",
    "reserved",
}

var mail_PROVIDER_EXTENSION_CATALOG = []MailProviderExtensionCatalogEntry{
    {ExtensionKey: "smtp.transport", ProviderKey: "smtp", DisplayName: "SMTP Transport", Surface: "runtime-bridge", Access: "unwrap-only", Status: "reserved"},
    {ExtensionKey: "imap.sync", ProviderKey: "imap", DisplayName: "IMAP Sync", Surface: "runtime-bridge", Access: "unwrap-only", Status: "reserved"},
}

func GetMailProviderExtensionCatalog() []MailProviderExtensionCatalogEntry {
    return append([]MailProviderExtensionCatalogEntry(nil), mail_PROVIDER_EXTENSION_CATALOG...)
}

func GetMailProviderExtensionDescriptor(extensionKey string) *MailProviderExtensionCatalogEntry {
    for index := range mail_PROVIDER_EXTENSION_CATALOG {
        if mail_PROVIDER_EXTENSION_CATALOG[index].ExtensionKey == extensionKey {
            return &mail_PROVIDER_EXTENSION_CATALOG[index]
        }
    }

    return nil
}

func GetMailProviderExtensionsForProvider(providerKey string) []MailProviderExtensionCatalogEntry {
    entries := make([]MailProviderExtensionCatalogEntry, 0)
    for _, entry := range mail_PROVIDER_EXTENSION_CATALOG {
        if entry.ProviderKey == providerKey {
            entries = append(entries, entry)
        }
    }

    return entries
}

func GetMailProviderExtensions(extensionKeys []string) []MailProviderExtensionCatalogEntry {
    entries := make([]MailProviderExtensionCatalogEntry, 0)
    for _, extensionKey := range extensionKeys {
        entry := GetMailProviderExtensionDescriptor(extensionKey)
        if entry != nil {
            entries = append(entries, *entry)
        }
    }

    return entries
}

func HasMailProviderExtension(extensionKeys []string, extensionKey string) bool {
    if GetMailProviderExtensionDescriptor(extensionKey) == nil {
        return false
    }

    for _, value := range extensionKeys {
        if value == extensionKey {
            return true
        }
    }

    return false
}
