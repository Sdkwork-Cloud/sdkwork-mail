/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderSmtpPackageContract;

impl MailProviderSmtpPackageContract {
    pub const PROVIDER_KEY: &'static str = "smtp";
    pub const PLUGIN_ID: &'static str = "Mail-smtp";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-smtp";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-smtp";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
