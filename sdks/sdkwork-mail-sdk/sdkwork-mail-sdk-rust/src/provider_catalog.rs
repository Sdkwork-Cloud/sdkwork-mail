#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub defaultSelected: bool,
}

pub struct MailProviderCatalog;

pub const DEFAULT_mail_PROVIDER_KEY: &str = "smtp";

pub const OFFICIAL_mail_PROVIDERS: [MailProviderCatalogEntry; 2] = [
    MailProviderCatalogEntry { providerKey: "smtp", pluginId: "Mail-smtp", driverId: "sdkwork-mail-driver-smtp", defaultSelected: true },
    MailProviderCatalogEntry { providerKey: "imap", pluginId: "Mail-imap", driverId: "sdkwork-mail-driver-imap", defaultSelected: false },
];

pub fn get_mail_provider_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderCatalogEntry> {
    OFFICIAL_mail_PROVIDERS
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}
