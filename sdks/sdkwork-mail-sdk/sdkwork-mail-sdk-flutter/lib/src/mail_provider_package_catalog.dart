final class MailProviderPackageCatalogEntry {
  const MailProviderPackageCatalogEntry({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
    required this.packageIdentity,
    required this.manifestPath,
    required this.readmePath,
    required this.sourcePath,
    required this.sourceSymbol,
    required this.builtin,
    required this.rootPublic,
    required this.status,
    required this.runtimeBridgeStatus,
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
  final String packageIdentity;
  final String manifestPath;
  final String readmePath;
  final String sourcePath;
  final String sourceSymbol;
  final bool builtin;
  final bool rootPublic;
  final String status;
  final String runtimeBridgeStatus;
}

final class MailProviderPackageCatalog {
  static const List<MailProviderPackageCatalogEntry> entries =
      <MailProviderPackageCatalogEntry>[
    MailProviderPackageCatalogEntry(
      providerKey: "volcengine",
      pluginId: "Mail-volcengine",
      driverId: "sdkwork-mail-driver-volcengine",
      packageIdentity: "mail_sdk_provider_volcengine",
      manifestPath: "providers/mail_sdk_provider_volcengine/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_volcengine/README.md",
      sourcePath: "providers/mail_sdk_provider_volcengine/lib/src/mail_provider_volcengine_package_contract.dart",
      sourceSymbol: "MailProviderVolcenginePackageContract",
      builtin: true,
      rootPublic: false,
      status: "package_reference_boundary",
      runtimeBridgeStatus: "reference-baseline",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "aliyun",
      pluginId: "Mail-aliyun",
      driverId: "sdkwork-mail-driver-aliyun",
      packageIdentity: "mail_sdk_provider_aliyun",
      manifestPath: "providers/mail_sdk_provider_aliyun/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_aliyun/README.md",
      sourcePath: "providers/mail_sdk_provider_aliyun/lib/src/mail_provider_aliyun_package_contract.dart",
      sourceSymbol: "MailProviderAliyunPackageContract",
      builtin: true,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "tencent",
      pluginId: "Mail-tencent",
      driverId: "sdkwork-mail-driver-tencent",
      packageIdentity: "mail_sdk_provider_tencent",
      manifestPath: "providers/mail_sdk_provider_tencent/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_tencent/README.md",
      sourcePath: "providers/mail_sdk_provider_tencent/lib/src/mail_provider_tencent_package_contract.dart",
      sourceSymbol: "MailProviderTencentPackageContract",
      builtin: true,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "agora",
      pluginId: "Mail-agora",
      driverId: "sdkwork-mail-driver-agora",
      packageIdentity: "mail_sdk_provider_agora",
      manifestPath: "providers/mail_sdk_provider_agora/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_agora/README.md",
      sourcePath: "providers/mail_sdk_provider_agora/lib/src/mail_provider_agora_package_contract.dart",
      sourceSymbol: "MailProviderAgoraPackageContract",
      builtin: true,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "zego",
      pluginId: "Mail-zego",
      driverId: "sdkwork-mail-driver-zego",
      packageIdentity: "mail_sdk_provider_zego",
      manifestPath: "providers/mail_sdk_provider_zego/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_zego/README.md",
      sourcePath: "providers/mail_sdk_provider_zego/lib/src/mail_provider_zego_package_contract.dart",
      sourceSymbol: "MailProviderZegoPackageContract",
      builtin: false,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "livekit",
      pluginId: "Mail-livekit",
      driverId: "sdkwork-mail-driver-livekit",
      packageIdentity: "mail_sdk_provider_livekit",
      manifestPath: "providers/mail_sdk_provider_livekit/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_livekit/README.md",
      sourcePath: "providers/mail_sdk_provider_livekit/lib/src/mail_provider_livekit_package_contract.dart",
      sourceSymbol: "MailProviderLivekitPackageContract",
      builtin: true,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "twilio",
      pluginId: "Mail-twilio",
      driverId: "sdkwork-mail-driver-twilio",
      packageIdentity: "mail_sdk_provider_twilio",
      manifestPath: "providers/mail_sdk_provider_twilio/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_twilio/README.md",
      sourcePath: "providers/mail_sdk_provider_twilio/lib/src/mail_provider_twilio_package_contract.dart",
      sourceSymbol: "MailProviderTwilioPackageContract",
      builtin: false,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "jitsi",
      pluginId: "Mail-jitsi",
      driverId: "sdkwork-mail-driver-jitsi",
      packageIdentity: "mail_sdk_provider_jitsi",
      manifestPath: "providers/mail_sdk_provider_jitsi/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_jitsi/README.md",
      sourcePath: "providers/mail_sdk_provider_jitsi/lib/src/mail_provider_jitsi_package_contract.dart",
      sourceSymbol: "MailProviderJitsiPackageContract",
      builtin: false,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "janus",
      pluginId: "Mail-janus",
      driverId: "sdkwork-mail-driver-janus",
      packageIdentity: "mail_sdk_provider_janus",
      manifestPath: "providers/mail_sdk_provider_janus/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_janus/README.md",
      sourcePath: "providers/mail_sdk_provider_janus/lib/src/mail_provider_janus_package_contract.dart",
      sourceSymbol: "MailProviderJanusPackageContract",
      builtin: false,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "mediasoup",
      pluginId: "Mail-mediasoup",
      driverId: "sdkwork-mail-driver-mediasoup",
      packageIdentity: "mail_sdk_provider_mediasoup",
      manifestPath: "providers/mail_sdk_provider_mediasoup/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_mediasoup/README.md",
      sourcePath: "providers/mail_sdk_provider_mediasoup/lib/src/mail_provider_mediasoup_package_contract.dart",
      sourceSymbol: "MailProviderMediasoupPackageContract",
      builtin: false,
      rootPublic: false,
      status: "future-runtime-bridge-only",
      runtimeBridgeStatus: "reserved",
    )
      ];

  const MailProviderPackageCatalog._();
}

MailProviderPackageCatalogEntry? getMailProviderPackageByProviderKey(String providerKey) {
  for (final entry in MailProviderPackageCatalog.entries) {
    if (entry.providerKey == providerKey) {
      return entry;
    }
  }

  return null;
}

MailProviderPackageCatalogEntry? getMailProviderPackageByPackageIdentity(String packageIdentity) {
  for (final entry in MailProviderPackageCatalog.entries) {
    if (entry.packageIdentity == packageIdentity) {
      return entry;
    }
  }

  return null;
}
