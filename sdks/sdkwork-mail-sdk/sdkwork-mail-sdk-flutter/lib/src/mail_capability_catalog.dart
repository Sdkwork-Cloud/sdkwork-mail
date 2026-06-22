final class MailCapabilityCatalogEntry {
  const MailCapabilityCatalogEntry({
    required this.capabilityKey,
    required this.category,
    required this.surface,
  });

  final String capabilityKey;
  final String category;
  final String surface;
}

final class MailCapabilityCatalog {
  static const List<MailCapabilityCatalogEntry> entries = <MailCapabilityCatalogEntry>[
    MailCapabilityCatalogEntry(
      capabilityKey: "transport.connect",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "transport.authenticate",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "health",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "smtp.send",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "imap.sync",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "imap.folder-sync",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "imap.message-sync",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "transport.retry",
      category: "optional-advanced",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "transport.pool",
      category: "optional-advanced",
      surface: "control-plane",
    )
  ];

  const MailCapabilityCatalog._();
}

List<MailCapabilityCatalogEntry> getMailCapabilityCatalog() {
  return MailCapabilityCatalog.entries;
}

MailCapabilityCatalogEntry? getMailCapabilityDescriptor(String capabilityKey) {
  for (final entry in MailCapabilityCatalog.entries) {
    if (entry.capabilityKey == capabilityKey) {
      return entry;
    }
  }

  return null;
}
