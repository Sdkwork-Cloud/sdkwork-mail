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

pub const OFFICIAL_mail_PROVIDER_PACKAGES: [MailProviderPackageCatalogEntry; 10] = [
    MailProviderPackageCatalogEntry { providerKey: "volcengine", pluginId: "Mail-volcengine", driverId: "sdkwork-mail-driver-volcengine", packageIdentity: "Mail-sdk-provider-volcengine", manifestPath: "providers/Mail-sdk-provider-volcengine/Cargo.toml", readmePath: "providers/Mail-sdk-provider-volcengine/README.md", sourcePath: "providers/Mail-sdk-provider-volcengine/src/lib.rs", sourceSymbol: "MailProviderVolcenginePackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "aliyun", pluginId: "Mail-aliyun", driverId: "sdkwork-mail-driver-aliyun", packageIdentity: "Mail-sdk-provider-aliyun", manifestPath: "providers/Mail-sdk-provider-aliyun/Cargo.toml", readmePath: "providers/Mail-sdk-provider-aliyun/README.md", sourcePath: "providers/Mail-sdk-provider-aliyun/src/lib.rs", sourceSymbol: "MailProviderAliyunPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "tencent", pluginId: "Mail-tencent", driverId: "sdkwork-mail-driver-tencent", packageIdentity: "Mail-sdk-provider-tencent", manifestPath: "providers/Mail-sdk-provider-tencent/Cargo.toml", readmePath: "providers/Mail-sdk-provider-tencent/README.md", sourcePath: "providers/Mail-sdk-provider-tencent/src/lib.rs", sourceSymbol: "MailProviderTencentPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "agora", pluginId: "Mail-agora", driverId: "sdkwork-mail-driver-agora", packageIdentity: "Mail-sdk-provider-agora", manifestPath: "providers/Mail-sdk-provider-agora/Cargo.toml", readmePath: "providers/Mail-sdk-provider-agora/README.md", sourcePath: "providers/Mail-sdk-provider-agora/src/lib.rs", sourceSymbol: "MailProviderAgoraPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "zego", pluginId: "Mail-zego", driverId: "sdkwork-mail-driver-zego", packageIdentity: "Mail-sdk-provider-zego", manifestPath: "providers/Mail-sdk-provider-zego/Cargo.toml", readmePath: "providers/Mail-sdk-provider-zego/README.md", sourcePath: "providers/Mail-sdk-provider-zego/src/lib.rs", sourceSymbol: "MailProviderZegoPackageContract", builtin: false, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "livekit", pluginId: "Mail-livekit", driverId: "sdkwork-mail-driver-livekit", packageIdentity: "Mail-sdk-provider-livekit", manifestPath: "providers/Mail-sdk-provider-livekit/Cargo.toml", readmePath: "providers/Mail-sdk-provider-livekit/README.md", sourcePath: "providers/Mail-sdk-provider-livekit/src/lib.rs", sourceSymbol: "MailProviderLivekitPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "twilio", pluginId: "Mail-twilio", driverId: "sdkwork-mail-driver-twilio", packageIdentity: "Mail-sdk-provider-twilio", manifestPath: "providers/Mail-sdk-provider-twilio/Cargo.toml", readmePath: "providers/Mail-sdk-provider-twilio/README.md", sourcePath: "providers/Mail-sdk-provider-twilio/src/lib.rs", sourceSymbol: "MailProviderTwilioPackageContract", builtin: false, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "jitsi", pluginId: "Mail-jitsi", driverId: "sdkwork-mail-driver-jitsi", packageIdentity: "Mail-sdk-provider-jitsi", manifestPath: "providers/Mail-sdk-provider-jitsi/Cargo.toml", readmePath: "providers/Mail-sdk-provider-jitsi/README.md", sourcePath: "providers/Mail-sdk-provider-jitsi/src/lib.rs", sourceSymbol: "MailProviderJitsiPackageContract", builtin: false, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "janus", pluginId: "Mail-janus", driverId: "sdkwork-mail-driver-janus", packageIdentity: "Mail-sdk-provider-janus", manifestPath: "providers/Mail-sdk-provider-janus/Cargo.toml", readmePath: "providers/Mail-sdk-provider-janus/README.md", sourcePath: "providers/Mail-sdk-provider-janus/src/lib.rs", sourceSymbol: "MailProviderJanusPackageContract", builtin: false, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
    MailProviderPackageCatalogEntry { providerKey: "mediasoup", pluginId: "Mail-mediasoup", driverId: "sdkwork-mail-driver-mediasoup", packageIdentity: "Mail-sdk-provider-mediasoup", manifestPath: "providers/Mail-sdk-provider-mediasoup/Cargo.toml", readmePath: "providers/Mail-sdk-provider-mediasoup/README.md", sourcePath: "providers/Mail-sdk-provider-mediasoup/src/lib.rs", sourceSymbol: "MailProviderMediasoupPackageContract", builtin: false, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved" },
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
