import 'mail_capability_catalog.dart';
import 'mail_provider_activation_catalog.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_extension_catalog.dart';
import 'mail_types.dart';

const Map<String, String> _MailProviderDisplayNames = <String, String>{
  'smtp': 'SMTP Mail Transport',
  'imap': 'IMAP Mail Transport',
};

const Map<String, List<String>> _MailProviderOptionalCapabilityMap =
    <String, List<String>>{
  'smtp': <String>['smtp.send', 'transport.retry', 'transport.pool'],
  'imap': <String>[
    'imap.sync',
    'imap.folder-sync',
    'imap.message-sync',
    'transport.retry',
  ],
};

List<String> _buildRequiredCapabilities() {
  return MailCapabilityCatalog.entries
      .where((entry) => entry.category == 'required-baseline')
      .map((entry) => entry.capabilityKey)
      .toList(growable: false);
}

List<String> _buildExtensionKeys(String providerKey) {
  return getMailProviderExtensionsForProvider(providerKey)
      .map((entry) => entry.extensionKey)
      .toList(growable: false);
}

MailProviderMetadata _buildProviderMetadata(MailProviderCatalogEntry entry) {
  return MailProviderMetadata(
    providerKey: entry.providerKey,
    pluginId: entry.pluginId,
    driverId: entry.driverId,
    displayName: _MailProviderDisplayNames[entry.providerKey] ?? entry.providerKey,
    defaultSelected: entry.defaultSelected,
    requiredCapabilities: _buildRequiredCapabilities(),
    optionalCapabilities: List<String>.of(
      _MailProviderOptionalCapabilityMap[entry.providerKey] ?? const <String>[],
      growable: false,
    ),
    extensionKeys: _buildExtensionKeys(entry.providerKey),
  );
}

final List<MailProviderMetadata> _officialMailProviderMetadataCatalog =
    MailProviderCatalog.entries
        .map(_buildProviderMetadata)
        .toList(growable: false);

MailProviderMetadata? getMailProviderMetadataByProviderKey(String providerKey) {
  for (final metadata in _officialMailProviderMetadataCatalog) {
    if (metadata.providerKey == providerKey) {
      return metadata;
    }
  }
  return null;
}

MailProviderMetadata getMailProviderMetadataOrThrow(String providerKey) {
  final metadata = getMailProviderMetadataByProviderKey(providerKey);
  if (metadata == null) {
    throw StateError('unknown Mail provider key: $providerKey');
  }
  return metadata;
}

List<MailProviderMetadata> getOfficialMailProviderMetadataCatalog() {
  return List<MailProviderMetadata>.unmodifiable(_officialMailProviderMetadataCatalog);
}

MailProviderMetadata getDefaultMailProviderMetadata() {
  return getMailProviderMetadataOrThrow(MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
}

MailProviderActivationEntry? getMailProviderActivationEntry(String providerKey) {
  for (final entry in MailProviderActivationCatalog.entries) {
    if (entry.providerKey == providerKey) {
      return entry;
    }
  }
  return null;
}

MailProviderMetadata? getOfficialMailProviderMetadataByKey(String providerKey) {
  return getMailProviderMetadataByProviderKey(providerKey);
}
