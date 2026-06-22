/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderJanusPackageContract;

impl MailProviderJanusPackageContract {
    pub const PROVIDER_KEY: &'static str = "janus";
    pub const PLUGIN_ID: &'static str = "Mail-janus";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-janus";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-janus";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
