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
      capabilityKey: "session",
      category: "required-baseline",
      surface: "cross-surface",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "credential",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "provider.webhook",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "provider.event-normalization",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "health",
      category: "required-baseline",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "media.audio",
      category: "required-baseline",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "media.video",
      category: "required-baseline",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "live.broadcast",
      category: "required-baseline",
      surface: "cross-surface",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "live.audience",
      category: "required-baseline",
      surface: "cross-surface",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "screen-share",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "recording",
      category: "optional-advanced",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "artifact",
      category: "optional-advanced",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "cloud-mix",
      category: "optional-advanced",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "cdn-relay",
      category: "optional-advanced",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "data-channel",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "transcription",
      category: "optional-advanced",
      surface: "control-plane",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "beauty",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "spatial-audio",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "e2ee",
      category: "optional-advanced",
      surface: "runtime-bridge",
    ),
    MailCapabilityCatalogEntry(
      capabilityKey: "provider.active-query",
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
