/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderLivekitPackageContract;

impl MailProviderLivekitPackageContract {
    pub const PROVIDER_KEY: &'static str = "livekit";
    pub const PLUGIN_ID: &'static str = "Mail-livekit";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-livekit";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-livekit";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
