final class MailProviderExtensionCatalogEntry {
  const MailProviderExtensionCatalogEntry({
    required this.extensionKey,
    required this.providerKey,
    required this.displayName,
    required this.surface,
    required this.access,
    required this.status,
  });

  final String extensionKey;
  final String providerKey;
  final String displayName;
  final String surface;
  final String access;
  final String status;
}

final class MailProviderExtensionCatalog {
  static const List<String> recognizedSurfaces = <String>[
    'control-plane',
    'runtime-bridge',
    'cross-surface',
  ];

  static const List<String> recognizedAccessModes = <String>[
    'unwrap-only',
    'extension-object',
  ];

  static const List<String> recognizedStatuses = <String>[
    'reference-baseline',
    'reserved',
  ];

  static const List<MailProviderExtensionCatalogEntry> entries =
      <MailProviderExtensionCatalogEntry>[
        MailProviderExtensionCatalogEntry(
          extensionKey: "volcengine.native-client",
          providerKey: "volcengine",
          displayName: "Volcengine Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reference-baseline",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "aliyun.native-client",
          providerKey: "aliyun",
          displayName: "Aliyun Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "tencent.native-client",
          providerKey: "tencent",
          displayName: "Tencent Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reference-baseline",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "agora.native-client",
          providerKey: "agora",
          displayName: "Agora Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "zego.native-client",
          providerKey: "zego",
          displayName: "ZEGO Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "livekit.native-client",
          providerKey: "livekit",
          displayName: "LiveKit Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "twilio.native-client",
          providerKey: "twilio",
          displayName: "Twilio Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "jitsi.native-client",
          providerKey: "jitsi",
          displayName: "Jitsi Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "janus.native-client",
          providerKey: "janus",
          displayName: "Janus Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "mediasoup.native-client",
          providerKey: "mediasoup",
          displayName: "mediasoup Native Client",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        )
      ];

  const MailProviderExtensionCatalog._();
}

List<MailProviderExtensionCatalogEntry> getMailProviderExtensionCatalog() {
  return MailProviderExtensionCatalog.entries;
}

MailProviderExtensionCatalogEntry? getMailProviderExtensionDescriptor(String extensionKey) {
  for (final entry in MailProviderExtensionCatalog.entries) {
    if (entry.extensionKey == extensionKey) {
      return entry;
    }
  }

  return null;
}

List<MailProviderExtensionCatalogEntry> getMailProviderExtensionsForProvider(String providerKey) {
  return MailProviderExtensionCatalog.entries
      .where((entry) => entry.providerKey == providerKey)
      .toList(growable: false);
}

List<MailProviderExtensionCatalogEntry> getMailProviderExtensions(List<String> extensionKeys) {
  final entries = <MailProviderExtensionCatalogEntry>[];

  for (final extensionKey in extensionKeys) {
    final entry = getMailProviderExtensionDescriptor(extensionKey);
    if (entry != null) {
      entries.add(entry);
    }
  }

  return entries.toList(growable: false);
}

bool hasMailProviderExtension(List<String> extensionKeys, String extensionKey) {
  return extensionKeys.contains(extensionKey) &&
      getMailProviderExtensionDescriptor(extensionKey) != null;
}
