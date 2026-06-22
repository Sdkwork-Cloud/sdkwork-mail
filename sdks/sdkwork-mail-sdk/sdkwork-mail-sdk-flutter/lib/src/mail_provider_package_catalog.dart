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
      providerKey: "smtp",
      pluginId: "Mail-smtp",
      driverId: "sdkwork-mail-driver-smtp",
      packageIdentity: "mail_sdk_provider_smtp",
      manifestPath: "providers/mail_sdk_provider_smtp/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_smtp/README.md",
      sourcePath: "providers/mail_sdk_provider_smtp/lib/src/mail_provider_smtp_package_contract.dart",
      sourceSymbol: "MailProviderSmtpPackageContract",
      builtin: true,
      rootPublic: false,
      status: "package_reference_boundary",
      runtimeBridgeStatus: "reserved",
    ),
    MailProviderPackageCatalogEntry(
      providerKey: "imap",
      pluginId: "Mail-imap",
      driverId: "sdkwork-mail-driver-imap",
      packageIdentity: "mail_sdk_provider_imap",
      manifestPath: "providers/mail_sdk_provider_imap/pubspec.yaml",
      readmePath: "providers/mail_sdk_provider_imap/README.md",
      sourcePath: "providers/mail_sdk_provider_imap/lib/src/mail_provider_imap_package_contract.dart",
      sourceSymbol: "MailProviderImapPackageContract",
      builtin: true,
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
