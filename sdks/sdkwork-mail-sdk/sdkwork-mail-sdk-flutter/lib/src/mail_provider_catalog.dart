final class MailProviderCatalogEntry {
  const MailProviderCatalogEntry({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
    required this.defaultSelected,
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
  final bool defaultSelected;
}

final class MailProviderCatalog {
  static const String DEFAULT_mail_PROVIDER_KEY = "volcengine";

  static const List<MailProviderCatalogEntry> entries = <MailProviderCatalogEntry>[
    MailProviderCatalogEntry(
      providerKey: "volcengine",
      pluginId: "Mail-volcengine",
      driverId: "sdkwork-mail-driver-volcengine",
      defaultSelected: true,
    ),
    MailProviderCatalogEntry(
      providerKey: "aliyun",
      pluginId: "Mail-aliyun",
      driverId: "sdkwork-mail-driver-aliyun",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "tencent",
      pluginId: "Mail-tencent",
      driverId: "sdkwork-mail-driver-tencent",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "agora",
      pluginId: "Mail-agora",
      driverId: "sdkwork-mail-driver-agora",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "zego",
      pluginId: "Mail-zego",
      driverId: "sdkwork-mail-driver-zego",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "livekit",
      pluginId: "Mail-livekit",
      driverId: "sdkwork-mail-driver-livekit",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "twilio",
      pluginId: "Mail-twilio",
      driverId: "sdkwork-mail-driver-twilio",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "jitsi",
      pluginId: "Mail-jitsi",
      driverId: "sdkwork-mail-driver-jitsi",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "janus",
      pluginId: "Mail-janus",
      driverId: "sdkwork-mail-driver-janus",
      defaultSelected: false,
    ),
    MailProviderCatalogEntry(
      providerKey: "mediasoup",
      pluginId: "Mail-mediasoup",
      driverId: "sdkwork-mail-driver-mediasoup",
      defaultSelected: false,
    )
  ];

  const MailProviderCatalog._();
}

MailProviderCatalogEntry? getMailProviderByProviderKey(String providerKey) {
  for (final entry in MailProviderCatalog.entries) {
    if (entry.providerKey == providerKey) {
      return entry;
    }
  }

  return null;
}
