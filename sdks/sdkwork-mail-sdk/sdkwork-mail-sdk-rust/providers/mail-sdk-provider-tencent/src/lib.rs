/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderTencentPackageContract;

impl MailProviderTencentPackageContract {
    pub const PROVIDER_KEY: &'static str = "tencent";
    pub const PLUGIN_ID: &'static str = "Mail-tencent";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-tencent";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-tencent";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
