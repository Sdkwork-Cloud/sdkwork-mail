/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderAliyunPackageContract;

impl MailProviderAliyunPackageContract {
    pub const PROVIDER_KEY: &'static str = "aliyun";
    pub const PLUGIN_ID: &'static str = "Mail-aliyun";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-aliyun";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-aliyun";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
