/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct MailProviderTwilioPackageContract;

impl MailProviderTwilioPackageContract {
    pub const PROVIDER_KEY: &'static str = "twilio";
    pub const PLUGIN_ID: &'static str = "Mail-twilio";
    pub const DRIVER_ID: &'static str = "sdkwork-mail-driver-twilio";
    pub const PACKAGE_IDENTITY: &'static str = "Mail-sdk-provider-twilio";
    pub const STATUS: &'static str = "future-runtime-bridge-only";
    pub const RUNTIME_BRIDGE_STATUS: &'static str = "reserved";
    pub const ROOT_PUBLIC: bool = false;
}
