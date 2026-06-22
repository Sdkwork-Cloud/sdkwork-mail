/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderZegoPackageContract;

impl MailProviderZegoPackageContract {
    pub const PROVIDER_KEY: &'static str = "zego";
    pub const PLUGIN_ID: &'static str = "Mail-zego";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-zego";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-zego";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
