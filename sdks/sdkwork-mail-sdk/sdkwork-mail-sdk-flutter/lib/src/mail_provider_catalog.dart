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
  static const String DEFAULT_mail_PROVIDER_KEY = "smtp";

  static const List<MailProviderCatalogEntry> entries = <MailProviderCatalogEntry>[
    MailProviderCatalogEntry(
      providerKey: "smtp",
      pluginId: "Mail-smtp",
      driverId: "sdkwork-mail-driver-smtp",
      defaultSelected: true,
    ),
    MailProviderCatalogEntry(
      providerKey: "imap",
      pluginId: "Mail-imap",
      driverId: "sdkwork-mail-driver-imap",
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
