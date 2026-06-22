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
      providerKey: "smtp",
      pluginId: "Mail-smtp",
      driverId: "sdkwork-mail-driver-smtp",
      activationStatus: "package-boundary",
      runtimeBridge: true,
      rootPublic: false,
      packageBoundary: true,
      builtin: true,
      packageIdentity: "mail_sdk_provider_smtp",
    ),
    MailProviderActivationCatalogEntry(
      providerKey: "imap",
      pluginId: "Mail-imap",
      driverId: "sdkwork-mail-driver-imap",
      activationStatus: "package-boundary",
      runtimeBridge: true,
      rootPublic: false,
      packageBoundary: true,
      builtin: true,
      packageIdentity: "mail_sdk_provider_imap",
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
