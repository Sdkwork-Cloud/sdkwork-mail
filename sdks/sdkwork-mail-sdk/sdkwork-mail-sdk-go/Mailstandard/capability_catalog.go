package Mailstandard

type MailCapabilityCatalogEntry struct {
    CapabilityKey string
    Category      string
    Surface       string
}

type MailCapabilityCatalog struct{}

var mail_CAPABILITY_CATALOG = []MailCapabilityCatalogEntry{
    {CapabilityKey: "transport.connect", Category: "required-baseline", Surface: "control-plane"},
    {CapabilityKey: "transport.authenticate", Category: "required-baseline", Surface: "control-plane"},
    {CapabilityKey: "health", Category: "required-baseline", Surface: "control-plane"},
    {CapabilityKey: "smtp.send", Category: "optional-advanced", Surface: "runtime-bridge"},
    {CapabilityKey: "imap.sync", Category: "optional-advanced", Surface: "runtime-bridge"},
    {CapabilityKey: "imap.folder-sync", Category: "optional-advanced", Surface: "runtime-bridge"},
    {CapabilityKey: "imap.message-sync", Category: "optional-advanced", Surface: "runtime-bridge"},
    {CapabilityKey: "transport.retry", Category: "optional-advanced", Surface: "control-plane"},
    {CapabilityKey: "transport.pool", Category: "optional-advanced", Surface: "control-plane"},
}

func GetMailCapabilityCatalog() []MailCapabilityCatalogEntry {
    return append([]MailCapabilityCatalogEntry(nil), mail_CAPABILITY_CATALOG...)
}

func GetMailCapabilityDescriptor(capabilityKey string) *MailCapabilityCatalogEntry {
    for index := range mail_CAPABILITY_CATALOG {
        if mail_CAPABILITY_CATALOG[index].CapabilityKey == capabilityKey {
            return &mail_CAPABILITY_CATALOG[index]
        }
    }

    return nil
}
