/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderJitsiPackageContract;

impl MailProviderJitsiPackageContract {
    pub const PROVIDER_KEY: &'static str = "jitsi";
    pub const PLUGIN_ID: &'static str = "Mail-jitsi";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-jitsi";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-jitsi";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
