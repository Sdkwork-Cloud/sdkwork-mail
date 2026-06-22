#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderExtensionCatalogEntry {
    pub extensionKey: &'static str,
    pub providerKey: &'static str,
    pub displayName: &'static str,
    pub surface: &'static str,
    pub access: &'static str,
    pub status: &'static str,
}

pub struct MailProviderExtensionCatalog;

pub const mail_PROVIDER_EXTENSION_SURFACES: [&str; 3] = [
    "control-plane",
    "runtime-bridge",
    "cross-surface",
];

pub const mail_PROVIDER_EXTENSION_ACCESSES: [&str; 2] = [
    "unwrap-only",
    "extension-object",
];

pub const mail_PROVIDER_EXTENSION_STATUSES: [&str; 2] = [
    "reference-baseline",
    "reserved",
];

pub const mail_PROVIDER_EXTENSION_CATALOG: [MailProviderExtensionCatalogEntry; 2] = [
    MailProviderExtensionCatalogEntry { extensionKey: "smtp.transport", providerKey: "smtp", displayName: "SMTP Transport", surface: "runtime-bridge", access: "unwrap-only", status: "reserved" },
    MailProviderExtensionCatalogEntry { extensionKey: "imap.sync", providerKey: "imap", displayName: "IMAP Sync", surface: "runtime-bridge", access: "unwrap-only", status: "reserved" },
];

pub fn get_mail_provider_extension_catalog() -> &'static [MailProviderExtensionCatalogEntry] {
    &mail_PROVIDER_EXTENSION_CATALOG
}

pub fn get_mail_provider_extension_descriptor(
    extension_key: &str,
) -> Option<&'static MailProviderExtensionCatalogEntry> {
    mail_PROVIDER_EXTENSION_CATALOG
        .iter()
        .find(|entry| entry.extensionKey == extension_key)
}

pub fn get_mail_provider_extensions_for_provider(
    provider_key: &str,
) -> Vec<MailProviderExtensionCatalogEntry> {
    mail_PROVIDER_EXTENSION_CATALOG
        .iter()
        .filter(|entry| entry.providerKey == provider_key)
        .copied()
        .collect()
}

pub fn get_mail_provider_extensions(
    extension_keys: &[&str],
) -> Vec<MailProviderExtensionCatalogEntry> {
    extension_keys
        .iter()
        .filter_map(|extension_key| get_mail_provider_extension_descriptor(extension_key).copied())
        .collect()
}

pub fn has_mail_provider_extension(extension_keys: &[&str], extension_key: &str) -> bool {
    extension_keys.iter().any(|value| *value == extension_key)
        && get_mail_provider_extension_descriptor(extension_key).is_some()
}
