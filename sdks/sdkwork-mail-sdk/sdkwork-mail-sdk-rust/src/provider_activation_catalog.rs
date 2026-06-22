#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderActivationCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub activationStatus: &'static str,
    pub runtimeBridge: bool,
    pub rootPublic: bool,
    pub packageBoundary: bool,
    pub builtin: bool,
    pub packageIdentity: &'static str,
}

pub struct MailProviderActivationCatalog;

pub const mail_PROVIDER_ACTIVATION_STATUSES: [&str; 2] = ["package-boundary", "control-metadata-only"];

pub const OFFICIAL_mail_PROVIDER_ACTIVATIONS: [MailProviderActivationCatalogEntry; 2] = [
    MailProviderActivationCatalogEntry { providerKey: "smtp", pluginId: "Mail-smtp", driverId: "sdkwork-mail-driver-smtp", activationStatus: "package-boundary", runtimeBridge: true, rootPublic: false, packageBoundary: true, builtin: true, packageIdentity: "Mail-sdk-provider-smtp" },
    MailProviderActivationCatalogEntry { providerKey: "imap", pluginId: "Mail-imap", driverId: "sdkwork-mail-driver-imap", activationStatus: "package-boundary", runtimeBridge: true, rootPublic: false, packageBoundary: true, builtin: true, packageIdentity: "Mail-sdk-provider-imap" },
];

pub fn get_mail_provider_activation_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderActivationCatalogEntry> {
    OFFICIAL_mail_PROVIDER_ACTIVATIONS
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}
