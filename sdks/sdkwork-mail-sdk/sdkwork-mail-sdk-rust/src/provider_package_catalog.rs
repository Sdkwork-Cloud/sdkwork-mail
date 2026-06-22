#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderPackageCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub packageIdentity: &'static str,
    pub manifestPath: &'static str,
    pub readmePath: &'static str,
    pub sourcePath: &'static str,
    pub sourceSymbol: &'static str,
    pub builtin: bool,
    pub rootPublic: bool,
    pub status: &'static str,
    pub runtimeBridgeStatus: &'static str,
}

pub struct MailProviderPackageCatalog;

pub const OFFICIAL_mail_PROVIDER_PACKAGES: [MailProviderPackageCatalogEntry; 2] = [
    MailProviderPackageCatalogEntry { providerKey: "smtp", pluginId: "Mail-smtp", driverId: "sdkwork-mail-driver-smtp", packageIdentity: "Mail-sdk-provider-smtp", manifestPath: "providers/Mail-sdk-provider-smtp/Cargo.toml", readmePath: "providers/Mail-sdk-provider-smtp/README.md", sourcePath: "providers/Mail-sdk-provider-smtp/src/lib.rs", sourceSymbol: "MailProviderSmtpPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "imap", pluginId: "Mail-imap", driverId: "sdkwork-mail-driver-imap", packageIdentity: "Mail-sdk-provider-imap", manifestPath: "providers/Mail-sdk-provider-imap/Cargo.toml", readmePath: "providers/Mail-sdk-provider-imap/README.md", sourcePath: "providers/Mail-sdk-provider-imap/src/lib.rs", sourceSymbol: "MailProviderImapPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
];

pub fn get_mail_provider_package_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderPackageCatalogEntry> {
    OFFICIAL_mail_PROVIDER_PACKAGES
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}

pub fn get_mail_provider_package_by_package_identity(
    package_identity: &str,
) -> Option<&'static MailProviderPackageCatalogEntry> {
    OFFICIAL_mail_PROVIDER_PACKAGES
        .iter()
        .find(|entry| entry.packageIdentity == package_identity)
}
