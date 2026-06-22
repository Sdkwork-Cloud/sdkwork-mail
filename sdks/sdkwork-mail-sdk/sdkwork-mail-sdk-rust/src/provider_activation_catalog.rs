#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderActivationCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub activationStatus: &'static str,
    pub runtimeBridge: bool,
    pub rootPublic: bool,
    pub packageBoundary: bool,
    pub builtin: bool,
    pub packageIdentity: &'static str,
}

pub struct MailProviderActivationCatalog;

pub const mail_PROVIDER_ACTIVATION_STATUSES: [&str; 2] = ["package-boundary", "control-metadata-only"];

pub const OFFICIAL_mail_PROVIDER_ACTIVATIONS: [MailProviderActivationCatalogEntry; 10] = [
    MailProviderActivationCatalogEntry { providerKey: "volcengine", pluginId: "Mail-volcengine", driverId: "sdkwork-mail-driver-volcengine", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: true, packageIdentity: "Mail-sdk-provider-volcengine" },
    MailProviderActivationCatalogEntry { providerKey: "aliyun", pluginId: "Mail-aliyun", driverId: "sdkwork-mail-driver-aliyun", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: true, packageIdentity: "Mail-sdk-provider-aliyun" },
    MailProviderActivationCatalogEntry { providerKey: "tencent", pluginId: "Mail-tencent", driverId: "sdkwork-mail-driver-tencent", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: true, packageIdentity: "Mail-sdk-provider-tencent" },
    MailProviderActivationCatalogEntry { providerKey: "agora", pluginId: "Mail-agora", driverId: "sdkwork-mail-driver-agora", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: true, packageIdentity: "Mail-sdk-provider-agora" },
    MailProviderActivationCatalogEntry { providerKey: "zego", pluginId: "Mail-zego", driverId: "sdkwork-mail-driver-zego", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: false, packageIdentity: "Mail-sdk-provider-zego" },
    MailProviderActivationCatalogEntry { providerKey: "livekit", pluginId: "Mail-livekit", driverId: "sdkwork-mail-driver-livekit", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: true, packageIdentity: "Mail-sdk-provider-livekit" },
    MailProviderActivationCatalogEntry { providerKey: "twilio", pluginId: "Mail-twilio", driverId: "sdkwork-mail-driver-twilio", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: false, packageIdentity: "Mail-sdk-provider-twilio" },
    MailProviderActivationCatalogEntry { providerKey: "jitsi", pluginId: "Mail-jitsi", driverId: "sdkwork-mail-driver-jitsi", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: false, packageIdentity: "Mail-sdk-provider-jitsi" },
    MailProviderActivationCatalogEntry { providerKey: "janus", pluginId: "Mail-janus", driverId: "sdkwork-mail-driver-janus", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: false, packageIdentity: "Mail-sdk-provider-janus" },
    MailProviderActivationCatalogEntry { providerKey: "mediasoup", pluginId: "Mail-mediasoup", driverId: "sdkwork-mail-driver-mediasoup", activationStatus: "control-metadata-only", runtimeBridge: false, rootPublic: false, packageBoundary: false, builtin: false, packageIdentity: "Mail-sdk-provider-mediasoup" },
];

pub fn get_mail_provider_activation_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderActivationCatalogEntry> {
    OFFICIAL_mail_PROVIDER_ACTIVATIONS
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}
