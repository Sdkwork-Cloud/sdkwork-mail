final class MailProviderActivationCatalogEntry {
  const MailProviderActivationCatalogEntry({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
    required this.activationStatus,
    required this.runtimeBridge,
    required this.rootPublic,
    required this.packageBoundary,
    required this.builtin,
    required this.packageIdentity,
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
  final String activationStatus;
  final bool runtimeBridge;
  final bool rootPublic;
  final bool packageBoundary;
  final bool builtin;
  final String packageIdentity;
}

final class MailProviderActivationCatalog {
  static const List<String> recognizedActivationStatuses = <String>[
    "package-boundary",
    "control-metadata-only",
  ];

  static const List<MailProviderActivationCatalogEntry> entries =
      <MailProviderActivationCatalogEntry>[
    MailProviderActivationCatalogEntry(
      providerKey: "volcengine",
      pluginId: "Mail-volcengine",
      driverId: "sdkwork-mail-driver-volcengine",
      activationStatus: "package-boundary",
      runtimeBridge: true,
      rootPublic: false,
      packageBoundary: true,
      builtin: true,
      packageIdentity: "mail_sdk_provider_volcengine",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "aliyun",
      pluginId: "Mail-aliyun",
      driverId: "sdkwork-mail-driver-aliyun",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: true,
      packageIdentity: "mail_sdk_provider_aliyun",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "tencent",
      pluginId: "Mail-tencent",
      driverId: "sdkwork-mail-driver-tencent",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: true,
      packageIdentity: "mail_sdk_provider_tencent",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "agora",
      pluginId: "Mail-agora",
      driverId: "sdkwork-mail-driver-agora",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: true,
      packageIdentity: "mail_sdk_provider_agora",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "zego",
      pluginId: "Mail-zego",
      driverId: "sdkwork-mail-driver-zego",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: false,
      packageIdentity: "mail_sdk_provider_zego",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "livekit",
      pluginId: "Mail-livekit",
      driverId: "sdkwork-mail-driver-livekit",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: true,
      packageIdentity: "mail_sdk_provider_livekit",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "twilio",
      pluginId: "Mail-twilio",
      driverId: "sdkwork-mail-driver-twilio",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: false,
      packageIdentity: "mail_sdk_provider_twilio",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "jitsi",
      pluginId: "Mail-jitsi",
      driverId: "sdkwork-mail-driver-jitsi",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: false,
      packageIdentity: "mail_sdk_provider_jitsi",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "janus",
      pluginId: "Mail-janus",
      driverId: "sdkwork-mail-driver-janus",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: false,
      packageIdentity: "mail_sdk_provider_janus",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "mediasoup",
      pluginId: "Mail-mediasoup",
      driverId: "sdkwork-mail-driver-mediasoup",
      activationStatus: "control-metadata-only",
      runtimeBridge: false,
      rootPublic: false,
      packageBoundary: false,
      builtin: false,
      packageIdentity: "mail_sdk_provider_mediasoup",
    ),
      ];

  const MailProviderActivationCatalog._();
}

MailProviderActivationCatalogEntry? getMailProviderActivationByProviderKey(String providerKey) {
  for (final entry in MailProviderActivationCatalog.entries) {
    if (entry.providerKey == providerKey) {
      return entry;
    }
  }

  return null;
}
