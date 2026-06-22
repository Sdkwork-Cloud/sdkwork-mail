#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub defaultSelected: bool,
}

pub struct MailProviderCatalog;

pub const DEFAULT_mail_PROVIDER_KEY: &str = "volcengine";

pub const OFFICIAL_mail_PROVIDERS: [MailProviderCatalogEntry; 10] = [
    MailProviderCatalogEntry { providerKey: "volcengine", pluginId: "Mail-volcengine", driverId: "sdkwork-mail-driver-volcengine", defaultSelected: true },
    MailProviderCatalogEntry { providerKey: "aliyun", pluginId: "Mail-aliyun", driverId: "sdkwork-mail-driver-aliyun", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "tencent", pluginId: "Mail-tencent", driverId: "sdkwork-mail-driver-tencent", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "agora", pluginId: "Mail-agora", driverId: "sdkwork-mail-driver-agora", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "zego", pluginId: "Mail-zego", driverId: "sdkwork-mail-driver-zego", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "livekit", pluginId: "Mail-livekit", driverId: "sdkwork-mail-driver-livekit", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "twilio", pluginId: "Mail-twilio", driverId: "sdkwork-mail-driver-twilio", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "jitsi", pluginId: "Mail-jitsi", driverId: "sdkwork-mail-driver-jitsi", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "janus", pluginId: "Mail-janus", driverId: "sdkwork-mail-driver-janus", defaultSelected: false },
    MailProviderCatalogEntry { providerKey: "mediasoup", pluginId: "Mail-mediasoup", driverId: "sdkwork-mail-driver-mediasoup", defaultSelected: false },
];

pub fn get_mail_provider_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderCatalogEntry> {
    OFFICIAL_mail_PROVIDERS
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}
