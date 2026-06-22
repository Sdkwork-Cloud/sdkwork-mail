/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderImapPackageContract;

impl MailProviderImapPackageContract {
    pub const PROVIDER_KEY: &'static str = "imap";
    pub const PLUGIN_ID: &'static str = "Mail-imap";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-imap";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-imap";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
