import 'mail_capability_catalog.dart';
import 'mail_provider_activation_catalog.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_extension_catalog.dart';
import 'mail_types.dart';

const Map<String, String> _MailProviderDisplayNames = <String, String>{
  'volcengine': 'Volcengine Mail',
  'aliyun': 'Aliyun Mail',
  'tencent': 'Tencent Mail',
  'agora': 'Agora Mail',
  'zego': 'ZEGO Mail',
  'livekit': 'LiveKit Mail',
  'twilio': 'Twilio Video',
  'jitsi': 'Jitsi Meet',
  'janus': 'Janus Mail',
  'mediasoup': 'mediasoup Mail',
};

const Map<String, List<String>> _MailProviderOptionalCapabilityMap =
    <String, List<String>>{
  'volcengine': <String>['screen-share', 'recording', 'cloud-mix'],
  'aliyun': <String>['screen-share', 'recording'],
  'tencent': <String>['screen-share', 'recording', 'cdn-relay'],
  'agora': <String>[
    'screen-share',
    'recording',
    'cloud-mix',
    'data-channel',
    'spatial-audio',
    'e2ee',
  ],
  'zego': <String>['screen-share', 'recording', 'cloud-mix', 'beauty'],
  'livekit': <String>[
    'screen-share',
    'recording',
    'data-channel',
    'transcription',
    'e2ee',
  ],
  'twilio': <String>['screen-share', 'recording', 'data-channel'],
  'jitsi': <String>['screen-share', 'recording', 'transcription'],
  'janus': <String>['data-channel'],
  'mediasoup': <String>['data-channel'],
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

final Map<String, MailProviderMetadata> _officialMailProviderMetadataByKey =
    <String, MailProviderMetadata>{
  for (final metadata in _officialMailProviderMetadataCatalog)
    metadata.providerKey: metadata,
};

final Set<String> _builtinMailProviderKeys = MailProviderActivationCatalog.entries
    .where((entry) => entry.builtin)
    .map((entry) => entry.providerKey)
    .toSet();

final List<MailProviderMetadata> _builtinMailProviderMetadataCatalog =
    _officialMailProviderMetadataCatalog
        .where((metadata) => _builtinMailProviderKeys.contains(metadata.providerKey))
        .toList(growable: false);

List<MailProviderMetadata> getOfficialMailProviderMetadataCatalog() {
  return List<MailProviderMetadata>.unmodifiable(
    _officialMailProviderMetadataCatalog,
  );
}

List<MailProviderMetadata> getBuiltinMailProviderMetadataCatalog() {
  return List<MailProviderMetadata>.unmodifiable(
    _builtinMailProviderMetadataCatalog,
  );
}

MailProviderMetadata? getOfficialMailProviderMetadataByKey(String providerKey) {
  return _officialMailProviderMetadataByKey[providerKey];
}
