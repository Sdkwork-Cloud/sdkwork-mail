#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailCapabilityCatalogEntry {
    pub capabilityKey: &'static str,
    pub category: &'static str,
    pub surface: &'static str,
}

pub struct MailCapabilityCatalog;

pub const mail_CAPABILITY_CATALOG: [MailCapabilityCatalogEntry; 9] = [
    MailCapabilityCatalogEntry { capabilityKey: "transport.connect", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "transport.authenticate", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "health", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "smtp.send", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "imap.sync", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "imap.folder-sync", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "imap.message-sync", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "transport.retry", category: "optional-advanced", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "transport.pool", category: "optional-advanced", surface: "control-plane" },
];

pub fn get_mail_capability_catalog() -> &'static [MailCapabilityCatalogEntry] {
    &mail_CAPABILITY_CATALOG
}

pub fn get_mail_capability_descriptor(
    capability_key: &str,
) -> Option<&'static MailCapabilityCatalogEntry> {
    mail_CAPABILITY_CATALOG
        .iter()
        .find(|entry| entry.capabilityKey == capability_key)
}
