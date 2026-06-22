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
          extensionKey: "smtp.transport",
          providerKey: "smtp",
          displayName: "SMTP Transport",
          surface: "runtime-bridge",
          access: "unwrap-only",
          status: "reserved",
        ),
        MailProviderExtensionCatalogEntry(
          extensionKey: "imap.sync",
          providerKey: "imap",
          displayName: "IMAP Sync",
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
