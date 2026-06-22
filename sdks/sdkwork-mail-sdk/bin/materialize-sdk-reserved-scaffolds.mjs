import {
  buildLanguageProviderActivationCatalogEntries,
  buildProviderPackageManifestPath,
  buildProviderPackageReadmePath,
  buildProviderPackageSourcePath,
  buildProviderPackageSourceRelativePath,
  buildProviderPackageSourceRoot,
  buildProviderPackageSourceSymbol,
  buildReservedProviderPackageCatalogEntries,
  materializeProviderPackagePattern,
  resolveProviderPackageScaffoldRuntimeBridgeStatus,
  resolveProviderPackageScaffoldStatus,
  toPascalCase,
} from './Mail-standard-shared-helpers.mjs';
import {
  mail_PROVIDER_ACTIVATION_STATUSES as PROVIDER_ACTIVATION_STATUSES,
  mail_PROVIDER_SELECTION_SOURCES as PROVIDER_SELECTION_SOURCES,
  mail_PROVIDER_SUPPORT_STATUSES as PROVIDER_SUPPORT_STATUSES,
} from './Mail-standard-contract-constants.mjs';
function q(value) {
  return JSON.stringify(String(value));
}

function qNullable(value) {
  return typeof value === 'string' ? q(value) : 'null';
}

function qRustOption(value) {
  return typeof value === 'string' ? `Some(${q(value)})` : 'None';
}

function qSwiftOption(value) {
  return typeof value === 'string' ? q(value) : 'nil';
}

function qPythonOption(value) {
  return typeof value === 'string' ? q(value) : 'None';
}

function qGoStringPointer(value) {
  return typeof value === 'string' ? `MailStringPtr(${q(value)})` : 'nil';
}

function renderFlutterRuntimeSurfaceMethodEntries(assembly, indent = '  ') {
  return (assembly.runtimeSurfaceStandard?.methodTerms ?? [])
    .map((methodName) => `${indent}'${String(methodName).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`)
    .join('\n');
}

function renderFlutterTypesModule() {
  return lines(`
import 'mail_provider_selection.dart';

enum MailTrackKind {
  audio,
  video,
  screenShare,
  data,
}

String MailTrackKindWireName(MailTrackKind kind) {
  switch (kind) {
    case MailTrackKind.audio:
      return 'audio';
    case MailTrackKind.video:
      return 'video';
    case MailTrackKind.screenShare:
      return 'screen-share';
    case MailTrackKind.data:
      return 'data';
  }
}

enum MailSessionConnectionState {
  joined,
  left,
}

class MailProviderMetadata {
  const MailProviderMetadata({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
    required this.displayName,
    required this.defaultSelected,
    this.requiredCapabilities = const <String>[],
    this.optionalCapabilities = const <String>[],
    this.extensionKeys = const <String>[],
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
  final String displayName;
  final bool defaultSelected;
  final List<String> requiredCapabilities;
  final List<String> optionalCapabilities;
  final List<String> extensionKeys;

  Map<String, Object?> toDebugMap() {
    return <String, Object?>{
      'providerKey': providerKey,
      'pluginId': pluginId,
      'driverId': driverId,
      'displayName': displayName,
      'defaultSelected': defaultSelected,
      'requiredCapabilities': requiredCapabilities,
      'optionalCapabilities': optionalCapabilities,
      'extensionKeys': extensionKeys,
    };
  }
}

class MailJoinOptions {
  const MailJoinOptions({
    required this.sessionId,
    required this.roomId,
    required this.participantId,
    this.token,
    this.metadata,
  });

  final String sessionId;
  final String roomId;
  final String participantId;
  final String? token;
  final Map<String, Object?>? metadata;
}

class MailSessionDescriptor {
  const MailSessionDescriptor({
    required this.sessionId,
    required this.roomId,
    required this.participantId,
    required this.providerKey,
    required this.connectionState,
  });

  final String sessionId;
  final String roomId;
  final String participantId;
  final String providerKey;
  final MailSessionConnectionState connectionState;
}

class MailPublishOptions {
  const MailPublishOptions({
    required this.trackId,
    required this.kind,
    this.metadata,
  });

  final String trackId;
  final MailTrackKind kind;
  final Map<String, Object?>? metadata;
}

class MailScreenShareOptions {
  const MailScreenShareOptions({
    required this.trackId,
    this.metadata,
  });

  final String trackId;
  final Map<String, Object?>? metadata;
}

class MailTrackPublication {
  const MailTrackPublication({
    required this.trackId,
    required this.kind,
    required this.muted,
  });

  final String trackId;
  final MailTrackKind kind;
  final bool muted;
}

class MailMuteState {
  const MailMuteState({
    required this.kind,
    required this.muted,
  });

  final MailTrackKind kind;
  final bool muted;
}

class MailClientConfig {
  const MailClientConfig({
    this.providerUrl,
    this.providerKey,
    this.tenantOverrideProviderKey,
    this.deploymentProfileProviderKey,
    this.defaultProviderKey,
    this.nativeConfig,
  });

  final String? providerUrl;
  final String? providerKey;
  final String? tenantOverrideProviderKey;
  final String? deploymentProfileProviderKey;
  final String? defaultProviderKey;
  final Object? nativeConfig;
}

class MailResolvedClientConfig extends MailClientConfig {
  const MailResolvedClientConfig({
    super.providerUrl,
    required super.providerKey,
    super.tenantOverrideProviderKey,
    super.deploymentProfileProviderKey,
    super.defaultProviderKey,
    super.nativeConfig,
    required this.selectionSource,
  });

  final MailProviderSelectionSource selectionSource;
}

class MailRuntimeControllerContext<TNativeClient> {
  const MailRuntimeControllerContext({
    required this.metadata,
    required this.selection,
    required this.nativeClient,
  });

  final MailProviderMetadata metadata;
  final MailProviderSelection selection;
  final TNativeClient nativeClient;
}
`);
}

function renderFlutterClientModule() {
  return lines(`
import 'mail_errors.dart';
import 'mail_provider_selection.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class StandardMailClient<TNativeClient> implements MailClient<TNativeClient> {
  StandardMailClient({
    required this.metadata,
    required this.selection,
    required TNativeClient nativeClient,
    MailRuntimeController<TNativeClient>? runtimeController,
  })  : _nativeClient = nativeClient,
        _runtimeController = runtimeController;

  @override
  final MailProviderMetadata metadata;

  @override
  final MailProviderSelection selection;

  final TNativeClient _nativeClient;
  final MailRuntimeController<TNativeClient>? _runtimeController;

  MailRuntimeControllerContext<TNativeClient> get _runtimeContext {
    return MailRuntimeControllerContext<TNativeClient>(
      metadata: metadata,
      selection: selection,
      nativeClient: _nativeClient,
    );
  }

  MailRuntimeController<TNativeClient> _requireRuntimeController(
    String methodName,
  ) {
    if (_runtimeController != null) {
      return _runtimeController;
    }

    throw MailSdkException(
      code: MailStandardContract.runtimeSurfaceFailureCode,
      message: 'Mail runtime bridge method not available: $methodName',
      providerKey: metadata.providerKey,
      pluginId: metadata.pluginId,
      details: <String, Object?>{
        'methodName': methodName,
      },
    );
  }

  MailScreenShareRuntimeController<TNativeClient>?
      _resolveScreenShareRuntimeController() {
    final runtimeController = _runtimeController;
    if (runtimeController is MailScreenShareRuntimeController<TNativeClient>) {
      return runtimeController as MailScreenShareRuntimeController<TNativeClient>;
    }

    return null;
  }

  @override
  Future<MailSessionDescriptor> join(MailJoinOptions options) {
    return _requireRuntimeController('join').join(options, _runtimeContext);
  }

  @override
  Future<MailSessionDescriptor> leave() {
    return _requireRuntimeController('leave').leave(_runtimeContext);
  }

  @override
  Future<MailTrackPublication> publish(MailPublishOptions options) {
    return _requireRuntimeController('publish').publish(options, _runtimeContext);
  }

  @override
  Future<void> unpublish(String trackId) {
    return _requireRuntimeController('unpublish').unpublish(
      trackId,
      _runtimeContext,
    );
  }

  @override
  Future<MailTrackPublication> startScreenShare(
    MailScreenShareOptions options,
  ) {
    requireCapability('screen-share');
    final runtimeController = _requireRuntimeController('startScreenShare');
    final screenShareRuntimeController = _resolveScreenShareRuntimeController();
    if (screenShareRuntimeController != null) {
      return screenShareRuntimeController.startScreenShare(options, _runtimeContext);
    }

    return runtimeController.publish(
      MailPublishOptions(
        trackId: options.trackId,
        kind: MailTrackKind.screenShare,
        metadata: options.metadata,
      ),
      _runtimeContext,
    );
  }

  @override
  Future<void> stopScreenShare(String trackId) {
    requireCapability('screen-share');
    final runtimeController = _requireRuntimeController('stopScreenShare');
    final screenShareRuntimeController = _resolveScreenShareRuntimeController();
    if (screenShareRuntimeController != null) {
      return screenShareRuntimeController.stopScreenShare(trackId, _runtimeContext);
    }

    return runtimeController.unpublish(trackId, _runtimeContext);
  }

  @override
  Future<MailMuteState> muteAudio(bool muted) {
    return _requireRuntimeController('muteAudio').muteAudio(
      muted,
      _runtimeContext,
    );
  }

  @override
  Future<MailMuteState> muteVideo(bool muted) {
    return _requireRuntimeController('muteVideo').muteVideo(
      muted,
      _runtimeContext,
    );
  }

  @override
  List<String> getProviderExtensions() {
    return List<String>.unmodifiable(metadata.extensionKeys);
  }

  @override
  bool supportsProviderExtension(String extensionKey) {
    return metadata.extensionKeys.contains(extensionKey);
  }

  @override
  bool supportsCapability(String capability) {
    return metadata.requiredCapabilities.contains(capability) ||
        metadata.optionalCapabilities.contains(capability);
  }

  @override
  void requireCapability(String capability) {
    if (supportsCapability(capability)) {
      return;
    }

    throw MailSdkException(
      code: 'capability_not_supported',
      message: 'Mail capability not supported: $capability',
      providerKey: metadata.providerKey,
      pluginId: metadata.pluginId,
      details: <String, Object?>{
        'capability': capability,
      },
    );
  }

  @override
  TNativeClient unwrap() => _nativeClient;
}
`);
}

function renderFlutterRuntimeSurfaceModule(assembly) {
  return lines(`
const List<String> MailRuntimeSurfaceMethods = <String>[
${renderFlutterRuntimeSurfaceMethodEntries(assembly)}
];

const String MailRuntimeSurfaceFailureCode = 'native_sdk_not_available';

const Map<String, Object> MailRuntimeSurfaceStandard = <String, Object>{
  'methodTerms': MailRuntimeSurfaceMethods,
  'failureCode': MailRuntimeSurfaceFailureCode,
};
`);
}

function renderProviderPackageScaffoldInitializer(language, providerPackageScaffold) {
  if (!providerPackageScaffold) {
    switch (language) {
      case 'go':
      case 'swift':
        return 'nil';
      case 'python':
        return 'None';
      default:
        return 'null';
    }
  }

  const baseArguments = [
    q(providerPackageScaffold.relativePath),
    q(providerPackageScaffold.directoryPattern),
    q(providerPackageScaffold.packagePattern),
    q(providerPackageScaffold.manifestFileName),
    q(providerPackageScaffold.readmeFileName),
    q(providerPackageScaffold.sourceFilePattern),
    q(providerPackageScaffold.sourceSymbolPattern),
  ];
  const referenceArguments = [
    providerPackageScaffold.referenceProviderKey,
    providerPackageScaffold.referenceStatus,
    providerPackageScaffold.referenceRuntimeBridgeStatus,
    providerPackageScaffold.referenceVendorSdkPackage,
    providerPackageScaffold.referenceVendorSdkVersion,
  ];

  switch (language) {
    case 'java':
      return `new MailLanguageWorkspaceProviderPackageScaffold(${[
        ...baseArguments,
        `List.of(${providerPackageScaffold.templateTokens.map(q).join(', ')})`,
        `List.of(${providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')})`,
        ...referenceArguments.map(qNullable),
        q(providerPackageScaffold.runtimeBridgeStatus),
        providerPackageScaffold.rootPublic ? 'true' : 'false',
        q(providerPackageScaffold.status),
      ].join(', ')})`;
    case 'csharp':
      return `new(${[
        ...baseArguments,
        `new List<string> { ${providerPackageScaffold.templateTokens.map(q).join(', ')} }`,
        `new List<string> { ${providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')} }`,
        ...referenceArguments.map(qNullable),
        q(providerPackageScaffold.runtimeBridgeStatus),
        providerPackageScaffold.rootPublic ? 'true' : 'false',
        q(providerPackageScaffold.status),
      ].join(', ')})`;
    case 'swift':
      return `.init(relativePath: ${q(providerPackageScaffold.relativePath)}, directoryPattern: ${q(providerPackageScaffold.directoryPattern)}, packagePattern: ${q(providerPackageScaffold.packagePattern)}, manifestFileName: ${q(providerPackageScaffold.manifestFileName)}, readmeFileName: ${q(providerPackageScaffold.readmeFileName)}, sourceFilePattern: ${q(providerPackageScaffold.sourceFilePattern)}, sourceSymbolPattern: ${q(providerPackageScaffold.sourceSymbolPattern)}, templateTokens: [${providerPackageScaffold.templateTokens.map(q).join(', ')}], sourceTemplateTokens: [${providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')}], referenceProviderKey: ${qSwiftOption(providerPackageScaffold.referenceProviderKey)}, referenceStatus: ${qSwiftOption(providerPackageScaffold.referenceStatus)}, referenceRuntimeBridgeStatus: ${qSwiftOption(providerPackageScaffold.referenceRuntimeBridgeStatus)}, referenceVendorSdkPackage: ${qSwiftOption(providerPackageScaffold.referenceVendorSdkPackage)}, referenceVendorSdkVersion: ${qSwiftOption(providerPackageScaffold.referenceVendorSdkVersion)}, runtimeBridgeStatus: ${q(providerPackageScaffold.runtimeBridgeStatus)}, rootPublic: ${providerPackageScaffold.rootPublic ? 'true' : 'false'}, status: ${q(providerPackageScaffold.status)})`;
    case 'kotlin':
      return `MailLanguageWorkspaceProviderPackageScaffold(${[
        ...baseArguments,
        `listOf(${providerPackageScaffold.templateTokens.map(q).join(', ')})`,
        `listOf(${providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')})`,
        ...referenceArguments.map(qNullable),
        q(providerPackageScaffold.runtimeBridgeStatus),
        providerPackageScaffold.rootPublic ? 'true' : 'false',
        q(providerPackageScaffold.status),
      ].join(', ')})`;
    case 'go':
      return `&MailLanguageWorkspaceProviderPackageScaffold{RelativePath: ${q(providerPackageScaffold.relativePath)}, DirectoryPattern: ${q(providerPackageScaffold.directoryPattern)}, PackagePattern: ${q(providerPackageScaffold.packagePattern)}, ManifestFileName: ${q(providerPackageScaffold.manifestFileName)}, ReadmeFileName: ${q(providerPackageScaffold.readmeFileName)}, SourceFilePattern: ${q(providerPackageScaffold.sourceFilePattern)}, SourceSymbolPattern: ${q(providerPackageScaffold.sourceSymbolPattern)}, TemplateTokens: []string{${providerPackageScaffold.templateTokens.map(q).join(', ')}}, SourceTemplateTokens: []string{${providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')}}, ReferenceProviderKey: ${qGoStringPointer(providerPackageScaffold.referenceProviderKey)}, ReferenceStatus: ${qGoStringPointer(providerPackageScaffold.referenceStatus)}, ReferenceRuntimeBridgeStatus: ${qGoStringPointer(providerPackageScaffold.referenceRuntimeBridgeStatus)}, ReferenceVendorSdkPackage: ${qGoStringPointer(providerPackageScaffold.referenceVendorSdkPackage)}, ReferenceVendorSdkVersion: ${qGoStringPointer(providerPackageScaffold.referenceVendorSdkVersion)}, RuntimeBridgeStatus: ${q(providerPackageScaffold.runtimeBridgeStatus)}, RootPublic: ${providerPackageScaffold.rootPublic ? 'true' : 'false'}, Status: ${q(providerPackageScaffold.status)}}`;
    case 'python':
      return `MailLanguageWorkspaceProviderPackageScaffold(${[
        ...baseArguments,
        `[${providerPackageScaffold.templateTokens.map(q).join(', ')}]`,
        `[${providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')}]`,
        ...referenceArguments.map(qPythonOption),
        q(providerPackageScaffold.runtimeBridgeStatus),
        providerPackageScaffold.rootPublic ? 'True' : 'False',
        q(providerPackageScaffold.status),
      ].join(', ')})`;
    default:
      throw new Error(`Unsupported provider package scaffold language: ${language}`);
  }
}

function lines(value) {
  return `${value.trim()}\n`;
}

function renderTemplateTokenList(tokens) {
  return (tokens ?? []).map((token) => `\`${token}\``).join(', ');
}

export function resolveFlutterRuntimeBaselineDependencyLines(packageName) {
  void packageName;
  return [];
}

function renderFlutterRuntimeBaselineDependencies(languageEntry) {
  if (!languageEntry.runtimeBaseline) {
    throw new Error('Flutter language workspace must declare runtimeBaseline metadata');
  }

  return [
    '  flutter:',
    '    sdk: flutter',
  ].join('\n');
}

function renderFlutterRootAnalysisOptions() {
  return lines(`
analyzer:
  exclude:
    - providers/**
`);
}

function renderReservedLanguageProviderCatalogLookupHelper(language) {
  switch (language) {
    case 'flutter':
      return lines(`
MailProviderCatalogEntry? getMailProviderByProviderKey(String providerKey) {
  for (final entry in MailProviderCatalog.entries) {
    if (entry.providerKey == providerKey) {
      return entry;
    }
  }

  return null;
}
`);
    case 'rust':
      return lines(`
pub fn get_mail_provider_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderCatalogEntry> {
    OFFICIAL_mail_PROVIDERS
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}
`);
    case 'java':
      return lines(`
  public static Optional<Entry> getMailProviderByProviderKey(String providerKey) {
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }
`);
    case 'csharp':
      return lines(`
    public static MailProviderCatalogEntry? GetMailProviderByProviderKey(string providerKey) =>
        Entries.FirstOrDefault(entry => entry.providerKey == providerKey);
`);
    case 'swift':
      return lines(`
    public static func getMailProviderByProviderKey(_ providerKey: String) -> MailProviderCatalogEntry? {
        entries.first { $0.providerKey == providerKey }
    }
`);
    case 'kotlin':
      return lines(`
    fun getMailProviderByProviderKey(providerKey: String): MailProviderCatalogEntry? =
        entries.firstOrNull { it.providerKey == providerKey }
`);
    case 'go':
      return lines(`
func GetMailProviderByProviderKey(providerKey string) *MailProviderCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDERS {
        if OFFICIAL_mail_PROVIDERS[index].ProviderKey == providerKey {
            return &OFFICIAL_mail_PROVIDERS[index]
        }
    }

    return nil
}
`);
    case 'python':
      return lines(`
def get_mail_provider_by_provider_key(provider_key: str) -> Optional[MailProviderCatalogEntry]:
    for entry in MailProviderCatalog.entries:
        if entry.providerKey == provider_key:
            return entry

    return None
`);
    default:
      return '';
  }
}

function renderReservedLanguageProviderPackageLookupHelper(language) {
  switch (language) {
    case 'flutter':
      return lines(`
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
`);
    case 'rust':
      return lines(`
pub fn get_mail_provider_package_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderPackageCatalogEntry> {
    OFFICIAL_mail_PROVIDER_PACKAGES
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}

pub fn get_mail_provider_package_by_package_identity(
    package_identity: &str,
) -> Option<&'static MailProviderPackageCatalogEntry> {
    OFFICIAL_mail_PROVIDER_PACKAGES
        .iter()
        .find(|entry| entry.packageIdentity == package_identity)
}
`);
    case 'java':
      return lines(`
  public static Optional<MailProviderPackageCatalogEntry> getMailProviderPackageByProviderKey(String providerKey) {
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }

  public static Optional<MailProviderPackageCatalogEntry> getMailProviderPackageByPackageIdentity(String packageIdentity) {
    for (var entry : ENTRIES) {
      if (entry.packageIdentity().equals(packageIdentity)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }
`);
    case 'csharp':
      return lines(`
    public static MailProviderPackageCatalogEntry? GetMailProviderPackageByProviderKey(string providerKey) =>
        Entries.FirstOrDefault(entry => entry.providerKey == providerKey);

    public static MailProviderPackageCatalogEntry? GetMailProviderPackageByPackageIdentity(string packageIdentity) =>
        Entries.FirstOrDefault(entry => entry.packageIdentity == packageIdentity);
`);
    case 'swift':
      return lines(`
    public static func getMailProviderPackageByProviderKey(_ providerKey: String) -> MailProviderPackageCatalogEntry? {
        entries.first { $0.providerKey == providerKey }
    }

    public static func getMailProviderPackageByPackageIdentity(_ packageIdentity: String) -> MailProviderPackageCatalogEntry? {
        entries.first { $0.packageIdentity == packageIdentity }
    }
`);
    case 'kotlin':
      return lines(`
    fun getMailProviderPackageByProviderKey(providerKey: String): MailProviderPackageCatalogEntry? =
        entries.firstOrNull { it.providerKey == providerKey }

    fun getMailProviderPackageByPackageIdentity(packageIdentity: String): MailProviderPackageCatalogEntry? =
        entries.firstOrNull { it.packageIdentity == packageIdentity }
`);
    case 'go':
      return lines(`
func GetMailProviderPackageByProviderKey(providerKey string) *MailProviderPackageCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDER_PACKAGES {
        if OFFICIAL_mail_PROVIDER_PACKAGES[index].ProviderKey == providerKey {
            return &OFFICIAL_mail_PROVIDER_PACKAGES[index]
        }
    }

    return nil
}

func GetMailProviderPackageByPackageIdentity(packageIdentity string) *MailProviderPackageCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDER_PACKAGES {
        if OFFICIAL_mail_PROVIDER_PACKAGES[index].PackageIdentity == packageIdentity {
            return &OFFICIAL_mail_PROVIDER_PACKAGES[index]
        }
    }

    return nil
}
`);
    case 'python':
      return lines(`
def get_mail_provider_package_by_provider_key(provider_key: str) -> Optional[MailProviderPackageCatalogEntry]:
    for entry in MailProviderPackageCatalog.entries:
        if entry.providerKey == provider_key:
            return entry

    return None


def get_mail_provider_package_by_package_identity(package_identity: str) -> Optional[MailProviderPackageCatalogEntry]:
    for entry in MailProviderPackageCatalog.entries:
        if entry.packageIdentity == package_identity:
            return entry

    return None
`);
    default:
      return '';
  }
}

function renderReservedLanguageProviderActivationLookupHelper(language) {
  switch (language) {
    case 'flutter':
      return lines(`
MailProviderActivationCatalogEntry? getMailProviderActivationByProviderKey(String providerKey) {
  for (final entry in MailProviderActivationCatalog.entries) {
    if (entry.providerKey == providerKey) {
      return entry;
    }
  }

  return null;
}
`);
    case 'rust':
      return lines(`
pub fn get_mail_provider_activation_by_provider_key(
    provider_key: &str,
) -> Option<&'static MailProviderActivationCatalogEntry> {
    OFFICIAL_mail_PROVIDER_ACTIVATIONS
        .iter()
        .find(|entry| entry.providerKey == provider_key)
}
`);
    case 'java':
      return lines(`
  public static Optional<MailProviderActivationCatalogEntry> getMailProviderActivationByProviderKey(String providerKey) {
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }
`);
    case 'csharp':
      return lines(`
    public static MailProviderActivationCatalogEntry? GetMailProviderActivationByProviderKey(string providerKey) =>
        Entries.FirstOrDefault(entry => entry.providerKey == providerKey);
`);
    case 'swift':
      return lines(`
    public static func getMailProviderActivationByProviderKey(_ providerKey: String) -> MailProviderActivationCatalogEntry? {
        entries.first { $0.providerKey == providerKey }
    }
`);
    case 'kotlin':
      return lines(`
    fun getMailProviderActivationByProviderKey(providerKey: String): MailProviderActivationCatalogEntry? =
        entries.firstOrNull { it.providerKey == providerKey }
`);
    case 'go':
      return lines(`
func GetMailProviderActivationByProviderKey(providerKey string) *MailProviderActivationCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDER_ACTIVATIONS {
        if OFFICIAL_mail_PROVIDER_ACTIVATIONS[index].ProviderKey == providerKey {
            return &OFFICIAL_mail_PROVIDER_ACTIVATIONS[index]
        }
    }

    return nil
}
`);
    case 'python':
      return lines(`
def get_mail_provider_activation_by_provider_key(provider_key: str) -> Optional[MailProviderActivationCatalogEntry]:
    for entry in MailProviderActivationCatalog.entries:
        if entry.providerKey == provider_key:
            return entry

    return None
`);
    default:
      return '';
  }
}

function renderReservedLanguageCapabilityLookupHelper(language) {
  switch (language) {
    case 'flutter':
      return lines(`
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
`);
    case 'rust':
      return lines(`
pub fn get_mail_capability_catalog() -> &'static [MailCapabilityCatalogEntry] {
    &mail_CAPABILITY_CATALOG
}

pub fn get_mail_capability_descriptor(
    capability_key: &str,
) -> Option<&'static MailCapabilityCatalogEntry> {
    mail_CAPABILITY_CATALOG
        .iter()
        .find(|entry| entry.capabilityKey == capability_key)
}
`);
    case 'java':
      return lines(`
  public static List<Entry> getMailCapabilityCatalog() {
    return ENTRIES;
  }

  public static Optional<Entry> getMailCapabilityDescriptor(String capabilityKey) {
    for (var entry : ENTRIES) {
      if (entry.capabilityKey().equals(capabilityKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }
`);
    case 'csharp':
      return lines(`
    public static IReadOnlyList<MailCapabilityCatalogEntry> GetMailCapabilityCatalog() =>
        Entries;

    public static MailCapabilityCatalogEntry? GetMailCapabilityDescriptor(string capabilityKey) =>
        Entries.FirstOrDefault(entry => entry.capabilityKey == capabilityKey);
`);
    case 'swift':
      return lines(`
    public static func getMailCapabilityCatalog() -> [MailCapabilityCatalogEntry] {
        entries
    }

    public static func getMailCapabilityDescriptor(_ capabilityKey: String) -> MailCapabilityCatalogEntry? {
        entries.first { $0.capabilityKey == capabilityKey }
    }
`);
    case 'kotlin':
      return lines(`
    fun getMailCapabilityCatalog(): List<MailCapabilityCatalogEntry> = entries

    fun getMailCapabilityDescriptor(capabilityKey: String): MailCapabilityCatalogEntry? =
        entries.firstOrNull { it.capabilityKey == capabilityKey }
`);
    case 'go':
      return lines(`
func GetMailCapabilityCatalog() []MailCapabilityCatalogEntry {
    return append([]MailCapabilityCatalogEntry(nil), mail_CAPABILITY_CATALOG...)
}

func GetMailCapabilityDescriptor(capabilityKey string) *MailCapabilityCatalogEntry {
    for index := range mail_CAPABILITY_CATALOG {
        if mail_CAPABILITY_CATALOG[index].CapabilityKey == capabilityKey {
            return &mail_CAPABILITY_CATALOG[index]
        }
    }

    return nil
}
`);
    case 'python':
      return lines(`
def get_mail_capability_catalog() -> list[MailCapabilityCatalogEntry]:
    return MailCapabilityCatalog.entries


def get_mail_capability_descriptor(capability_key: str) -> Optional[MailCapabilityCatalogEntry]:
    for entry in MailCapabilityCatalog.entries:
        if entry.capabilityKey == capability_key:
            return entry

    return None
`);
    default:
      return '';
  }
}

function renderReservedLanguageProviderExtensionLookupHelper(language) {
  switch (language) {
    case 'flutter':
      return lines(`
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
`);
    case 'rust':
      return lines(`
pub fn get_mail_provider_extension_catalog() -> &'static [MailProviderExtensionCatalogEntry] {
    &mail_PROVIDER_EXTENSION_CATALOG
}

pub fn get_mail_provider_extension_descriptor(
    extension_key: &str,
) -> Option<&'static MailProviderExtensionCatalogEntry> {
    mail_PROVIDER_EXTENSION_CATALOG
        .iter()
        .find(|entry| entry.extensionKey == extension_key)
}

pub fn get_mail_provider_extensions_for_provider(
    provider_key: &str,
) -> Vec<MailProviderExtensionCatalogEntry> {
    mail_PROVIDER_EXTENSION_CATALOG
        .iter()
        .filter(|entry| entry.providerKey == provider_key)
        .copied()
        .collect()
}

pub fn get_mail_provider_extensions(
    extension_keys: &[&str],
) -> Vec<MailProviderExtensionCatalogEntry> {
    extension_keys
        .iter()
        .filter_map(|extension_key| get_mail_provider_extension_descriptor(extension_key).copied())
        .collect()
}

pub fn has_mail_provider_extension(extension_keys: &[&str], extension_key: &str) -> bool {
    extension_keys.iter().any(|value| *value == extension_key)
        && get_mail_provider_extension_descriptor(extension_key).is_some()
}
`);
    case 'java':
      return lines(`
  public static List<Entry> getMailProviderExtensionCatalog() {
    return ENTRIES;
  }

  public static Optional<Entry> getMailProviderExtensionDescriptor(String extensionKey) {
    for (var entry : ENTRIES) {
      if (entry.extensionKey().equals(extensionKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }

  public static List<Entry> getMailProviderExtensionsForProvider(String providerKey) {
    var resolved = new ArrayList<Entry>();
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        resolved.add(entry);
      }
    }

    return List.copyOf(resolved);
  }

  public static List<Entry> getMailProviderExtensions(List<String> extensionKeys) {
    var resolved = new ArrayList<Entry>();
    for (var extensionKey : extensionKeys) {
      getMailProviderExtensionDescriptor(extensionKey).ifPresent(resolved::add);
    }

    return List.copyOf(resolved);
  }

  public static boolean hasMailProviderExtension(List<String> extensionKeys, String extensionKey) {
    return extensionKeys.contains(extensionKey)
        && getMailProviderExtensionDescriptor(extensionKey).isPresent();
  }
`);
    case 'csharp':
      return lines(`
    public static IReadOnlyList<MailProviderExtensionCatalogEntry> GetMailProviderExtensionCatalog() =>
        Entries;

    public static MailProviderExtensionCatalogEntry? GetMailProviderExtensionDescriptor(string extensionKey) =>
        Entries.FirstOrDefault(entry => entry.extensionKey == extensionKey);

    public static IReadOnlyList<MailProviderExtensionCatalogEntry> GetMailProviderExtensionsForProvider(string providerKey) =>
        Entries.Where(entry => entry.providerKey == providerKey).ToArray();

    public static IReadOnlyList<MailProviderExtensionCatalogEntry> GetMailProviderExtensions(IReadOnlyList<string> extensionKeys)
    {
        var entries = new List<MailProviderExtensionCatalogEntry>();
        foreach (var extensionKey in extensionKeys)
        {
            var entry = GetMailProviderExtensionDescriptor(extensionKey);
            if (entry is not null)
            {
                entries.Add(entry);
            }
        }

        return entries.ToArray();
    }

    public static bool HasMailProviderExtension(IReadOnlyList<string> extensionKeys, string extensionKey) =>
        extensionKeys.Contains(extensionKey) && GetMailProviderExtensionDescriptor(extensionKey) is not null;
`);
    case 'swift':
      return lines(`
    public static func getMailProviderExtensionCatalog() -> [MailProviderExtensionCatalogEntry] {
        entries
    }

    public static func getMailProviderExtensionDescriptor(_ extensionKey: String) -> MailProviderExtensionCatalogEntry? {
        entries.first { $0.extensionKey == extensionKey }
    }

    public static func getMailProviderExtensionsForProvider(_ providerKey: String) -> [MailProviderExtensionCatalogEntry] {
        entries.filter { $0.providerKey == providerKey }
    }

    public static func getMailProviderExtensions(_ extensionKeys: [String]) -> [MailProviderExtensionCatalogEntry] {
        var resolved: [MailProviderExtensionCatalogEntry] = []
        for extensionKey in extensionKeys {
            if let entry = getMailProviderExtensionDescriptor(extensionKey) {
                resolved.append(entry)
            }
        }

        return resolved
    }

    public static func hasMailProviderExtension(_ extensionKeys: [String], _ extensionKey: String) -> Bool {
        extensionKeys.contains(extensionKey) && getMailProviderExtensionDescriptor(extensionKey) != nil
    }
`);
    case 'kotlin':
      return lines(`
    fun getMailProviderExtensionCatalog(): List<MailProviderExtensionCatalogEntry> = entries

    fun getMailProviderExtensionDescriptor(extensionKey: String): MailProviderExtensionCatalogEntry? =
        entries.firstOrNull { it.extensionKey == extensionKey }

    fun getMailProviderExtensionsForProvider(providerKey: String): List<MailProviderExtensionCatalogEntry> =
        entries.filter { it.providerKey == providerKey }

    fun getMailProviderExtensions(extensionKeys: List<String>): List<MailProviderExtensionCatalogEntry> =
        extensionKeys.mapNotNull(::getMailProviderExtensionDescriptor)

    fun hasMailProviderExtension(extensionKeys: List<String>, extensionKey: String): Boolean =
        extensionKeys.contains(extensionKey) && getMailProviderExtensionDescriptor(extensionKey) != null
`);
    case 'go':
      return lines(`
func GetMailProviderExtensionCatalog() []MailProviderExtensionCatalogEntry {
    return append([]MailProviderExtensionCatalogEntry(nil), mail_PROVIDER_EXTENSION_CATALOG...)
}

func GetMailProviderExtensionDescriptor(extensionKey string) *MailProviderExtensionCatalogEntry {
    for index := range mail_PROVIDER_EXTENSION_CATALOG {
        if mail_PROVIDER_EXTENSION_CATALOG[index].ExtensionKey == extensionKey {
            return &mail_PROVIDER_EXTENSION_CATALOG[index]
        }
    }

    return nil
}

func GetMailProviderExtensionsForProvider(providerKey string) []MailProviderExtensionCatalogEntry {
    entries := make([]MailProviderExtensionCatalogEntry, 0)
    for _, entry := range mail_PROVIDER_EXTENSION_CATALOG {
        if entry.ProviderKey == providerKey {
            entries = append(entries, entry)
        }
    }

    return entries
}

func GetMailProviderExtensions(extensionKeys []string) []MailProviderExtensionCatalogEntry {
    entries := make([]MailProviderExtensionCatalogEntry, 0)
    for _, extensionKey := range extensionKeys {
        entry := GetMailProviderExtensionDescriptor(extensionKey)
        if entry != nil {
            entries = append(entries, *entry)
        }
    }

    return entries
}

func HasMailProviderExtension(extensionKeys []string, extensionKey string) bool {
    if GetMailProviderExtensionDescriptor(extensionKey) == nil {
        return false
    }

    for _, value := range extensionKeys {
        if value == extensionKey {
            return true
        }
    }

    return false
}
`);
    case 'python':
      return lines(`
def get_mail_provider_extension_catalog() -> list[MailProviderExtensionCatalogEntry]:
    return MailProviderExtensionCatalog.entries


def get_mail_provider_extension_descriptor(
    extension_key: str,
) -> Optional[MailProviderExtensionCatalogEntry]:
    for entry in MailProviderExtensionCatalog.entries:
        if entry.extensionKey == extension_key:
            return entry

    return None


def get_mail_provider_extensions_for_provider(
    provider_key: str,
) -> list[MailProviderExtensionCatalogEntry]:
    return [
        entry for entry in MailProviderExtensionCatalog.entries if entry.providerKey == provider_key
    ]


def get_mail_provider_extensions(
    extension_keys: list[str],
) -> list[MailProviderExtensionCatalogEntry]:
    entries: list[MailProviderExtensionCatalogEntry] = []
    for extension_key in extension_keys:
        entry = get_mail_provider_extension_descriptor(extension_key)
        if entry is not None:
            entries.append(entry)

    return entries


def has_mail_provider_extension(extension_keys: list[str], extension_key: str) -> bool:
    return extension_key in extension_keys and get_mail_provider_extension_descriptor(extension_key) is not None
`);
    default:
      return '';
  }
}

function renderReservedLanguageWorkspaceLookupHelper(language) {
  switch (language) {
    case 'flutter':
      return lines(`
MailLanguageWorkspaceCatalogEntry? getMailLanguageWorkspaceByLanguage(String language) {
  for (final entry in MailLanguageWorkspaceCatalog.entries) {
    if (entry.language == language) {
      return entry;
    }
  }

  return null;
}
`);
    case 'rust':
      return lines(`
pub fn get_mail_language_workspace_by_language(
    language: &str,
) -> Option<&'static MailLanguageWorkspaceCatalogEntry> {
    OFFICIAL_mail_LANGUAGE_WORKSPACES
        .iter()
        .find(|entry| entry.language == language)
}
`);
    case 'java':
      return lines(`
  public static Optional<MailLanguageWorkspaceCatalogEntry> getMailLanguageWorkspaceByLanguage(String language) {
    for (var entry : ENTRIES) {
      if (entry.language().equals(language)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }
`);
    case 'csharp':
      return lines(`
    public static MailLanguageWorkspaceCatalogEntry? GetMailLanguageWorkspaceByLanguage(string language) =>
        Entries.FirstOrDefault(entry => entry.language == language);
`);
    case 'swift':
      return lines(`
    public static func getMailLanguageWorkspaceByLanguage(_ language: String) -> MailLanguageWorkspaceCatalogEntry? {
        entries.first { $0.language == language }
    }
`);
    case 'kotlin':
      return lines(`
    fun getMailLanguageWorkspaceByLanguage(language: String): MailLanguageWorkspaceCatalogEntry? =
        entries.firstOrNull { it.language == language }
`);
    case 'go':
      return lines(`
func GetMailLanguageWorkspaceByLanguage(language string) *MailLanguageWorkspaceCatalogEntry {
    for index := range OFFICIAL_mail_LANGUAGE_WORKSPACES {
        if OFFICIAL_mail_LANGUAGE_WORKSPACES[index].Language == language {
            return &OFFICIAL_mail_LANGUAGE_WORKSPACES[index]
        }
    }

    return nil
}
`);
    case 'python':
      return lines(`
def get_mail_language_workspace_by_language(language: str) -> Optional[MailLanguageWorkspaceCatalogEntry]:
    for entry in MailLanguageWorkspaceCatalog.entries:
        if entry.language == language:
            return entry

    return None
`);
    default:
      return '';
  }
}

function renderReservedLanguageProviderSelectionModule(language) {
  switch (language) {
    case 'flutter':
      return lines(`
import 'mail_provider_catalog.dart';

enum MailProviderSelectionSource {
  provider_url,
  provider_key,
  tenant_override,
  deployment_profile,
  default_provider,
}

final class ParsedMailProviderUrl {
  const ParsedMailProviderUrl({
    required this.providerKey,
    required this.rawUrl,
  });

  final String providerKey;
  final String rawUrl;
}

final class MailProviderSelection {
  const MailProviderSelection({
    required this.providerKey,
    required this.source,
  });

  final String providerKey;
  final MailProviderSelectionSource source;
}

final class MailProviderSelectionRequest {
  const MailProviderSelectionRequest({
    this.providerUrl,
    this.providerKey,
    this.tenantOverrideProviderKey,
    this.deploymentProfileProviderKey,
  });

  final String? providerUrl;
  final String? providerKey;
  final String? tenantOverrideProviderKey;
  final String? deploymentProfileProviderKey;
}

const List<String> MailProviderSelectionSources = <String>[
  'provider_url',
  'provider_key',
  'tenant_override',
  'deployment_profile',
  'default_provider',
];

const List<String> MailProviderSelectionPrecedence = <String>[
  'provider_url',
  'provider_key',
  'tenant_override',
  'deployment_profile',
  'default_provider',
];

bool _hasMailProviderSelectionText(String? value) =>
    value != null && value.trim().isNotEmpty;

ParsedMailProviderUrl parseMailProviderUrl(String providerUrl) {
  final trimmed = providerUrl.trim();
  if (!trimmed.startsWith('Mail:') || !trimmed.contains('://')) {
    throw ArgumentError.value(providerUrl, 'providerUrl', 'Invalid Mail provider URL');
  }

  return ParsedMailProviderUrl(
    providerKey: trimmed.substring(4).split('://').first.toLowerCase(),
    rawUrl: providerUrl,
  );
}

MailProviderSelection resolveMailProviderSelection(
  MailProviderSelectionRequest request, {
  String defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
}) {
  if (_hasMailProviderSelectionText(request.providerUrl)) {
    return MailProviderSelection(
      providerKey: parseMailProviderUrl(request.providerUrl!).providerKey,
      source: MailProviderSelectionSource.provider_url,
    );
  }

  if (_hasMailProviderSelectionText(request.providerKey)) {
    return MailProviderSelection(
      providerKey: request.providerKey!.trim(),
      source: MailProviderSelectionSource.provider_key,
    );
  }

  if (_hasMailProviderSelectionText(request.tenantOverrideProviderKey)) {
    return MailProviderSelection(
      providerKey: request.tenantOverrideProviderKey!.trim(),
      source: MailProviderSelectionSource.tenant_override,
    );
  }

  if (_hasMailProviderSelectionText(request.deploymentProfileProviderKey)) {
    return MailProviderSelection(
      providerKey: request.deploymentProfileProviderKey!.trim(),
      source: MailProviderSelectionSource.deployment_profile,
    );
  }

  return MailProviderSelection(
    providerKey: defaultProviderKey,
    source: MailProviderSelectionSource.default_provider,
  );
}
`);
    case 'rust':
      return lines(`
use crate::provider_catalog::DEFAULT_mail_PROVIDER_KEY;

#[allow(non_snake_case)]
pub struct ParsedMailProviderUrl {
    pub providerKey: String,
    pub rawUrl: String,
}

#[allow(non_snake_case)]
pub struct MailProviderSelection {
    pub providerKey: String,
    pub source: &'static str,
}

#[derive(Default)]
#[allow(non_snake_case)]
pub struct MailProviderSelectionRequest {
    pub providerUrl: Option<String>,
    pub providerKey: Option<String>,
    pub tenantOverrideProviderKey: Option<String>,
    pub deploymentProfileProviderKey: Option<String>,
}

pub const mail_PROVIDER_SELECTION_SOURCES: [&str; 5] = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
];

pub const mail_PROVIDER_SELECTION_PRECEDENCE: [&str; 5] = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
];

fn has_mail_provider_selection_text(value: &Option<String>) -> bool {
    value.as_ref().is_some_and(|entry| !entry.trim().is_empty())
}

pub fn parse_mail_provider_url(provider_url: &str) -> ParsedMailProviderUrl {
    let trimmed = provider_url.trim();
    if !trimmed.starts_with("Mail:") || !trimmed.contains("://") {
        panic!("Invalid Mail provider URL: {provider_url}");
    }

    let provider_key = trimmed[4..]
        .split("://")
        .next()
        .unwrap_or(DEFAULT_mail_PROVIDER_KEY)
        .to_lowercase();

    ParsedMailProviderUrl {
        providerKey: provider_key,
        rawUrl: provider_url.to_string(),
    }
}

pub fn resolve_mail_provider_selection(
    request: &MailProviderSelectionRequest,
    default_provider_key: Option<&str>,
) -> MailProviderSelection {
    if has_mail_provider_selection_text(&request.providerUrl) {
        return MailProviderSelection {
            providerKey: parse_mail_provider_url(request.providerUrl.as_deref().unwrap()).providerKey,
            source: "provider_url",
        };
    }

    if has_mail_provider_selection_text(&request.providerKey) {
        return MailProviderSelection {
            providerKey: request.providerKey.as_deref().unwrap().trim().to_string(),
            source: "provider_key",
        };
    }

    if has_mail_provider_selection_text(&request.tenantOverrideProviderKey) {
        return MailProviderSelection {
            providerKey: request
                .tenantOverrideProviderKey
                .as_deref()
                .unwrap()
                .trim()
                .to_string(),
            source: "tenant_override",
        };
    }

    if has_mail_provider_selection_text(&request.deploymentProfileProviderKey) {
        return MailProviderSelection {
            providerKey: request
                .deploymentProfileProviderKey
                .as_deref()
                .unwrap()
                .trim()
                .to_string(),
            source: "deployment_profile",
        };
    }

    MailProviderSelection {
        providerKey: default_provider_key
            .unwrap_or(DEFAULT_mail_PROVIDER_KEY)
            .to_string(),
        source: "default_provider",
    }
}
`);
    case 'java':
      return lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;

public record MailProviderSelection(String providerKey, MailProviderSelectionSource source) {

  public enum MailProviderSelectionSource {
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider
  }

  public record ParsedMailProviderUrl(String providerKey, String rawUrl) {
  }

  public record MailProviderSelectionRequest(
      String providerUrl,
      String providerKey,
      String tenantOverrideProviderKey,
      String deploymentProfileProviderKey
  ) {
  }

  public static final List<String> mail_PROVIDER_SELECTION_SOURCES = List.of(
      "provider_url",
      "provider_key",
      "tenant_override",
      "deployment_profile",
      "default_provider"
  );

  public static final List<String> mail_PROVIDER_SELECTION_PRECEDENCE = List.of(
      "provider_url",
      "provider_key",
      "tenant_override",
      "deployment_profile",
      "default_provider"
  );

  public static ParsedMailProviderUrl parseMailProviderUrl(String providerUrl) {
    var trimmed = providerUrl.trim();
    if (!trimmed.startsWith("Mail:") || !trimmed.contains("://")) {
      throw new IllegalArgumentException("Invalid Mail provider URL: " + providerUrl);
    }

    return new ParsedMailProviderUrl(
        trimmed.substring(4, trimmed.indexOf("://")).toLowerCase(),
        providerUrl
    );
  }

  public static MailProviderSelection resolveMailProviderSelection(
      MailProviderSelectionRequest request
  ) {
    return resolveMailProviderSelection(request, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public static MailProviderSelection resolveMailProviderSelection(
      MailProviderSelectionRequest request,
      String defaultProviderKey
  ) {
    var resolvedRequest = request == null
        ? new MailProviderSelectionRequest(null, null, null, null)
        : request;

    if (hasText(resolvedRequest.providerUrl())) {
      return new MailProviderSelection(
          parseMailProviderUrl(resolvedRequest.providerUrl()).providerKey(),
          MailProviderSelectionSource.provider_url
      );
    }

    if (hasText(resolvedRequest.providerKey())) {
      return new MailProviderSelection(
          resolvedRequest.providerKey().trim(),
          MailProviderSelectionSource.provider_key
      );
    }

    if (hasText(resolvedRequest.tenantOverrideProviderKey())) {
      return new MailProviderSelection(
          resolvedRequest.tenantOverrideProviderKey().trim(),
          MailProviderSelectionSource.tenant_override
      );
    }

    if (hasText(resolvedRequest.deploymentProfileProviderKey())) {
      return new MailProviderSelection(
          resolvedRequest.deploymentProfileProviderKey().trim(),
          MailProviderSelectionSource.deployment_profile
      );
    }

    return new MailProviderSelection(
        defaultProviderKey,
        MailProviderSelectionSource.default_provider
    );
  }

  private static boolean hasText(String value) {
    return value != null && !value.trim().isEmpty();
  }
}
`);
    case 'csharp':
      return lines(`
namespace Sdkwork.Mail.Sdk;

using System;
using System.Collections.Generic;

public enum MailProviderSelectionSource
{
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider,
}

public sealed record ParsedMailProviderUrl(string providerKey, string rawUrl);

public sealed record MailProviderSelectionRequest(
    string? providerUrl = null,
    string? providerKey = null,
    string? tenantOverrideProviderKey = null,
    string? deploymentProfileProviderKey = null
);

public sealed record MailProviderSelection(
    string providerKey,
    MailProviderSelectionSource source
)
{
    public static readonly IReadOnlyList<string> MailProviderSelectionSources =
    [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ];

    public static readonly IReadOnlyList<string> MailProviderSelectionPrecedence =
    [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ];

    public static ParsedMailProviderUrl ParseMailProviderUrl(string providerUrl)
    {
        var trimmed = providerUrl.Trim();
        if (!trimmed.StartsWith("Mail:", StringComparison.OrdinalIgnoreCase) || !trimmed.Contains("://", StringComparison.Ordinal))
        {
            throw new ArgumentException($"Invalid Mail provider URL: {providerUrl}", nameof(providerUrl));
        }

        return new ParsedMailProviderUrl(
            trimmed[4..trimmed.IndexOf("://", StringComparison.Ordinal)].ToLowerInvariant(),
            providerUrl
        );
    }

    public static MailProviderSelection ResolveMailProviderSelection(
        MailProviderSelectionRequest? request = null,
        string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    )
    {
        request ??= new MailProviderSelectionRequest();

        if (HasText(request.providerUrl))
        {
            return new MailProviderSelection(
                ParseMailProviderUrl(request.providerUrl!).providerKey,
                MailProviderSelectionSource.provider_url
            );
        }

        if (HasText(request.providerKey))
        {
            return new MailProviderSelection(
                request.providerKey!.Trim(),
                MailProviderSelectionSource.provider_key
            );
        }

        if (HasText(request.tenantOverrideProviderKey))
        {
            return new MailProviderSelection(
                request.tenantOverrideProviderKey!.Trim(),
                MailProviderSelectionSource.tenant_override
            );
        }

        if (HasText(request.deploymentProfileProviderKey))
        {
            return new MailProviderSelection(
                request.deploymentProfileProviderKey!.Trim(),
                MailProviderSelectionSource.deployment_profile
            );
        }

        return new MailProviderSelection(
            defaultProviderKey,
            MailProviderSelectionSource.default_provider
        );
    }

    private static bool HasText(string? value) => !string.IsNullOrWhiteSpace(value);
}
`);
    case 'swift':
      return lines(`
public enum MailProviderSelectionSource: String {
    case provider_url = "provider_url"
    case provider_key = "provider_key"
    case tenant_override = "tenant_override"
    case deployment_profile = "deployment_profile"
    case default_provider = "default_provider"
}

public struct ParsedMailProviderUrl {
    public let providerKey: String
    public let rawUrl: String

    public init(providerKey: String, rawUrl: String) {
        self.providerKey = providerKey
        self.rawUrl = rawUrl
    }
}

public struct MailProviderSelectionRequest {
    public let providerUrl: String?
    public let providerKey: String?
    public let tenantOverrideProviderKey: String?
    public let deploymentProfileProviderKey: String?

    public init(
        providerUrl: String? = nil,
        providerKey: String? = nil,
        tenantOverrideProviderKey: String? = nil,
        deploymentProfileProviderKey: String? = nil
    ) {
        self.providerUrl = providerUrl
        self.providerKey = providerKey
        self.tenantOverrideProviderKey = tenantOverrideProviderKey
        self.deploymentProfileProviderKey = deploymentProfileProviderKey
    }
}

public struct MailProviderSelection {
    public let providerKey: String
    public let source: MailProviderSelectionSource

    public static let MailProviderSelectionSources: [String] = [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ]

    public static let MailProviderSelectionPrecedence: [String] = [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ]

    public static func parseMailProviderUrl(_ providerUrl: String) -> ParsedMailProviderUrl {
        let trimmed = providerUrl.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasPrefix("Mail:"), let delimiter = trimmed.range(of: "://") else {
            fatalError("Invalid Mail provider URL: \\(providerUrl)")
        }

        return ParsedMailProviderUrl(
            providerKey: String(trimmed[trimmed.index(trimmed.startIndex, offsetBy: 4)..<delimiter.lowerBound]).lowercased(),
            rawUrl: providerUrl
        )
    }

    public static func resolveMailProviderSelection(
        request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) -> MailProviderSelection {
        if let providerUrl = request.providerUrl, hasText(providerUrl) {
            return MailProviderSelection(
                providerKey: parseMailProviderUrl(providerUrl).providerKey,
                source: .provider_url
            )
        }

        if let providerKey = request.providerKey, hasText(providerKey) {
            return MailProviderSelection(
                providerKey: providerKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .provider_key
            )
        }

        if let tenantOverrideProviderKey = request.tenantOverrideProviderKey, hasText(tenantOverrideProviderKey) {
            return MailProviderSelection(
                providerKey: tenantOverrideProviderKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .tenant_override
            )
        }

        if let deploymentProfileProviderKey = request.deploymentProfileProviderKey, hasText(deploymentProfileProviderKey) {
            return MailProviderSelection(
                providerKey: deploymentProfileProviderKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .deployment_profile
            )
        }

        return MailProviderSelection(
            providerKey: defaultProviderKey,
            source: .default_provider
        )
    }

    private static func hasText(_ value: String) -> Bool {
        !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
}
`);
    case 'kotlin':
      return lines(`
package com.sdkwork.Mail.metadata

enum class MailProviderSelectionSource {
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider,
}

data class ParsedMailProviderUrl(
    val providerKey: String,
    val rawUrl: String,
)

data class MailProviderSelection(
    val providerKey: String,
    val source: MailProviderSelectionSource,
)

data class MailProviderSelectionRequest(
    val providerUrl: String? = null,
    val providerKey: String? = null,
    val tenantOverrideProviderKey: String? = null,
    val deploymentProfileProviderKey: String? = null,
)

val mail_PROVIDER_SELECTION_SOURCES: List<String> = listOf(
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
)

val mail_PROVIDER_SELECTION_PRECEDENCE: List<String> = listOf(
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
)

private fun hasMailProviderSelectionText(value: String?): Boolean = value != null && value.isNotBlank()

fun parseMailProviderUrl(providerUrl: String): ParsedMailProviderUrl {
    val trimmed = providerUrl.trim()
    require(trimmed.startsWith("Mail:") && trimmed.contains("://")) {
        "Invalid Mail provider URL: $providerUrl"
    }

    return ParsedMailProviderUrl(
        providerKey = trimmed.substring(4, trimmed.indexOf("://")).lowercase(),
        rawUrl = providerUrl,
    )
}

fun resolveMailProviderSelection(
    request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
    defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
): MailProviderSelection {
    if (hasMailProviderSelectionText(request.providerUrl)) {
        return MailProviderSelection(
            providerKey = parseMailProviderUrl(request.providerUrl!!).providerKey,
            source = MailProviderSelectionSource.provider_url,
        )
    }

    if (hasMailProviderSelectionText(request.providerKey)) {
        return MailProviderSelection(
            providerKey = request.providerKey!!.trim(),
            source = MailProviderSelectionSource.provider_key,
        )
    }

    if (hasMailProviderSelectionText(request.tenantOverrideProviderKey)) {
        return MailProviderSelection(
            providerKey = request.tenantOverrideProviderKey!!.trim(),
            source = MailProviderSelectionSource.tenant_override,
        )
    }

    if (hasMailProviderSelectionText(request.deploymentProfileProviderKey)) {
        return MailProviderSelection(
            providerKey = request.deploymentProfileProviderKey!!.trim(),
            source = MailProviderSelectionSource.deployment_profile,
        )
    }

    return MailProviderSelection(
        providerKey = defaultProviderKey,
        source = MailProviderSelectionSource.default_provider,
    )
}
`);
    case 'go':
      return lines(`
package Mailstandard

import "strings"

type ParsedMailProviderUrl struct {
    ProviderKey string
    RawUrl      string
}

type MailProviderSelection struct {
    ProviderKey string
    Source      string
}

type MailProviderSelectionRequest struct {
    ProviderUrl                  string
    ProviderKey                  string
    TenantOverrideProviderKey    string
    DeploymentProfileProviderKey string
}

var MailProviderSelectionSources = []string{
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
}

var MailProviderSelectionPrecedence = []string{
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
}

func hasMailProviderSelectionText(value string) bool {
    return strings.TrimSpace(value) != ""
}

func ParseMailProviderUrl(providerUrl string) ParsedMailProviderUrl {
    trimmed := strings.TrimSpace(providerUrl)
    if !strings.HasPrefix(trimmed, "Mail:") || !strings.Contains(trimmed, "://") {
        panic("Invalid Mail provider URL: " + providerUrl)
    }

    withoutPrefix := strings.TrimPrefix(trimmed, "Mail:")
    providerKey, _, _ := strings.Cut(withoutPrefix, "://")

    return ParsedMailProviderUrl{
        ProviderKey: strings.ToLower(providerKey),
        RawUrl:      providerUrl,
    }
}

func ResolveMailProviderSelection(
    request MailProviderSelectionRequest,
    defaultProviderKey string,
) MailProviderSelection {
    if hasMailProviderSelectionText(request.ProviderUrl) {
        return MailProviderSelection{
            ProviderKey: ParseMailProviderUrl(request.ProviderUrl).ProviderKey,
            Source:      "provider_url",
        }
    }

    if hasMailProviderSelectionText(request.ProviderKey) {
        return MailProviderSelection{
            ProviderKey: strings.TrimSpace(request.ProviderKey),
            Source:      "provider_key",
        }
    }

    if hasMailProviderSelectionText(request.TenantOverrideProviderKey) {
        return MailProviderSelection{
            ProviderKey: strings.TrimSpace(request.TenantOverrideProviderKey),
            Source:      "tenant_override",
        }
    }

    if hasMailProviderSelectionText(request.DeploymentProfileProviderKey) {
        return MailProviderSelection{
            ProviderKey: strings.TrimSpace(request.DeploymentProfileProviderKey),
            Source:      "deployment_profile",
        }
    }

    resolvedDefaultProviderKey := defaultProviderKey
    if !hasMailProviderSelectionText(resolvedDefaultProviderKey) {
        resolvedDefaultProviderKey = DEFAULT_mail_PROVIDER_KEY
    }

    return MailProviderSelection{
        ProviderKey: resolvedDefaultProviderKey,
        Source:      "default_provider",
    }
}
`);
    case 'python':
      return lines(`
from dataclasses import dataclass
from enum import Enum

from .provider_catalog import DEFAULT_mail_PROVIDER_KEY


class MailProviderSelectionSource(str, Enum):
    provider_url = "provider_url"
    provider_key = "provider_key"
    tenant_override = "tenant_override"
    deployment_profile = "deployment_profile"
    default_provider = "default_provider"


@dataclass(frozen=True)
class ParsedMailProviderUrl:
    providerKey: str
    rawUrl: str


@dataclass(frozen=True)
class MailProviderSelection:
    providerKey: str
    source: MailProviderSelectionSource


@dataclass(frozen=True)
class MailProviderSelectionRequest:
    providerUrl: str | None = None
    providerKey: str | None = None
    tenantOverrideProviderKey: str | None = None
    deploymentProfileProviderKey: str | None = None


mail_PROVIDER_SELECTION_SOURCES = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
]

mail_PROVIDER_SELECTION_PRECEDENCE = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
]


def _has_mail_provider_selection_text(value: str | None) -> bool:
    return value is not None and value.strip() != ""


def parse_mail_provider_url(provider_url: str) -> ParsedMailProviderUrl:
    trimmed = provider_url.strip()
    if not trimmed.startswith("Mail:") or "://" not in trimmed:
        raise ValueError(f"Invalid Mail provider URL: {provider_url}")

    return ParsedMailProviderUrl(
        providerKey=trimmed[4:].split("://", 1)[0].lower(),
        rawUrl=provider_url,
    )


def resolve_mail_provider_selection(
    request: MailProviderSelectionRequest | None = None,
    *,
    default_provider_key: str = DEFAULT_mail_PROVIDER_KEY,
) -> MailProviderSelection:
    request = request or MailProviderSelectionRequest()

    if _has_mail_provider_selection_text(request.providerUrl):
        return MailProviderSelection(
            providerKey=parse_mail_provider_url(request.providerUrl).providerKey,
            source=MailProviderSelectionSource.provider_url,
        )

    if _has_mail_provider_selection_text(request.providerKey):
        return MailProviderSelection(
            providerKey=request.providerKey.strip(),
            source=MailProviderSelectionSource.provider_key,
        )

    if _has_mail_provider_selection_text(request.tenantOverrideProviderKey):
        return MailProviderSelection(
            providerKey=request.tenantOverrideProviderKey.strip(),
            source=MailProviderSelectionSource.tenant_override,
        )

    if _has_mail_provider_selection_text(request.deploymentProfileProviderKey):
        return MailProviderSelection(
            providerKey=request.deploymentProfileProviderKey.strip(),
            source=MailProviderSelectionSource.deployment_profile,
        )

    return MailProviderSelection(
        providerKey=default_provider_key,
        source=MailProviderSelectionSource.default_provider,
    )
`);
    default:
      return '';
  }
}

function renderReservedLanguageProviderSupportModule(language) {
  switch (language) {
    case 'flutter':
      return lines(`
enum MailProviderSupportStatus {
  builtin_registered,
  official_registered,
  official_unregistered,
  unknown,
}

final class MailProviderSupport {
  const MailProviderSupport({
    required this.providerKey,
    required this.status,
    required this.builtin,
    required this.official,
    required this.registered,
  });

  final String providerKey;
  final MailProviderSupportStatus status;
  final bool builtin;
  final bool official;
  final bool registered;
}

final class MailProviderSupportStateRequest {
  const MailProviderSupportStateRequest({
    required this.providerKey,
    required this.builtin,
    required this.official,
    required this.registered,
  });

  final String providerKey;
  final bool builtin;
  final bool official;
  final bool registered;
}

const List<String> MailProviderSupportStatuses = <String>[
  'builtin_registered',
  'official_registered',
  'official_unregistered',
  'unknown',
];

MailProviderSupportStatus resolveMailProviderSupportStatus(
  MailProviderSupportStateRequest request,
) {
  if (request.official && request.registered) {
    return request.builtin
        ? MailProviderSupportStatus.builtin_registered
        : MailProviderSupportStatus.official_registered;
  }

  if (request.official) {
    return MailProviderSupportStatus.official_unregistered;
  }

  return MailProviderSupportStatus.unknown;
}

MailProviderSupport createMailProviderSupportState(
  MailProviderSupportStateRequest request,
) {
  return MailProviderSupport(
    providerKey: request.providerKey,
    status: resolveMailProviderSupportStatus(request),
    builtin: request.builtin,
    official: request.official,
    registered: request.registered,
  );
}
`);
    case 'rust':
      return lines(`
#[allow(non_snake_case)]
pub struct MailProviderSupport {
    pub providerKey: String,
    pub status: &'static str,
    pub builtin: bool,
    pub official: bool,
    pub registered: bool,
}

#[allow(non_snake_case)]
pub struct MailProviderSupportStateRequest {
    pub providerKey: String,
    pub builtin: bool,
    pub official: bool,
    pub registered: bool,
}

pub const mail_PROVIDER_SUPPORT_STATUSES: [&str; 4] = [
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
];

pub fn resolve_mail_provider_support_status(
    request: &MailProviderSupportStateRequest,
) -> &'static str {
    if request.official && request.registered {
        return if request.builtin {
            "builtin_registered"
        } else {
            "official_registered"
        };
    }

    if request.official {
        return "official_unregistered";
    }

    "unknown"
}

pub fn create_mail_provider_support_state(
    request: MailProviderSupportStateRequest,
) -> MailProviderSupport {
    let status = resolve_mail_provider_support_status(&request);

    MailProviderSupport {
        providerKey: request.providerKey,
        status,
        builtin: request.builtin,
        official: request.official,
        registered: request.registered,
    }
}
`);
    case 'java':
      return lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;

public record MailProviderSupport(
    String providerKey,
    MailProviderSupportStatus status,
    boolean builtin,
    boolean official,
    boolean registered
) {

  public enum MailProviderSupportStatus {
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown
  }

  public record MailProviderSupportStateRequest(
      String providerKey,
      boolean builtin,
      boolean official,
      boolean registered
  ) {
  }

  public static final List<String> mail_PROVIDER_SUPPORT_STATUSES = List.of(
      "builtin_registered",
      "official_registered",
      "official_unregistered",
      "unknown"
  );

  public static MailProviderSupportStatus resolveMailProviderSupportStatus(
      MailProviderSupportStateRequest request
  ) {
    if (request.official() && request.registered()) {
      return request.builtin()
          ? MailProviderSupportStatus.builtin_registered
          : MailProviderSupportStatus.official_registered;
    }

    if (request.official()) {
      return MailProviderSupportStatus.official_unregistered;
    }

    return MailProviderSupportStatus.unknown;
  }

  public static MailProviderSupport createMailProviderSupportState(
      MailProviderSupportStateRequest request
  ) {
    return new MailProviderSupport(
        request.providerKey(),
        resolveMailProviderSupportStatus(request),
        request.builtin(),
        request.official(),
        request.registered()
    );
  }
}
`);
    case 'csharp':
      return lines(`
namespace Sdkwork.Mail.Sdk;

using System.Collections.Generic;

public enum MailProviderSupportStatus
{
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown,
}

public sealed record MailProviderSupportStateRequest(
    string providerKey,
    bool builtin,
    bool official,
    bool registered
);

public sealed record MailProviderSupport(
    string providerKey,
    MailProviderSupportStatus status,
    bool builtin,
    bool official,
    bool registered
)
{
    public static readonly IReadOnlyList<string> MailProviderSupportStatuses =
    [
        "builtin_registered",
        "official_registered",
        "official_unregistered",
        "unknown",
    ];

    public static MailProviderSupportStatus ResolveMailProviderSupportStatus(
        MailProviderSupportStateRequest request
    )
    {
        if (request.official && request.registered)
        {
            return request.builtin
                ? MailProviderSupportStatus.builtin_registered
                : MailProviderSupportStatus.official_registered;
        }

        if (request.official)
        {
            return MailProviderSupportStatus.official_unregistered;
        }

        return MailProviderSupportStatus.unknown;
    }

    public static MailProviderSupport CreateMailProviderSupportState(
        MailProviderSupportStateRequest request
    )
    {
        return new MailProviderSupport(
            request.providerKey,
            ResolveMailProviderSupportStatus(request),
            request.builtin,
            request.official,
            request.registered
        );
    }
}
`);
    case 'swift':
      return lines(`
public enum MailProviderSupportStatus: String {
    case builtin_registered = "builtin_registered"
    case official_registered = "official_registered"
    case official_unregistered = "official_unregistered"
    case unknown = "unknown"
}

public struct MailProviderSupportStateRequest {
    public let providerKey: String
    public let builtin: Bool
    public let official: Bool
    public let registered: Bool

    public init(
        providerKey: String,
        builtin: Bool,
        official: Bool,
        registered: Bool
    ) {
        self.providerKey = providerKey
        self.builtin = builtin
        self.official = official
        self.registered = registered
    }
}

public struct MailProviderSupport {
    public let providerKey: String
    public let status: MailProviderSupportStatus
    public let builtin: Bool
    public let official: Bool
    public let registered: Bool

    public static let MailProviderSupportStatuses: [String] = [
        "builtin_registered",
        "official_registered",
        "official_unregistered",
        "unknown",
    ]

    public static func resolveMailProviderSupportStatus(
        _ request: MailProviderSupportStateRequest
    ) -> MailProviderSupportStatus {
        if request.official && request.registered {
            return request.builtin ? .builtin_registered : .official_registered
        }

        if request.official {
            return .official_unregistered
        }

        return .unknown
    }

    public static func createMailProviderSupportState(
        _ request: MailProviderSupportStateRequest
    ) -> MailProviderSupport {
        return MailProviderSupport(
            providerKey: request.providerKey,
            status: resolveMailProviderSupportStatus(request),
            builtin: request.builtin,
            official: request.official,
            registered: request.registered
        )
    }
}
`);
    case 'kotlin':
      return lines(`
package com.sdkwork.Mail.metadata

enum class MailProviderSupportStatus {
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown,
}

data class MailProviderSupport(
    val providerKey: String,
    val status: MailProviderSupportStatus,
    val builtin: Boolean,
    val official: Boolean,
    val registered: Boolean,
)

data class MailProviderSupportStateRequest(
    val providerKey: String,
    val builtin: Boolean,
    val official: Boolean,
    val registered: Boolean,
)

val mail_PROVIDER_SUPPORT_STATUSES: List<String> = listOf(
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
)

fun resolveMailProviderSupportStatus(
    request: MailProviderSupportStateRequest,
): MailProviderSupportStatus {
    if (request.official && request.registered) {
        return if (request.builtin) {
            MailProviderSupportStatus.builtin_registered
        } else {
            MailProviderSupportStatus.official_registered
        }
    }

    if (request.official) {
        return MailProviderSupportStatus.official_unregistered
    }

    return MailProviderSupportStatus.unknown
}

fun createMailProviderSupportState(
    request: MailProviderSupportStateRequest,
): MailProviderSupport {
    return MailProviderSupport(
        providerKey = request.providerKey,
        status = resolveMailProviderSupportStatus(request),
        builtin = request.builtin,
        official = request.official,
        registered = request.registered,
    )
}
`);
    case 'go':
      return lines(`
package Mailstandard

type MailProviderSupportStateRequest struct {
    ProviderKey string
    Builtin     bool
    Official    bool
    Registered  bool
}

type MailProviderSupport struct {
    ProviderKey string
    Status      string
    Builtin     bool
    Official    bool
    Registered  bool
}

var MailProviderSupportStatuses = []string{
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
}

func ResolveMailProviderSupportStatus(request MailProviderSupportStateRequest) string {
    if request.Official && request.Registered {
        if request.Builtin {
            return "builtin_registered"
        }
        return "official_registered"
    }

    if request.Official {
        return "official_unregistered"
    }

    return "unknown"
}

func CreateMailProviderSupportState(
    request MailProviderSupportStateRequest,
) MailProviderSupport {
    return MailProviderSupport{
        ProviderKey: request.ProviderKey,
        Status:      ResolveMailProviderSupportStatus(request),
        Builtin:     request.Builtin,
        Official:    request.Official,
        Registered:  request.Registered,
    }
}
`);
    case 'python':
      return lines(`
from dataclasses import dataclass
from enum import Enum


class MailProviderSupportStatus(str, Enum):
    builtin_registered = "builtin_registered"
    official_registered = "official_registered"
    official_unregistered = "official_unregistered"
    unknown = "unknown"


@dataclass(frozen=True)
class MailProviderSupport:
    providerKey: str
    status: MailProviderSupportStatus
    builtin: bool
    official: bool
    registered: bool


@dataclass(frozen=True)
class MailProviderSupportStateRequest:
    providerKey: str
    builtin: bool
    official: bool
    registered: bool


mail_PROVIDER_SUPPORT_STATUSES = [
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
]


def resolve_mail_provider_support_status(
    request: MailProviderSupportStateRequest,
) -> MailProviderSupportStatus:
    if request.official and request.registered:
        return (
            MailProviderSupportStatus.builtin_registered
            if request.builtin
            else MailProviderSupportStatus.official_registered
        )

    if request.official:
        return MailProviderSupportStatus.official_unregistered

    return MailProviderSupportStatus.unknown


def create_mail_provider_support_state(
    request: MailProviderSupportStateRequest,
) -> MailProviderSupport:
    return MailProviderSupport(
        providerKey=request.providerKey,
        status=resolve_mail_provider_support_status(request),
        builtin=request.builtin,
        official=request.official,
        registered=request.registered,
    )
`);
    default:
      return '';
  }
}

function renderReservedLanguageProviderPackageLoaderModule(language) {
  switch (language) {
    case 'flutter':
      return lines(`
import 'dart:async';

import 'mail_driver_manager.dart';
import 'mail_provider_package_catalog.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class MailProviderPackageLoaderException implements Exception {
  const MailProviderPackageLoaderException(this.code, this.message);

  final String code;
  final String message;

  @override
  String toString() => 'MailProviderPackageLoaderException($code): $message';
}

typedef MailProviderModuleDriverOptions<TNativeClient> = ({
  FutureOr<TNativeClient> Function(MailResolvedClientConfig config)? nativeFactory,
  MailRuntimeController<TNativeClient>? runtimeController,
});

final class MailProviderModule<TNativeClient> {
  const MailProviderModule({
    required this.packageName,
    required this.metadata,
    required this.builtin,
    required this.createDriver,
  });

  final String packageName;
  final MailProviderMetadata metadata;
  final bool builtin;
  final MailProviderDriver<TNativeClient> Function([
    MailProviderModuleDriverOptions<TNativeClient>? options,
  ]) createDriver;
}

final class MailProviderModuleRegistration<TNativeClient> {
  const MailProviderModuleRegistration({
    required this.providerModule,
    this.options,
  });

  final MailProviderModule<TNativeClient> providerModule;
  final MailProviderModuleDriverOptions<TNativeClient>? options;
}

final class MailProviderPackageLoadRequest {
  const MailProviderPackageLoadRequest({
    this.providerKey,
    this.packageIdentity,
  });

  final String? providerKey;
  final String? packageIdentity;
}

final class MailResolvedProviderPackageLoadTarget {
  const MailResolvedProviderPackageLoadTarget({
    required this.packageEntry,
  });

  final MailProviderPackageCatalogEntry packageEntry;
}

typedef MailProviderModuleNamespace = Object?;
typedef MailProviderPackageImportFn = Future<MailProviderModuleNamespace> Function(
  MailResolvedProviderPackageLoadTarget target,
);
typedef MailProviderPackageLoader = Future<MailProviderModuleNamespace> Function(
  MailProviderPackageLoadRequest request,
);

final class MailProviderPackageInstallRequest<TNativeClient> {
  const MailProviderPackageInstallRequest({
    required this.driverManager,
    required this.loadRequest,
    this.options,
  });

  final MailDriverManager driverManager;
  final MailProviderPackageLoadRequest loadRequest;
  final MailProviderModuleDriverOptions<TNativeClient>? options;
}

MailResolvedProviderPackageLoadTarget resolveMailProviderPackageLoadTarget(
  MailProviderPackageLoadRequest request,
) {
  final packageByProviderKey = request.providerKey == null
      ? null
      : getMailProviderPackageByProviderKey(request.providerKey!);
  final packageByIdentity = request.packageIdentity == null
      ? null
      : getMailProviderPackageByPackageIdentity(request.packageIdentity!);

  if (packageByProviderKey != null &&
      packageByIdentity != null &&
      packageByProviderKey.packageIdentity != packageByIdentity.packageIdentity) {
    throw const MailProviderPackageLoaderException(
      'provider_package_identity_mismatch',
      'providerKey and packageIdentity must resolve to the same provider package boundary.',
    );
  }

  final resolvedPackage = packageByProviderKey ?? packageByIdentity;
  if (resolvedPackage == null) {
    throw const MailProviderPackageLoaderException(
      'provider_package_not_found',
      'No official provider package matches the requested provider boundary.',
    );
  }

  return MailResolvedProviderPackageLoadTarget(packageEntry: resolvedPackage);
}

MailProviderPackageLoader createMailProviderPackageLoader({
  required MailProviderPackageImportFn importPackage,
}) {
  return (request) async => loadMailProviderModuleNamespace(
        request,
        importPackage: importPackage,
      );
}

Future<MailProviderModuleNamespace> loadMailProviderModuleNamespace(
  MailProviderPackageLoadRequest request, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final target = resolveMailProviderPackageLoadTarget(request);

  try {
    final namespace = await importPackage(target);
    if (namespace == null) {
      throw const MailProviderPackageLoaderException(
        'provider_module_export_missing',
        'Provider package loader requires an executable provider module namespace.',
      );
    }

    return namespace;
  } on MailProviderPackageLoaderException {
    rethrow;
  } catch (error) {
    throw MailProviderPackageLoaderException(
      'provider_package_load_failed',
      'Reserved provider package loader scaffold could not load ${'$'}{target.packageEntry.packageIdentity}: ${'$'}error',
    );
  }
}

Future<MailProviderModule<TNativeClient>> loadMailProviderModule<TNativeClient>(
  MailProviderPackageLoadRequest request, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final target = resolveMailProviderPackageLoadTarget(request);
  final namespace = await loadMailProviderModuleNamespace(
    request,
    importPackage: importPackage,
  );
  final providerModule = _extractProviderModule<TNativeClient>(namespace, target.packageEntry);
  _assertMailProviderModuleContract(providerModule, target.packageEntry);

  return providerModule;
}

Future<void> installMailProviderPackage<TNativeClient>(
  MailProviderPackageInstallRequest<TNativeClient> request, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final providerModule = await loadMailProviderModule<TNativeClient>(
    request.loadRequest,
    importPackage: importPackage,
  );
  request.driverManager.register(providerModule.createDriver(request.options));
}

Future<void> installMailProviderPackages<TNativeClient>(
  Iterable<MailProviderPackageInstallRequest<TNativeClient>> requests, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final materializedRequests = requests.toList(growable: false);
  if (materializedRequests.isEmpty) {
    return;
  }

  final manager = materializedRequests.first.driverManager;
  final drivers = <MailProviderDriver<TNativeClient>>[];

  for (final request in materializedRequests) {
    if (!identical(request.driverManager, manager)) {
      throw const MailProviderPackageLoaderException(
        'provider_module_contract_mismatch',
        'Batch Mail provider package installation requires one shared MailDriverManager.',
      );
    }

    final providerModule = await loadMailProviderModule<TNativeClient>(
      request.loadRequest,
      importPackage: importPackage,
    );
    drivers.add(providerModule.createDriver(request.options));
  }

  manager.registerAll(drivers);
}

MailProviderModule<TNativeClient> _extractProviderModule<TNativeClient>(
  Object? namespace,
  MailProviderPackageCatalogEntry packageEntry,
) {
  if (namespace is MailProviderModule) {
    return namespace as MailProviderModule<TNativeClient>;
  }

  if (namespace is Map<String, Object?>) {
    final value = namespace[packageEntry.sourceSymbol];
    if (value is MailProviderModule) {
      return value as MailProviderModule<TNativeClient>;
    }
  }

  throw MailProviderPackageLoaderException(
    'provider_module_export_missing',
    'Mail provider package is missing the required provider module export: ${'$'}{packageEntry.sourceSymbol}.',
  );
}

void _assertMailProviderModuleContract<TNativeClient>(
  MailProviderModule<TNativeClient> providerModule,
  MailProviderPackageCatalogEntry packageEntry,
) {
  if (providerModule.packageName != packageEntry.packageIdentity) {
    throw const MailProviderPackageLoaderException(
      'provider_module_contract_mismatch',
      'Mail provider module packageName must match the provider package catalog identity.',
    );
  }

  if (providerModule.metadata.providerKey != packageEntry.providerKey ||
      providerModule.metadata.pluginId != packageEntry.pluginId ||
      providerModule.metadata.driverId != packageEntry.driverId) {
    throw const MailProviderPackageLoaderException(
      'provider_module_contract_mismatch',
      'Mail provider module metadata must match the provider package catalog entry.',
    );
  }
}
`);
    case 'rust':
      return lines(`
use std::collections::BTreeMap;

use crate::provider_package_catalog::{
    get_mail_provider_package_by_package_identity, get_mail_provider_package_by_provider_key,
    MailProviderPackageCatalogEntry,
};

#[derive(Debug, Clone)]
pub struct MailProviderPackageLoaderError {
    pub code: &'static str,
    pub message: String,
}

impl MailProviderPackageLoaderError {
    pub fn new(code: &'static str, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }
}

#[derive(Debug, Clone, Default)]
#[allow(non_snake_case)]
pub struct MailProviderPackageLoadRequest {
    pub providerKey: Option<String>,
    pub packageIdentity: Option<String>,
}

#[allow(non_snake_case)]
pub struct MailResolvedProviderPackageLoadTarget {
    pub packageEntry: &'static MailProviderPackageCatalogEntry,
}

pub type MailProviderModuleNamespace = BTreeMap<String, String>;
pub type MailProviderPackageImportFn =
    fn(&MailResolvedProviderPackageLoadTarget) -> Result<MailProviderModuleNamespace, MailProviderPackageLoaderError>;
pub type MailProviderPackageLoader = Box<
    dyn Fn(MailProviderPackageLoadRequest) -> Result<MailProviderModuleNamespace, MailProviderPackageLoaderError>,
>;

#[allow(non_snake_case)]
pub struct MailProviderPackageInstallRequest<TDriverManager> {
    pub driverManager: TDriverManager,
    pub loadRequest: MailProviderPackageLoadRequest,
}

pub fn resolve_mail_provider_package_load_target(
    request: &MailProviderPackageLoadRequest,
) -> Result<MailResolvedProviderPackageLoadTarget, MailProviderPackageLoaderError> {
    let package_by_provider_key = request
        .providerKey
        .as_deref()
        .and_then(get_mail_provider_package_by_provider_key);
    let package_by_identity = request
        .packageIdentity
        .as_deref()
        .and_then(get_mail_provider_package_by_package_identity);

    if let (Some(provider_key_entry), Some(package_identity_entry)) =
        (package_by_provider_key, package_by_identity)
    {
        if provider_key_entry.packageIdentity != package_identity_entry.packageIdentity {
            return Err(MailProviderPackageLoaderError::new(
                "provider_package_identity_mismatch",
                "providerKey and packageIdentity must resolve to the same provider package boundary.",
            ));
        }
    }

    let resolved_package = package_by_provider_key.or(package_by_identity).ok_or_else(|| {
        MailProviderPackageLoaderError::new(
            "provider_package_not_found",
            "No official provider package matches the requested provider boundary.",
        )
    })?;

    Ok(MailResolvedProviderPackageLoadTarget {
        packageEntry: resolved_package,
    })
}

pub fn create_mail_provider_package_loader(
    import_package: MailProviderPackageImportFn,
) -> MailProviderPackageLoader {
    Box::new(move |request| load_mail_provider_module(&request, import_package))
}

pub fn load_mail_provider_module(
    request: &MailProviderPackageLoadRequest,
    import_package: MailProviderPackageImportFn,
) -> Result<MailProviderModuleNamespace, MailProviderPackageLoaderError> {
    let target = resolve_mail_provider_package_load_target(request)?;
    let namespace = import_package(&target).map_err(|error| {
        if error.code == "provider_package_load_failed" || error.code == "provider_module_export_missing" {
            error
        } else {
            MailProviderPackageLoaderError::new(
                "provider_package_load_failed",
                format!(
                    "Reserved provider package loader scaffold could not load {}: {}",
                    target.packageEntry.packageIdentity, error.message
                ),
            )
        }
    })?;

    if namespace.is_empty() {
        return Err(MailProviderPackageLoaderError::new(
            "provider_module_export_missing",
            "Reserved provider package loader scaffold requires an executable provider module namespace.",
        ));
    }

    Ok(namespace)
}

pub fn install_mail_provider_package<TDriverManager>(
    request: &MailProviderPackageInstallRequest<TDriverManager>,
    import_package: MailProviderPackageImportFn,
) -> Result<(), MailProviderPackageLoaderError> {
    let _namespace = load_mail_provider_module(&request.loadRequest, import_package)?;

    Err(MailProviderPackageLoaderError::new(
        "provider_package_load_failed",
        "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
    ))
}

pub fn install_mail_provider_packages<TDriverManager>(
    requests: &[MailProviderPackageInstallRequest<TDriverManager>],
    import_package: MailProviderPackageImportFn,
) -> Result<(), MailProviderPackageLoaderError> {
    for request in requests {
        let _namespace = load_mail_provider_module(&request.loadRequest, import_package)?;
    }

    if !requests.is_empty() {
        return Err(MailProviderPackageLoaderError::new(
            "provider_package_load_failed",
            "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
        ));
    }

    Ok(())
}
`);
    case 'java':
      return lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderPackageLoader {

  public static final String PROVIDER_PACKAGE_NOT_FOUND = "provider_package_not_found";
  public static final String PROVIDER_PACKAGE_IDENTITY_MISMATCH = "provider_package_identity_mismatch";
  public static final String PROVIDER_PACKAGE_LOAD_FAILED = "provider_package_load_failed";
  public static final String PROVIDER_MODULE_EXPORT_MISSING = "provider_module_export_missing";

  public record MailProviderPackageLoadRequest(
      String providerKey,
      String packageIdentity
  ) {
  }

  public record MailResolvedProviderPackageLoadTarget(
      MailProviderPackageCatalog.MailProviderPackageCatalogEntry packageEntry
  ) {
  }

  @FunctionalInterface
  public interface MailProviderPackageImportFn {
    Object importPackage(MailResolvedProviderPackageLoadTarget target);
  }

  @FunctionalInterface
  public interface MailProviderPackageLoaderFn {
    Object load(MailProviderPackageLoadRequest request);
  }

  public record MailProviderPackageInstallRequest(
      Object driverManager,
      MailProviderPackageLoadRequest loadRequest
  ) {
  }

  public static MailResolvedProviderPackageLoadTarget resolveMailProviderPackageLoadTarget(
      MailProviderPackageLoadRequest request
  ) {
    var resolvedRequest = request == null
        ? new MailProviderPackageLoadRequest(null, null)
        : request;
    var packageByProviderKey = Optional.ofNullable(resolvedRequest.providerKey())
        .flatMap(MailProviderPackageCatalog::getMailProviderPackageByProviderKey);
    var packageByIdentity = Optional.ofNullable(resolvedRequest.packageIdentity())
        .flatMap(MailProviderPackageCatalog::getMailProviderPackageByPackageIdentity);

    if (packageByProviderKey.isPresent() && packageByIdentity.isPresent()
        && !packageByProviderKey.get().packageIdentity().equals(packageByIdentity.get().packageIdentity())) {
      throw new MailProviderPackageLoaderException(
          PROVIDER_PACKAGE_IDENTITY_MISMATCH,
          "providerKey and packageIdentity must resolve to the same provider package boundary."
      );
    }

    var resolvedPackage = packageByProviderKey.or(() -> packageByIdentity).orElseThrow(() ->
        new MailProviderPackageLoaderException(
            PROVIDER_PACKAGE_NOT_FOUND,
            "No official provider package matches the requested provider boundary."
        )
    );

    return new MailResolvedProviderPackageLoadTarget(resolvedPackage);
  }

  public static MailProviderPackageLoaderFn createMailProviderPackageLoader(
      MailProviderPackageImportFn importPackage
  ) {
    return request -> loadMailProviderModule(request, importPackage);
  }

  public static Object loadMailProviderModule(
      MailProviderPackageLoadRequest request,
      MailProviderPackageImportFn importPackage
  ) {
    var target = resolveMailProviderPackageLoadTarget(request);

    try {
      var namespace = importPackage.importPackage(target);
      if (namespace == null) {
        throw new MailProviderPackageLoaderException(
            PROVIDER_MODULE_EXPORT_MISSING,
            "Reserved provider package loader scaffold requires an executable provider module namespace."
        );
      }

      return namespace;
    } catch (MailProviderPackageLoaderException error) {
      throw error;
    } catch (RuntimeException error) {
      throw new MailProviderPackageLoaderException(
          PROVIDER_PACKAGE_LOAD_FAILED,
          "Reserved provider package loader scaffold could not load "
              + target.packageEntry().packageIdentity()
              + ": "
              + error.getMessage()
      );
    }
  }

  public static void installMailProviderPackage(
      MailProviderPackageInstallRequest request,
      MailProviderPackageImportFn importPackage
  ) {
    loadMailProviderModule(request.loadRequest(), importPackage);

    throw new MailProviderPackageLoaderException(
        PROVIDER_PACKAGE_LOAD_FAILED,
        "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
    );
  }

  public static void installMailProviderPackages(
      List<MailProviderPackageInstallRequest> requests,
      MailProviderPackageImportFn importPackage
  ) {
    for (var request : requests) {
      loadMailProviderModule(request.loadRequest(), importPackage);
    }

    if (!requests.isEmpty()) {
      throw new MailProviderPackageLoaderException(
          PROVIDER_PACKAGE_LOAD_FAILED,
          "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
      );
    }
  }

  public static final class MailProviderPackageLoaderException extends RuntimeException {
    private final String code;

    public MailProviderPackageLoaderException(String code, String message) {
      super(message);
      this.code = code;
    }

    public String code() {
      return code;
    }
  }

  private MailProviderPackageLoader() {
  }
}
`);
    case 'csharp':
      return lines(`
namespace Sdkwork.Mail.Sdk;

using System;
using System.Collections.Generic;
using System.Linq;

public sealed class MailProviderPackageLoaderException : Exception
{
    public MailProviderPackageLoaderException(string code, string message)
        : base(message)
    {
        this.code = code;
    }

    public string code { get; }
}

public sealed record MailProviderPackageLoadRequest(
    string? providerKey = null,
    string? packageIdentity = null
);

public sealed record MailResolvedProviderPackageLoadTarget(
    MailProviderPackageCatalogEntry packageEntry
);

public delegate object? MailProviderPackageImportFn(MailResolvedProviderPackageLoadTarget target);
public delegate object? MailProviderPackageLoaderFn(MailProviderPackageLoadRequest request);

public sealed record MailProviderPackageInstallRequest(
    object driverManager,
    MailProviderPackageLoadRequest loadRequest
);

public static class MailProviderPackageLoader
{
    public const string ProviderPackageNotFound = "provider_package_not_found";
    public const string ProviderPackageIdentityMismatch = "provider_package_identity_mismatch";
    public const string ProviderPackageLoadFailed = "provider_package_load_failed";
    public const string ProviderModuleExportMissing = "provider_module_export_missing";

    public static MailResolvedProviderPackageLoadTarget ResolveMailProviderPackageLoadTarget(
        MailProviderPackageLoadRequest? request
    )
    {
        request ??= new MailProviderPackageLoadRequest();
        var packageByProviderKey = string.IsNullOrWhiteSpace(request.providerKey)
            ? null
            : MailProviderPackageCatalog.GetMailProviderPackageByProviderKey(request.providerKey!);
        var packageByIdentity = string.IsNullOrWhiteSpace(request.packageIdentity)
            ? null
            : MailProviderPackageCatalog.GetMailProviderPackageByPackageIdentity(request.packageIdentity!);

        if (packageByProviderKey is not null
            && packageByIdentity is not null
            && !string.Equals(packageByProviderKey.packageIdentity, packageByIdentity.packageIdentity, StringComparison.Ordinal))
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageIdentityMismatch,
                "providerKey and packageIdentity must resolve to the same provider package boundary."
            );
        }

        var resolvedPackage = packageByProviderKey ?? packageByIdentity;
        if (resolvedPackage is null)
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageNotFound,
                "No official provider package matches the requested provider boundary."
            );
        }

        return new MailResolvedProviderPackageLoadTarget(resolvedPackage);
    }

    public static MailProviderPackageLoaderFn CreateMailProviderPackageLoader(
        MailProviderPackageImportFn importPackage
    ) => request => LoadMailProviderModule(request, importPackage);

    public static object? LoadMailProviderModule(
        MailProviderPackageLoadRequest request,
        MailProviderPackageImportFn importPackage
    )
    {
        var target = ResolveMailProviderPackageLoadTarget(request);

        try
        {
            var providerModule = importPackage(target);
            if (providerModule is null)
            {
                throw new MailProviderPackageLoaderException(
                    ProviderModuleExportMissing,
                    "Reserved provider package loader scaffold requires an executable provider module namespace."
                );
            }

            return providerModule;
        }
        catch (MailProviderPackageLoaderException)
        {
            throw;
        }
        catch (Exception error)
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageLoadFailed,
                $"Reserved provider package loader scaffold could not load {target.packageEntry.packageIdentity}: {error.Message}"
            );
        }
    }

    public static void InstallMailProviderPackage(
        MailProviderPackageInstallRequest request,
        MailProviderPackageImportFn importPackage
    )
    {
        _ = LoadMailProviderModule(request.loadRequest, importPackage);

        throw new MailProviderPackageLoaderException(
            ProviderPackageLoadFailed,
            "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
        );
    }

    public static void InstallMailProviderPackages(
        IReadOnlyList<MailProviderPackageInstallRequest> requests,
        MailProviderPackageImportFn importPackage
    )
    {
        foreach (var request in requests)
        {
            _ = LoadMailProviderModule(request.loadRequest, importPackage);
        }

        if (requests.Count > 0)
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageLoadFailed,
                "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
            );
        }
    }
}
`);
    case 'swift':
      return lines(`
public struct MailProviderPackageLoaderException: Error {
    public let code: String
    public let message: String

    public init(code: String, message: String) {
        self.code = code
        self.message = message
    }
}

public struct MailProviderPackageLoadRequest {
    public let providerKey: String?
    public let packageIdentity: String?

    public init(providerKey: String? = nil, packageIdentity: String? = nil) {
        self.providerKey = providerKey
        self.packageIdentity = packageIdentity
    }
}

public struct MailResolvedProviderPackageLoadTarget {
    public let packageEntry: MailProviderPackageCatalogEntry

    public init(packageEntry: MailProviderPackageCatalogEntry) {
        self.packageEntry = packageEntry
    }
}

public typealias MailProviderModuleNamespace = [String: String]
public typealias MailProviderPackageImportFn = (MailResolvedProviderPackageLoadTarget) throws -> MailProviderModuleNamespace
public typealias MailProviderPackageLoader = (MailProviderPackageLoadRequest) throws -> MailProviderModuleNamespace

public struct MailProviderPackageInstallRequest {
    public let driverManager: Any
    public let loadRequest: MailProviderPackageLoadRequest

    public init(driverManager: Any, loadRequest: MailProviderPackageLoadRequest) {
        self.driverManager = driverManager
        self.loadRequest = loadRequest
    }
}

public func resolveMailProviderPackageLoadTarget(
    _ request: MailProviderPackageLoadRequest
) throws -> MailResolvedProviderPackageLoadTarget {
    let packageByProviderKey = request.providerKey.flatMap(MailProviderPackageCatalog.getMailProviderPackageByProviderKey)
    let packageByIdentity = request.packageIdentity.flatMap(MailProviderPackageCatalog.getMailProviderPackageByPackageIdentity)

    if let providerKeyEntry = packageByProviderKey,
       let packageIdentityEntry = packageByIdentity,
       providerKeyEntry.packageIdentity != packageIdentityEntry.packageIdentity {
        throw MailProviderPackageLoaderException(
            code: "provider_package_identity_mismatch",
            message: "providerKey and packageIdentity must resolve to the same provider package boundary."
        )
    }

    guard let resolvedPackage = packageByProviderKey ?? packageByIdentity else {
        throw MailProviderPackageLoaderException(
            code: "provider_package_not_found",
            message: "No official provider package matches the requested provider boundary."
        )
    }

    return MailResolvedProviderPackageLoadTarget(packageEntry: resolvedPackage)
}

public func createMailProviderPackageLoader(
    importPackage: @escaping MailProviderPackageImportFn
) -> MailProviderPackageLoader {
    return { request in
        try loadMailProviderModule(request, importPackage: importPackage)
    }
}

public func loadMailProviderModule(
    _ request: MailProviderPackageLoadRequest,
    importPackage: MailProviderPackageImportFn
) throws -> MailProviderModuleNamespace {
    let target = try resolveMailProviderPackageLoadTarget(request)

    do {
        let namespace = try importPackage(target)
        if namespace.isEmpty {
            throw MailProviderPackageLoaderException(
                code: "provider_module_export_missing",
                message: "Reserved provider package loader scaffold requires an executable provider module namespace."
            )
        }

        return namespace
    } catch let error as MailProviderPackageLoaderException {
        throw error
    } catch {
        throw MailProviderPackageLoaderException(
            code: "provider_package_load_failed",
            message: "Reserved provider package loader scaffold could not load \\(target.packageEntry.packageIdentity): \\(error)"
        )
    }
}

public func installMailProviderPackage(
    _ request: MailProviderPackageInstallRequest,
    importPackage: MailProviderPackageImportFn
) throws {
    _ = try loadMailProviderModule(request.loadRequest, importPackage: importPackage)

    throw MailProviderPackageLoaderException(
        code: "provider_package_load_failed",
        message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
    )
}

public func installMailProviderPackages(
    _ requests: [MailProviderPackageInstallRequest],
    importPackage: MailProviderPackageImportFn
) throws {
    for request in requests {
        _ = try loadMailProviderModule(request.loadRequest, importPackage: importPackage)
    }

    if !requests.isEmpty {
        throw MailProviderPackageLoaderException(
            code: "provider_package_load_failed",
            message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
        )
    }
}
`);
    case 'kotlin':
      return lines(`
package com.sdkwork.Mail.metadata

class MailProviderPackageLoaderException(
    val code: String,
    override val message: String,
) : RuntimeException(message)

data class MailProviderPackageLoadRequest(
    val providerKey: String? = null,
    val packageIdentity: String? = null,
)

data class MailResolvedProviderPackageLoadTarget(
    val packageEntry: MailProviderPackageCatalogEntry,
)

typealias MailProviderModuleNamespace = Map<String, String>
typealias MailProviderPackageImportFn = (MailResolvedProviderPackageLoadTarget) -> MailProviderModuleNamespace
typealias MailProviderPackageLoader = (MailProviderPackageLoadRequest) -> MailProviderModuleNamespace

data class MailProviderPackageInstallRequest(
    val driverManager: Any,
    val loadRequest: MailProviderPackageLoadRequest,
)

fun resolveMailProviderPackageLoadTarget(
    request: MailProviderPackageLoadRequest,
): MailResolvedProviderPackageLoadTarget {
    val packageByProviderKey = request.providerKey?.let { MailProviderPackageCatalog.getMailProviderPackageByProviderKey(it) }
    val packageByIdentity = request.packageIdentity?.let { MailProviderPackageCatalog.getMailProviderPackageByPackageIdentity(it) }

    if (packageByProviderKey != null
        && packageByIdentity != null
        && packageByProviderKey.packageIdentity != packageByIdentity.packageIdentity
    ) {
        throw MailProviderPackageLoaderException(
            code = "provider_package_identity_mismatch",
            message = "providerKey and packageIdentity must resolve to the same provider package boundary.",
        )
    }

    val resolvedPackage = packageByProviderKey ?: packageByIdentity
        ?: throw MailProviderPackageLoaderException(
            code = "provider_package_not_found",
            message = "No official provider package matches the requested provider boundary.",
        )

    return MailResolvedProviderPackageLoadTarget(packageEntry = resolvedPackage)
}

fun createMailProviderPackageLoader(
    importPackage: MailProviderPackageImportFn,
): MailProviderPackageLoader = { request ->
    loadMailProviderModule(request, importPackage)
}

fun loadMailProviderModule(
    request: MailProviderPackageLoadRequest,
    importPackage: MailProviderPackageImportFn,
): MailProviderModuleNamespace {
    val target = resolveMailProviderPackageLoadTarget(request)

    return try {
        val namespace = importPackage(target)
        if (namespace.isEmpty()) {
            throw MailProviderPackageLoaderException(
                code = "provider_module_export_missing",
                message = "Reserved provider package loader scaffold requires an executable provider module namespace.",
            )
        }

        namespace
    } catch (error: MailProviderPackageLoaderException) {
        throw error
    } catch (error: RuntimeException) {
        throw MailProviderPackageLoaderException(
            code = "provider_package_load_failed",
            message = "Reserved provider package loader scaffold could not load ${'$'}{target.packageEntry.packageIdentity}: ${'$'}{error.message}",
        )
    }
}

fun installMailProviderPackage(
    request: MailProviderPackageInstallRequest,
    importPackage: MailProviderPackageImportFn,
) {
    loadMailProviderModule(request.loadRequest, importPackage)

    throw MailProviderPackageLoaderException(
        code = "provider_package_load_failed",
        message = "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
    )
}

fun installMailProviderPackages(
    requests: Iterable<MailProviderPackageInstallRequest>,
    importPackage: MailProviderPackageImportFn,
) {
    val materializedRequests = requests.toList()
    materializedRequests.forEach { request ->
        loadMailProviderModule(request.loadRequest, importPackage)
    }

    if (materializedRequests.isNotEmpty()) {
        throw MailProviderPackageLoaderException(
            code = "provider_package_load_failed",
            message = "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
        )
    }
}
`);
    case 'go':
      return lines(`
package Mailstandard

import "fmt"

type MailProviderPackageLoaderError struct {
	Code    string
	Message string
}

func (e MailProviderPackageLoaderError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

type MailProviderPackageLoadRequest struct {
	ProviderKey     string
	PackageIdentity string
}

type MailResolvedProviderPackageLoadTarget struct {
	PackageEntry MailProviderPackageCatalogEntry
}

type MailProviderModuleNamespace map[string]string
type MailProviderPackageImportFn func(MailResolvedProviderPackageLoadTarget) (MailProviderModuleNamespace, error)
type MailProviderPackageLoader func(MailProviderPackageLoadRequest) (MailProviderModuleNamespace, error)

type MailProviderPackageInstallRequest struct {
	DriverManager any
	LoadRequest   MailProviderPackageLoadRequest
}

func ResolveMailProviderPackageLoadTarget(
	request MailProviderPackageLoadRequest,
) (MailResolvedProviderPackageLoadTarget, error) {
	var packageByProviderKey *MailProviderPackageCatalogEntry
	if request.ProviderKey != "" {
		packageByProviderKey = GetMailProviderPackageByProviderKey(request.ProviderKey)
	}

	var packageByIdentity *MailProviderPackageCatalogEntry
	if request.PackageIdentity != "" {
		packageByIdentity = GetMailProviderPackageByPackageIdentity(request.PackageIdentity)
	}

	if packageByProviderKey != nil && packageByIdentity != nil && packageByProviderKey.PackageIdentity != packageByIdentity.PackageIdentity {
		return MailResolvedProviderPackageLoadTarget{}, MailProviderPackageLoaderError{
			Code:    "provider_package_identity_mismatch",
			Message: "providerKey and packageIdentity must resolve to the same provider package boundary.",
		}
	}

	resolvedPackage := packageByProviderKey
	if resolvedPackage == nil {
		resolvedPackage = packageByIdentity
	}

	if resolvedPackage == nil {
		return MailResolvedProviderPackageLoadTarget{}, MailProviderPackageLoaderError{
			Code:    "provider_package_not_found",
			Message: "No official provider package matches the requested provider boundary.",
		}
	}

	return MailResolvedProviderPackageLoadTarget{PackageEntry: *resolvedPackage}, nil
}

func CreateMailProviderPackageLoader(importPackage MailProviderPackageImportFn) MailProviderPackageLoader {
	return func(request MailProviderPackageLoadRequest) (MailProviderModuleNamespace, error) {
		return LoadMailProviderModule(request, importPackage)
	}
}

func LoadMailProviderModule(
	request MailProviderPackageLoadRequest,
	importPackage MailProviderPackageImportFn,
) (MailProviderModuleNamespace, error) {
	target, err := ResolveMailProviderPackageLoadTarget(request)
	if err != nil {
		return nil, err
	}

	namespace, err := importPackage(target)
	if err != nil {
		return nil, MailProviderPackageLoaderError{
			Code:    "provider_package_load_failed",
			Message: fmt.Sprintf("Reserved provider package loader scaffold could not load %s: %v", target.PackageEntry.PackageIdentity, err),
		}
	}

	if len(namespace) == 0 {
		return nil, MailProviderPackageLoaderError{
			Code:    "provider_module_export_missing",
			Message: "Reserved provider package loader scaffold requires an executable provider module namespace.",
		}
	}

	return namespace, nil
}

func InstallMailProviderPackage(
	request MailProviderPackageInstallRequest,
	importPackage MailProviderPackageImportFn,
) error {
	if _, err := LoadMailProviderModule(request.LoadRequest, importPackage); err != nil {
		return err
	}

	return MailProviderPackageLoaderError{
		Code:    "provider_package_load_failed",
		Message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
	}
}

func InstallMailProviderPackages(
	requests []MailProviderPackageInstallRequest,
	importPackage MailProviderPackageImportFn,
) error {
	for _, request := range requests {
		if _, err := LoadMailProviderModule(request.LoadRequest, importPackage); err != nil {
			return err
		}
	}

	if len(requests) > 0 {
		return MailProviderPackageLoaderError{
			Code:    "provider_package_load_failed",
			Message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
		}
	}

	return nil
}
`);
    case 'python':
      return lines(`
from dataclasses import dataclass
from typing import Any, Callable

from .provider_package_catalog import (
    MailProviderPackageCatalogEntry,
    get_mail_provider_package_by_package_identity,
    get_mail_provider_package_by_provider_key,
)


class MailProviderPackageLoaderException(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


@dataclass(frozen=True)
class MailProviderPackageLoadRequest:
    providerKey: str | None = None
    packageIdentity: str | None = None


@dataclass(frozen=True)
class MailResolvedProviderPackageLoadTarget:
    packageEntry: MailProviderPackageCatalogEntry


MailProviderModuleNamespace = dict[str, str]
MailProviderPackageImportFn = Callable[
    [MailResolvedProviderPackageLoadTarget],
    MailProviderModuleNamespace,
]
MailProviderPackageLoader = Callable[
    [MailProviderPackageLoadRequest],
    MailProviderModuleNamespace,
]


@dataclass(frozen=True)
class MailProviderPackageInstallRequest:
    driverManager: Any
    loadRequest: MailProviderPackageLoadRequest


def resolve_mail_provider_package_load_target(
    request: MailProviderPackageLoadRequest,
) -> MailResolvedProviderPackageLoadTarget:
    package_by_provider_key = (
        get_mail_provider_package_by_provider_key(request.providerKey)
        if request.providerKey
        else None
    )
    package_by_identity = (
        get_mail_provider_package_by_package_identity(request.packageIdentity)
        if request.packageIdentity
        else None
    )

    if (
        package_by_provider_key is not None
        and package_by_identity is not None
        and package_by_provider_key.packageIdentity
        != package_by_identity.packageIdentity
    ):
        raise MailProviderPackageLoaderException(
            "provider_package_identity_mismatch",
            "providerKey and packageIdentity must resolve to the same provider package boundary.",
        )

    resolved_package = package_by_provider_key or package_by_identity
    if resolved_package is None:
        raise MailProviderPackageLoaderException(
            "provider_package_not_found",
            "No official provider package matches the requested provider boundary.",
        )

    return MailResolvedProviderPackageLoadTarget(packageEntry=resolved_package)


def create_mail_provider_package_loader(
    import_package: MailProviderPackageImportFn,
) -> MailProviderPackageLoader:
    def _loader(request: MailProviderPackageLoadRequest) -> MailProviderModuleNamespace:
        return load_mail_provider_module(request, import_package)

    return _loader


def load_mail_provider_module(
    request: MailProviderPackageLoadRequest,
    import_package: MailProviderPackageImportFn,
) -> MailProviderModuleNamespace:
    target = resolve_mail_provider_package_load_target(request)

    try:
        namespace = import_package(target)
    except MailProviderPackageLoaderException:
        raise
    except Exception as error:  # pragma: no cover - scaffold-only failure wrapper
        raise MailProviderPackageLoaderException(
            "provider_package_load_failed",
            f"Reserved provider package loader scaffold could not load {target.packageEntry.packageIdentity}: {error}",
        ) from error

    if not namespace:
        raise MailProviderPackageLoaderException(
            "provider_module_export_missing",
            "Reserved provider package loader scaffold requires an executable provider module namespace.",
        )

    return namespace


def install_mail_provider_package(
    request: MailProviderPackageInstallRequest,
    import_package: MailProviderPackageImportFn,
) -> None:
    load_mail_provider_module(request.loadRequest, import_package)
    raise MailProviderPackageLoaderException(
        "provider_package_load_failed",
        "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
    )


def install_mail_provider_packages(
    requests: list[MailProviderPackageInstallRequest],
    import_package: MailProviderPackageImportFn,
) -> None:
    for request in requests:
        load_mail_provider_module(request.loadRequest, import_package)

    if requests:
        raise MailProviderPackageLoaderException(
            "provider_package_load_failed",
            "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
        )
`);
    default:
      return '';
  }
}

function renderReservedLanguageDriverManagerModule(language) {
  switch (language) {
    case 'flutter':
      return lines(`
import 'mail_errors.dart';
import 'mail_provider_activation_catalog.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_metadata.dart';
import 'mail_provider_selection.dart';
import 'mail_provider_support.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class MailDriverManager {
  MailDriverManager({
    this.defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    Iterable<MailProviderDriver<dynamic>> drivers =
        const <MailProviderDriver<dynamic>>[],
  }) {
    registerAll(drivers);
  }

  final String defaultProviderKey;
  final Map<String, MailProviderDriver<dynamic>> _drivers =
      <String, MailProviderDriver<dynamic>>{};

  MailProviderSelection resolveSelection(
    MailProviderSelectionRequest request, {
    String? defaultProviderKey,
  }) {
    return resolveMailProviderSelection(
      request,
      defaultProviderKey: defaultProviderKey ?? this.defaultProviderKey,
    );
  }

  MailProviderMetadata getMetadata([
    MailClientConfig config = const MailClientConfig(),
  ]) {
    final selection = _resolveClientSelection(config);
    final catalogEntry = getMailProviderByProviderKey(selection.providerKey);
    final driver = _drivers[selection.providerKey];
    if (driver != null) {
      return driver.metadata;
    }

    final officialMetadata =
        catalogEntry == null
            ? null
            : getOfficialMailProviderMetadataByKey(catalogEntry.providerKey);
    if (officialMetadata != null) {
      return officialMetadata;
    }

    throw MailSdkException(
      code: 'driver_not_found',
      message: 'No Mail driver registered for provider: \${selection.providerKey}',
      providerKey: selection.providerKey,
    );
  }

  MailProviderMetadata getDefaultMetadata() {
    return getMetadata(
      MailClientConfig(defaultProviderKey: defaultProviderKey),
    );
  }

  void register<TNativeClient>(MailProviderDriver<TNativeClient> driver) {
    _asseMailanRegister(driver);
    _drivers[driver.metadata.providerKey] = driver;
  }

  void registerAll(Iterable<MailProviderDriver<dynamic>> drivers) {
    final plannedProviderKeys = <String>{};

    for (final driver in drivers) {
      _asseMailanRegister(
        driver,
        plannedProviderKeys: plannedProviderKeys,
      );
      plannedProviderKeys.add(driver.metadata.providerKey);
    }

    for (final driver in drivers) {
      _drivers[driver.metadata.providerKey] = driver;
    }
  }

  bool hasDriver(String providerKey) => _drivers.containsKey(providerKey);

  MailProviderDriver<dynamic> resolveDriver(String providerKey) {
    final driver = _drivers[providerKey];
    if (driver != null) {
      return driver;
    }

    throw MailSdkException(
      code: 'driver_not_found',
      message: 'No Mail driver registered for provider: $providerKey',
      providerKey: providerKey,
    );
  }

  MailProviderSupport describeProviderSupport(String providerKey) {
    final catalogEntry = getMailProviderByProviderKey(providerKey);
    final activationEntry = getMailProviderActivationByProviderKey(providerKey);
    final registered = _drivers.containsKey(providerKey);

    return createMailProviderSupportState(
      MailProviderSupportStateRequest(
        providerKey: providerKey,
        builtin: activationEntry?.builtin ?? false,
        official: catalogEntry != null && activationEntry != null,
        registered: registered,
      ),
    );
  }

  List<MailProviderSupport> listProviderSupport() {
    return MailProviderCatalog.entries
        .map((entry) => describeProviderSupport(entry.providerKey))
        .toList(growable: false);
  }

  Future<MailClient<dynamic>> connect([
    MailClientConfig config = const MailClientConfig(),
  ]) async {
    final selection = _resolveClientSelection(config);
    final driver = _drivers[selection.providerKey];

    if (driver == null) {
      final catalogEntry = getMailProviderByProviderKey(selection.providerKey);
      final activationEntry = getMailProviderActivationByProviderKey(
        selection.providerKey,
      );

      if (catalogEntry != null && activationEntry != null) {
        throw MailSdkException(
          code: 'provider_not_supported',
          message: 'Mail provider is officially defined but not registered in this runtime: \${selection.providerKey}',
          providerKey: selection.providerKey,
        );
      }

      throw MailSdkException(
        code: 'driver_not_found',
        message: 'No Mail driver registered for provider: \${selection.providerKey}',
        providerKey: selection.providerKey,
      );
    }

    return driver.connect(
      MailResolvedClientConfig(
        providerUrl: config.providerUrl,
        providerKey: selection.providerKey,
        tenantOverrideProviderKey: config.tenantOverrideProviderKey,
        deploymentProfileProviderKey: config.deploymentProfileProviderKey,
        defaultProviderKey: config.defaultProviderKey ?? defaultProviderKey,
        nativeConfig: config.nativeConfig,
        selectionSource: selection.source,
      ),
    );
  }

  MailProviderSelection _resolveClientSelection(MailClientConfig config) {
    return resolveSelection(
      MailProviderSelectionRequest(
        providerUrl: config.providerUrl,
        providerKey: config.providerKey,
        tenantOverrideProviderKey: config.tenantOverrideProviderKey,
        deploymentProfileProviderKey: config.deploymentProfileProviderKey,
      ),
      defaultProviderKey: config.defaultProviderKey,
    );
  }

  void _asseMailanRegister(
    MailProviderDriver<dynamic> driver, {
    Set<String> plannedProviderKeys = const <String>{},
  }) {
    final providerKey = driver.metadata.providerKey;
    final catalogEntry = getMailProviderByProviderKey(providerKey);
    final activationEntry = getMailProviderActivationByProviderKey(providerKey);
    final officialMetadata = getOfficialMailProviderMetadataByKey(providerKey);

    if (
      catalogEntry == null ||
      activationEntry == null ||
      officialMetadata == null
    ) {
      throw MailSdkException(
        code: 'provider_not_official',
        message: 'Mail driver registration requires an official provider catalog entry: $providerKey',
        providerKey: providerKey,
        pluginId: driver.metadata.pluginId,
      );
    }

    if (!_sameProviderMetadata(driver.metadata, officialMetadata)) {
      throw MailSdkException(
        code: 'provider_metadata_mismatch',
        message: 'Mail driver metadata must match the official provider catalog: $providerKey',
        providerKey: providerKey,
        pluginId: driver.metadata.pluginId,
        details: <String, Object?>{
          'expectedMetadata': officialMetadata.toDebugMap(),
          'receivedMetadata': driver.metadata.toDebugMap(),
        },
      );
    }

    if (_drivers.containsKey(providerKey) || plannedProviderKeys.contains(providerKey)) {
      throw MailSdkException(
        code: 'driver_already_registered',
        message: 'Mail driver already registered for provider: $providerKey',
        providerKey: providerKey,
        pluginId: driver.metadata.pluginId,
      );
    }
  }

  bool _sameProviderMetadata(
    MailProviderMetadata actual,
    MailProviderMetadata expected,
  ) {
    return actual.providerKey == expected.providerKey &&
        actual.pluginId == expected.pluginId &&
        actual.driverId == expected.driverId &&
        actual.displayName == expected.displayName &&
        actual.defaultSelected == expected.defaultSelected &&
        _sameStringList(actual.requiredCapabilities, expected.requiredCapabilities) &&
        _sameStringList(actual.optionalCapabilities, expected.optionalCapabilities) &&
        _sameStringList(actual.extensionKeys, expected.extensionKeys);
  }

  bool _sameStringList(List<String> actual, List<String> expected) {
    if (actual.length != expected.length) {
      return false;
    }

    for (var index = 0; index < actual.length; index += 1) {
      if (actual[index] != expected[index]) {
        return false;
      }
    }

    return true;
  }
}
`);
    case 'rust':
      return lines(`
use crate::provider_activation_catalog::get_mail_provider_activation_by_provider_key;
use crate::provider_catalog::{get_mail_provider_by_provider_key, OFFICIAL_mail_PROVIDERS};
use crate::provider_selection::{
    resolve_mail_provider_selection, MailProviderSelection, MailProviderSelectionRequest,
};
use crate::provider_support::{
    create_mail_provider_support_state, MailProviderSupport, MailProviderSupportStateRequest,
};

pub struct MailDriverManager;

impl MailDriverManager {
    #[allow(non_snake_case)]
    pub fn resolveSelection(
        &self,
        request: &MailProviderSelectionRequest,
        defaultProviderKey: Option<&str>,
    ) -> MailProviderSelection {
        resolve_mail_provider_selection(request, defaultProviderKey)
    }

    #[allow(non_snake_case)]
    pub fn describeProviderSupport(&self, providerKey: &str) -> MailProviderSupport {
        let official = get_mail_provider_by_provider_key(providerKey).is_some();
        let activation = get_mail_provider_activation_by_provider_key(providerKey);

        create_mail_provider_support_state(MailProviderSupportStateRequest {
            providerKey: providerKey.to_string(),
            builtin: activation.is_some_and(|entry| entry.builtin),
            official,
            registered: activation.is_some_and(|entry| entry.runtimeBridge),
        })
    }

    #[allow(non_snake_case)]
    pub fn listProviderSupport(&self) -> Vec<MailProviderSupport> {
        OFFICIAL_mail_PROVIDERS
            .iter()
            .map(|entry| self.describeProviderSupport(entry.providerKey))
            .collect()
    }
}
`);
    case 'java':
      return lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;

public final class MailDriverManager {

  public MailProviderSelection resolveSelection(
      MailProviderSelection.MailProviderSelectionRequest request
  ) {
    return resolveSelection(request, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public MailProviderSelection resolveSelection(
      MailProviderSelection.MailProviderSelectionRequest request,
      String defaultProviderKey
  ) {
    return MailProviderSelection.resolveMailProviderSelection(request, defaultProviderKey);
  }

  public MailProviderSupport describeProviderSupport(String providerKey) {
    var official = MailProviderCatalog.getMailProviderByProviderKey(providerKey).isPresent();
    var activation = MailProviderActivationCatalog.getMailProviderActivationByProviderKey(providerKey);

    return MailProviderSupport.createMailProviderSupportState(
        new MailProviderSupport.MailProviderSupportStateRequest(
            providerKey,
            activation
                .map(MailProviderActivationCatalog.MailProviderActivationCatalogEntry::builtin)
                .orElse(false),
            official,
            activation
                .map(MailProviderActivationCatalog.MailProviderActivationCatalogEntry::runtimeBridge)
                .orElse(false)
        )
    );
  }

  public List<MailProviderSupport> listProviderSupport() {
    return MailProviderCatalog.ENTRIES.stream()
        .map(entry -> describeProviderSupport(entry.providerKey()))
        .toList();
  }
}
`);
    case 'csharp':
      return lines(`
namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed class MailDriverManager
{
    public MailProviderSelection ResolveSelection(
        MailProviderSelectionRequest? request = null,
        string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    )
    {
        return MailProviderSelection.ResolveMailProviderSelection(request, defaultProviderKey);
    }

    public MailProviderSupport DescribeProviderSupport(string providerKey)
    {
        var official = MailProviderCatalog.GetMailProviderByProviderKey(providerKey) is not null;
        var activation = MailProviderActivationCatalog.GetMailProviderActivationByProviderKey(providerKey);

        return MailProviderSupport.CreateMailProviderSupportState(
            new MailProviderSupportStateRequest(
                providerKey,
                activation?.builtin ?? false,
                official,
                activation?.runtimeBridge ?? false
            )
        );
    }

    public IReadOnlyList<MailProviderSupport> ListProviderSupport()
    {
        return MailProviderCatalog.Entries
            .Select(entry => DescribeProviderSupport(entry.providerKey))
            .ToArray();
    }
}
`);
    case 'swift':
      return lines(`
public struct MailDriverManager {
    public init() {}

    public func resolveSelection(
        request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) -> MailProviderSelection {
        return MailProviderSelection.resolveMailProviderSelection(
            request: request,
            defaultProviderKey: defaultProviderKey
        )
    }

    public func describeProviderSupport(providerKey: String) -> MailProviderSupport {
        let official = MailProviderCatalog.getMailProviderByProviderKey(providerKey) != nil
        let activation = MailProviderActivationCatalog.getMailProviderActivationByProviderKey(providerKey)

        return MailProviderSupport.createMailProviderSupportState(
            .init(
                providerKey: providerKey,
                builtin: activation?.builtin ?? false,
                official: official,
                registered: activation?.runtimeBridge ?? false
            )
        )
    }

    public func listProviderSupport() -> [MailProviderSupport] {
        MailProviderCatalog.entries.map { describeProviderSupport(providerKey: $0.providerKey) }
    }
}
`);
    case 'kotlin':
      return lines(`
package com.sdkwork.Mail.metadata

class MailDriverManager {
    fun resolveSelection(
        request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    ): MailProviderSelection {
        return resolveMailProviderSelection(request, defaultProviderKey)
    }

    fun describeProviderSupport(providerKey: String): MailProviderSupport {
        val official = getMailProviderByProviderKey(providerKey) != null
        val activation = getMailProviderActivationByProviderKey(providerKey)

        return createMailProviderSupportState(
            MailProviderSupportStateRequest(
                providerKey = providerKey,
                builtin = activation?.builtin ?: false,
                official = official,
                registered = activation?.runtimeBridge ?: false,
            )
        )
    }

    fun listProviderSupport(): List<MailProviderSupport> {
        return MailProviderCatalog.entries.map { describeProviderSupport(it.providerKey) }
    }
}
`);
    case 'go':
      return lines(`
package Mailstandard

type MailDriverManager struct{}

func (manager MailDriverManager) resolveSelection(request MailProviderSelectionRequest, defaultProviderKey string) MailProviderSelection {
    return ResolveMailProviderSelection(request, defaultProviderKey)
}

func (manager MailDriverManager) ResolveSelection(request MailProviderSelectionRequest, defaultProviderKey string) MailProviderSelection {
    return manager.resolveSelection(request, defaultProviderKey)
}

func (manager MailDriverManager) describeProviderSupport(providerKey string) MailProviderSupport {
    official := GetMailProviderByProviderKey(providerKey) != nil
    activation := GetMailProviderActivationByProviderKey(providerKey)

    return CreateMailProviderSupportState(MailProviderSupportStateRequest{
        ProviderKey: providerKey,
        Builtin:     activation != nil && activation.Builtin,
        Official:    official,
        Registered:  activation != nil && activation.RuntimeBridge,
    })
}

func (manager MailDriverManager) DescribeProviderSupport(providerKey string) MailProviderSupport {
    return manager.describeProviderSupport(providerKey)
}

func (manager MailDriverManager) listProviderSupport() []MailProviderSupport {
    supports := make([]MailProviderSupport, 0, len(OFFICIAL_mail_PROVIDERS))
    for _, entry := range OFFICIAL_mail_PROVIDERS {
        supports = append(supports, manager.describeProviderSupport(entry.ProviderKey))
    }
    return supports
}

func (manager MailDriverManager) ListProviderSupport() []MailProviderSupport {
    return manager.listProviderSupport()
}
`);
    case 'python':
      return lines(`
from .provider_activation_catalog import get_mail_provider_activation_by_provider_key
from .provider_catalog import (
    DEFAULT_mail_PROVIDER_KEY,
    MailProviderCatalog,
    get_mail_provider_by_provider_key,
)
from .provider_selection import (
    MailProviderSelection,
    MailProviderSelectionRequest,
    resolve_mail_provider_selection,
)
from .provider_support import (
    MailProviderSupport,
    MailProviderSupportStateRequest,
    create_mail_provider_support_state,
)


class MailDriverManager:
    def resolveSelection(
        self,
        request: MailProviderSelectionRequest | None = None,
        *,
        defaultProviderKey: str = DEFAULT_mail_PROVIDER_KEY,
    ) -> MailProviderSelection:
        return resolve_mail_provider_selection(
            request,
            default_provider_key=defaultProviderKey,
        )

    def describeProviderSupport(self, providerKey: str) -> MailProviderSupport:
        official = get_mail_provider_by_provider_key(providerKey) is not None
        activation = get_mail_provider_activation_by_provider_key(providerKey)

        return create_mail_provider_support_state(
            MailProviderSupportStateRequest(
                providerKey=providerKey,
                builtin=activation.builtin if activation is not None else False,
                official=official,
                registered=activation.runtimeBridge if activation is not None else False,
            )
        )

    def listProviderSupport(self) -> list[MailProviderSupport]:
        return [
            self.describeProviderSupport(entry.providerKey)
            for entry in MailProviderCatalog.entries
        ]
`);
    default:
      return '';
  }
}

function renderReservedLanguageDataSourceModule(language) {
  switch (language) {
    case 'flutter':
      return lines(`
import 'mail_driver_manager.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_selection.dart';
import 'mail_provider_support.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class MailDataSourceOptions extends MailClientConfig {
  const MailDataSourceOptions({
    super.providerUrl,
    super.providerKey,
    super.tenantOverrideProviderKey,
    super.deploymentProfileProviderKey,
    super.defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    super.nativeConfig,
  });
}

MailDataSourceOptions _mergeOptions(
  MailDataSourceOptions base,
  MailDataSourceOptions? overrides,
) {
  if (overrides == null) {
    return base;
  }

  return MailDataSourceOptions(
    providerUrl: overrides.providerUrl ?? base.providerUrl,
    providerKey: overrides.providerKey ?? base.providerKey,
    tenantOverrideProviderKey:
        overrides.tenantOverrideProviderKey ?? base.tenantOverrideProviderKey,
    deploymentProfileProviderKey:
        overrides.deploymentProfileProviderKey ?? base.deploymentProfileProviderKey,
    defaultProviderKey: overrides.defaultProviderKey ?? base.defaultProviderKey,
    nativeConfig: overrides.nativeConfig ?? base.nativeConfig,
  );
}

final class MailDataSource {
  MailDataSource({
    MailDataSourceOptions? options,
    MailDriverManager? driverManager,
  })  : options = options ?? const MailDataSourceOptions(),
        driverManager = driverManager ?? MailDriverManager();

  final MailDataSourceOptions options;
  final MailDriverManager driverManager;

  MailProviderMetadata describe([MailDataSourceOptions? overrides]) {
    return driverManager.getMetadata(
      _mergeOptions(options, overrides),
    );
  }

  MailProviderSelection describeSelection([MailDataSourceOptions? overrides]) {
    final merged = _mergeOptions(options, overrides);
    return driverManager.resolveSelection(
      MailProviderSelectionRequest(
        providerUrl: merged.providerUrl,
        providerKey: merged.providerKey,
        tenantOverrideProviderKey: merged.tenantOverrideProviderKey,
        deploymentProfileProviderKey: merged.deploymentProfileProviderKey,
      ),
      defaultProviderKey: merged.defaultProviderKey,
    );
  }

  MailProviderSupport describeProviderSupport([MailDataSourceOptions? overrides]) {
    final selection = describeSelection(overrides);
    return driverManager.describeProviderSupport(selection.providerKey);
  }

  List<MailProviderSupport> listProviderSupport() {
    return driverManager.listProviderSupport();
  }

  bool supportsCapability(
    String capability, [
    MailDataSourceOptions? overrides,
  ]) {
    final metadata = describe(overrides);
    return metadata.requiredCapabilities.contains(capability) ||
        metadata.optionalCapabilities.contains(capability);
  }

  bool supportsProviderExtension(
    String extensionKey, [
    MailDataSourceOptions? overrides,
  ]) {
    return describe(overrides).extensionKeys.contains(extensionKey);
  }

  Future<MailClient<TNativeClient>> createClient<TNativeClient>([
    MailDataSourceOptions? overrides,
  ]) async {
    return await driverManager.connect(
          _mergeOptions(options, overrides),
        )
        as MailClient<TNativeClient>;
  }
}
`);
    case 'rust':
      return '';
    case 'java':
      return lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;

final class MailDataSourceOptions {

  public final String providerUrl;
  public final String providerKey;
  public final String tenantOverrideProviderKey;
  public final String deploymentProfileProviderKey;
  public final String defaultProviderKey;

  public MailDataSourceOptions() {
    this(null, null, null, null, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public MailDataSourceOptions(
      String providerUrl,
      String providerKey,
      String tenantOverrideProviderKey,
      String deploymentProfileProviderKey,
      String defaultProviderKey
  ) {
    this.providerUrl = providerUrl;
    this.providerKey = providerKey;
    this.tenantOverrideProviderKey = tenantOverrideProviderKey;
    this.deploymentProfileProviderKey = deploymentProfileProviderKey;
    this.defaultProviderKey = defaultProviderKey;
  }
}

public final class MailDataSource {

  private final MailDataSourceOptions options;
  private final MailDriverManager driverManager;

  public MailDataSource() {
    this(new MailDataSourceOptions(), new MailDriverManager());
  }

  public MailDataSource(
      MailDataSourceOptions options,
      MailDriverManager driverManager
  ) {
    this.options = options == null ? new MailDataSourceOptions() : options;
    this.driverManager = driverManager == null ? new MailDriverManager() : driverManager;
  }

  public MailProviderSelection describeSelection() {
    return describeSelection(null);
  }

  public MailProviderSelection describeSelection(MailDataSourceOptions overrides) {
    var merged = merge(options, overrides);
    return driverManager.resolveSelection(
        new MailProviderSelection.MailProviderSelectionRequest(
            merged.providerUrl,
            merged.providerKey,
            merged.tenantOverrideProviderKey,
            merged.deploymentProfileProviderKey
        ),
        merged.defaultProviderKey
    );
  }

  public MailProviderSupport describeProviderSupport() {
    return describeProviderSupport(null);
  }

  public MailProviderSupport describeProviderSupport(MailDataSourceOptions overrides) {
    return driverManager.describeProviderSupport(describeSelection(overrides).providerKey());
  }

  public List<MailProviderSupport> listProviderSupport() {
    return driverManager.listProviderSupport();
  }

  private static MailDataSourceOptions merge(
      MailDataSourceOptions base,
      MailDataSourceOptions overrides
  ) {
    if (overrides == null) {
      return base;
    }

    return new MailDataSourceOptions(
        overrides.providerUrl != null ? overrides.providerUrl : base.providerUrl,
        overrides.providerKey != null ? overrides.providerKey : base.providerKey,
        overrides.tenantOverrideProviderKey != null
            ? overrides.tenantOverrideProviderKey
            : base.tenantOverrideProviderKey,
        overrides.deploymentProfileProviderKey != null
            ? overrides.deploymentProfileProviderKey
            : base.deploymentProfileProviderKey,
        overrides.defaultProviderKey == null || overrides.defaultProviderKey.isBlank()
            ? base.defaultProviderKey
            : overrides.defaultProviderKey
    );
  }
}
`);
    case 'csharp':
      return lines(`
namespace Sdkwork.Mail.Sdk;

public sealed record MailDataSourceOptions(
    string? providerUrl = null,
    string? providerKey = null,
    string? tenantOverrideProviderKey = null,
    string? deploymentProfileProviderKey = null,
    string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
);

public sealed class MailDataSource
{
    private readonly MailDataSourceOptions _options;
    private readonly MailDriverManager _driverManager;

    public MailDataSource(
        MailDataSourceOptions? options = null,
        MailDriverManager? driverManager = null
    )
    {
        _options = options ?? new MailDataSourceOptions();
        _driverManager = driverManager ?? new MailDriverManager();
    }

    public MailProviderSelection DescribeSelection(MailDataSourceOptions? overrides = null)
    {
        var merged = merge(_options, overrides);
        return _driverManager.ResolveSelection(
            new MailProviderSelectionRequest(
                merged.providerUrl,
                merged.providerKey,
                merged.tenantOverrideProviderKey,
                merged.deploymentProfileProviderKey
            ),
            merged.defaultProviderKey
        );
    }

    public MailProviderSupport DescribeProviderSupport(MailDataSourceOptions? overrides = null)
    {
        return _driverManager.DescribeProviderSupport(DescribeSelection(overrides).providerKey);
    }

    public IReadOnlyList<MailProviderSupport> ListProviderSupport()
    {
        return _driverManager.ListProviderSupport();
    }

    private static MailDataSourceOptions merge(
        MailDataSourceOptions baseOptions,
        MailDataSourceOptions? overrides
    )
    {
        if (overrides is null)
        {
            return baseOptions;
        }

        return new MailDataSourceOptions(
            overrides.providerUrl ?? baseOptions.providerUrl,
            overrides.providerKey ?? baseOptions.providerKey,
            overrides.tenantOverrideProviderKey ?? baseOptions.tenantOverrideProviderKey,
            overrides.deploymentProfileProviderKey ?? baseOptions.deploymentProfileProviderKey,
            string.IsNullOrWhiteSpace(overrides.defaultProviderKey)
                ? baseOptions.defaultProviderKey
                : overrides.defaultProviderKey
        );
    }
}
`);
    case 'swift':
      return lines(`
public struct MailDataSourceOptions {
    public let providerUrl: String?
    public let providerKey: String?
    public let tenantOverrideProviderKey: String?
    public let deploymentProfileProviderKey: String?
    public let defaultProviderKey: String

    public init(
        providerUrl: String? = nil,
        providerKey: String? = nil,
        tenantOverrideProviderKey: String? = nil,
        deploymentProfileProviderKey: String? = nil,
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) {
        self.providerUrl = providerUrl
        self.providerKey = providerKey
        self.tenantOverrideProviderKey = tenantOverrideProviderKey
        self.deploymentProfileProviderKey = deploymentProfileProviderKey
        self.defaultProviderKey = defaultProviderKey
    }
}

public struct MailDataSource {
    public let options: MailDataSourceOptions
    public let driverManager: MailDriverManager

    public init(
        options: MailDataSourceOptions = MailDataSourceOptions(),
        driverManager: MailDriverManager = MailDriverManager()
    ) {
        self.options = options
        self.driverManager = driverManager
    }

    public func describeSelection(_ overrides: MailDataSourceOptions? = nil) -> MailProviderSelection {
        let merged = merge(options, overrides)
        return driverManager.resolveSelection(
            request: MailProviderSelectionRequest(
                providerUrl: merged.providerUrl,
                providerKey: merged.providerKey,
                tenantOverrideProviderKey: merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey: merged.deploymentProfileProviderKey
            ),
            defaultProviderKey: merged.defaultProviderKey
        )
    }

    public func describeProviderSupport(_ overrides: MailDataSourceOptions? = nil) -> MailProviderSupport {
        let selection = describeSelection(overrides)
        return driverManager.describeProviderSupport(providerKey: selection.providerKey)
    }

    public func listProviderSupport() -> [MailProviderSupport] {
        driverManager.listProviderSupport()
    }

    private func merge(_ base: MailDataSourceOptions, _ overrides: MailDataSourceOptions?) -> MailDataSourceOptions {
        guard let overrides else {
            return base
        }

        return MailDataSourceOptions(
            providerUrl: overrides.providerUrl ?? base.providerUrl,
            providerKey: overrides.providerKey ?? base.providerKey,
            tenantOverrideProviderKey: overrides.tenantOverrideProviderKey ?? base.tenantOverrideProviderKey,
            deploymentProfileProviderKey: overrides.deploymentProfileProviderKey ?? base.deploymentProfileProviderKey,
            defaultProviderKey: overrides.defaultProviderKey.isEmpty ? base.defaultProviderKey : overrides.defaultProviderKey
        )
    }
}
`);
    case 'kotlin':
      return lines(`
package com.sdkwork.Mail.metadata

data class MailDataSourceOptions(
    val providerUrl: String? = null,
    val providerKey: String? = null,
    val tenantOverrideProviderKey: String? = null,
    val deploymentProfileProviderKey: String? = null,
    val defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
)

class MailDataSource(
    private val options: MailDataSourceOptions = MailDataSourceOptions(),
    private val driverManager: MailDriverManager = MailDriverManager(),
) {
    fun describeSelection(overrides: MailDataSourceOptions? = null): MailProviderSelection {
        val merged = merge(options, overrides)
        return driverManager.resolveSelection(
            request = MailProviderSelectionRequest(
                providerUrl = merged.providerUrl,
                providerKey = merged.providerKey,
                tenantOverrideProviderKey = merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey = merged.deploymentProfileProviderKey,
            ),
            defaultProviderKey = merged.defaultProviderKey,
        )
    }

    fun describeProviderSupport(overrides: MailDataSourceOptions? = null): MailProviderSupport {
        return driverManager.describeProviderSupport(describeSelection(overrides).providerKey)
    }

    fun listProviderSupport(): List<MailProviderSupport> {
        return driverManager.listProviderSupport()
    }

    private fun merge(
        base: MailDataSourceOptions,
        overrides: MailDataSourceOptions?,
    ): MailDataSourceOptions {
        if (overrides == null) {
            return base
        }

        return MailDataSourceOptions(
            providerUrl = overrides.providerUrl ?: base.providerUrl,
            providerKey = overrides.providerKey ?: base.providerKey,
            tenantOverrideProviderKey = overrides.tenantOverrideProviderKey ?: base.tenantOverrideProviderKey,
            deploymentProfileProviderKey = overrides.deploymentProfileProviderKey ?: base.deploymentProfileProviderKey,
            defaultProviderKey = overrides.defaultProviderKey.ifBlank { base.defaultProviderKey },
        )
    }
}
`);
    case 'go':
      return lines(`
package Mailstandard

type MailDataSourceOptions struct {
    ProviderUrl                  string
    ProviderKey                  string
    TenantOverrideProviderKey    string
    DeploymentProfileProviderKey string
    DefaultProviderKey           string
}

type MailDataSource struct {
    options       MailDataSourceOptions
    driverManager MailDriverManager
}

func NewMailDataSourceOptions() MailDataSourceOptions {
    return MailDataSourceOptions{
        DefaultProviderKey: DEFAULT_mail_PROVIDER_KEY,
    }
}

func NewMailDataSource(options MailDataSourceOptions, driverManager MailDriverManager) MailDataSource {
    if !hasText(options.DefaultProviderKey) {
        options.DefaultProviderKey = DEFAULT_mail_PROVIDER_KEY
    }

    return MailDataSource{
        options:       options,
        driverManager: driverManager,
    }
}

func mergeMailDataSourceOptions(base MailDataSourceOptions, overrides *MailDataSourceOptions) MailDataSourceOptions {
    if overrides == nil {
        return base
    }

    merged := base
    if overrides.ProviderUrl != "" {
        merged.ProviderUrl = overrides.ProviderUrl
    }
    if overrides.ProviderKey != "" {
        merged.ProviderKey = overrides.ProviderKey
    }
    if overrides.TenantOverrideProviderKey != "" {
        merged.TenantOverrideProviderKey = overrides.TenantOverrideProviderKey
    }
    if overrides.DeploymentProfileProviderKey != "" {
        merged.DeploymentProfileProviderKey = overrides.DeploymentProfileProviderKey
    }
    if overrides.DefaultProviderKey != "" {
        merged.DefaultProviderKey = overrides.DefaultProviderKey
    }

    return merged
}

func (dataSource MailDataSource) describeSelection(overrides *MailDataSourceOptions) MailProviderSelection {
    merged := mergeMailDataSourceOptions(dataSource.options, overrides)
    return dataSource.driverManager.resolveSelection(
        MailProviderSelectionRequest{
            ProviderUrl:                  merged.ProviderUrl,
            ProviderKey:                  merged.ProviderKey,
            TenantOverrideProviderKey:    merged.TenantOverrideProviderKey,
            DeploymentProfileProviderKey: merged.DeploymentProfileProviderKey,
        },
        merged.DefaultProviderKey,
    )
}

func (dataSource MailDataSource) DescribeSelection(overrides *MailDataSourceOptions) MailProviderSelection {
    return dataSource.describeSelection(overrides)
}

func (dataSource MailDataSource) describeProviderSupport(overrides *MailDataSourceOptions) MailProviderSupport {
    selection := dataSource.describeSelection(overrides)
    return dataSource.driverManager.describeProviderSupport(selection.ProviderKey)
}

func (dataSource MailDataSource) DescribeProviderSupport(overrides *MailDataSourceOptions) MailProviderSupport {
    return dataSource.describeProviderSupport(overrides)
}

func (dataSource MailDataSource) listProviderSupport() []MailProviderSupport {
    return dataSource.driverManager.listProviderSupport()
}

func (dataSource MailDataSource) ListProviderSupport() []MailProviderSupport {
    return dataSource.listProviderSupport()
}
`);
    case 'python':
      return '';
    default:
      return '';
  }
}

function splitPackageIdentity(packageIdentity) {
  if (!String(packageIdentity).includes(':')) {
    return {
      groupId: null,
      artifactId: String(packageIdentity),
    };
  }

  const [groupId, artifactId] = String(packageIdentity).split(':', 2);
  return { groupId, artifactId };
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isReferenceProviderPackage(providerPackageScaffold, provider) {
  return (
    providerPackageScaffold?.referenceProviderKey === provider.providerKey &&
    resolveProviderPackageScaffoldRuntimeBridgeStatus(
      providerPackageScaffold,
      provider.providerKey,
    ) === 'reference-baseline'
  );
}

function resolveProviderPackageStatus(providerPackageScaffold, provider) {
  return resolveProviderPackageScaffoldStatus(
    providerPackageScaffold,
    provider.providerKey,
  );
}

function resolveProviderPackageRuntimeBridgeStatus(providerPackageScaffold, provider) {
  return resolveProviderPackageScaffoldRuntimeBridgeStatus(
    providerPackageScaffold,
    provider.providerKey,
  );
}

function renderFlutterReferenceProviderPackageReadme(
  languageEntry,
  provider,
  providerPackageScaffold,
) {
  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );
  const directoryPath = materializeProviderPackagePattern(
    providerPackageScaffold.directoryPattern,
    provider.providerKey,
  );
  const manifestPath = buildProviderPackageManifestPath(providerPackageScaffold, provider.providerKey);
  const readmePath = buildProviderPackageReadmePath(providerPackageScaffold, provider.providerKey);
  const sourcePath = buildProviderPackageSourcePath(providerPackageScaffold, provider.providerKey);
  const sourceSymbol = buildProviderPackageSourceSymbol(
    providerPackageScaffold,
    provider.providerKey,
  );
  const vendorSdkPackage = providerPackageScaffold.referenceVendorSdkPackage;
  const vendorSdkVersion = providerPackageScaffold.referenceVendorSdkVersion;
  const status = resolveProviderPackageStatus(providerPackageScaffold, provider);
  const runtimeBridgeStatus = resolveProviderPackageRuntimeBridgeStatus(
    providerPackageScaffold,
    provider,
  );

  return lines(`
# ${languageEntry.displayName} ${provider.displayName} Provider Package

Reference ${languageEntry.displayName} provider package boundary for ${provider.displayName}.

- provider key: \`${provider.providerKey}\`
- plugin id: \`${provider.pluginId}\`
- driver id: \`${provider.driverId}\`
- package identity: \`${packageIdentity}\`
- directory path: \`${directoryPath}\`
- manifest path: \`${manifestPath}\`
- readme path: \`${readmePath}\`
- source path: \`${sourcePath}\`
- source symbol: \`${sourceSymbol}\`
- vendor SDK package: \`${vendorSdkPackage}@${vendorSdkVersion}\`
- status: \`${status}\`
- runtime bridge status: \`${runtimeBridgeStatus}\`
- root public exposure: \`${providerPackageScaffold.rootPublic}\`

Rules:

- this package is the executable Flutter reference bridge for the official Volcengine Mail SDK
- the root \`mail_sdk\` package remains provider-neutral and does not depend on \`${vendorSdkPackage}\`
- install this provider package only when a Flutter application selects Volcengine as its Mail media provider
- wrap the official vendor SDK; do not re-implement Mail media runtime, signaling, invitation, or call lifecycle behavior
- expose only provider-neutral Mail media operations: \`join\`, \`leave\`, \`publish\`, \`unpublish\`, \`muteAudio\`, and \`muteVideo\`
- use Craw Chat or another owning IM/signaling runtime for business messages, room invitations, and call state orchestration
`);
}

function renderFlutterReferenceProviderPackageManifest(
  languageEntry,
  provider,
  providerPackageScaffold,
) {
  void languageEntry;
  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );
  const sourcePath = buildProviderPackageSourceRelativePath(
    providerPackageScaffold,
    provider.providerKey,
  );
  const sourceSymbol = buildProviderPackageSourceSymbol(
    providerPackageScaffold,
    provider.providerKey,
  );
  const vendorSdkPackage = providerPackageScaffold.referenceVendorSdkPackage;
  const vendorSdkVersion = providerPackageScaffold.referenceVendorSdkVersion;
  const status = resolveProviderPackageStatus(providerPackageScaffold, provider);
  const runtimeBridgeStatus = resolveProviderPackageRuntimeBridgeStatus(
    providerPackageScaffold,
    provider,
  );

  return lines(`
name: ${packageIdentity}
description: >
  Reference Flutter provider package boundary for ${provider.displayName}.
  providerKey: ${provider.providerKey}
  pluginId: ${provider.pluginId}
  driverId: ${provider.driverId}
  status: ${status}
  runtimeBridgeStatus: ${runtimeBridgeStatus}
publish_to: none
version: 0.1.0

environment:
  sdk: ">=3.4.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  mail_sdk:
    path: ../..
  ${vendorSdkPackage}: ${vendorSdkVersion}

sdkwork_mail_provider:
  providerKey: ${provider.providerKey}
  pluginId: ${provider.pluginId}
  driverId: ${provider.driverId}
  packageIdentity: ${packageIdentity}
  sourcePath: ${sourcePath}
  sourceSymbol: ${sourceSymbol}
  rootPublic: ${providerPackageScaffold.rootPublic}
  status: ${status}
  runtimeBridgeStatus: ${runtimeBridgeStatus}
  officialVendorSdkPackage: ${vendorSdkPackage}
  officialVendorSdkVersion: ${vendorSdkVersion}
`);
}

function renderFlutterReferenceProviderPackageEntrypoint(provider, providerPackageScaffold) {
  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );

  return lines(`
library ${packageIdentity};

export 'src/mail_provider_${provider.providerKey}_package_contract.dart';
`);
}

function renderFlutterReferenceProviderPackageSource(
  languageEntry,
  provider,
  providerPackageScaffold,
) {
  void languageEntry;
  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );
  const sourceSymbol = buildProviderPackageSourceSymbol(
    providerPackageScaffold,
    provider.providerKey,
  );
  const status = resolveProviderPackageStatus(providerPackageScaffold, provider);
  const runtimeBridgeStatus = resolveProviderPackageRuntimeBridgeStatus(
    providerPackageScaffold,
    provider,
  );

  return lines(`
import 'dart:async';
import 'dart:convert';

import 'package:mail_sdk/mail_sdk.dart';
import 'package:volc_engine_Mail/volc_engine_Mail.dart' as volc;

final MailProviderMetadata VOLCENGINE_mail_PROVIDER_METADATA =
    _requireVolcengineProviderMetadata();

final class MailVolcengineFlutterNativeConfig {
  const MailVolcengineFlutterNativeConfig({
    this.appId,
    this.engineParameters,
    this.userExtraInfo,
    this.userVisibility = true,
    this.isPublishAudio = false,
    this.isPublishVideo = false,
    this.isAutoSubscribeAudio = true,
    this.isAutoSubscribeVideo = true,
    this.destroyEngineOnLeave = true,
  });

  final String? appId;
  final Map<String, Object?>? engineParameters;
  final Map<String, Object?>? userExtraInfo;
  final bool userVisibility;
  final bool isPublishAudio;
  final bool isPublishVideo;
  final bool isAutoSubscribeAudio;
  final bool isAutoSubscribeVideo;
  final bool destroyEngineOnLeave;

  static MailVolcengineFlutterNativeConfig from(Object? value) {
    if (value is MailVolcengineFlutterNativeConfig) {
      return value;
    }

    if (value == null) {
      return const MailVolcengineFlutterNativeConfig();
    }

    if (value is! Map) {
      throw _invalidNativeConfig(
        'Mail nativeConfig must be an object for the official Volcengine Flutter bridge.',
        details: <String, Object?>{
          'receivedType': value.runtimeType.toString(),
        },
      );
    }

    return MailVolcengineFlutterNativeConfig(
      appId: _readString(value, 'appId'),
      engineParameters: _readStringObjectMap(value['engineParameters'], 'engineParameters') ??
          _readStringObjectMap(value['parameters'], 'parameters'),
      userExtraInfo: _readStringObjectMap(value['userExtraInfo'], 'userExtraInfo'),
      userVisibility: _readBool(value, 'userVisibility', true),
      isPublishAudio: _readBool(value, 'isPublishAudio', false),
      isPublishVideo: _readBool(value, 'isPublishVideo', false),
      isAutoSubscribeAudio: _readBool(value, 'isAutoSubscribeAudio', true),
      isAutoSubscribeVideo: _readBool(value, 'isAutoSubscribeVideo', true),
      destroyEngineOnLeave: _readBool(value, 'destroyEngineOnLeave', true),
    );
  }
}

typedef MailVolcengineFlutterEngineFactory = FutureOr<dynamic> Function(
  MailVolcengineFlutterNativeConfig nativeConfig,
);

final class CreateOfficialVolcengineFlutterMailDriverOptions {
  const CreateOfficialVolcengineFlutterMailDriverOptions({
    this.engineFactory,
  });

  final MailVolcengineFlutterEngineFactory? engineFactory;
}

final class MailVolcengineOfficialFlutterNativeClient {
  MailVolcengineOfficialFlutterNativeClient({
    required this.resolvedConfig,
    required this.nativeConfig,
    required this.engineFactory,
  });

  final MailResolvedClientConfig resolvedConfig;
  final MailVolcengineFlutterNativeConfig nativeConfig;
  final MailVolcengineFlutterEngineFactory engineFactory;
  final Map<String, MailTrackKind> publishedTracks = <String, MailTrackKind>{};

  dynamic engine;
  dynamic room;
  MailSessionDescriptor? joinedSession;
}

final class VolcengineMailRuntimeController
    implements
        MailRuntimeController<MailVolcengineOfficialFlutterNativeClient>,
        MailScreenShareRuntimeController<MailVolcengineOfficialFlutterNativeClient> {
  const VolcengineMailRuntimeController();

  @override
  Future<MailSessionDescriptor> join(
    MailJoinOptions options,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final runtime = await _ensureVolcengineRuntime(context, options.roomId);
    final userInfo = _buildUserInfo(options, runtime.nativeConfig);
    final roomConfig = volc.RoomConfig(
      isPublishAudio: runtime.nativeConfig.isPublishAudio,
      isPublishVideo: runtime.nativeConfig.isPublishVideo,
      isAutoSubscribeAudio: runtime.nativeConfig.isAutoSubscribeAudio,
      isAutoSubscribeVideo: runtime.nativeConfig.isAutoSubscribeVideo,
    );

    await Future<Object?>.value(
      runtime.room.joinRoom(
        token: options.token ?? '',
        userInfo: userInfo,
        roomConfig: roomConfig,
        userVisibility: runtime.nativeConfig.userVisibility,
      ),
    );

    final sessionDescriptor = MailSessionDescriptor(
      sessionId: options.sessionId,
      roomId: options.roomId,
      participantId: options.participantId,
      providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
      connectionState: MailSessionConnectionState.joined,
    );
    context.nativeClient.joinedSession = sessionDescriptor;

    return sessionDescriptor;
  }

  @override
  Future<MailSessionDescriptor> leave(
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final nativeClient = context.nativeClient;
    final joinedSession = nativeClient.joinedSession;

    if (nativeClient.room != null) {
      await Future<Object?>.value(nativeClient.room.leaveRoom());
      nativeClient.room = null;
    }

    if (nativeClient.engine != null && nativeClient.nativeConfig.destroyEngineOnLeave) {
      nativeClient.engine.destroy();
      nativeClient.engine = null;
    }

    nativeClient.joinedSession = null;
    nativeClient.publishedTracks.clear();

    return MailSessionDescriptor(
      sessionId: joinedSession?.sessionId ?? '',
      roomId: joinedSession?.roomId ?? '',
      participantId: joinedSession?.participantId ?? '',
      providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
      connectionState: MailSessionConnectionState.left,
    );
  }

  @override
  Future<MailTrackPublication> publish(
    MailPublishOptions options,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final mediaKind = _resolvePublishedMediaKind(options);
    final roomId = _requireJoinedRoomId(context.nativeClient);
    final runtime = await _ensureVolcengineRuntime(context, roomId);
    await _publishMediaKind(runtime, mediaKind, publish: true);
    context.nativeClient.publishedTracks[options.trackId] = mediaKind;

    return MailTrackPublication(
      trackId: options.trackId,
      kind: options.kind,
      muted: false,
    );
  }

  @override
  Future<void> unpublish(
    String trackId,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final mediaKind = context.nativeClient.publishedTracks[trackId];
    if (mediaKind == null) {
      return;
    }

    final roomId = _requireJoinedRoomId(context.nativeClient);
    final runtime = await _ensureVolcengineRuntime(context, roomId);
    await _publishMediaKind(runtime, mediaKind, publish: false);
    context.nativeClient.publishedTracks.remove(trackId);
  }

  @override
  Future<MailTrackPublication> startScreenShare(
    MailScreenShareOptions options,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final roomId = _requireJoinedRoomId(context.nativeClient);
    final runtime = await _ensureVolcengineRuntime(context, roomId);
    await _publishMediaKind(runtime, MailTrackKind.screenShare, publish: true);
    context.nativeClient.publishedTracks[options.trackId] = MailTrackKind.screenShare;

    return MailTrackPublication(
      trackId: options.trackId,
      kind: MailTrackKind.screenShare,
      muted: false,
    );
  }

  @override
  Future<void> stopScreenShare(
    String trackId,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final mediaKind = context.nativeClient.publishedTracks[trackId];
    if (mediaKind != MailTrackKind.screenShare) {
      return;
    }

    final roomId = _requireJoinedRoomId(context.nativeClient);
    final runtime = await _ensureVolcengineRuntime(context, roomId);
    await _publishMediaKind(runtime, MailTrackKind.screenShare, publish: false);
    context.nativeClient.publishedTracks.remove(trackId);
  }

  @override
  Future<MailMuteState> muteAudio(
    bool muted,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final roomId = _requireJoinedRoomId(context.nativeClient);
    final runtime = await _ensureVolcengineRuntime(context, roomId);
    await _publishMediaKind(runtime, MailTrackKind.audio, publish: !muted);

    return MailMuteState(kind: MailTrackKind.audio, muted: muted);
  }

  @override
  Future<MailMuteState> muteVideo(
    bool muted,
    MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  ) async {
    final roomId = _requireJoinedRoomId(context.nativeClient);
    final runtime = await _ensureVolcengineRuntime(context, roomId);
    await _publishMediaKind(runtime, MailTrackKind.video, publish: !muted);

    if (muted) {
      await Future<Object?>.value(runtime.engine.stopVideoCapture());
    }

    return MailMuteState(kind: MailTrackKind.video, muted: muted);
  }
}

final class ${sourceSymbol} {
  static const String providerKey = ${q(provider.providerKey)};
  static const String pluginId = ${q(provider.pluginId)};
  static const String driverId = ${q(provider.driverId)};
  static const String packageIdentity = ${q(packageIdentity)};
  static const String status = ${q(status)};
  static const String runtimeBridgeStatus = ${q(runtimeBridgeStatus)};
  static const bool rootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'};
  static final MailProviderModule<MailVolcengineOfficialFlutterNativeClient>
      providerModule = VOLCENGINE_mail_PROVIDER_MODULE;

  const ${sourceSymbol}._();
}

MailProviderDriver<MailVolcengineOfficialFlutterNativeClient>
    createOfficialVolcengineFlutterMailDriver([
  CreateOfficialVolcengineFlutterMailDriverOptions? options,
]) {
  final engineFactory = options?.engineFactory ?? _createDefaultVolcengineEngine;

  return createMailProviderDriver<MailVolcengineOfficialFlutterNativeClient>(
    metadata: VOLCENGINE_mail_PROVIDER_METADATA,
    nativeFactory: (config) async {
      return MailVolcengineOfficialFlutterNativeClient(
        resolvedConfig: config,
        nativeConfig: MailVolcengineFlutterNativeConfig.from(config.nativeConfig),
        engineFactory: engineFactory,
      );
    },
    runtimeController: const VolcengineMailRuntimeController(),
  );
}

MailProviderDriver<TNativeClient> createVolcengineMailDriver<TNativeClient>([
  MailProviderModuleDriverOptions<TNativeClient>? options,
]) {
  if (options == null) {
    return createOfficialVolcengineFlutterMailDriver()
        as MailProviderDriver<TNativeClient>;
  }

  return createMailProviderDriver<TNativeClient>(
    metadata: VOLCENGINE_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  );
}

final MailProviderModule<MailVolcengineOfficialFlutterNativeClient>
    VOLCENGINE_mail_PROVIDER_MODULE =
        MailProviderModule<MailVolcengineOfficialFlutterNativeClient>(
  packageName: ${q(packageIdentity)},
  metadata: VOLCENGINE_mail_PROVIDER_METADATA,
  builtin: getMailProviderPackageByProviderKey(${q(provider.providerKey)})?.builtin ?? false,
  createDriver: createVolcengineMailDriver<MailVolcengineOfficialFlutterNativeClient>,
);

MailProviderMetadata _requireVolcengineProviderMetadata() {
  final metadata = getOfficialMailProviderMetadataByKey(${q(provider.providerKey)});
  if (metadata == null) {
    throw const MailSdkException(
      code: 'provider_not_official',
      message: 'Volcengine Mail provider metadata is missing from the root Mail provider catalog.',
      providerKey: ${q(provider.providerKey)},
      pluginId: ${q(provider.pluginId)},
    );
  }

  return metadata;
}

Future<dynamic> _createDefaultVolcengineEngine(
  MailVolcengineFlutterNativeConfig nativeConfig,
) async {
  _assertRequiredVolcengineConfig(nativeConfig);

  return volc.MailEngine.createMailEngine(
    volc.MailVideoContext(
      appId: nativeConfig.appId!,
      parameters: nativeConfig.engineParameters == null
          ? null
          : Map<String, dynamic>.from(nativeConfig.engineParameters!),
    ),
  );
}

void _assertRequiredVolcengineConfig(
  MailVolcengineFlutterNativeConfig nativeConfig,
) {
  if ((nativeConfig.appId ?? '').trim().isNotEmpty) {
    return;
  }

  throw MailSdkException(
    code: 'invalid_native_config',
    message: 'Official Volcengine Flutter Mail runtime requires nativeConfig.appId.',
    providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
    pluginId: VOLCENGINE_mail_PROVIDER_METADATA.pluginId,
    details: <String, Object?>{
      'missingConfigKeys': <String>['appId'],
    },
  );
}

volc.UserInfo _buildUserInfo(
  MailJoinOptions options,
  MailVolcengineFlutterNativeConfig nativeConfig,
) {
  final extraInfo = <String, Object?>{
    ...?nativeConfig.userExtraInfo,
    ...?options.metadata,
  };

  return volc.UserInfo(
    userId: options.participantId,
    extraInfo: extraInfo.isEmpty ? '' : jsonEncode(extraInfo),
  );
}

Future<_ResolvedVolcengineRuntime> _ensureVolcengineRuntime(
  MailRuntimeControllerContext<MailVolcengineOfficialFlutterNativeClient> context,
  String roomId,
) async {
  final nativeClient = context.nativeClient;
  final nativeConfig = nativeClient.nativeConfig;
  _assertRequiredVolcengineConfig(nativeConfig);

  if (nativeClient.engine == null) {
    nativeClient.engine = await Future<dynamic>.value(
      nativeClient.engineFactory(nativeConfig),
    );
  }

  if (nativeClient.room != null && nativeClient.joinedSession?.roomId != roomId) {
    await Future<Object?>.value(nativeClient.room.leaveRoom());
    nativeClient.room = null;
    nativeClient.publishedTracks.clear();
  }

  if (nativeClient.room == null) {
    nativeClient.room = await Future<dynamic>.value(
      nativeClient.engine.createMailRoom(roomId),
    );
  }

  if (nativeClient.room == null) {
    throw MailSdkException(
      code: MailStandardContract.runtimeSurfaceFailureCode,
      message: 'Official Volcengine Flutter Mail SDK could not create a room.',
      providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
      pluginId: VOLCENGINE_mail_PROVIDER_METADATA.pluginId,
      details: <String, Object?>{
        'roomId': roomId,
      },
    );
  }

  return _ResolvedVolcengineRuntime(
    nativeConfig: nativeConfig,
    engine: nativeClient.engine,
    room: nativeClient.room,
  );
}

String _requireJoinedRoomId(
  MailVolcengineOfficialFlutterNativeClient nativeClient,
) {
  final roomId = nativeClient.joinedSession?.roomId;
  if (roomId != null && roomId.isNotEmpty) {
    return roomId;
  }

  throw MailSdkException(
    code: 'room_not_joined',
    message: 'Mail runtime media operation requires a joined room.',
    providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
    pluginId: VOLCENGINE_mail_PROVIDER_METADATA.pluginId,
  );
}

MailTrackKind _resolvePublishedMediaKind(MailPublishOptions options) {
  if (options.kind == MailTrackKind.audio ||
      options.kind == MailTrackKind.video ||
      options.kind == MailTrackKind.screenShare) {
    return options.kind;
  }

  throw MailSdkException(
    code: 'capability_not_supported',
    message: 'Official Volcengine Flutter bridge only supports audio and video through the standard publish surface.',
    providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
    pluginId: VOLCENGINE_mail_PROVIDER_METADATA.pluginId,
    details: <String, Object?>{
      'kind': MailTrackKindWireName(options.kind),
    },
  );
}

Future<void> _publishMediaKind(
  _ResolvedVolcengineRuntime runtime,
  MailTrackKind kind, {
  required bool publish,
}) async {
  if (kind == MailTrackKind.audio) {
    if (publish) {
      await Future<Object?>.value(runtime.engine.startAudioCapture());
    }

    await Future<Object?>.value(runtime.room.publishStreamAudio(publish));
    return;
  }

  if (kind == MailTrackKind.screenShare) {
    await Future<Object?>.value(runtime.room.publishScreen(publish));
    return;
  }

  if (publish) {
    await Future<Object?>.value(runtime.engine.startVideoCapture());
  }

  await Future<Object?>.value(runtime.room.publishStreamVideo(publish));
}

String? _readString(Map<dynamic, dynamic> map, String key) {
  final value = map[key];
  if (value == null) {
    return null;
  }

  if (value is String) {
    return value;
  }

  throw _invalidNativeConfig(
    'Mail nativeConfig.' + key + ' must be a string.',
    details: <String, Object?>{
      'key': key,
      'receivedType': value.runtimeType.toString(),
    },
  );
}

bool _readBool(Map<dynamic, dynamic> map, String key, bool defaultValue) {
  final value = map[key];
  if (value == null) {
    return defaultValue;
  }

  if (value is bool) {
    return value;
  }

  throw _invalidNativeConfig(
    'Mail nativeConfig.' + key + ' must be a boolean.',
    details: <String, Object?>{
      'key': key,
      'receivedType': value.runtimeType.toString(),
    },
  );
}

Map<String, Object?>? _readStringObjectMap(Object? value, String key) {
  if (value == null) {
    return null;
  }

  if (value is! Map) {
    throw _invalidNativeConfig(
      'Mail nativeConfig.' + key + ' must be an object.',
      details: <String, Object?>{
        'key': key,
        'receivedType': value.runtimeType.toString(),
      },
    );
  }

  final result = <String, Object?>{};
  for (final entry in value.entries) {
    if (entry.key is! String) {
      throw _invalidNativeConfig(
        'Mail nativeConfig.' + key + ' must contain string keys only.',
        details: <String, Object?>{
          'key': key,
          'receivedKeyType': entry.key.runtimeType.toString(),
        },
      );
    }

    result[entry.key as String] = entry.value;
  }

  return result;
}

MailSdkException _invalidNativeConfig(
  String message, {
  Map<String, Object?>? details,
}) {
  return MailSdkException(
    code: 'invalid_native_config',
    message: message,
    providerKey: VOLCENGINE_mail_PROVIDER_METADATA.providerKey,
    pluginId: VOLCENGINE_mail_PROVIDER_METADATA.pluginId,
    details: details,
  );
}

final class _ResolvedVolcengineRuntime {
  const _ResolvedVolcengineRuntime({
    required this.nativeConfig,
    required this.engine,
    required this.room,
  });

  final MailVolcengineFlutterNativeConfig nativeConfig;
  final dynamic engine;
  final dynamic room;
}
`);
}

function renderReservedLanguageProviderPackageScaffoldPlan(languageEntry, assembly) {
  if (!languageEntry.providerPackageScaffold) {
    return [];
  }

  const providers = assembly.providers ?? [];
  const providerPackageScaffold = languageEntry.providerPackageScaffold;
  const packageRows = providers
    .map(
      (provider) => {
        const providerPascal = toPascalCase(provider.providerKey);
        const packageIdentity = materializeProviderPackagePattern(
          providerPackageScaffold.packagePattern,
          provider.providerKey,
        );
        const directoryPath = materializeProviderPackagePattern(
          providerPackageScaffold.directoryPattern,
          provider.providerKey,
        );
        const manifestPath = buildProviderPackageManifestPath(
          providerPackageScaffold,
          provider.providerKey,
        );
        const readmePath = buildProviderPackageReadmePath(
          providerPackageScaffold,
          provider.providerKey,
        );
        const sourcePath = buildProviderPackageSourcePath(
          providerPackageScaffold,
          provider.providerKey,
        );
        const sourceSymbol = buildProviderPackageSourceSymbol(
          providerPackageScaffold,
          provider.providerKey,
        );

        return `| \`${provider.providerKey}\` | \`${providerPascal}\` | \`${packageIdentity}\` | \`${directoryPath}\` | \`${manifestPath}\` | \`${readmePath}\` | \`${sourcePath}\` | \`${sourceSymbol}\` |`;
      },
    )
    .join('\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${providerPackageScaffold.relativePath}`,
      content: lines(`
# ${languageEntry.displayName} Provider Package Scaffold

Reserved provider package scaffold for future ${languageEntry.displayName} Mail adapters.

- directory pattern: \`${providerPackageScaffold.directoryPattern}\`
- package pattern: \`${providerPackageScaffold.packagePattern}\`
- manifest file name: \`${providerPackageScaffold.manifestFileName}\`
- readme file name: \`${providerPackageScaffold.readmeFileName}\`
- source file pattern: \`${providerPackageScaffold.sourceFilePattern}\`
- source symbol pattern: \`${providerPackageScaffold.sourceSymbolPattern}\`
- template tokens: ${renderTemplateTokenList(providerPackageScaffold.templateTokens)}
- source template tokens: ${renderTemplateTokenList(providerPackageScaffold.sourceTemplateTokens)}
- status: \`${providerPackageScaffold.status}\`
- runtime bridge status: \`${providerPackageScaffold.runtimeBridgeStatus}\`
- root public exposure: \`${providerPackageScaffold.rootPublic}\`

Rules:

- one provider per package boundary
- bind each package to one official providerKey from the assembly-driven provider catalog
- preserve providerKey, pluginId, and driverId alignment with the official provider catalog
- wrap the official vendor SDK instead of re-implementing media runtime
- materialize one metadata-only source stub per provider package boundary before runtime bridge work lands
- keep the package outside the workspace root public API until a verified runtime bridge lands
- keep the status fixed at \`${providerPackageScaffold.status}\` until a language-specific runtime bridge is verified
- keep runtime bridge status fixed at \`${providerPackageScaffold.runtimeBridgeStatus}\` until the provider package becomes executable
- keep root public exposure fixed at \`false\` until the provider becomes a verified builtin baseline

| Provider key | Provider pascal | Package identity | Directory path | Manifest path | README path | Source path | Source symbol |
| --- | --- | --- | --- | --- | --- | --- | --- |
${packageRows}
`),
    },
  ];
}

function renderReservedProviderPackageReadme(languageEntry, provider, providerPackageScaffold) {
  if (
    languageEntry.language === 'flutter' &&
    isReferenceProviderPackage(providerPackageScaffold, provider)
  ) {
    return renderFlutterReferenceProviderPackageReadme(
      languageEntry,
      provider,
      providerPackageScaffold,
    );
  }

  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );
  const directoryPath = materializeProviderPackagePattern(
    providerPackageScaffold.directoryPattern,
    provider.providerKey,
  );
  const manifestPath = buildProviderPackageManifestPath(providerPackageScaffold, provider.providerKey);
  const readmePath = buildProviderPackageReadmePath(providerPackageScaffold, provider.providerKey);
  const sourcePath = buildProviderPackageSourcePath(providerPackageScaffold, provider.providerKey);
  const sourceSymbol = buildProviderPackageSourceSymbol(
    providerPackageScaffold,
    provider.providerKey,
  );

  return lines(`
# ${languageEntry.displayName} ${provider.displayName} Provider Package

Reserved ${languageEntry.displayName} provider package boundary for ${provider.displayName}.

- provider key: \`${provider.providerKey}\`
- plugin id: \`${provider.pluginId}\`
- driver id: \`${provider.driverId}\`
- package identity: \`${packageIdentity}\`
- directory path: \`${directoryPath}\`
- manifest path: \`${manifestPath}\`
- readme path: \`${readmePath}\`
- source path: \`${sourcePath}\`
- source symbol: \`${sourceSymbol}\`
- builtin provider: \`${provider.builtin}\`
- status: \`${providerPackageScaffold.status}\`
- runtime bridge status: \`${providerPackageScaffold.runtimeBridgeStatus}\`
- root public exposure: \`${providerPackageScaffold.rootPublic}\`

Rules:

- one provider per package boundary
- preserve providerKey, pluginId, and driverId alignment with the official provider catalog
- wrap the official vendor SDK instead of re-implementing media runtime
- keep the source scaffold metadata-only until a verified runtime bridge lands
- do not expose this package through the root public API in the current landing
- no runtime bridge ships in the current reserved package boundary
`);
}

function renderReservedProviderPackageManifest(languageEntry, provider, providerPackageScaffold) {
  if (
    languageEntry.language === 'flutter' &&
    isReferenceProviderPackage(providerPackageScaffold, provider)
  ) {
    return renderFlutterReferenceProviderPackageManifest(
      languageEntry,
      provider,
      providerPackageScaffold,
    );
  }

  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );
  const sourcePath = buildProviderPackageSourceRelativePath(
    providerPackageScaffold,
    provider.providerKey,
  );
  const sourceRoot = buildProviderPackageSourceRoot(
    providerPackageScaffold,
    provider.providerKey,
  );
  const sourceSymbol = buildProviderPackageSourceSymbol(
    providerPackageScaffold,
    provider.providerKey,
  );

  switch (languageEntry.language) {
    case 'flutter':
      return lines(`
name: ${packageIdentity}
description: >
  Reserved Flutter provider package boundary for ${provider.displayName}.
  providerKey: ${provider.providerKey}
  pluginId: ${provider.pluginId}
  driverId: ${provider.driverId}
  status: ${providerPackageScaffold.status}
  runtimeBridgeStatus: ${providerPackageScaffold.runtimeBridgeStatus}
publish_to: none
version: 0.1.0

environment:
  sdk: ">=3.4.0 <4.0.0"

sdkwork_mail_provider:
  providerKey: ${provider.providerKey}
  pluginId: ${provider.pluginId}
  driverId: ${provider.driverId}
  packageIdentity: ${packageIdentity}
  sourcePath: ${sourcePath}
  sourceSymbol: ${sourceSymbol}
  rootPublic: ${providerPackageScaffold.rootPublic}
  status: ${providerPackageScaffold.status}
  runtimeBridgeStatus: ${providerPackageScaffold.runtimeBridgeStatus}
`);
    case 'rust':
      return lines(`
[package]
name = ${q(packageIdentity)}
version = "0.1.0"
edition = "2021"
description = ${q(`Reserved Rust provider package boundary for ${provider.displayName}`)}
license = "UNLICENSED"
publish = false

[lib]
path = ${q(sourcePath)}

[package.metadata.sdkwork-mail-provider]
providerKey = ${q(provider.providerKey)}
pluginId = ${q(provider.pluginId)}
driverId = ${q(provider.driverId)}
packageIdentity = ${q(packageIdentity)}
sourcePath = ${q(sourcePath)}
sourceSymbol = ${q(sourceSymbol)}
rootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'}
status = ${q(providerPackageScaffold.status)}
runtimeBridgeStatus = ${q(providerPackageScaffold.runtimeBridgeStatus)}
`);
    case 'java': {
      const { groupId, artifactId } = splitPackageIdentity(packageIdentity);
      return lines(`
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>${escapeXml(groupId ?? packageIdentity)}</groupId>
  <artifactId>${escapeXml(artifactId)}</artifactId>
  <version>0.1.0</version>
  <name>${escapeXml(packageIdentity)}</name>
  <description>${escapeXml(`Reserved Java provider package boundary for ${provider.displayName}`)}</description>

  <properties>
    <sdkwork.Mail.providerKey>${escapeXml(provider.providerKey)}</sdkwork.Mail.providerKey>
    <sdkwork.Mail.pluginId>${escapeXml(provider.pluginId)}</sdkwork.Mail.pluginId>
    <sdkwork.Mail.driverId>${escapeXml(provider.driverId)}</sdkwork.Mail.driverId>
    <sdkwork.Mail.packageIdentity>${escapeXml(packageIdentity)}</sdkwork.Mail.packageIdentity>
    <sdkwork.Mail.sourcePath>${escapeXml(sourcePath)}</sdkwork.Mail.sourcePath>
    <sdkwork.Mail.sourceSymbol>${escapeXml(sourceSymbol)}</sdkwork.Mail.sourceSymbol>
    <sdkwork.Mail.rootPublic>${escapeXml(String(providerPackageScaffold.rootPublic))}</sdkwork.Mail.rootPublic>
    <sdkwork.Mail.status>${escapeXml(providerPackageScaffold.status)}</sdkwork.Mail.status>
    <sdkwork.Mail.runtimeBridgeStatus>${escapeXml(providerPackageScaffold.runtimeBridgeStatus)}</sdkwork.Mail.runtimeBridgeStatus>
  </properties>
</project>
`);
    }
    case 'csharp':
      return lines(`
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <AssemblyName>${escapeXml(packageIdentity)}</AssemblyName>
    <RootNamespace>${escapeXml(packageIdentity)}</RootNamespace>
    <PackageId>${escapeXml(packageIdentity)}</PackageId>
    <Version>0.1.0</Version>
    <Description>${escapeXml(`Reserved C# provider package boundary for ${provider.displayName}`)}</Description>
    <IsPackable>true</IsPackable>
    <SdkworkMailProviderKey>${escapeXml(provider.providerKey)}</SdkworkMailProviderKey>
    <SdkworkMailPluginId>${escapeXml(provider.pluginId)}</SdkworkMailPluginId>
    <SdkworkMailDriverId>${escapeXml(provider.driverId)}</SdkworkMailDriverId>
    <SdkworkMailSourcePath>${escapeXml(sourcePath)}</SdkworkMailSourcePath>
    <SdkworkMailSourceSymbol>${escapeXml(sourceSymbol)}</SdkworkMailSourceSymbol>
    <SdkworkMailRootPublic>${escapeXml(String(providerPackageScaffold.rootPublic))}</SdkworkMailRootPublic>
    <SdkworkMailStatus>${escapeXml(providerPackageScaffold.status)}</SdkworkMailStatus>
    <SdkworkMailRuntimeBridgeStatus>${escapeXml(providerPackageScaffold.runtimeBridgeStatus)}</SdkworkMailRuntimeBridgeStatus>
  </PropertyGroup>
</Project>
`);
    case 'swift':
      return lines(`
// providerKey: ${provider.providerKey}
// pluginId: ${provider.pluginId}
// driverId: ${provider.driverId}
// packageIdentity: ${packageIdentity}
// sourcePath: ${sourcePath}
// sourceSymbol: ${sourceSymbol}
// rootPublic: ${providerPackageScaffold.rootPublic}
// status: ${providerPackageScaffold.status}
// runtimeBridgeStatus: ${providerPackageScaffold.runtimeBridgeStatus}

import PackageDescription

let package = Package(
    name: ${q(packageIdentity)},
    products: [
        .library(
            name: ${q(packageIdentity)},
            targets: [${q(packageIdentity)}]
        ),
    ],
    targets: [
        .target(
            name: ${q(packageIdentity)},
            path: ${q(sourceRoot)}
        ),
    ]
)
`);
    case 'kotlin': {
      const { groupId } = splitPackageIdentity(packageIdentity);
      return lines(`
group = ${q(groupId ?? 'com.sdkwork')}
version = "0.1.0"
description = ${q(`Reserved Kotlin provider package boundary for ${provider.displayName}`)}

extra["sdkworkMailProviderKey"] = ${q(provider.providerKey)}
extra["sdkworkMailPluginId"] = ${q(provider.pluginId)}
extra["sdkworkMailDriverId"] = ${q(provider.driverId)}
extra["sdkworkMailPackageIdentity"] = ${q(packageIdentity)}
extra["sdkworkMailSourcePath"] = ${q(sourcePath)}
extra["sdkworkMailSourceSymbol"] = ${q(sourceSymbol)}
extra["sdkworkMailRootPublic"] = ${q(String(providerPackageScaffold.rootPublic))}
extra["sdkworkMailStatus"] = ${q(providerPackageScaffold.status)}
extra["sdkworkMailRuntimeBridgeStatus"] = ${q(providerPackageScaffold.runtimeBridgeStatus)}
`);
    }
    case 'go':
      return lines(`
module ${packageIdentity}

go 1.22

// providerKey: ${provider.providerKey}
// pluginId: ${provider.pluginId}
// driverId: ${provider.driverId}
// sourcePath: ${sourcePath}
// sourceSymbol: ${sourceSymbol}
// rootPublic: ${providerPackageScaffold.rootPublic}
// status: ${providerPackageScaffold.status}
// runtimeBridgeStatus: ${providerPackageScaffold.runtimeBridgeStatus}
`);
    case 'python':
      return lines(`
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = ${q(packageIdentity)}
version = "0.1.0"
description = ${q(`Reserved Python provider package boundary for ${provider.displayName}`)}
requires-python = ">=3.11"

[tool.setuptools]
packages = [${q(sourceRoot)}]

[tool.sdkwork-mail-provider]
providerKey = ${q(provider.providerKey)}
pluginId = ${q(provider.pluginId)}
driverId = ${q(provider.driverId)}
packageIdentity = ${q(packageIdentity)}
sourcePath = ${q(sourcePath)}
sourceSymbol = ${q(sourceSymbol)}
rootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'}
status = ${q(providerPackageScaffold.status)}
runtimeBridgeStatus = ${q(providerPackageScaffold.runtimeBridgeStatus)}
`);
    default:
      throw new Error(`Unsupported reserved provider package manifest materialization: ${languageEntry.language}`);
  }
}

function renderReservedProviderPackageSource(languageEntry, provider, providerPackageScaffold) {
  if (
    languageEntry.language === 'flutter' &&
    isReferenceProviderPackage(providerPackageScaffold, provider)
  ) {
    return renderFlutterReferenceProviderPackageSource(
      languageEntry,
      provider,
      providerPackageScaffold,
    );
  }

  const packageIdentity = materializeProviderPackagePattern(
    providerPackageScaffold.packagePattern,
    provider.providerKey,
  );
  const sourceSymbol = buildProviderPackageSourceSymbol(
    providerPackageScaffold,
    provider.providerKey,
  );

  switch (languageEntry.language) {
    case 'flutter':
      return lines(`
/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
final class ${sourceSymbol} {
  static const String providerKey = ${q(provider.providerKey)};
  static const String pluginId = ${q(provider.pluginId)};
  static const String driverId = ${q(provider.driverId)};
  static const String packageIdentity = ${q(packageIdentity)};
  static const String status = ${q(providerPackageScaffold.status)};
  static const String runtimeBridgeStatus = ${q(providerPackageScaffold.runtimeBridgeStatus)};
  static const bool rootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'};

  const ${sourceSymbol}._();
}
`);
    case 'rust':
      return lines(`
/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
pub struct ${sourceSymbol};

impl ${sourceSymbol} {
    pub const PROVIDER_KEY: &'static str = ${q(provider.providerKey)};
    pub const PLUGIN_ID: &'static str = ${q(provider.pluginId)};
    pub const DRIVER_ID: &'static str = ${q(provider.driverId)};
    pub const PACKAGE_IDENTITY: &'static str = ${q(packageIdentity)};
    pub const STATUS: &'static str = ${q(providerPackageScaffold.status)};
    pub const RUNTIME_BRIDGE_STATUS: &'static str = ${q(providerPackageScaffold.runtimeBridgeStatus)};
    pub const ROOT_PUBLIC: bool = ${providerPackageScaffold.rootPublic ? 'true' : 'false'};
}
`);
    case 'java':
      return lines(`
package com.sdkwork.Mail.provider.${provider.providerKey};

/**
 * Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
 */
public final class ${sourceSymbol} {
  public static final String PROVIDER_KEY = ${q(provider.providerKey)};
  public static final String PLUGIN_ID = ${q(provider.pluginId)};
  public static final String DRIVER_ID = ${q(provider.driverId)};
  public static final String PACKAGE_IDENTITY = ${q(packageIdentity)};
  public static final String STATUS = ${q(providerPackageScaffold.status)};
  public static final String RUNTIME_BRIDGE_STATUS = ${q(providerPackageScaffold.runtimeBridgeStatus)};
  public static final boolean ROOT_PUBLIC = ${providerPackageScaffold.rootPublic ? 'true' : 'false'};

  private ${sourceSymbol}() {
  }
}
`);
    case 'csharp':
      return lines(`
namespace ${packageIdentity};

/// <summary>
/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
/// </summary>
public static class ${sourceSymbol}
{
    public const string ProviderKey = ${q(provider.providerKey)};
    public const string PluginId = ${q(provider.pluginId)};
    public const string DriverId = ${q(provider.driverId)};
    public const string PackageIdentity = ${q(packageIdentity)};
    public const string Status = ${q(providerPackageScaffold.status)};
    public const string RuntimeBridgeStatus = ${q(providerPackageScaffold.runtimeBridgeStatus)};
    public const bool RootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'};
}
`);
    case 'swift':
      return lines(`
/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
public enum ${sourceSymbol} {
    public static let providerKey = ${q(provider.providerKey)}
    public static let pluginId = ${q(provider.pluginId)}
    public static let driverId = ${q(provider.driverId)}
    public static let packageIdentity = ${q(packageIdentity)}
    public static let status = ${q(providerPackageScaffold.status)}
    public static let runtimeBridgeStatus = ${q(providerPackageScaffold.runtimeBridgeStatus)}
    public static let rootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'}
}
`);
    case 'kotlin':
      return lines(`
package com.sdkwork.Mail.provider.${provider.providerKey}

/**
 * Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
 */
object ${sourceSymbol} {
    const val PROVIDER_KEY: String = ${q(provider.providerKey)}
    const val PLUGIN_ID: String = ${q(provider.pluginId)}
    const val DRIVER_ID: String = ${q(provider.driverId)}
    const val PACKAGE_IDENTITY: String = ${q(packageIdentity)}
    const val STATUS: String = ${q(providerPackageScaffold.status)}
    const val RUNTIME_BRIDGE_STATUS: String = ${q(providerPackageScaffold.runtimeBridgeStatus)}
    const val ROOT_PUBLIC: Boolean = ${providerPackageScaffold.rootPublic ? 'true' : 'false'}
}
`);
    case 'go':
      return lines(`
package Mailprovider

// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
type ${sourceSymbol} struct{}

const (
	${sourceSymbol}ProviderKey = ${q(provider.providerKey)}
	${sourceSymbol}PluginID = ${q(provider.pluginId)}
	${sourceSymbol}DriverID = ${q(provider.driverId)}
	${sourceSymbol}PackageIdentity = ${q(packageIdentity)}
	${sourceSymbol}Status = ${q(providerPackageScaffold.status)}
	${sourceSymbol}RuntimeBridgeStatus = ${q(providerPackageScaffold.runtimeBridgeStatus)}
)

const ${sourceSymbol}RootPublic = ${providerPackageScaffold.rootPublic ? 'true' : 'false'}
`);
    case 'python':
      return lines(`
"""Metadata-only provider package scaffold. No runtime bridge is implemented here yet."""


class ${sourceSymbol}:
    provider_key = ${q(provider.providerKey)}
    plugin_id = ${q(provider.pluginId)}
    driver_id = ${q(provider.driverId)}
    package_identity = ${q(packageIdentity)}
    status = ${q(providerPackageScaffold.status)}
    runtime_bridge_status = ${q(providerPackageScaffold.runtimeBridgeStatus)}
    root_public = ${providerPackageScaffold.rootPublic ? 'True' : 'False'}


__all__ = [${q(sourceSymbol)}]
`);
    default:
      throw new Error(`Unsupported reserved provider package source materialization: ${languageEntry.language}`);
  }
}

function renderReservedLanguageProviderPackageBoundaryPlan(languageEntry, assembly) {
  if (!languageEntry.providerPackageScaffold) {
    return [];
  }

  return (assembly.providers ?? []).flatMap((provider) => {
    const providerPackageScaffold = languageEntry.providerPackageScaffold;
    const directoryPath = materializeProviderPackagePattern(
      providerPackageScaffold.directoryPattern,
      provider.providerKey,
    );
    const manifestFileName = materializeProviderPackagePattern(
      providerPackageScaffold.manifestFileName,
      provider.providerKey,
    );
    const packageIdentity = materializeProviderPackagePattern(
      providerPackageScaffold.packagePattern,
      provider.providerKey,
    );
    const entries = [
      {
        relativePath: `${languageEntry.workspace}/${directoryPath}/${providerPackageScaffold.readmeFileName}`,
        content: renderReservedProviderPackageReadme(
          languageEntry,
          provider,
          providerPackageScaffold,
        ),
      },
      {
        relativePath: `${languageEntry.workspace}/${directoryPath}/${manifestFileName}`,
        content: renderReservedProviderPackageManifest(
          languageEntry,
          provider,
          providerPackageScaffold,
        ),
      },
      {
        relativePath: `${languageEntry.workspace}/${buildProviderPackageSourcePath(
          providerPackageScaffold,
          provider.providerKey,
        )}`,
        content: renderReservedProviderPackageSource(
          languageEntry,
          provider,
          providerPackageScaffold,
        ),
      },
    ];

    if (
      languageEntry.language === 'flutter' &&
      isReferenceProviderPackage(providerPackageScaffold, provider)
    ) {
      entries.push({
        relativePath: `${languageEntry.workspace}/${directoryPath}/lib/${packageIdentity}.dart`,
        content: renderFlutterReferenceProviderPackageEntrypoint(
          provider,
          providerPackageScaffold,
        ),
      });
    }

    return entries;
  });
}

function renderFlutterReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) => `    MailProviderCatalogEntry(
      providerKey: ${q(provider.providerKey)},
      pluginId: ${q(provider.pluginId)},
      driverId: ${q(provider.driverId)},
      defaultSelected: ${provider.defaultSelected ? 'true' : 'false'},
    )`,
    )
    .join(',\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) => `    MailProviderPackageCatalogEntry(
      providerKey: ${q(entry.providerKey)},
      pluginId: ${q(entry.pluginId)},
      driverId: ${q(entry.driverId)},
      packageIdentity: ${q(entry.packageIdentity)},
      manifestPath: ${q(entry.manifestPath)},
      readmePath: ${q(entry.readmePath)},
      sourcePath: ${q(entry.sourcePath)},
      sourceSymbol: ${q(entry.sourceSymbol)},
      builtin: ${entry.builtin ? 'true' : 'false'},
      rootPublic: ${entry.rootPublic ? 'true' : 'false'},
      status: ${q(entry.status)},
      runtimeBridgeStatus: ${q(entry.runtimeBridgeStatus)},
    )`,
    )
    .join(',\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) => `    MailCapabilityCatalogEntry(
      capabilityKey: ${q(descriptor.capabilityKey)},
      category: ${q(descriptor.category)},
      surface: ${q(descriptor.surface)},
    )`,
    )
    .join(',\n');

  const extensionEntries = extensions
    .map(
      (descriptor) => `        MailProviderExtensionCatalogEntry(
          extensionKey: ${q(descriptor.extensionKey)},
          providerKey: ${q(descriptor.providerKey)},
          displayName: ${q(descriptor.displayName)},
          surface: ${q(descriptor.surface)},
          access: ${q(descriptor.access)},
          status: ${q(descriptor.status)},
        )`,
    )
    .join(',\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
name: ${languageEntry.publicPackage}
description: >
  ${languageEntry.runtimeBridge ? `Flutter Mail runtime baseline for ${languageEntry.publicPackage}.` : `Reserved Flutter package scaffold for ${languageEntry.publicPackage}.`}
  build system: ${languageEntry.packageScaffold.buildSystem}
publish_to: none
version: 0.1.0

environment:
  sdk: ">=3.4.0 <4.0.0"

dependencies:
${renderFlutterRuntimeBaselineDependencies(languageEntry)}

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: false
`),
    },
    {
      relativePath: `${languageEntry.workspace}/analysis_options.yaml`,
      content: renderFlutterRootAnalysisOptions(),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
import 'mail_provider_selection.dart';
import 'mail_types.dart';

abstract interface class MailProviderDriver<TNativeClient> {
  MailProviderMetadata get metadata;
  Future<MailClient<TNativeClient>> connect(MailResolvedClientConfig config);
}

abstract interface class MailClient<TNativeClient> {
  MailProviderMetadata get metadata;
  MailProviderSelection get selection;
  Future<MailSessionDescriptor> join(MailJoinOptions options);
  Future<MailSessionDescriptor> leave();
  Future<MailTrackPublication> publish(MailPublishOptions options);
  Future<void> unpublish(String trackId);
  Future<MailTrackPublication> startScreenShare(MailScreenShareOptions options);
  Future<void> stopScreenShare(String trackId);
  Future<MailMuteState> muteAudio(bool muted);
  Future<MailMuteState> muteVideo(bool muted);
  List<String> getProviderExtensions();
  bool supportsProviderExtension(String extensionKey);
  bool supportsCapability(String capability);
  void requireCapability(String capability);
  TNativeClient unwrap();
}

abstract interface class MailRuntimeController<TNativeClient> {
  Future<MailSessionDescriptor> join(
    MailJoinOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailSessionDescriptor> leave(
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTrackPublication> publish(
    MailPublishOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<void> unpublish(
    String trackId,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailMuteState> muteAudio(
    bool muted,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailMuteState> muteVideo(
    bool muted,
    MailRuntimeControllerContext<TNativeClient> context,
  );
}

abstract interface class MailScreenShareRuntimeController<TNativeClient> {
  Future<MailTrackPublication> startScreenShare(
    MailScreenShareOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<void> stopScreenShare(
    String trackId,
    MailRuntimeControllerContext<TNativeClient> context,
  );
}

final class MailStandardContract {
  static const String symbol = 'MailStandardContract';
  static const List<String> jdbcStyleResolutionTypes = <String>[
    'MailDriverManager',
    'MailDataSource',
  ];
  static const List<String> runtimeSurfaceMethods = <String>[
${renderFlutterRuntimeSurfaceMethodEntries(assembly, '    ')}
  ];
  static const String runtimeSurfaceFailureCode = 'native_sdk_not_available';

  const MailStandardContract._();
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/lib/src/mail_types.dart`,
      content: renderFlutterTypesModule(),
    },
    {
      relativePath: `${languageEntry.workspace}/lib/src/mail_client.dart`,
      content: renderFlutterClientModule(),
    },
    {
      relativePath: `${languageEntry.workspace}/lib/src/mail_runtime_surface.dart`,
      content: renderFlutterRuntimeSurfaceModule(assembly),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
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
  static const String DEFAULT_mail_PROVIDER_KEY = ${q(assembly.defaults?.providerKey ?? 'volcengine')};

  static const List<MailProviderCatalogEntry> entries = <MailProviderCatalogEntry>[
${providerEntries}
  ];

  const MailProviderCatalog._();
}

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
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
${providerPackageEntries}
      ];

  const MailProviderPackageCatalog._();
}

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
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
${capabilityEntries}
  ];

  const MailCapabilityCatalog._();
}

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
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
${extensionEntries}
      ];

  const MailProviderExtensionCatalog._();
}

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
enum MailProviderSelectionSource {
  provider_url,
  provider_key,
  tenant_override,
  deployment_profile,
  default_provider,
}

final class MailProviderSelection {
  const MailProviderSelection({
    required this.providerKey,
    required this.source,
  });

  final String providerKey;
  final MailProviderSelectionSource source;
}

final class MailProviderSelectionRequest {
  const MailProviderSelectionRequest({
    this.providerUrl,
    this.providerKey,
    this.tenantOverrideProviderKey,
    this.deploymentProfileProviderKey,
  });

  final String? providerUrl;
  final String? providerKey;
  final String? tenantOverrideProviderKey;
  final String? deploymentProfileProviderKey;
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: renderReservedLanguageDriverManagerModule(languageEntry.language),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
import 'mail_driver_manager.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_selection.dart';
import 'mail_provider_support.dart';

final class MailDataSourceOptions {
  const MailDataSourceOptions({
    this.providerUrl,
    this.providerKey,
    this.tenantOverrideProviderKey,
    this.deploymentProfileProviderKey,
    this.defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
  });

  final String? providerUrl;
  final String? providerKey;
  final String? tenantOverrideProviderKey;
  final String? deploymentProfileProviderKey;
  final String defaultProviderKey;
}

MailDataSourceOptions _mergeOptions(
  MailDataSourceOptions base,
  MailDataSourceOptions? overrides,
) {
  if (overrides == null) {
    return base;
  }

  return MailDataSourceOptions(
    providerUrl: overrides.providerUrl ?? base.providerUrl,
    providerKey: overrides.providerKey ?? base.providerKey,
    tenantOverrideProviderKey:
        overrides.tenantOverrideProviderKey ?? base.tenantOverrideProviderKey,
    deploymentProfileProviderKey:
        overrides.deploymentProfileProviderKey ?? base.deploymentProfileProviderKey,
    defaultProviderKey: overrides.defaultProviderKey,
  );
}

final class MailDataSource {
  const MailDataSource({
    this.options = const MailDataSourceOptions(),
    this.driverManager = const MailDriverManager(),
  });

  final MailDataSourceOptions options;
  final MailDriverManager driverManager;

  MailProviderSelection describeSelection([MailDataSourceOptions? overrides]) {
    final merged = _mergeOptions(options, overrides);
    return driverManager.resolveSelection(
      MailProviderSelectionRequest(
        providerUrl: merged.providerUrl,
        providerKey: merged.providerKey,
        tenantOverrideProviderKey: merged.tenantOverrideProviderKey,
        deploymentProfileProviderKey: merged.deploymentProfileProviderKey,
      ),
      defaultProviderKey: merged.defaultProviderKey,
    );
  }

  MailProviderSupport describeProviderSupport([MailDataSourceOptions? overrides]) {
    final selection = describeSelection(overrides);
    return driverManager.describeProviderSupport(selection.providerKey);
  }

  List<MailProviderSupport> listProviderSupport() {
    return driverManager.listProviderSupport();
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
enum MailProviderSupportStatus {
  builtin_registered,
  official_registered,
  official_unregistered,
  unknown,
}

final class MailProviderSupport {
  const MailProviderSupport({
    required this.providerKey,
    required this.status,
    required this.builtin,
    required this.official,
    required this.registered,
  });

  final String providerKey;
  final MailProviderSupportStatus status;
  final bool builtin;
  final bool official;
  final bool registered;
}
`),
    },
  ];
}

function renderRustReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `    MailProviderCatalogEntry { providerKey: ${q(provider.providerKey)}, pluginId: ${q(provider.pluginId)}, driverId: ${q(provider.driverId)}, defaultSelected: ${provider.defaultSelected ? 'true' : 'false'} },`,
    )
    .join('\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `    MailProviderPackageCatalogEntry { providerKey: ${q(entry.providerKey)}, pluginId: ${q(entry.pluginId)}, driverId: ${q(entry.driverId)}, packageIdentity: ${q(entry.packageIdentity)}, manifestPath: ${q(entry.manifestPath)}, readmePath: ${q(entry.readmePath)}, sourcePath: ${q(entry.sourcePath)}, sourceSymbol: ${q(entry.sourceSymbol)}, builtin: ${entry.builtin ? 'true' : 'false'}, rootPublic: ${entry.rootPublic ? 'true' : 'false'}, status: ${q(entry.status)}, runtimeBridgeStatus: ${q(entry.runtimeBridgeStatus)} },`,
    )
    .join('\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `    MailCapabilityCatalogEntry { capabilityKey: ${q(descriptor.capabilityKey)}, category: ${q(descriptor.category)}, surface: ${q(descriptor.surface)} },`,
    )
    .join('\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `    MailProviderExtensionCatalogEntry { extensionKey: ${q(descriptor.extensionKey)}, providerKey: ${q(descriptor.providerKey)}, displayName: ${q(descriptor.displayName)}, surface: ${q(descriptor.surface)}, access: ${q(descriptor.access)}, status: ${q(descriptor.status)} },`,
    )
    .join('\n');

  const selectionSources = PROVIDER_SELECTION_SOURCES.map(q).join(',\n    ');
  const supportStatuses = PROVIDER_SUPPORT_STATUSES.map(q).join(',\n    ');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
[package]
name = ${q(languageEntry.publicPackage)}
version = "0.1.0"
edition = "2021"
description = ${q(`Reserved Rust package scaffold for ${languageEntry.publicPackage} with build system: ${languageEntry.packageScaffold.buildSystem}`)}
license = "UNLICENSED"
publish = false

[lib]
path = "src/lib.rs"

[workspace]
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
pub mod capability_catalog;
pub mod data_source;
pub mod driver_manager;
pub mod language_workspace_catalog;
pub mod provider_activation_catalog;
pub mod provider_catalog;
pub mod provider_package_catalog;
pub mod provider_package_loader;
pub mod provider_extension_catalog;
pub mod provider_selection;
pub mod provider_support;

pub struct MailStandardContract;

pub trait MailProviderDriver<TNativeClient> {
    fn provider_key(&self) -> &str;
}

pub trait MailDriverManager<TNativeClient> {
    fn resolve_driver(&self, provider_key: &str);
}

pub trait MailDataSource<TNativeClient> {
    fn create_client(&self);
}

pub trait MailClient<TNativeClient> {
    fn join(&self);
    fn leave(&self);
    fn publish(&self, track_id: &str);
    fn unpublish(&self, track_id: &str);
    fn mute_audio(&self, muted: bool);
    fn mute_video(&self, muted: bool);
    fn unwrap(&self) -> Option<&TNativeClient>;
}

pub trait MailRuntimeController<TNativeClient> {
    fn join(&self);
    fn leave(&self);
    fn publish(&self, track_id: &str);
    fn unpublish(&self, track_id: &str);
    fn mute_audio(&self, muted: bool);
    fn mute_video(&self, muted: bool);
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub defaultSelected: bool,
}

pub struct MailProviderCatalog;

pub const DEFAULT_mail_PROVIDER_KEY: &str = ${q(assembly.defaults?.providerKey ?? 'volcengine')};

pub const OFFICIAL_mail_PROVIDERS: [MailProviderCatalogEntry; ${providers.length}] = [
${providerEntries}
];

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderPackageCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub packageIdentity: &'static str,
    pub manifestPath: &'static str,
    pub readmePath: &'static str,
    pub sourcePath: &'static str,
    pub sourceSymbol: &'static str,
    pub builtin: bool,
    pub rootPublic: bool,
    pub status: &'static str,
    pub runtimeBridgeStatus: &'static str,
}

pub struct MailProviderPackageCatalog;

pub const OFFICIAL_mail_PROVIDER_PACKAGES: [MailProviderPackageCatalogEntry; ${providerPackageCatalogEntries.length}] = [
${providerPackageEntries}
];

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailCapabilityCatalogEntry {
    pub capabilityKey: &'static str,
    pub category: &'static str,
    pub surface: &'static str,
}

pub struct MailCapabilityCatalog;

pub const mail_CAPABILITY_CATALOG: [MailCapabilityCatalogEntry; ${capabilities.length}] = [
${capabilityEntries}
];

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderExtensionCatalogEntry {
    pub extensionKey: &'static str,
    pub providerKey: &'static str,
    pub displayName: &'static str,
    pub surface: &'static str,
    pub access: &'static str,
    pub status: &'static str,
}

pub struct MailProviderExtensionCatalog;

pub const mail_PROVIDER_EXTENSION_SURFACES: [&str; 3] = [
    "control-plane",
    "runtime-bridge",
    "cross-surface",
];

pub const mail_PROVIDER_EXTENSION_ACCESSES: [&str; 2] = [
    "unwrap-only",
    "extension-object",
];

pub const mail_PROVIDER_EXTENSION_STATUSES: [&str; 2] = [
    "reference-baseline",
    "reserved",
];

pub const mail_PROVIDER_EXTENSION_CATALOG: [MailProviderExtensionCatalogEntry; ${extensions.length}] = [
${extensionEntries}
];

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
#[allow(non_snake_case)]
pub struct MailProviderSelection {
    pub providerKey: String,
    pub source: &'static str,
}

#[derive(Default)]
#[allow(non_snake_case)]
pub struct MailProviderSelectionRequest {
    pub providerUrl: Option<String>,
    pub providerKey: Option<String>,
    pub tenantOverrideProviderKey: Option<String>,
    pub deploymentProfileProviderKey: Option<String>,
}

pub const mail_PROVIDER_SELECTION_SOURCES: [&str; ${PROVIDER_SELECTION_SOURCES.length}] = [
    ${selectionSources}
];
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
use crate::provider_catalog::{MailProviderCatalogEntry, DEFAULT_mail_PROVIDER_KEY, OFFICIAL_mail_PROVIDERS};
use crate::provider_selection::{MailProviderSelection, MailProviderSelectionRequest};
use crate::provider_support::MailProviderSupport;

pub struct MailDriverManager;

fn has_text(value: &Option<String>) -> bool {
    value.as_ref().is_some_and(|entry| !entry.trim().is_empty())
}

fn parse_provider_key(provider_url: &str) -> String {
    let trimmed = provider_url.trim();
    if !trimmed.starts_with("Mail:") || !trimmed.contains("://") {
        panic!("Invalid Mail provider URL: {provider_url}");
    }

    trimmed[4..]
        .split("://")
        .next()
        .unwrap_or(DEFAULT_mail_PROVIDER_KEY)
        .to_lowercase()
}

fn as_official_provider(provider_key: &str) -> Option<MailProviderCatalogEntry> {
    OFFICIAL_mail_PROVIDERS
        .iter()
        .copied()
        .find(|entry| entry.providerKey == provider_key)
}

impl MailDriverManager {
    #[allow(non_snake_case)]
    pub fn resolveSelection(
        &self,
        request: &MailProviderSelectionRequest,
        defaultProviderKey: Option<&str>,
    ) -> MailProviderSelection {
        if has_text(&request.providerUrl) {
            return MailProviderSelection {
                providerKey: parse_provider_key(request.providerUrl.as_deref().unwrap()),
                source: "provider_url",
            };
        }

        if has_text(&request.providerKey) {
            return MailProviderSelection {
                providerKey: request.providerKey.as_deref().unwrap().trim().to_string(),
                source: "provider_key",
            };
        }

        if has_text(&request.tenantOverrideProviderKey) {
            return MailProviderSelection {
                providerKey: request
                    .tenantOverrideProviderKey
                    .as_deref()
                    .unwrap()
                    .trim()
                    .to_string(),
                source: "tenant_override",
            };
        }

        if has_text(&request.deploymentProfileProviderKey) {
            return MailProviderSelection {
                providerKey: request
                    .deploymentProfileProviderKey
                    .as_deref()
                    .unwrap()
                    .trim()
                    .to_string(),
                source: "deployment_profile",
            };
        }

        MailProviderSelection {
            providerKey: defaultProviderKey.unwrap_or(DEFAULT_mail_PROVIDER_KEY).to_string(),
            source: "default_provider",
        }
    }

    #[allow(non_snake_case)]
    pub fn describeProviderSupport(&self, providerKey: &str) -> MailProviderSupport {
        if as_official_provider(providerKey).is_some() {
            return MailProviderSupport {
                providerKey: providerKey.to_string(),
                status: "official_unregistered",
                builtin: false,
                official: true,
                registered: false,
            };
        }

        MailProviderSupport {
            providerKey: providerKey.to_string(),
            status: "unknown",
            builtin: false,
            official: false,
            registered: false,
        }
    }

    #[allow(non_snake_case)]
    pub fn listProviderSupport(&self) -> Vec<MailProviderSupport> {
        OFFICIAL_mail_PROVIDERS
            .iter()
            .map(|entry| self.describeProviderSupport(entry.providerKey))
            .collect()
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
use crate::driver_manager::MailDriverManager;
use crate::provider_catalog::DEFAULT_mail_PROVIDER_KEY;
use crate::provider_selection::{MailProviderSelection, MailProviderSelectionRequest};
use crate::provider_support::MailProviderSupport;

#[derive(Clone)]
#[allow(non_snake_case)]
pub struct MailDataSourceOptions {
    pub providerUrl: String,
    pub providerKey: String,
    pub tenantOverrideProviderKey: String,
    pub deploymentProfileProviderKey: String,
    pub defaultProviderKey: String,
}

#[allow(non_snake_case)]
pub struct MailDataSource {
    options: MailDataSourceOptions,
    driverManager: MailDriverManager,
}

impl MailDataSourceOptions {
    pub fn new() -> Self {
        Self {
            providerUrl: String::new(),
            providerKey: String::new(),
            tenantOverrideProviderKey: String::new(),
            deploymentProfileProviderKey: String::new(),
            defaultProviderKey: DEFAULT_mail_PROVIDER_KEY.to_string(),
        }
    }
}

impl Default for MailDataSourceOptions {
    fn default() -> Self {
        Self::new()
    }
}

impl MailDataSource {
    #[allow(non_snake_case)]
    pub fn new(options: MailDataSourceOptions, driverManager: MailDriverManager) -> Self {
        let mut resolved_options = options;
        if resolved_options.defaultProviderKey.trim().is_empty() {
          resolved_options.defaultProviderKey = DEFAULT_mail_PROVIDER_KEY.to_string();
        }

        Self {
            options: resolved_options,
            driverManager,
        }
    }

    #[allow(non_snake_case)]
    fn mergeMailDataSourceOptions(
        base: &MailDataSourceOptions,
        overrides: Option<&MailDataSourceOptions>,
    ) -> MailDataSourceOptions {
        let mut merged = base.clone();
        if let Some(value) = overrides {
            if !value.providerUrl.trim().is_empty() {
                merged.providerUrl = value.providerUrl.clone();
            }
            if !value.providerKey.trim().is_empty() {
                merged.providerKey = value.providerKey.clone();
            }
            if !value.tenantOverrideProviderKey.trim().is_empty() {
                merged.tenantOverrideProviderKey = value.tenantOverrideProviderKey.clone();
            }
            if !value.deploymentProfileProviderKey.trim().is_empty() {
                merged.deploymentProfileProviderKey = value.deploymentProfileProviderKey.clone();
            }
            if !value.defaultProviderKey.trim().is_empty() {
                merged.defaultProviderKey = value.defaultProviderKey.clone();
            }
        }
        merged
    }

    #[allow(non_snake_case)]
    fn describeSelectionInternal(&self, overrides: Option<&MailDataSourceOptions>) -> MailProviderSelection {
        let merged = Self::mergeMailDataSourceOptions(&self.options, overrides);
        self.driverManager.resolveSelection(
            &MailProviderSelectionRequest {
                providerUrl: if merged.providerUrl.trim().is_empty() { None } else { Some(merged.providerUrl) },
                providerKey: if merged.providerKey.trim().is_empty() { None } else { Some(merged.providerKey) },
                tenantOverrideProviderKey: if merged.tenantOverrideProviderKey.trim().is_empty() { None } else { Some(merged.tenantOverrideProviderKey) },
                deploymentProfileProviderKey: if merged.deploymentProfileProviderKey.trim().is_empty() { None } else { Some(merged.deploymentProfileProviderKey) },
            },
            Some(merged.defaultProviderKey.as_str()),
        )
    }

    #[allow(non_snake_case)]
    pub fn describeSelection(&self, overrides: Option<&MailDataSourceOptions>) -> MailProviderSelection {
        self.describeSelectionInternal(overrides)
    }

    #[allow(non_snake_case)]
    pub fn describeProviderSupport(&self, overrides: Option<&MailDataSourceOptions>) -> MailProviderSupport {
        let selection = self.describeSelectionInternal(overrides);
        self.driverManager.describeProviderSupport(selection.providerKey.as_str())
    }

    #[allow(non_snake_case)]
    pub fn listProviderSupport(&self) -> Vec<MailProviderSupport> {
        self.driverManager.listProviderSupport()
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
#[allow(non_snake_case)]
pub struct MailProviderSupport {
    pub providerKey: String,
    pub status: &'static str,
    pub builtin: bool,
    pub official: bool,
    pub registered: bool,
}

pub const mail_PROVIDER_SUPPORT_STATUSES: [&str; ${PROVIDER_SUPPORT_STATUSES.length}] = [
    ${supportStatuses}
];
`),
    },
  ];
}

function renderJavaReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `      new Entry(${q(provider.providerKey)}, ${q(provider.pluginId)}, ${q(provider.driverId)}, ${provider.defaultSelected ? 'true' : 'false'})`,
    )
    .join(',\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `      new MailProviderPackageCatalogEntry(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.packageIdentity)}, ${q(entry.manifestPath)}, ${q(entry.readmePath)}, ${q(entry.sourcePath)}, ${q(entry.sourceSymbol)}, ${entry.builtin ? 'true' : 'false'}, ${entry.rootPublic ? 'true' : 'false'}, ${q(entry.status)}, ${q(entry.runtimeBridgeStatus)})`,
    )
    .join(',\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `      new Entry(${q(descriptor.capabilityKey)}, ${q(descriptor.category)}, ${q(descriptor.surface)})`,
    )
    .join(',\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `      new Entry(${q(descriptor.extensionKey)}, ${q(descriptor.providerKey)}, ${q(descriptor.displayName)}, ${q(descriptor.surface)}, ${q(descriptor.access)}, ${q(descriptor.status)})`,
    )
    .join(',\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.sdkwork</groupId>
  <artifactId>Mail-sdk</artifactId>
  <version>0.1.0</version>
  <packaging>jar</packaging>
  <name>${languageEntry.publicPackage}</name>
  <description>Reserved Java package scaffold for ${languageEntry.publicPackage} with build system: ${languageEntry.packageScaffold.buildSystem}</description>
</project>
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
package com.sdkwork.Mail.standard;

public final class MailStandardContract {

  private MailStandardContract() {
  }

  public interface MailProviderDriver<TNativeClient> {
    String providerKey();

    MailClient<TNativeClient> createClient();
  }

  public interface MailDriverManager<TNativeClient> {
    MailProviderDriver<TNativeClient> resolveDriver(String providerKey);
  }

  public interface MailDataSource<TNativeClient> {
    MailClient<TNativeClient> createClient();
  }

  public interface MailClient<TNativeClient> {
    void join();

    void leave();

    void publish(String trackId);

    void unpublish(String trackId);

    void muteAudio(boolean muted);

    void muteVideo(boolean muted);

    TNativeClient unwrap();
  }

  public interface MailRuntimeController<TNativeClient> {
    void join();

    void leave();

    void publish(String trackId);

    void unpublish(String trackId);

    void muteAudio(boolean muted);

    void muteVideo(boolean muted);
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderCatalog {

  public static final String DEFAULT_mail_PROVIDER_KEY = ${q(assembly.defaults?.providerKey ?? 'volcengine')};

  public static final List<Entry> ENTRIES = List.of(
${providerEntries}
  );

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}

  private MailProviderCatalog() {
  }

  public record Entry(String providerKey, String pluginId, String driverId, boolean defaultSelected) {
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderPackageCatalog {

  public static final List<MailProviderPackageCatalogEntry> ENTRIES = List.of(
${providerPackageEntries}
  );

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}

  private MailProviderPackageCatalog() {
  }

  public record MailProviderPackageCatalogEntry(
      String providerKey,
      String pluginId,
      String driverId,
      String packageIdentity,
      String manifestPath,
      String readmePath,
      String sourcePath,
      String sourceSymbol,
      boolean builtin,
      boolean rootPublic,
      String status,
      String runtimeBridgeStatus
  ) {
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailCapabilityCatalog {

  public static final List<Entry> ENTRIES = List.of(
${capabilityEntries}
  );

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}

  private MailCapabilityCatalog() {
  }

  public record Entry(String capabilityKey, String category, String surface) {
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public final class MailProviderExtensionCatalog {

  public static final List<String> RECOGNIZED_SURFACES = List.of(
      "control-plane",
      "runtime-bridge",
      "cross-surface"
  );

  public static final List<String> RECOGNIZED_ACCESSES = List.of(
      "unwrap-only",
      "extension-object"
  );

  public static final List<String> RECOGNIZED_STATUSES = List.of(
      "reference-baseline",
      "reserved"
  );

  public static final List<Entry> ENTRIES = List.of(
${extensionEntries}
  );

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}

  private MailProviderExtensionCatalog() {
  }

  public record Entry(
      String extensionKey,
      String providerKey,
      String displayName,
      String surface,
      String access,
      String status
  ) {
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

public record MailProviderSelection(String providerKey, Source source) {

  public enum Source {
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider
  }

  public record Request(
      String providerUrl,
      String providerKey,
      String tenantOverrideProviderKey,
      String deploymentProfileProviderKey
  ) {
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;

public final class MailDriverManager {

  public MailProviderSelection resolveSelection(MailProviderSelection.Request request) {
    return resolveSelection(request, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public MailProviderSelection resolveSelection(
      MailProviderSelection.Request request,
      String defaultProviderKey
  ) {
    if (hasText(request.providerUrl())) {
      return new MailProviderSelection(
          parseProviderKey(request.providerUrl()),
          MailProviderSelection.Source.provider_url
      );
    }

    if (hasText(request.providerKey())) {
      return new MailProviderSelection(
          request.providerKey().trim(),
          MailProviderSelection.Source.provider_key
      );
    }

    if (hasText(request.tenantOverrideProviderKey())) {
      return new MailProviderSelection(
          request.tenantOverrideProviderKey().trim(),
          MailProviderSelection.Source.tenant_override
      );
    }

    if (hasText(request.deploymentProfileProviderKey())) {
      return new MailProviderSelection(
          request.deploymentProfileProviderKey().trim(),
          MailProviderSelection.Source.deployment_profile
      );
    }

    return new MailProviderSelection(
        defaultProviderKey,
        MailProviderSelection.Source.default_provider
    );
  }

  public MailProviderSupport describeProviderSupport(String providerKey) {
    var officialProvider = MailProviderCatalog.ENTRIES.stream()
        .anyMatch(entry -> entry.providerKey().equals(providerKey));

    if (officialProvider) {
      return new MailProviderSupport(
          providerKey,
          MailProviderSupport.Status.official_unregistered,
          false,
          true,
          false
      );
    }

    return new MailProviderSupport(
        providerKey,
        MailProviderSupport.Status.unknown,
        false,
        false,
        false
    );
  }

  public List<MailProviderSupport> listProviderSupport() {
    return MailProviderCatalog.ENTRIES.stream()
        .map(entry -> describeProviderSupport(entry.providerKey()))
        .toList();
  }

  private static boolean hasText(String value) {
    return value != null && !value.trim().isEmpty();
  }

  private static String parseProviderKey(String providerUrl) {
    var trimmed = providerUrl.trim();
    if (!trimmed.startsWith("Mail:") || !trimmed.contains("://")) {
      throw new IllegalArgumentException("Invalid Mail provider URL: " + providerUrl);
    }

    return trimmed.substring(4, trimmed.indexOf("://")).toLowerCase();
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

public final class MailDataSource {

  private final MailDataSourceOptions options;
  private final MailDriverManager driverManager;

  public MailDataSource() {
    this(new MailDataSourceOptions(), new MailDriverManager());
  }

  public MailDataSource(MailDataSourceOptions options, MailDriverManager driverManager) {
    this.options = options;
    this.driverManager = driverManager;
  }

  public MailProviderSelection describeSelection() {
    return describeSelection(null);
  }

  public MailProviderSelection describeSelection(MailDataSourceOptions overrides) {
    var merged = merge(options, overrides);
    return driverManager.resolveSelection(
        new MailProviderSelection.Request(
            merged.providerUrl(),
            merged.providerKey(),
            merged.tenantOverrideProviderKey(),
            merged.deploymentProfileProviderKey()
        ),
        merged.defaultProviderKey()
    );
  }

  public MailProviderSupport describeProviderSupport() {
    return describeProviderSupport(null);
  }

  public MailProviderSupport describeProviderSupport(MailDataSourceOptions overrides) {
    return driverManager.describeProviderSupport(describeSelection(overrides).providerKey());
  }

  public java.util.List<MailProviderSupport> listProviderSupport() {
    return driverManager.listProviderSupport();
  }

  private static MailDataSourceOptions merge(
      MailDataSourceOptions base,
      MailDataSourceOptions overrides
  ) {
    if (overrides == null) {
      return base;
    }

    return new MailDataSourceOptions(
        overrides.providerUrl() != null ? overrides.providerUrl() : base.providerUrl(),
        overrides.providerKey() != null ? overrides.providerKey() : base.providerKey(),
        overrides.tenantOverrideProviderKey() != null
            ? overrides.tenantOverrideProviderKey()
            : base.tenantOverrideProviderKey(),
        overrides.deploymentProfileProviderKey() != null
            ? overrides.deploymentProfileProviderKey()
            : base.deploymentProfileProviderKey(),
        overrides.defaultProviderKey() != null && !overrides.defaultProviderKey().isBlank()
            ? overrides.defaultProviderKey()
            : base.defaultProviderKey()
    );
  }

  public record MailDataSourceOptions(
      String providerUrl,
      String providerKey,
      String tenantOverrideProviderKey,
      String deploymentProfileProviderKey,
      String defaultProviderKey
  ) {
    public MailDataSourceOptions() {
      this(null, null, null, null, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
    }
  }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata;

public record MailProviderSupport(
    String providerKey,
    Status status,
    boolean builtin,
    boolean official,
    boolean registered
) {

  public enum Status {
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown
  }
}
`),
    },
  ];
}

function renderCsharpReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `        new(${q(provider.providerKey)}, ${q(provider.pluginId)}, ${q(provider.driverId)}, ${provider.defaultSelected ? 'true' : 'false'}),`,
    )
    .join('\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `        new(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.packageIdentity)}, ${q(entry.manifestPath)}, ${q(entry.readmePath)}, ${q(entry.sourcePath)}, ${q(entry.sourceSymbol)}, ${entry.builtin ? 'true' : 'false'}, ${entry.rootPublic ? 'true' : 'false'}, ${q(entry.status)}, ${q(entry.runtimeBridgeStatus)}),`,
    )
    .join('\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `        new(${q(descriptor.capabilityKey)}, ${q(descriptor.category)}, ${q(descriptor.surface)}),`,
    )
    .join('\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `        new(${q(descriptor.extensionKey)}, ${q(descriptor.providerKey)}, ${q(descriptor.displayName)}, ${q(descriptor.surface)}, ${q(descriptor.access)}, ${q(descriptor.status)}),`,
    )
    .join('\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <PackageId>${languageEntry.publicPackage}</PackageId>
    <AssemblyName>${languageEntry.publicPackage}</AssemblyName>
    <Description>Reserved C# package scaffold for ${languageEntry.publicPackage} with build system: ${languageEntry.packageScaffold.buildSystem}</Description>
  </PropertyGroup>
</Project>
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

public static class MailStandardContract
{
    public const string Symbol = "MailStandardContract";
}

public interface MailProviderDriver<TNativeClient>
{
    string ProviderKey { get; }

    MailClient<TNativeClient> CreateClient();
}

public interface MailDriverManager<TNativeClient>
{
    MailProviderDriver<TNativeClient> ResolveDriver(string providerKey);
}

public interface MailDataSource<TNativeClient>
{
    MailClient<TNativeClient> CreateClient();
}

public interface MailClient<TNativeClient>
{
    void Join();

    void Leave();

    void Publish(string trackId);

    void Unpublish(string trackId);

    void MuteAudio(bool muted);

    void MuteVideo(bool muted);

    TNativeClient? Unwrap();
}

public interface MailRuntimeController<TNativeClient>
{
    void Join();

    void Leave();

    void Publish(string trackId);

    void Unpublish(string trackId);

    void MuteAudio(bool muted);

    void MuteVideo(bool muted);
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed record MailProviderCatalogEntry(
    string providerKey,
    string pluginId,
    string driverId,
    bool defaultSelected
);

public static class MailProviderCatalog
{
    public const string DEFAULT_mail_PROVIDER_KEY = ${q(assembly.defaults?.providerKey ?? 'volcengine')};

    public static readonly IReadOnlyList<MailProviderCatalogEntry> Entries =
    [
${providerEntries}
    ];

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed record MailProviderPackageCatalogEntry(
    string providerKey,
    string pluginId,
    string driverId,
    string packageIdentity,
    string manifestPath,
    string readmePath,
    string sourcePath,
    string sourceSymbol,
    bool builtin,
    bool rootPublic,
    string status,
    string runtimeBridgeStatus
);

public static class MailProviderPackageCatalog
{
    public static readonly IReadOnlyList<MailProviderPackageCatalogEntry> Entries =
    [
${providerPackageEntries}
    ];

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

using System.Collections.Generic;
using System.Linq;

public sealed record MailCapabilityCatalogEntry(
    string capabilityKey,
    string category,
    string surface
);

public static class MailCapabilityCatalog
{
    public static readonly IReadOnlyList<MailCapabilityCatalogEntry> Entries =
    [
${capabilityEntries}
    ];

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

using System.Collections.Generic;
using System.Linq;

public sealed record MailProviderExtensionCatalogEntry(
    string extensionKey,
    string providerKey,
    string displayName,
    string surface,
    string access,
    string status
);

public static class MailProviderExtensionCatalog
{
    public static readonly IReadOnlyList<string> RecognizedSurfaces =
    [
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    ];

    public static readonly IReadOnlyList<string> RecognizedAccessModes =
    [
        "unwrap-only",
        "extension-object",
    ];

    public static readonly IReadOnlyList<string> RecognizedStatuses =
    [
        "reference-baseline",
        "reserved",
    ];

    public static readonly IReadOnlyList<MailProviderExtensionCatalogEntry> Entries =
    [
${extensionEntries}
    ];

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

public enum Source
{
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider,
}

public sealed record MailProviderSelection(string providerKey, Source source);

public sealed record Request(
    string? providerUrl = null,
    string? providerKey = null,
    string? tenantOverrideProviderKey = null,
    string? deploymentProfileProviderKey = null
);
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

public sealed class MailDriverManager
{
    public MailProviderSelection ResolveSelection(
        Request? request = null,
        string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    )
    {
        return resolveSelection(request, defaultProviderKey);
    }

    public MailProviderSupport DescribeProviderSupport(string providerKey)
    {
        return describeProviderSupport(providerKey);
    }

    public IReadOnlyList<MailProviderSupport> ListProviderSupport()
    {
        return listProviderSupport();
    }

    private static MailProviderSelection resolveSelection(
        Request? request,
        string defaultProviderKey
    )
    {
        request ??= new Request();

        if (HasText(request.providerUrl))
        {
            return new MailProviderSelection(
                parseProviderKey(request.providerUrl!),
                Source.provider_url
            );
        }

        if (HasText(request.providerKey))
        {
            return new MailProviderSelection(request.providerKey!.Trim(), Source.provider_key);
        }

        if (HasText(request.tenantOverrideProviderKey))
        {
            return new MailProviderSelection(
                request.tenantOverrideProviderKey!.Trim(),
                Source.tenant_override
            );
        }

        if (HasText(request.deploymentProfileProviderKey))
        {
            return new MailProviderSelection(
                request.deploymentProfileProviderKey!.Trim(),
                Source.deployment_profile
            );
        }

        return new MailProviderSelection(defaultProviderKey, Source.default_provider);
    }

    private static MailProviderSupport describeProviderSupport(string providerKey)
    {
        var official = MailProviderCatalog.Entries.Any(entry => entry.providerKey == providerKey);
        if (official)
        {
            return new MailProviderSupport(
                providerKey,
                MailProviderSupportStatus.official_unregistered,
                false,
                true,
                false
            );
        }

        return new MailProviderSupport(
            providerKey,
            MailProviderSupportStatus.unknown,
            false,
            false,
            false
        );
    }

    private static IReadOnlyList<MailProviderSupport> listProviderSupport()
    {
        return MailProviderCatalog.Entries
            .Select(entry => describeProviderSupport(entry.providerKey))
            .ToArray();
    }

    private static bool HasText(string? value) => !string.IsNullOrWhiteSpace(value);

    private static string parseProviderKey(string providerUrl)
    {
        var trimmed = providerUrl.Trim();
        if (!trimmed.StartsWith("Mail:", StringComparison.OrdinalIgnoreCase) || !trimmed.Contains("://", StringComparison.Ordinal))
        {
            throw new ArgumentException($"Invalid Mail provider URL: {providerUrl}", nameof(providerUrl));
        }

        return trimmed[4..trimmed.IndexOf("://", StringComparison.Ordinal)].ToLowerInvariant();
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

public sealed record MailDataSourceOptions(
    string? providerUrl = null,
    string? providerKey = null,
    string? tenantOverrideProviderKey = null,
    string? deploymentProfileProviderKey = null,
    string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
);

public sealed class MailDataSource
{
    private readonly MailDataSourceOptions _options;
    private readonly MailDriverManager _driverManager;

    public MailDataSource(
        MailDataSourceOptions? options = null,
        MailDriverManager? driverManager = null
    )
    {
        _options = options ?? new MailDataSourceOptions();
        _driverManager = driverManager ?? new MailDriverManager();
    }

    public MailProviderSelection DescribeSelection(MailDataSourceOptions? overrides = null)
    {
        return describeSelection(overrides);
    }

    public MailProviderSupport DescribeProviderSupport(MailDataSourceOptions? overrides = null)
    {
        return describeProviderSupport(overrides);
    }

    public IReadOnlyList<MailProviderSupport> ListProviderSupport()
    {
        return listProviderSupport();
    }

    private MailProviderSelection describeSelection(MailDataSourceOptions? overrides)
    {
        var merged = merge(_options, overrides);
        return _driverManager.ResolveSelection(
            new Request(
                merged.providerUrl,
                merged.providerKey,
                merged.tenantOverrideProviderKey,
                merged.deploymentProfileProviderKey
            ),
            merged.defaultProviderKey
        );
    }

    private MailProviderSupport describeProviderSupport(MailDataSourceOptions? overrides)
    {
        return _driverManager.DescribeProviderSupport(describeSelection(overrides).providerKey);
    }

    private IReadOnlyList<MailProviderSupport> listProviderSupport()
    {
        return _driverManager.ListProviderSupport();
    }

    private static MailDataSourceOptions merge(
        MailDataSourceOptions baseOptions,
        MailDataSourceOptions? overrides
    )
    {
        if (overrides is null)
        {
            return baseOptions;
        }

        return new MailDataSourceOptions(
            overrides.providerUrl ?? baseOptions.providerUrl,
            overrides.providerKey ?? baseOptions.providerKey,
            overrides.tenantOverrideProviderKey ?? baseOptions.tenantOverrideProviderKey,
            overrides.deploymentProfileProviderKey ?? baseOptions.deploymentProfileProviderKey,
            string.IsNullOrWhiteSpace(overrides.defaultProviderKey)
                ? baseOptions.defaultProviderKey
                : overrides.defaultProviderKey
        );
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
namespace Sdkwork.Mail.Sdk;

public enum MailProviderSupportStatus
{
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown,
}

public sealed record MailProviderSupport(
    string providerKey,
    MailProviderSupportStatus status,
    bool builtin,
    bool official,
    bool registered
);
`),
    },
  ];
}

function renderSwiftReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `        .init(providerKey: ${q(provider.providerKey)}, pluginId: ${q(provider.pluginId)}, driverId: ${q(provider.driverId)}, defaultSelected: ${provider.defaultSelected ? 'true' : 'false'}),`,
    )
    .join('\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `        .init(providerKey: ${q(entry.providerKey)}, pluginId: ${q(entry.pluginId)}, driverId: ${q(entry.driverId)}, packageIdentity: ${q(entry.packageIdentity)}, manifestPath: ${q(entry.manifestPath)}, readmePath: ${q(entry.readmePath)}, sourcePath: ${q(entry.sourcePath)}, sourceSymbol: ${q(entry.sourceSymbol)}, builtin: ${entry.builtin ? 'true' : 'false'}, rootPublic: ${entry.rootPublic ? 'true' : 'false'}, status: ${q(entry.status)}, runtimeBridgeStatus: ${q(entry.runtimeBridgeStatus)}),`,
    )
    .join('\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `        .init(capabilityKey: ${q(descriptor.capabilityKey)}, category: ${q(descriptor.category)}, surface: ${q(descriptor.surface)}),`,
    )
    .join('\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `        .init(extensionKey: ${q(descriptor.extensionKey)}, providerKey: ${q(descriptor.providerKey)}, displayName: ${q(descriptor.displayName)}, surface: ${q(descriptor.surface)}, access: ${q(descriptor.access)}, status: ${q(descriptor.status)}),`,
    )
    .join('\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MailSdk",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
    ],
    products: [
        .library(
            name: "MailSdk",
            targets: ["MailSdk"]
        ),
    ],
    targets: [
        .target(
            name: "MailSdk",
            path: "Sources/MailSdk"
        ),
    ]
)

// build system: ${languageEntry.packageScaffold.buildSystem}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
public enum MailStandardContract {
    public static let symbol = "MailStandardContract"
}

public protocol MailProviderDriver {
    var providerKey: String { get }
}

public protocol MailDriverManager {
    func resolveDriver(providerKey: String)
}

public protocol MailDataSource {
    func createClient() async throws
}

public protocol MailClient {
    func join() async throws
    func leave() async throws
    func publish(trackId: String) async throws
    func unpublish(trackId: String) async throws
    func muteAudio(muted: Bool) async throws
    func muteVideo(muted: Bool) async throws
    func unwrap() -> Any?
}

public protocol MailRuntimeController {
    func join() async throws
    func leave() async throws
    func publish(trackId: String) async throws
    func unpublish(trackId: String) async throws
    func muteAudio(muted: Bool) async throws
    func muteVideo(muted: Bool) async throws
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
public struct MailProviderCatalogEntry {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
    public let defaultSelected: Bool
}

public enum MailProviderCatalog {
    public static let DEFAULT_mail_PROVIDER_KEY: String = ${q(assembly.defaults?.providerKey ?? 'volcengine')}

    public static let entries: [MailProviderCatalogEntry] = [
${providerEntries}
    ]

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
public struct MailProviderPackageCatalogEntry {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
    public let packageIdentity: String
    public let manifestPath: String
    public let readmePath: String
    public let sourcePath: String
    public let sourceSymbol: String
    public let builtin: Bool
    public let rootPublic: Bool
    public let status: String
    public let runtimeBridgeStatus: String
}

public enum MailProviderPackageCatalog {
    public static let entries: [MailProviderPackageCatalogEntry] = [
${providerPackageEntries}
    ]

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
public struct MailCapabilityCatalogEntry {
    public let capabilityKey: String
    public let category: String
    public let surface: String
}

public enum MailCapabilityCatalog {
    public static let entries: [MailCapabilityCatalogEntry] = [
${capabilityEntries}
    ]

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
public struct MailProviderExtensionCatalogEntry {
    public let extensionKey: String
    public let providerKey: String
    public let displayName: String
    public let surface: String
    public let access: String
    public let status: String
}

public enum MailProviderExtensionCatalog {
    public static let recognizedSurfaces: [String] = [
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    ]

    public static let recognizedAccessModes: [String] = [
        "unwrap-only",
        "extension-object",
    ]

    public static let recognizedStatuses: [String] = [
        "reference-baseline",
        "reserved",
    ]

    public static let entries: [MailProviderExtensionCatalogEntry] = [
${extensionEntries}
    ]

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
public enum Source: String {
    case provider_url = "provider_url"
    case provider_key = "provider_key"
    case tenant_override = "tenant_override"
    case deployment_profile = "deployment_profile"
    case default_provider = "default_provider"
}

public struct MailProviderSelection {
    public let providerKey: String
    public let source: Source
}

public struct Request {
    public let providerUrl: String?
    public let providerKey: String?
    public let tenantOverrideProviderKey: String?
    public let deploymentProfileProviderKey: String?
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
public struct MailDriverManager {
    public init() {}

    public func resolveSelection(
        request: Request = Request(providerUrl: nil, providerKey: nil, tenantOverrideProviderKey: nil, deploymentProfileProviderKey: nil),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) -> MailProviderSelection {
        if let providerUrl = request.providerUrl, hasText(providerUrl) {
            return MailProviderSelection(
                providerKey: parseProviderKey(providerUrl),
                source: .provider_url
            )
        }

        if let providerKey = request.providerKey, hasText(providerKey) {
            return MailProviderSelection(
                providerKey: providerKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .provider_key
            )
        }

        if let tenantOverrideProviderKey = request.tenantOverrideProviderKey, hasText(tenantOverrideProviderKey) {
            return MailProviderSelection(
                providerKey: tenantOverrideProviderKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .tenant_override
            )
        }

        if let deploymentProfileProviderKey = request.deploymentProfileProviderKey, hasText(deploymentProfileProviderKey) {
            return MailProviderSelection(
                providerKey: deploymentProfileProviderKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .deployment_profile
            )
        }

        return MailProviderSelection(
            providerKey: defaultProviderKey,
            source: .default_provider
        )
    }

    public func describeProviderSupport(providerKey: String) -> MailProviderSupport {
        let official = MailProviderCatalog.entries.contains { $0.providerKey == providerKey }
        if official {
            return MailProviderSupport(
                providerKey: providerKey,
                status: .official_unregistered,
                builtin: false,
                official: true,
                registered: false
            )
        }

        return MailProviderSupport(
            providerKey: providerKey,
            status: .unknown,
            builtin: false,
            official: false,
            registered: false
        )
    }

    public func listProviderSupport() -> [MailProviderSupport] {
        MailProviderCatalog.entries.map { describeProviderSupport(providerKey: $0.providerKey) }
    }

    private func hasText(_ value: String) -> Bool {
        !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func parseProviderKey(_ providerUrl: String) -> String {
        let trimmed = providerUrl.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasPrefix("Mail:"), let delimiter = trimmed.range(of: "://") else {
            fatalError("Invalid Mail provider URL: \\(providerUrl)")
        }

        return String(trimmed[trimmed.index(trimmed.startIndex, offsetBy: 4)..<delimiter.lowerBound]).lowercased()
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
public struct MailDataSourceOptions {
    public let providerUrl: String?
    public let providerKey: String?
    public let tenantOverrideProviderKey: String?
    public let deploymentProfileProviderKey: String?
    public let defaultProviderKey: String

    public init(
        providerUrl: String? = nil,
        providerKey: String? = nil,
        tenantOverrideProviderKey: String? = nil,
        deploymentProfileProviderKey: String? = nil,
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) {
        self.providerUrl = providerUrl
        self.providerKey = providerKey
        self.tenantOverrideProviderKey = tenantOverrideProviderKey
        self.deploymentProfileProviderKey = deploymentProfileProviderKey
        self.defaultProviderKey = defaultProviderKey
    }
}

public struct MailDataSource {
    public let options: MailDataSourceOptions
    public let driverManager: MailDriverManager

    public init(
        options: MailDataSourceOptions = MailDataSourceOptions(),
        driverManager: MailDriverManager = MailDriverManager()
    ) {
        self.options = options
        self.driverManager = driverManager
    }

    public func describeSelection(_ overrides: MailDataSourceOptions? = nil) -> MailProviderSelection {
        let merged = merge(options, overrides)
        return driverManager.resolveSelection(
            request: Request(
                providerUrl: merged.providerUrl,
                providerKey: merged.providerKey,
                tenantOverrideProviderKey: merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey: merged.deploymentProfileProviderKey
            ),
            defaultProviderKey: merged.defaultProviderKey
        )
    }

    public func describeProviderSupport(_ overrides: MailDataSourceOptions? = nil) -> MailProviderSupport {
        let selection = describeSelection(overrides)
        return driverManager.describeProviderSupport(providerKey: selection.providerKey)
    }

    public func listProviderSupport() -> [MailProviderSupport] {
        driverManager.listProviderSupport()
    }

    private func merge(_ base: MailDataSourceOptions, _ overrides: MailDataSourceOptions?) -> MailDataSourceOptions {
        guard let overrides else {
            return base
        }

        return MailDataSourceOptions(
            providerUrl: overrides.providerUrl ?? base.providerUrl,
            providerKey: overrides.providerKey ?? base.providerKey,
            tenantOverrideProviderKey: overrides.tenantOverrideProviderKey ?? base.tenantOverrideProviderKey,
            deploymentProfileProviderKey: overrides.deploymentProfileProviderKey ?? base.deploymentProfileProviderKey,
            defaultProviderKey: overrides.defaultProviderKey.isEmpty ? base.defaultProviderKey : overrides.defaultProviderKey
        )
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
public enum MailProviderSupportStatus: String {
    case builtin_registered = "builtin_registered"
    case official_registered = "official_registered"
    case official_unregistered = "official_unregistered"
    case unknown = "unknown"
}

public struct MailProviderSupport {
    public let providerKey: String
    public let status: MailProviderSupportStatus
    public let builtin: Bool
    public let official: Bool
    public let registered: Bool
}
`),
    },
  ];
}

function renderKotlinReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `        MailProviderCatalogEntry(${q(provider.providerKey)}, ${q(provider.pluginId)}, ${q(provider.driverId)}, ${provider.defaultSelected ? 'true' : 'false'}),`,
    )
    .join('\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `        MailProviderPackageCatalogEntry(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.packageIdentity)}, ${q(entry.manifestPath)}, ${q(entry.readmePath)}, ${q(entry.sourcePath)}, ${q(entry.sourceSymbol)}, ${entry.builtin ? 'true' : 'false'}, ${entry.rootPublic ? 'true' : 'false'}, ${q(entry.status)}, ${q(entry.runtimeBridgeStatus)}),`,
    )
    .join('\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `        MailCapabilityCatalogEntry(${q(descriptor.capabilityKey)}, ${q(descriptor.category)}, ${q(descriptor.surface)}),`,
    )
    .join('\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `        MailProviderExtensionCatalogEntry(${q(descriptor.extensionKey)}, ${q(descriptor.providerKey)}, ${q(descriptor.displayName)}, ${q(descriptor.surface)}, ${q(descriptor.access)}, ${q(descriptor.status)}),`,
    )
    .join('\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
plugins {
    base
}

group = "com.sdkwork"
version = "0.1.0"
description = "Reserved Kotlin package scaffold for ${languageEntry.publicPackage} with build system: ${languageEntry.packageScaffold.buildSystem}"

extra["sdkworkPublicPackage"] = "${languageEntry.publicPackage}"

base {
    archivesName.set("Mail-sdk")
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
package com.sdkwork.Mail.standard

object MailStandardContract {
    const val SYMBOL: String = "MailStandardContract"
}

interface MailProviderDriver<TNativeClient> {
    val providerKey: String

    fun createClient(): MailClient<TNativeClient>
}

interface MailDriverManager<TNativeClient> {
    fun resolveDriver(providerKey: String): MailProviderDriver<TNativeClient>
}

interface MailDataSource<TNativeClient> {
    fun createClient(): MailClient<TNativeClient>
}

interface MailClient<TNativeClient> {
    fun join()

    fun leave()

    fun publish(trackId: String)

    fun unpublish(trackId: String)

    fun muteAudio(muted: Boolean)

    fun muteVideo(muted: Boolean)

    fun unwrap(): TNativeClient?
}

interface MailRuntimeController<TNativeClient> {
    fun join()

    fun leave()

    fun publish(trackId: String)

    fun unpublish(trackId: String)

    fun muteAudio(muted: Boolean)

    fun muteVideo(muted: Boolean)
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

data class MailProviderCatalogEntry(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
    val defaultSelected: Boolean,
)

object MailProviderCatalog {
    const val DEFAULT_mail_PROVIDER_KEY: String = ${q(assembly.defaults?.providerKey ?? 'volcengine')}

    val entries: List<MailProviderCatalogEntry> = listOf(
${providerEntries}
    )

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

data class MailProviderPackageCatalogEntry(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
    val packageIdentity: String,
    val manifestPath: String,
    val readmePath: String,
    val sourcePath: String,
    val sourceSymbol: String,
    val builtin: Boolean,
    val rootPublic: Boolean,
    val status: String,
    val runtimeBridgeStatus: String,
)

object MailProviderPackageCatalog {
    val entries: List<MailProviderPackageCatalogEntry> = listOf(
${providerPackageEntries}
    )

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

data class MailCapabilityCatalogEntry(
    val capabilityKey: String,
    val category: String,
    val surface: String,
)

object MailCapabilityCatalog {
    val entries: List<MailCapabilityCatalogEntry> = listOf(
${capabilityEntries}
    )

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

data class MailProviderExtensionCatalogEntry(
    val extensionKey: String,
    val providerKey: String,
    val displayName: String,
    val surface: String,
    val access: String,
    val status: String,
)

object MailProviderExtensionCatalog {
    val recognizedSurfaces: List<String> = listOf(
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    )

    val recognizedAccessModes: List<String> = listOf(
        "unwrap-only",
        "extension-object",
    )

    val recognizedStatuses: List<String> = listOf(
        "reference-baseline",
        "reserved",
    )

    val entries: List<MailProviderExtensionCatalogEntry> = listOf(
${extensionEntries}
    )

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

enum class Source {
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider,
}

data class MailProviderSelection(
    val providerKey: String,
    val source: Source,
)

data class Request(
    val providerUrl: String? = null,
    val providerKey: String? = null,
    val tenantOverrideProviderKey: String? = null,
    val deploymentProfileProviderKey: String? = null,
)
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

class MailDriverManager {
    fun resolveSelection(
        request: Request = Request(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    ): MailProviderSelection {
        if (hasText(request.providerUrl)) {
            return MailProviderSelection(
                providerKey = parseProviderKey(request.providerUrl!!),
                source = Source.provider_url,
            )
        }

        if (hasText(request.providerKey)) {
            return MailProviderSelection(
                providerKey = request.providerKey!!.trim(),
                source = Source.provider_key,
            )
        }

        if (hasText(request.tenantOverrideProviderKey)) {
            return MailProviderSelection(
                providerKey = request.tenantOverrideProviderKey!!.trim(),
                source = Source.tenant_override,
            )
        }

        if (hasText(request.deploymentProfileProviderKey)) {
            return MailProviderSelection(
                providerKey = request.deploymentProfileProviderKey!!.trim(),
                source = Source.deployment_profile,
            )
        }

        return MailProviderSelection(
            providerKey = defaultProviderKey,
            source = Source.default_provider,
        )
    }

    fun describeProviderSupport(providerKey: String): MailProviderSupport {
        val official = MailProviderCatalog.entries.any { it.providerKey == providerKey }
        if (official) {
            return MailProviderSupport(
                providerKey = providerKey,
                status = MailProviderSupportStatus.official_unregistered,
                builtin = false,
                official = true,
                registered = false,
            )
        }

        return MailProviderSupport(
            providerKey = providerKey,
            status = MailProviderSupportStatus.unknown,
            builtin = false,
            official = false,
            registered = false,
        )
    }

    fun listProviderSupport(): List<MailProviderSupport> {
        return MailProviderCatalog.entries.map { describeProviderSupport(it.providerKey) }
    }

    private fun hasText(value: String?): Boolean = value != null && value.isNotBlank()

    private fun parseProviderKey(providerUrl: String): String {
        val trimmed = providerUrl.trim()
        require(trimmed.startsWith("Mail:") && trimmed.contains("://")) {
            "Invalid Mail provider URL: $providerUrl"
        }

        return trimmed.substring(4, trimmed.indexOf("://")).lowercase()
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

data class MailDataSourceOptions(
    val providerUrl: String? = null,
    val providerKey: String? = null,
    val tenantOverrideProviderKey: String? = null,
    val deploymentProfileProviderKey: String? = null,
    val defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
)

class MailDataSource(
    private val options: MailDataSourceOptions = MailDataSourceOptions(),
    private val driverManager: MailDriverManager = MailDriverManager(),
) {
    fun describeSelection(overrides: MailDataSourceOptions? = null): MailProviderSelection {
        val merged = merge(options, overrides)
        return driverManager.resolveSelection(
            request = Request(
                providerUrl = merged.providerUrl,
                providerKey = merged.providerKey,
                tenantOverrideProviderKey = merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey = merged.deploymentProfileProviderKey,
            ),
            defaultProviderKey = merged.defaultProviderKey,
        )
    }

    fun describeProviderSupport(overrides: MailDataSourceOptions? = null): MailProviderSupport {
        return driverManager.describeProviderSupport(describeSelection(overrides).providerKey)
    }

    fun listProviderSupport(): List<MailProviderSupport> {
        return driverManager.listProviderSupport()
    }

    private fun merge(
        base: MailDataSourceOptions,
        overrides: MailDataSourceOptions?,
    ): MailDataSourceOptions {
        if (overrides == null) {
            return base
        }

        return MailDataSourceOptions(
            providerUrl = overrides.providerUrl ?: base.providerUrl,
            providerKey = overrides.providerKey ?: base.providerKey,
            tenantOverrideProviderKey = overrides.tenantOverrideProviderKey ?: base.tenantOverrideProviderKey,
            deploymentProfileProviderKey = overrides.deploymentProfileProviderKey ?: base.deploymentProfileProviderKey,
            defaultProviderKey = overrides.defaultProviderKey.ifBlank { base.defaultProviderKey },
        )
    }
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
package com.sdkwork.Mail.metadata

enum class MailProviderSupportStatus {
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown,
}

data class MailProviderSupport(
    val providerKey: String,
    val status: MailProviderSupportStatus,
    val builtin: Boolean,
    val official: Boolean,
    val registered: Boolean,
)
`),
    },
  ];
}

function renderGoReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `    {ProviderKey: ${q(provider.providerKey)}, PluginId: ${q(provider.pluginId)}, DriverId: ${q(provider.driverId)}, DefaultSelected: ${provider.defaultSelected ? 'true' : 'false'}},`,
    )
    .join('\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `    {ProviderKey: ${q(entry.providerKey)}, PluginId: ${q(entry.pluginId)}, DriverId: ${q(entry.driverId)}, PackageIdentity: ${q(entry.packageIdentity)}, ManifestPath: ${q(entry.manifestPath)}, ReadmePath: ${q(entry.readmePath)}, SourcePath: ${q(entry.sourcePath)}, SourceSymbol: ${q(entry.sourceSymbol)}, Builtin: ${entry.builtin ? 'true' : 'false'}, RootPublic: ${entry.rootPublic ? 'true' : 'false'}, Status: ${q(entry.status)}, RuntimeBridgeStatus: ${q(entry.runtimeBridgeStatus)}},`,
    )
    .join('\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `    {CapabilityKey: ${q(descriptor.capabilityKey)}, Category: ${q(descriptor.category)}, Surface: ${q(descriptor.surface)}},`,
    )
    .join('\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `    {ExtensionKey: ${q(descriptor.extensionKey)}, ProviderKey: ${q(descriptor.providerKey)}, DisplayName: ${q(descriptor.displayName)}, Surface: ${q(descriptor.surface)}, Access: ${q(descriptor.access)}, Status: ${q(descriptor.status)}},`,
    )
    .join('\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
module ${languageEntry.publicPackage}

go 1.22

// build system: ${languageEntry.packageScaffold.buildSystem}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
package Mailstandard

type MailStandardContract struct{}

type MailProviderDriver interface {
    ProviderKey() string
}

type MailDriverManager interface {
    ResolveDriver(providerKey string)
}

type MailDataSource interface {
    CreateClient()
}

type MailClient interface {
    Join() error
    Leave() error
    Publish(trackID string) error
    Unpublish(trackID string) error
    MuteAudio(muted bool) error
    MuteVideo(muted bool) error
    Unwrap() any
}

type MailRuntimeController interface {
    Join() error
    Leave() error
    Publish(trackID string) error
    Unpublish(trackID string) error
    MuteAudio(muted bool) error
    MuteVideo(muted bool) error
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
package Mailstandard

type MailProviderCatalogEntry struct {
    ProviderKey     string
    PluginId        string
    DriverId        string
    DefaultSelected bool
}

type MailProviderCatalog struct{}

const DEFAULT_mail_PROVIDER_KEY = ${q(assembly.defaults?.providerKey ?? 'volcengine')}

var OFFICIAL_mail_PROVIDERS = []MailProviderCatalogEntry{
${providerEntries}
}

${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
package Mailstandard

type MailProviderPackageCatalogEntry struct {
    ProviderKey         string
    PluginId            string
    DriverId            string
    PackageIdentity     string
    ManifestPath        string
    ReadmePath          string
    SourcePath          string
    SourceSymbol        string
    Builtin             bool
    RootPublic          bool
    Status              string
    RuntimeBridgeStatus string
}

type MailProviderPackageCatalog struct{}

var OFFICIAL_mail_PROVIDER_PACKAGES = []MailProviderPackageCatalogEntry{
${providerPackageEntries}
}

${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
package Mailstandard

type MailCapabilityCatalogEntry struct {
    CapabilityKey string
    Category      string
    Surface       string
}

type MailCapabilityCatalog struct{}

var mail_CAPABILITY_CATALOG = []MailCapabilityCatalogEntry{
${capabilityEntries}
}

${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
package Mailstandard

type MailProviderExtensionCatalogEntry struct {
    ExtensionKey string
    ProviderKey  string
    DisplayName  string
    Surface      string
    Access       string
    Status       string
}

type MailProviderExtensionCatalog struct{}

var mail_PROVIDER_EXTENSION_SURFACES = []string{
    "control-plane",
    "runtime-bridge",
    "cross-surface",
}

var mail_PROVIDER_EXTENSION_ACCESSES = []string{
    "unwrap-only",
    "extension-object",
}

var mail_PROVIDER_EXTENSION_STATUSES = []string{
    "reference-baseline",
    "reserved",
}

var mail_PROVIDER_EXTENSION_CATALOG = []MailProviderExtensionCatalogEntry{
${extensionEntries}
}

${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
package Mailstandard

type MailProviderSelection struct {
    providerKey string
    source      string
}

type MailProviderSelectionRequest struct {
    providerUrl                  string
    providerKey                  string
    tenantOverrideProviderKey    string
    deploymentProfileProviderKey string
}

var mail_PROVIDER_SELECTION_SOURCES = []string{
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
package Mailstandard

import "strings"

type MailDriverManager struct{}

func hasText(value string) bool {
    return strings.TrimSpace(value) != ""
}

func parseProviderKey(providerUrl string) string {
    trimmed := strings.TrimSpace(providerUrl)
    if !strings.HasPrefix(trimmed, "Mail:") || !strings.Contains(trimmed, "://") {
        panic("Invalid Mail provider URL: " + providerUrl)
    }

    withoutPrefix := strings.TrimPrefix(trimmed, "Mail:")
    providerKey, _, _ := strings.Cut(withoutPrefix, "://")
    return strings.ToLower(providerKey)
}

func (manager MailDriverManager) resolveSelection(request MailProviderSelectionRequest, defaultProviderKey string) MailProviderSelection {
    if hasText(request.providerUrl) {
        return MailProviderSelection{
            providerKey: parseProviderKey(request.providerUrl),
            source:      "provider_url",
        }
    }

    if hasText(request.providerKey) {
        return MailProviderSelection{
            providerKey: strings.TrimSpace(request.providerKey),
            source:      "provider_key",
        }
    }

    if hasText(request.tenantOverrideProviderKey) {
        return MailProviderSelection{
            providerKey: strings.TrimSpace(request.tenantOverrideProviderKey),
            source:      "tenant_override",
        }
    }

    if hasText(request.deploymentProfileProviderKey) {
        return MailProviderSelection{
            providerKey: strings.TrimSpace(request.deploymentProfileProviderKey),
            source:      "deployment_profile",
        }
    }

    resolvedDefaultProviderKey := defaultProviderKey
    if !hasText(resolvedDefaultProviderKey) {
        resolvedDefaultProviderKey = DEFAULT_mail_PROVIDER_KEY
    }

    return MailProviderSelection{
        providerKey: resolvedDefaultProviderKey,
        source:      "default_provider",
    }
}

func (manager MailDriverManager) ResolveSelection(request MailProviderSelectionRequest, defaultProviderKey string) MailProviderSelection {
    return manager.resolveSelection(request, defaultProviderKey)
}

func (manager MailDriverManager) describeProviderSupport(providerKey string) MailProviderSupport {
    for _, entry := range OFFICIAL_mail_PROVIDERS {
        if entry.providerKey == providerKey {
            return MailProviderSupport{
                providerKey: providerKey,
                status:      "official_unregistered",
                builtin:     false,
                official:    true,
                registered:  false,
            }
        }
    }

    return MailProviderSupport{
        providerKey: providerKey,
        status:      "unknown",
        builtin:     false,
        official:    false,
        registered:  false,
    }
}

func (manager MailDriverManager) DescribeProviderSupport(providerKey string) MailProviderSupport {
    return manager.describeProviderSupport(providerKey)
}

func (manager MailDriverManager) listProviderSupport() []MailProviderSupport {
    supports := make([]MailProviderSupport, 0, len(OFFICIAL_mail_PROVIDERS))
    for _, entry := range OFFICIAL_mail_PROVIDERS {
        supports = append(supports, manager.describeProviderSupport(entry.providerKey))
    }
    return supports
}

func (manager MailDriverManager) ListProviderSupport() []MailProviderSupport {
    return manager.listProviderSupport()
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
package Mailstandard

type MailDataSourceOptions struct {
    providerUrl                  string
    providerKey                  string
    tenantOverrideProviderKey    string
    deploymentProfileProviderKey string
    defaultProviderKey           string
}

type MailDataSource struct {
    options       MailDataSourceOptions
    driverManager MailDriverManager
}

func NewMailDataSourceOptions() MailDataSourceOptions {
    return MailDataSourceOptions{
        defaultProviderKey: DEFAULT_mail_PROVIDER_KEY,
    }
}

func NewMailDataSource(options MailDataSourceOptions, driverManager MailDriverManager) MailDataSource {
    if !hasText(options.defaultProviderKey) {
        options.defaultProviderKey = DEFAULT_mail_PROVIDER_KEY
    }

    return MailDataSource{
        options:       options,
        driverManager: driverManager,
    }
}

func mergeMailDataSourceOptions(base MailDataSourceOptions, overrides *MailDataSourceOptions) MailDataSourceOptions {
    if overrides == nil {
        return base
    }

    merged := base
    if overrides.providerUrl != "" {
        merged.providerUrl = overrides.providerUrl
    }
    if overrides.providerKey != "" {
        merged.providerKey = overrides.providerKey
    }
    if overrides.tenantOverrideProviderKey != "" {
        merged.tenantOverrideProviderKey = overrides.tenantOverrideProviderKey
    }
    if overrides.deploymentProfileProviderKey != "" {
        merged.deploymentProfileProviderKey = overrides.deploymentProfileProviderKey
    }
    if overrides.defaultProviderKey != "" {
        merged.defaultProviderKey = overrides.defaultProviderKey
    }

    return merged
}

func (dataSource MailDataSource) describeSelection(overrides *MailDataSourceOptions) MailProviderSelection {
    merged := mergeMailDataSourceOptions(dataSource.options, overrides)
    return dataSource.driverManager.resolveSelection(
        MailProviderSelectionRequest{
            providerUrl:                  merged.providerUrl,
            providerKey:                  merged.providerKey,
            tenantOverrideProviderKey:    merged.tenantOverrideProviderKey,
            deploymentProfileProviderKey: merged.deploymentProfileProviderKey,
        },
        merged.defaultProviderKey,
    )
}

func (dataSource MailDataSource) DescribeSelection(overrides *MailDataSourceOptions) MailProviderSelection {
    return dataSource.describeSelection(overrides)
}

func (dataSource MailDataSource) describeProviderSupport(overrides *MailDataSourceOptions) MailProviderSupport {
    selection := dataSource.describeSelection(overrides)
    return dataSource.driverManager.describeProviderSupport(selection.providerKey)
}

func (dataSource MailDataSource) DescribeProviderSupport(overrides *MailDataSourceOptions) MailProviderSupport {
    return dataSource.describeProviderSupport(overrides)
}

func (dataSource MailDataSource) listProviderSupport() []MailProviderSupport {
    return dataSource.driverManager.listProviderSupport()
}

func (dataSource MailDataSource) ListProviderSupport() []MailProviderSupport {
    return dataSource.listProviderSupport()
}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
package Mailstandard

type MailProviderSupport struct {
    providerKey string
    status      string
    builtin     bool
    official    bool
    registered  bool
}

var mail_PROVIDER_SUPPORT_STATUSES = []string{
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
}
`),
    },
  ];
}

function renderPythonReservedLanguagePlan(languageEntry, assembly) {
  const providers = assembly.providers ?? [];
  const capabilities = assembly.capabilityCatalog ?? [];
  const extensions = assembly.providerExtensionCatalog ?? [];
  const providerPackageCatalogEntries = buildReservedProviderPackageCatalogEntries(
    languageEntry,
    providers,
  );

  const providerEntries = providers
    .map(
      (provider) =>
        `        MailProviderCatalogEntry(${q(provider.providerKey)}, ${q(provider.pluginId)}, ${q(provider.driverId)}, ${provider.defaultSelected ? 'True' : 'False'}),`,
    )
    .join('\n');

  const providerPackageEntries = providerPackageCatalogEntries
    .map(
      (entry) =>
        `        MailProviderPackageCatalogEntry(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.packageIdentity)}, ${q(entry.manifestPath)}, ${q(entry.readmePath)}, ${q(entry.sourcePath)}, ${q(entry.sourceSymbol)}, ${entry.builtin ? 'True' : 'False'}, ${entry.rootPublic ? 'True' : 'False'}, ${q(entry.status)}, ${q(entry.runtimeBridgeStatus)}),`,
    )
    .join('\n');

  const capabilityEntries = capabilities
    .map(
      (descriptor) =>
        `        MailCapabilityCatalogEntry(${q(descriptor.capabilityKey)}, ${q(descriptor.category)}, ${q(descriptor.surface)}),`,
    )
    .join('\n');

  const extensionEntries = extensions
    .map(
      (descriptor) =>
        `        MailProviderExtensionCatalogEntry(${q(descriptor.extensionKey)}, ${q(descriptor.providerKey)}, ${q(descriptor.displayName)}, ${q(descriptor.surface)}, ${q(descriptor.access)}, ${q(descriptor.status)}),`,
    )
    .join('\n');

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.packageScaffold.manifestRelativePath}`,
      content: lines(`
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = ${q(languageEntry.publicPackage)}
version = "0.1.0"
description = ${q(`Reserved Python package scaffold for ${languageEntry.publicPackage} with build system: ${languageEntry.packageScaffold.buildSystem}`)}
requires-python = ">=3.11"
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.contractScaffold.relativePath}`,
      content: lines(`
from __future__ import annotations

from typing import Protocol, TypeVar


NativeClientT = TypeVar("NativeClientT")


class MailStandardContract:
    symbol = "MailStandardContract"


class MailProviderDriver(Protocol[NativeClientT]):
    @property
    def provider_key(self) -> str:
        ...

    def create_client(self) -> "MailClient[NativeClientT]":
        ...


class MailDriverManager(Protocol[NativeClientT]):
    def resolve_driver(self, provider_key: str) -> MailProviderDriver[NativeClientT]:
        ...


class MailDataSource(Protocol[NativeClientT]):
    def create_client(self) -> "MailClient[NativeClientT]":
        ...


class MailClient(Protocol[NativeClientT]):
    def join(self) -> None:
        ...

    def leave(self) -> None:
        ...

    def publish(self, track_id: str) -> None:
        ...

    def unpublish(self, track_id: str) -> None:
        ...

    def mute_audio(self, muted: bool) -> None:
        ...

    def mute_video(self, muted: bool) -> None:
        ...

    def unwrap(self) -> NativeClientT | None:
        ...


class MailRuntimeController(Protocol[NativeClientT]):
    def join(self) -> None:
        ...

    def leave(self) -> None:
        ...

    def publish(self, track_id: str) -> None:
        ...

    def unpublish(self, track_id: str) -> None:
        ...

    def mute_audio(self, muted: bool) -> None:
        ...

    def mute_video(self, muted: bool) -> None:
        ...
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerCatalogRelativePath}`,
      content: lines(`
from dataclasses import dataclass
from typing import Optional


DEFAULT_mail_PROVIDER_KEY = ${q(assembly.defaults?.providerKey ?? 'volcengine')}


@dataclass(frozen=True)
class MailProviderCatalogEntry:
    providerKey: str
    pluginId: str
    driverId: str
    defaultSelected: bool


class MailProviderCatalog:
    entries = [
${providerEntries}
    ]


${renderReservedLanguageProviderCatalogLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}`,
      content: lines(`
from dataclasses import dataclass


@dataclass(frozen=True)
class MailProviderPackageCatalogEntry:
    providerKey: str
    pluginId: str
    driverId: str
    packageIdentity: str
    manifestPath: str
    readmePath: str
    sourcePath: str
    sourceSymbol: str
    builtin: bool
    rootPublic: bool
    status: str
    runtimeBridgeStatus: str


class MailProviderPackageCatalog:
    entries = [
${providerPackageEntries}
    ]


${renderReservedLanguageProviderPackageLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.capabilityCatalogRelativePath}`,
      content: lines(`
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailCapabilityCatalogEntry:
    capabilityKey: str
    category: str
    surface: str


class MailCapabilityCatalog:
    entries = [
${capabilityEntries}
    ]


${renderReservedLanguageCapabilityLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}`,
      content: lines(`
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailProviderExtensionCatalogEntry:
    extensionKey: str
    providerKey: str
    displayName: str
    surface: str
    access: str
    status: str


class MailProviderExtensionCatalog:
    recognizedSurfaces = [
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    ]

    recognizedAccessModes = [
        "unwrap-only",
        "extension-object",
    ]

    recognizedStatuses = [
        "reference-baseline",
        "reserved",
    ]

    entries = [
${extensionEntries}
    ]


${renderReservedLanguageProviderExtensionLookupHelper(languageEntry.language)}
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`,
      content: lines(`
from dataclasses import dataclass
from enum import Enum


class MailProviderSelectionSource(str, Enum):
    provider_url = "provider_url"
    provider_key = "provider_key"
    tenant_override = "tenant_override"
    deployment_profile = "deployment_profile"
    default_provider = "default_provider"


@dataclass(frozen=True)
class MailProviderSelection:
    providerKey: str
    source: MailProviderSelectionSource


@dataclass(frozen=True)
class MailProviderSelectionRequest:
    providerUrl: str | None = None
    providerKey: str | None = None
    tenantOverrideProviderKey: str | None = None
    deploymentProfileProviderKey: str | None = None
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`,
      content: lines(`
from .provider_catalog import DEFAULT_mail_PROVIDER_KEY, MailProviderCatalog
from .provider_selection import (
    MailProviderSelection,
    MailProviderSelectionRequest,
    MailProviderSelectionSource,
)
from .provider_support import MailProviderSupport, MailProviderSupportStatus


def _has_text(value: str | None) -> bool:
    return value is not None and value.strip() != ""


def _parse_provider_key(providerUrl: str) -> str:
    trimmed = providerUrl.strip()
    if not trimmed.startswith("Mail:") or "://" not in trimmed:
        raise ValueError(f"Invalid Mail provider URL: {providerUrl}")
    return trimmed[4:].split("://", 1)[0].lower()


class MailDriverManager:
    def resolveSelection(
        self,
        request: MailProviderSelectionRequest | None = None,
        *,
        defaultProviderKey: str = DEFAULT_mail_PROVIDER_KEY,
    ) -> MailProviderSelection:
        request = request or MailProviderSelectionRequest()

        if _has_text(request.providerUrl):
            return MailProviderSelection(
                providerKey=_parse_provider_key(request.providerUrl),
                source=MailProviderSelectionSource.provider_url,
            )

        if _has_text(request.providerKey):
            return MailProviderSelection(
                providerKey=request.providerKey.strip(),
                source=MailProviderSelectionSource.provider_key,
            )

        if _has_text(request.tenantOverrideProviderKey):
            return MailProviderSelection(
                providerKey=request.tenantOverrideProviderKey.strip(),
                source=MailProviderSelectionSource.tenant_override,
            )

        if _has_text(request.deploymentProfileProviderKey):
            return MailProviderSelection(
                providerKey=request.deploymentProfileProviderKey.strip(),
                source=MailProviderSelectionSource.deployment_profile,
            )

        return MailProviderSelection(
            providerKey=defaultProviderKey,
            source=MailProviderSelectionSource.default_provider,
        )

    def describeProviderSupport(self, providerKey: str) -> MailProviderSupport:
        official = any(entry.providerKey == providerKey for entry in MailProviderCatalog.entries)

        if official:
            return MailProviderSupport(
                providerKey=providerKey,
                status=MailProviderSupportStatus.official_unregistered,
                builtin=False,
                official=True,
                registered=False,
            )

        return MailProviderSupport(
            providerKey=providerKey,
            status=MailProviderSupportStatus.unknown,
            builtin=False,
            official=False,
            registered=False,
        )

    def listProviderSupport(self) -> list[MailProviderSupport]:
        return [
            self.describeProviderSupport(entry.providerKey)
            for entry in MailProviderCatalog.entries
        ]
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`,
      content: lines(`
from dataclasses import dataclass

from .driver_manager import MailDriverManager
from .provider_catalog import DEFAULT_mail_PROVIDER_KEY
from .provider_selection import MailProviderSelection, MailProviderSelectionRequest
from .provider_support import MailProviderSupport


@dataclass(frozen=True)
class MailDataSourceOptions:
    providerUrl: str | None = None
    providerKey: str | None = None
    tenantOverrideProviderKey: str | None = None
    deploymentProfileProviderKey: str | None = None
    defaultProviderKey: str = DEFAULT_mail_PROVIDER_KEY


def _prefer(overrideValue: str | None, baseValue: str | None) -> str | None:
    return overrideValue if overrideValue is not None else baseValue


def _merge_options(
    base: MailDataSourceOptions,
    overrides: MailDataSourceOptions | None,
) -> MailDataSourceOptions:
    if overrides is None:
        return base

    return MailDataSourceOptions(
        providerUrl=_prefer(overrides.providerUrl, base.providerUrl),
        providerKey=_prefer(overrides.providerKey, base.providerKey),
        tenantOverrideProviderKey=_prefer(
            overrides.tenantOverrideProviderKey,
            base.tenantOverrideProviderKey,
        ),
        deploymentProfileProviderKey=_prefer(
            overrides.deploymentProfileProviderKey,
            base.deploymentProfileProviderKey,
        ),
        defaultProviderKey=overrides.defaultProviderKey or base.defaultProviderKey,
    )


class MailDataSource:
    def __init__(
        self,
        options: MailDataSourceOptions | None = None,
        driverManager: MailDriverManager | None = None,
    ) -> None:
        self._options = options or MailDataSourceOptions()
        self._driverManager = driverManager or MailDriverManager()

    def describeSelection(
        self,
        overrides: MailDataSourceOptions | None = None,
    ) -> MailProviderSelection:
        merged = _merge_options(self._options, overrides)
        return self._driverManager.resolveSelection(
            MailProviderSelectionRequest(
                providerUrl=merged.providerUrl,
                providerKey=merged.providerKey,
                tenantOverrideProviderKey=merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey=merged.deploymentProfileProviderKey,
            ),
            defaultProviderKey=merged.defaultProviderKey,
        )

    def describeProviderSupport(
        self,
        overrides: MailDataSourceOptions | None = None,
    ) -> MailProviderSupport:
        selection = self.describeSelection(overrides)
        return self._driverManager.describeProviderSupport(selection.providerKey)

    def listProviderSupport(self) -> list[MailProviderSupport]:
        return self._driverManager.listProviderSupport()
`),
    },
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`,
      content: lines(`
from dataclasses import dataclass
from enum import Enum


class MailProviderSupportStatus(str, Enum):
    builtin_registered = "builtin_registered"
    official_registered = "official_registered"
    official_unregistered = "official_unregistered"
    unknown = "unknown"


@dataclass(frozen=True)
class MailProviderSupport:
    providerKey: str
    status: MailProviderSupportStatus
    builtin: bool
    official: bool
    registered: bool
`),
    },
  ];
}

function renderReservedLanguageProviderActivationCatalogPlan(languageEntry, assembly) {
  if (typeof languageEntry.metadataScaffold?.providerActivationCatalogRelativePath !== 'string') {
    return [];
  }

  const entries = buildLanguageProviderActivationCatalogEntries(languageEntry, assembly.providers);

  switch (languageEntry.language) {
    case 'flutter': {
      const activationEntries = entries
        .map(
          (entry) => `    MailProviderActivationCatalogEntry(
      providerKey: ${q(entry.providerKey)},
      pluginId: ${q(entry.pluginId)},
      driverId: ${q(entry.driverId)},
      activationStatus: ${q(entry.activationStatus)},
      runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'},
      rootPublic: ${entry.rootPublic ? 'true' : 'false'},
      packageBoundary: ${entry.packageBoundary ? 'true' : 'false'},
      builtin: ${entry.builtin ? 'true' : 'false'},
      packageIdentity: ${q(entry.packageIdentity)},
    ),`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => `    ${q(status)},`).join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
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
${recognizedStatuses}
  ];

  static const List<MailProviderActivationCatalogEntry> entries =
      <MailProviderActivationCatalogEntry>[
${activationEntries}
      ];

  const MailProviderActivationCatalog._();
}

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    case 'rust': {
      const activationEntries = entries
        .map(
          (entry) => `    MailProviderActivationCatalogEntry { providerKey: ${q(entry.providerKey)}, pluginId: ${q(entry.pluginId)}, driverId: ${q(entry.driverId)}, activationStatus: ${q(entry.activationStatus)}, runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'}, rootPublic: ${entry.rootPublic ? 'true' : 'false'}, packageBoundary: ${entry.packageBoundary ? 'true' : 'false'}, builtin: ${entry.builtin ? 'true' : 'false'}, packageIdentity: ${q(entry.packageIdentity)} },`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map(q).join(', ');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailProviderActivationCatalogEntry {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
    pub activationStatus: &'static str,
    pub runtimeBridge: bool,
    pub rootPublic: bool,
    pub packageBoundary: bool,
    pub builtin: bool,
    pub packageIdentity: &'static str,
}

pub struct MailProviderActivationCatalog;

pub const mail_PROVIDER_ACTIVATION_STATUSES: [&str; ${PROVIDER_ACTIVATION_STATUSES.length}] = [${recognizedStatuses}];

pub const OFFICIAL_mail_PROVIDER_ACTIVATIONS: [MailProviderActivationCatalogEntry; ${entries.length}] = [
${activationEntries}
];

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    case 'java': {
      const activationEntries = entries
        .map(
          (entry) =>
            `      new MailProviderActivationCatalogEntry(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.activationStatus)}, ${entry.runtimeBridge ? 'true' : 'false'}, ${entry.rootPublic ? 'true' : 'false'}, ${entry.packageBoundary ? 'true' : 'false'}, ${entry.builtin ? 'true' : 'false'}, ${q(entry.packageIdentity)})`,
        )
        .join(',\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => `      ${q(status)}`).join(',\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderActivationCatalog {

  public static final List<String> RECOGNIZED_ACTIVATION_STATUSES = List.of(
${recognizedStatuses}
  );

  public static final List<MailProviderActivationCatalogEntry> ENTRIES = List.of(
${activationEntries}
  );

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}

  private MailProviderActivationCatalog() {
  }

  public record MailProviderActivationCatalogEntry(
      String providerKey,
      String pluginId,
      String driverId,
      String activationStatus,
      boolean runtimeBridge,
      boolean rootPublic,
      boolean packageBoundary,
      boolean builtin,
      String packageIdentity
  ) {
  }
}
`),
        },
      ];
    }
    case 'csharp': {
      const activationEntries = entries
        .map(
          (entry) =>
            `        new(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.activationStatus)}, ${entry.runtimeBridge ? 'true' : 'false'}, ${entry.rootPublic ? 'true' : 'false'}, ${entry.packageBoundary ? 'true' : 'false'}, ${entry.builtin ? 'true' : 'false'}, ${q(entry.packageIdentity)}),`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => `        ${q(status)},`).join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed record MailProviderActivationCatalogEntry(
    string providerKey,
    string pluginId,
    string driverId,
    string activationStatus,
    bool runtimeBridge,
    bool rootPublic,
    bool packageBoundary,
    bool builtin,
    string packageIdentity
);

public static class MailProviderActivationCatalog
{
    public static readonly IReadOnlyList<string> RecognizedActivationStatuses =
    [
${recognizedStatuses}
    ];

    public static readonly IReadOnlyList<MailProviderActivationCatalogEntry> Entries =
    [
${activationEntries}
    ];

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
}
`),
        },
      ];
    }
    case 'swift': {
      const activationEntries = entries
        .map(
          (entry) =>
            `        .init(providerKey: ${q(entry.providerKey)}, pluginId: ${q(entry.pluginId)}, driverId: ${q(entry.driverId)}, activationStatus: ${q(entry.activationStatus)}, runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'}, rootPublic: ${entry.rootPublic ? 'true' : 'false'}, packageBoundary: ${entry.packageBoundary ? 'true' : 'false'}, builtin: ${entry.builtin ? 'true' : 'false'}, packageIdentity: ${q(entry.packageIdentity)}),`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => `        ${q(status)},`).join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
public struct MailProviderActivationCatalogEntry {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
    public let activationStatus: String
    public let runtimeBridge: Bool
    public let rootPublic: Bool
    public let packageBoundary: Bool
    public let builtin: Bool
    public let packageIdentity: String
}

public enum MailProviderActivationCatalog {
    public static let recognizedActivationStatuses: [String] = [
${recognizedStatuses}
    ]

    public static let entries: [MailProviderActivationCatalogEntry] = [
${activationEntries}
    ]

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
}
`),
        },
      ];
    }
    case 'kotlin': {
      const activationEntries = entries
        .map(
          (entry) =>
            `        MailProviderActivationCatalogEntry(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.activationStatus)}, ${entry.runtimeBridge ? 'true' : 'false'}, ${entry.rootPublic ? 'true' : 'false'}, ${entry.packageBoundary ? 'true' : 'false'}, ${entry.builtin ? 'true' : 'false'}, ${q(entry.packageIdentity)}),`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => `        ${q(status)},`).join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
package com.sdkwork.Mail.metadata

data class MailProviderActivationCatalogEntry(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
    val activationStatus: String,
    val runtimeBridge: Boolean,
    val rootPublic: Boolean,
    val packageBoundary: Boolean,
    val builtin: Boolean,
    val packageIdentity: String,
)

object MailProviderActivationCatalog {
    val recognizedActivationStatuses: List<String> = listOf(
${recognizedStatuses}
    )

    val entries: List<MailProviderActivationCatalogEntry> = listOf(
${activationEntries}
    )

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
}
`),
        },
      ];
    }
    case 'go': {
      const activationEntries = entries
        .map(
          (entry) =>
            `    {ProviderKey: ${q(entry.providerKey)}, PluginId: ${q(entry.pluginId)}, DriverId: ${q(entry.driverId)}, ActivationStatus: ${q(entry.activationStatus)}, RuntimeBridge: ${entry.runtimeBridge ? 'true' : 'false'}, RootPublic: ${entry.rootPublic ? 'true' : 'false'}, PackageBoundary: ${entry.packageBoundary ? 'true' : 'false'}, Builtin: ${entry.builtin ? 'true' : 'false'}, PackageIdentity: ${q(entry.packageIdentity)}},`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => q(status)).join(', ');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
package Mailstandard

type MailProviderActivationCatalogEntry struct {
    ProviderKey      string
    PluginId         string
    DriverId         string
    ActivationStatus string
    RuntimeBridge    bool
    RootPublic       bool
    PackageBoundary  bool
    Builtin          bool
    PackageIdentity  string
}

type MailProviderActivationCatalog struct{}

var mail_PROVIDER_ACTIVATION_STATUSES = []string{${recognizedStatuses}}

var OFFICIAL_mail_PROVIDER_ACTIVATIONS = []MailProviderActivationCatalogEntry{
${activationEntries}
}

${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    case 'python': {
      const activationEntries = entries
        .map(
          (entry) =>
            `        MailProviderActivationCatalogEntry(${q(entry.providerKey)}, ${q(entry.pluginId)}, ${q(entry.driverId)}, ${q(entry.activationStatus)}, ${entry.runtimeBridge ? 'True' : 'False'}, ${entry.rootPublic ? 'True' : 'False'}, ${entry.packageBoundary ? 'True' : 'False'}, ${entry.builtin ? 'True' : 'False'}, ${q(entry.packageIdentity)}),`,
        )
        .join('\n');
      const recognizedStatuses = PROVIDER_ACTIVATION_STATUSES.map((status) => `        ${q(status)},`).join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}`,
          content: lines(`
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailProviderActivationCatalogEntry:
    providerKey: str
    pluginId: str
    driverId: str
    activationStatus: str
    runtimeBridge: bool
    rootPublic: bool
    packageBoundary: bool
    builtin: bool
    packageIdentity: str


class MailProviderActivationCatalog:
    recognizedActivationStatuses = [
${recognizedStatuses}
    ]

    entries = [
${activationEntries}
    ]


${renderReservedLanguageProviderActivationLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    default:
      return [];
  }
}

function buildLanguageWorkspaceCatalogEntries(assembly) {
  const defaultProviderContract =
    typeof assembly.defaults?.providerKey === 'string' &&
    typeof assembly.defaults?.pluginId === 'string' &&
    typeof assembly.defaults?.driverId === 'string'
      ? {
          providerKey: assembly.defaults.providerKey,
          pluginId: assembly.defaults.pluginId,
          driverId: assembly.defaults.driverId,
        }
      : undefined;
  const providerSelectionContract =
    Array.isArray(assembly.providerSelectionStandard?.sourceTerms) &&
    Array.isArray(assembly.providerSelectionStandard?.precedence) &&
    typeof assembly.providerSelectionStandard?.defaultSource === 'string'
      ? {
          sourceTerms: [...assembly.providerSelectionStandard.sourceTerms],
          precedence: [...assembly.providerSelectionStandard.precedence],
          defaultSource: assembly.providerSelectionStandard.defaultSource,
        }
      : undefined;
  const providerSuppoMailontract = Array.isArray(assembly.providerSupportStandard?.statusTerms)
    ? {
        statusTerms: [...assembly.providerSupportStandard.statusTerms],
      }
    : undefined;
  const providerActivationContract = Array.isArray(assembly.providerActivationStandard?.statusTerms)
    ? {
        statusTerms: [...assembly.providerActivationStandard.statusTerms],
      }
    : undefined;
  const providerPackageBoundaryContract =
    Array.isArray(assembly.providerPackageBoundaryStandard?.modeTerms) &&
    Array.isArray(assembly.providerPackageBoundaryStandard?.rootPublicPolicyTerms) &&
    Array.isArray(assembly.providerPackageBoundaryStandard?.lifecycleStatusTerms) &&
    Array.isArray(assembly.providerPackageBoundaryStandard?.runtimeBridgeStatusTerms)
      ? {
          modeTerms: [...assembly.providerPackageBoundaryStandard.modeTerms],
          rootPublicPolicyTerms: [...assembly.providerPackageBoundaryStandard.rootPublicPolicyTerms],
          lifecycleStatusTerms: [...assembly.providerPackageBoundaryStandard.lifecycleStatusTerms],
          runtimeBridgeStatusTerms: [
            ...assembly.providerPackageBoundaryStandard.runtimeBridgeStatusTerms,
          ],
        }
      : undefined;

  return (assembly.languages ?? []).map((languageEntry) => ({
    language: languageEntry.language,
    workspace: languageEntry.workspace,
    workspaceCatalogRelativePath: languageEntry.workspaceCatalogRelativePath,
    displayName: languageEntry.displayName,
    publicPackage: languageEntry.publicPackage,
    maturityTier: languageEntry.maturityTier,
    controlSdk: languageEntry.controlSdk === true,
    runtimeBridge: languageEntry.runtimeBridge === true,
    currentRole: languageEntry.currentRole,
    workspaceSummary: languageEntry.workspaceSummary,
    roleHighlights: [...(languageEntry.roleHighlights ?? [])],
    defaultProviderContract,
    providerSelectionContract,
    providerSuppoMailontract,
    providerActivationContract,
    runtimeBaseline: languageEntry.runtimeBaseline
      ? {
          vendorSdkPackage: languageEntry.runtimeBaseline.vendorSdkPackage,
          vendorSdkImportPath: languageEntry.runtimeBaseline.vendorSdkImportPath,
          recommendedEntrypoint: languageEntry.runtimeBaseline.recommendedEntrypoint,
          smokeCommand: languageEntry.runtimeBaseline.smokeCommand,
          smokeMode: languageEntry.runtimeBaseline.smokeMode,
          smokeVariants: [...languageEntry.runtimeBaseline.smokeVariants],
        }
      : undefined,
    metadataScaffold: languageEntry.metadataScaffold
      ? {
          providerCatalogRelativePath: languageEntry.metadataScaffold.providerCatalogRelativePath,
          capabilityCatalogRelativePath: languageEntry.metadataScaffold.capabilityCatalogRelativePath,
          providerExtensionCatalogRelativePath:
            languageEntry.metadataScaffold.providerExtensionCatalogRelativePath,
          providerPackageCatalogRelativePath:
            languageEntry.metadataScaffold.providerPackageCatalogRelativePath,
          providerActivationCatalogRelativePath:
            languageEntry.metadataScaffold.providerActivationCatalogRelativePath,
          providerSelectionRelativePath:
            languageEntry.metadataScaffold.providerSelectionRelativePath,
        }
      : undefined,
    resolutionScaffold: languageEntry.resolutionScaffold
      ? {
          driverManagerRelativePath: languageEntry.resolutionScaffold.driverManagerRelativePath,
          dataSourceRelativePath: languageEntry.resolutionScaffold.dataSourceRelativePath,
          providerSupportRelativePath: languageEntry.resolutionScaffold.providerSupportRelativePath,
          providerPackageLoaderRelativePath:
            languageEntry.resolutionScaffold.providerPackageLoaderRelativePath,
        }
      : undefined,
    providerPackageBoundaryContract,
    providerPackageBoundary: languageEntry.providerPackageBoundary
      ? {
          mode: languageEntry.providerPackageBoundary.mode,
          rootPublicPolicy: languageEntry.providerPackageBoundary.rootPublicPolicy,
          lifecycleStatusTerms: [...(languageEntry.providerPackageBoundary.lifecycleStatusTerms ?? [])],
          runtimeBridgeStatusTerms: [
            ...(languageEntry.providerPackageBoundary.runtimeBridgeStatusTerms ?? []),
          ],
        }
      : undefined,
    providerPackageScaffold: languageEntry.providerPackageScaffold
      ? {
          relativePath: languageEntry.providerPackageScaffold.relativePath,
          directoryPattern: languageEntry.providerPackageScaffold.directoryPattern,
          packagePattern: languageEntry.providerPackageScaffold.packagePattern,
          manifestFileName: languageEntry.providerPackageScaffold.manifestFileName,
          readmeFileName: languageEntry.providerPackageScaffold.readmeFileName,
          sourceFilePattern: languageEntry.providerPackageScaffold.sourceFilePattern,
          sourceSymbolPattern: languageEntry.providerPackageScaffold.sourceSymbolPattern,
          templateTokens: [...(languageEntry.providerPackageScaffold.templateTokens ?? [])],
          sourceTemplateTokens: [
            ...(languageEntry.providerPackageScaffold.sourceTemplateTokens ?? []),
          ],
          referenceProviderKey: languageEntry.providerPackageScaffold.referenceProviderKey,
          referenceStatus: languageEntry.providerPackageScaffold.referenceStatus,
          referenceRuntimeBridgeStatus:
            languageEntry.providerPackageScaffold.referenceRuntimeBridgeStatus,
          referenceVendorSdkPackage:
            languageEntry.providerPackageScaffold.referenceVendorSdkPackage,
          referenceVendorSdkVersion:
            languageEntry.providerPackageScaffold.referenceVendorSdkVersion,
          runtimeBridgeStatus: languageEntry.providerPackageScaffold.runtimeBridgeStatus,
          rootPublic: languageEntry.providerPackageScaffold.rootPublic === true,
          status: languageEntry.providerPackageScaffold.status,
        }
      : undefined,
  }));
}

function renderReservedLanguageWorkspaceCatalogPlan(languageEntry, assembly) {
  if (typeof languageEntry.workspaceCatalogRelativePath !== 'string') {
    return [];
  }

  const entries = buildLanguageWorkspaceCatalogEntries(assembly);

  switch (languageEntry.language) {
    case 'flutter': {
      const workspaceEntries = entries
        .map(
          (entry) => `    MailLanguageWorkspaceCatalogEntry(
      language: ${q(entry.language)},
      workspace: ${q(entry.workspace)},
      workspaceCatalogRelativePath: ${q(entry.workspaceCatalogRelativePath)},
      displayName: ${q(entry.displayName)},
      publicPackage: ${q(entry.publicPackage)},
      maturityTier: ${q(entry.maturityTier)},
      controlSdk: ${entry.controlSdk ? 'true' : 'false'},
      runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'},
      currentRole: ${q(entry.currentRole)},
      workspaceSummary: ${q(entry.workspaceSummary)},
      roleHighlights: <String>[
${entry.roleHighlights.map((roleHighlight) => `        ${q(roleHighlight)},`).join('\n')}
      ],
      defaultProviderContract: MailLanguageWorkspaceDefaultProviderContract(
        providerKey: ${q(entry.defaultProviderContract?.providerKey ?? '')},
        pluginId: ${q(entry.defaultProviderContract?.pluginId ?? '')},
        driverId: ${q(entry.defaultProviderContract?.driverId ?? '')},
      ),
      providerSelectionContract: MailLanguageWorkspaceProviderSelectionContract(
        sourceTerms: <String>[${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}],
        precedence: <String>[${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}],
        defaultSource: ${q(entry.providerSelectionContract?.defaultSource ?? '')},
      ),
      providerSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract(
        statusTerms: <String>[${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')}],
      ),
      providerActivationContract: MailLanguageWorkspaceProviderActivationContract(
        statusTerms: <String>[${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')}],
      ),
      runtimeBaseline: ${entry.runtimeBaseline
        ? `MailLanguageWorkspaceRuntimeBaseline(
        vendorSdkPackage: ${q(entry.runtimeBaseline.vendorSdkPackage)},
        vendorSdkImportPath: ${q(entry.runtimeBaseline.vendorSdkImportPath)},
        recommendedEntrypoint: ${q(entry.runtimeBaseline.recommendedEntrypoint)},
        smokeCommand: ${q(entry.runtimeBaseline.smokeCommand)},
        smokeMode: ${q(entry.runtimeBaseline.smokeMode)},
        smokeVariants: <String>[${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}],
      )`
        : 'null'},
      metadataScaffold: MailLanguageWorkspaceMetadataScaffold(
        providerCatalogRelativePath: ${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')},
        capabilityCatalogRelativePath: ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')},
        providerExtensionCatalogRelativePath: ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')},
        providerPackageCatalogRelativePath: ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')},
        providerActivationCatalogRelativePath: ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')},
        providerSelectionRelativePath: ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')},
      ),
      resolutionScaffold: MailLanguageWorkspaceResolutionScaffold(
        driverManagerRelativePath: ${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')},
        dataSourceRelativePath: ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')},
        providerSupportRelativePath: ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')},
        providerPackageLoaderRelativePath: ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')},
      ),
      providerPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract(
        modeTerms: <String>[${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}],
        rootPublicPolicyTerms: <String>[${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}],
        lifecycleStatusTerms: <String>[${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}],
        runtimeBridgeStatusTerms: <String>[${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}],
      ),
      providerPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary(
        mode: ${q(entry.providerPackageBoundary?.mode ?? '')},
        rootPublicPolicy: ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')},
        lifecycleStatusTerms: <String>[${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}],
        runtimeBridgeStatusTerms: <String>[${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}],
      ),
      providerPackageScaffold: ${entry.providerPackageScaffold
        ? `MailLanguageWorkspaceProviderPackageScaffold(
        relativePath: ${q(entry.providerPackageScaffold.relativePath)},
        directoryPattern: ${q(entry.providerPackageScaffold.directoryPattern)},
        packagePattern: ${q(entry.providerPackageScaffold.packagePattern)},
        manifestFileName: ${q(entry.providerPackageScaffold.manifestFileName)},
        readmeFileName: ${q(entry.providerPackageScaffold.readmeFileName)},
        sourceFilePattern: ${q(entry.providerPackageScaffold.sourceFilePattern)},
        sourceSymbolPattern: ${q(entry.providerPackageScaffold.sourceSymbolPattern)},
        templateTokens: <String>[${entry.providerPackageScaffold.templateTokens.map(q).join(', ')}],
        sourceTemplateTokens: <String>[${entry.providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')}],
        referenceProviderKey: ${qNullable(entry.providerPackageScaffold.referenceProviderKey)},
        referenceStatus: ${qNullable(entry.providerPackageScaffold.referenceStatus)},
        referenceRuntimeBridgeStatus: ${qNullable(entry.providerPackageScaffold.referenceRuntimeBridgeStatus)},
        referenceVendorSdkPackage: ${qNullable(entry.providerPackageScaffold.referenceVendorSdkPackage)},
        referenceVendorSdkVersion: ${qNullable(entry.providerPackageScaffold.referenceVendorSdkVersion)},
        runtimeBridgeStatus: ${q(entry.providerPackageScaffold.runtimeBridgeStatus)},
        rootPublic: ${entry.providerPackageScaffold.rootPublic ? 'true' : 'false'},
        status: ${q(entry.providerPackageScaffold.status)},
      )`
        : 'null'},
    ),`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
final class MailLanguageWorkspaceCatalogEntry {
  const MailLanguageWorkspaceCatalogEntry({
    required this.language,
    required this.workspace,
    required this.workspaceCatalogRelativePath,
    required this.displayName,
    required this.publicPackage,
    required this.maturityTier,
    required this.controlSdk,
    required this.runtimeBridge,
    required this.currentRole,
    required this.workspaceSummary,
    required this.roleHighlights,
    required this.defaultProviderContract,
    required this.providerSelectionContract,
    required this.providerSuppoMailontract,
    required this.providerActivationContract,
    required this.runtimeBaseline,
    required this.metadataScaffold,
    required this.resolutionScaffold,
    required this.providerPackageBoundaryContract,
    required this.providerPackageBoundary,
    required this.providerPackageScaffold,
  });

  final String language;
  final String workspace;
  final String workspaceCatalogRelativePath;
  final String displayName;
  final String publicPackage;
  final String maturityTier;
  final bool controlSdk;
  final bool runtimeBridge;
  final String currentRole;
  final String workspaceSummary;
  final List<String> roleHighlights;
  final MailLanguageWorkspaceDefaultProviderContract defaultProviderContract;
  final MailLanguageWorkspaceProviderSelectionContract providerSelectionContract;
  final MailLanguageWorkspaceProviderSuppoMailontract providerSuppoMailontract;
  final MailLanguageWorkspaceProviderActivationContract providerActivationContract;
  final MailLanguageWorkspaceRuntimeBaseline? runtimeBaseline;
  final MailLanguageWorkspaceMetadataScaffold metadataScaffold;
  final MailLanguageWorkspaceResolutionScaffold resolutionScaffold;
  final MailLanguageWorkspaceProviderPackageBoundaryContract providerPackageBoundaryContract;
  final MailLanguageWorkspaceProviderPackageBoundary providerPackageBoundary;
  final MailLanguageWorkspaceProviderPackageScaffold? providerPackageScaffold;
}

final class MailLanguageWorkspaceDefaultProviderContract {
  const MailLanguageWorkspaceDefaultProviderContract({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
}

final class MailLanguageWorkspaceProviderSelectionContract {
  const MailLanguageWorkspaceProviderSelectionContract({
    required this.sourceTerms,
    required this.precedence,
    required this.defaultSource,
  });

  final List<String> sourceTerms;
  final List<String> precedence;
  final String defaultSource;
}

final class MailLanguageWorkspaceProviderSuppoMailontract {
  const MailLanguageWorkspaceProviderSuppoMailontract({
    required this.statusTerms,
  });

  final List<String> statusTerms;
}

final class MailLanguageWorkspaceProviderActivationContract {
  const MailLanguageWorkspaceProviderActivationContract({
    required this.statusTerms,
  });

  final List<String> statusTerms;
}

final class MailLanguageWorkspaceRuntimeBaseline {
  const MailLanguageWorkspaceRuntimeBaseline({
    required this.vendorSdkPackage,
    required this.vendorSdkImportPath,
    required this.recommendedEntrypoint,
    required this.smokeCommand,
    required this.smokeMode,
    required this.smokeVariants,
  });

  final String vendorSdkPackage;
  final String vendorSdkImportPath;
  final String recommendedEntrypoint;
  final String smokeCommand;
  final String smokeMode;
  final List<String> smokeVariants;
}

final class MailLanguageWorkspaceMetadataScaffold {
  const MailLanguageWorkspaceMetadataScaffold({
    required this.providerCatalogRelativePath,
    required this.capabilityCatalogRelativePath,
    required this.providerExtensionCatalogRelativePath,
    required this.providerPackageCatalogRelativePath,
    required this.providerActivationCatalogRelativePath,
    required this.providerSelectionRelativePath,
  });

  final String providerCatalogRelativePath;
  final String capabilityCatalogRelativePath;
  final String providerExtensionCatalogRelativePath;
  final String providerPackageCatalogRelativePath;
  final String providerActivationCatalogRelativePath;
  final String providerSelectionRelativePath;
}

final class MailLanguageWorkspaceResolutionScaffold {
  const MailLanguageWorkspaceResolutionScaffold({
    required this.driverManagerRelativePath,
    required this.dataSourceRelativePath,
    required this.providerSupportRelativePath,
    required this.providerPackageLoaderRelativePath,
  });

  final String driverManagerRelativePath;
  final String dataSourceRelativePath;
  final String providerSupportRelativePath;
  final String providerPackageLoaderRelativePath;
}

final class MailLanguageWorkspaceProviderPackageBoundaryContract {
  const MailLanguageWorkspaceProviderPackageBoundaryContract({
    required this.modeTerms,
    required this.rootPublicPolicyTerms,
    required this.lifecycleStatusTerms,
    required this.runtimeBridgeStatusTerms,
  });

  final List<String> modeTerms;
  final List<String> rootPublicPolicyTerms;
  final List<String> lifecycleStatusTerms;
  final List<String> runtimeBridgeStatusTerms;
}

final class MailLanguageWorkspaceProviderPackageBoundary {
  const MailLanguageWorkspaceProviderPackageBoundary({
    required this.mode,
    required this.rootPublicPolicy,
    required this.lifecycleStatusTerms,
    required this.runtimeBridgeStatusTerms,
  });

  final String mode;
  final String rootPublicPolicy;
  final List<String> lifecycleStatusTerms;
  final List<String> runtimeBridgeStatusTerms;
}

final class MailLanguageWorkspaceProviderPackageScaffold {
  const MailLanguageWorkspaceProviderPackageScaffold({
    required this.relativePath,
    required this.directoryPattern,
    required this.packagePattern,
    required this.manifestFileName,
    required this.readmeFileName,
    required this.sourceFilePattern,
    required this.sourceSymbolPattern,
    required this.templateTokens,
    required this.sourceTemplateTokens,
    required this.referenceProviderKey,
    required this.referenceStatus,
    required this.referenceRuntimeBridgeStatus,
    required this.referenceVendorSdkPackage,
    required this.referenceVendorSdkVersion,
    required this.runtimeBridgeStatus,
    required this.rootPublic,
    required this.status,
  });

  final String relativePath;
  final String directoryPattern;
  final String packagePattern;
  final String manifestFileName;
  final String readmeFileName;
  final String sourceFilePattern;
  final String sourceSymbolPattern;
  final List<String> templateTokens;
  final List<String> sourceTemplateTokens;
  final String? referenceProviderKey;
  final String? referenceStatus;
  final String? referenceRuntimeBridgeStatus;
  final String? referenceVendorSdkPackage;
  final String? referenceVendorSdkVersion;
  final String runtimeBridgeStatus;
  final bool rootPublic;
  final String status;
}

final class MailLanguageWorkspaceCatalog {
  static const List<MailLanguageWorkspaceCatalogEntry> entries =
      <MailLanguageWorkspaceCatalogEntry>[
${workspaceEntries}
      ];

  const MailLanguageWorkspaceCatalog._();
}

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    case 'rust': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `    MailLanguageWorkspaceCatalogEntry { language: ${q(entry.language)}, workspace: ${q(entry.workspace)}, workspaceCatalogRelativePath: ${q(entry.workspaceCatalogRelativePath)}, displayName: ${q(entry.displayName)}, publicPackage: ${q(entry.publicPackage)}, maturityTier: ${q(entry.maturityTier)}, controlSdk: ${entry.controlSdk ? 'true' : 'false'}, runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'}, currentRole: ${q(entry.currentRole)}, workspaceSummary: ${q(entry.workspaceSummary)}, roleHighlights: &[${entry.roleHighlights.map(q).join(', ')}], defaultProviderContract: MailLanguageWorkspaceDefaultProviderContract { providerKey: ${q(entry.defaultProviderContract?.providerKey ?? '')}, pluginId: ${q(entry.defaultProviderContract?.pluginId ?? '')}, driverId: ${q(entry.defaultProviderContract?.driverId ?? '')} }, providerSelectionContract: MailLanguageWorkspaceProviderSelectionContract { sourceTerms: &[${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}], precedence: &[${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}], defaultSource: ${q(entry.providerSelectionContract?.defaultSource ?? '')} }, providerSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract { statusTerms: &[${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')}] }, providerActivationContract: MailLanguageWorkspaceProviderActivationContract { statusTerms: &[${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')}] }, runtimeBaseline: ${entry.runtimeBaseline ? `Some(MailLanguageWorkspaceRuntimeBaseline { vendorSdkPackage: ${q(entry.runtimeBaseline.vendorSdkPackage)}, vendorSdkImportPath: ${q(entry.runtimeBaseline.vendorSdkImportPath)}, recommendedEntrypoint: ${q(entry.runtimeBaseline.recommendedEntrypoint)}, smokeCommand: ${q(entry.runtimeBaseline.smokeCommand)}, smokeMode: ${q(entry.runtimeBaseline.smokeMode)}, smokeVariants: &[${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}] })` : 'None'}, metadataScaffold: MailLanguageWorkspaceMetadataScaffold { providerCatalogRelativePath: ${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, capabilityCatalogRelativePath: ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, providerExtensionCatalogRelativePath: ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, providerPackageCatalogRelativePath: ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, providerActivationCatalogRelativePath: ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, providerSelectionRelativePath: ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')} }, resolutionScaffold: MailLanguageWorkspaceResolutionScaffold { driverManagerRelativePath: ${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, dataSourceRelativePath: ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, providerSupportRelativePath: ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, providerPackageLoaderRelativePath: ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')} }, providerPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract { modeTerms: &[${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}], rootPublicPolicyTerms: &[${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}], lifecycleStatusTerms: &[${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}], runtimeBridgeStatusTerms: &[${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}] }, providerPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary { mode: ${q(entry.providerPackageBoundary?.mode ?? '')}, rootPublicPolicy: ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, lifecycleStatusTerms: &[${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}], runtimeBridgeStatusTerms: &[${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}] }, providerPackageScaffold: ${entry.providerPackageScaffold ? `Some(MailLanguageWorkspaceProviderPackageScaffold { relativePath: ${q(entry.providerPackageScaffold.relativePath)}, directoryPattern: ${q(entry.providerPackageScaffold.directoryPattern)}, packagePattern: ${q(entry.providerPackageScaffold.packagePattern)}, manifestFileName: ${q(entry.providerPackageScaffold.manifestFileName)}, readmeFileName: ${q(entry.providerPackageScaffold.readmeFileName)}, sourceFilePattern: ${q(entry.providerPackageScaffold.sourceFilePattern)}, sourceSymbolPattern: ${q(entry.providerPackageScaffold.sourceSymbolPattern)}, templateTokens: &[${entry.providerPackageScaffold.templateTokens.map(q).join(', ')}], sourceTemplateTokens: &[${entry.providerPackageScaffold.sourceTemplateTokens.map(q).join(', ')}], referenceProviderKey: ${qRustOption(entry.providerPackageScaffold.referenceProviderKey)}, referenceStatus: ${qRustOption(entry.providerPackageScaffold.referenceStatus)}, referenceRuntimeBridgeStatus: ${qRustOption(entry.providerPackageScaffold.referenceRuntimeBridgeStatus)}, referenceVendorSdkPackage: ${qRustOption(entry.providerPackageScaffold.referenceVendorSdkPackage)}, referenceVendorSdkVersion: ${qRustOption(entry.providerPackageScaffold.referenceVendorSdkVersion)}, runtimeBridgeStatus: ${q(entry.providerPackageScaffold.runtimeBridgeStatus)}, rootPublic: ${entry.providerPackageScaffold.rootPublic ? 'true' : 'false'}, status: ${q(entry.providerPackageScaffold.status)} })` : 'None'} },`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceDefaultProviderContract {
    pub providerKey: &'static str,
    pub pluginId: &'static str,
    pub driverId: &'static str,
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceProviderSelectionContract {
    pub sourceTerms: &'static [&'static str],
    pub precedence: &'static [&'static str],
    pub defaultSource: &'static str,
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceProviderSuppoMailontract {
    pub statusTerms: &'static [&'static str],
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceProviderActivationContract {
    pub statusTerms: &'static [&'static str],
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceRuntimeBaseline {
    pub vendorSdkPackage: &'static str,
    pub vendorSdkImportPath: &'static str,
    pub recommendedEntrypoint: &'static str,
    pub smokeCommand: &'static str,
    pub smokeMode: &'static str,
    pub smokeVariants: &'static [&'static str],
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceMetadataScaffold {
    pub providerCatalogRelativePath: &'static str,
    pub capabilityCatalogRelativePath: &'static str,
    pub providerExtensionCatalogRelativePath: &'static str,
    pub providerPackageCatalogRelativePath: &'static str,
    pub providerActivationCatalogRelativePath: &'static str,
    pub providerSelectionRelativePath: &'static str,
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceResolutionScaffold {
    pub driverManagerRelativePath: &'static str,
    pub dataSourceRelativePath: &'static str,
    pub providerSupportRelativePath: &'static str,
    pub providerPackageLoaderRelativePath: &'static str,
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceProviderPackageBoundaryContract {
    pub modeTerms: &'static [&'static str],
    pub rootPublicPolicyTerms: &'static [&'static str],
    pub lifecycleStatusTerms: &'static [&'static str],
    pub runtimeBridgeStatusTerms: &'static [&'static str],
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceProviderPackageBoundary {
    pub mode: &'static str,
    pub rootPublicPolicy: &'static str,
    pub lifecycleStatusTerms: &'static [&'static str],
    pub runtimeBridgeStatusTerms: &'static [&'static str],
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceProviderPackageScaffold {
    pub relativePath: &'static str,
    pub directoryPattern: &'static str,
    pub packagePattern: &'static str,
    pub manifestFileName: &'static str,
    pub readmeFileName: &'static str,
    pub sourceFilePattern: &'static str,
    pub sourceSymbolPattern: &'static str,
    pub templateTokens: &'static [&'static str],
    pub sourceTemplateTokens: &'static [&'static str],
    pub referenceProviderKey: Option<&'static str>,
    pub referenceStatus: Option<&'static str>,
    pub referenceRuntimeBridgeStatus: Option<&'static str>,
    pub referenceVendorSdkPackage: Option<&'static str>,
    pub referenceVendorSdkVersion: Option<&'static str>,
    pub runtimeBridgeStatus: &'static str,
    pub rootPublic: bool,
    pub status: &'static str,
}

#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailLanguageWorkspaceCatalogEntry {
    pub language: &'static str,
    pub workspace: &'static str,
    pub workspaceCatalogRelativePath: &'static str,
    pub displayName: &'static str,
    pub publicPackage: &'static str,
    pub maturityTier: &'static str,
    pub controlSdk: bool,
    pub runtimeBridge: bool,
    pub currentRole: &'static str,
    pub workspaceSummary: &'static str,
    pub roleHighlights: &'static [&'static str],
    pub defaultProviderContract: MailLanguageWorkspaceDefaultProviderContract,
    pub providerSelectionContract: MailLanguageWorkspaceProviderSelectionContract,
    pub providerSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract,
    pub providerActivationContract: MailLanguageWorkspaceProviderActivationContract,
    pub runtimeBaseline: Option<MailLanguageWorkspaceRuntimeBaseline>,
    pub metadataScaffold: MailLanguageWorkspaceMetadataScaffold,
    pub resolutionScaffold: MailLanguageWorkspaceResolutionScaffold,
    pub providerPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract,
    pub providerPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary,
    pub providerPackageScaffold: Option<MailLanguageWorkspaceProviderPackageScaffold>,
}

pub struct MailLanguageWorkspaceCatalog;

pub const OFFICIAL_mail_LANGUAGE_WORKSPACES: [MailLanguageWorkspaceCatalogEntry; ${entries.length}] = [
${workspaceEntries}
];

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    case 'java': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `      new MailLanguageWorkspaceCatalogEntry(${q(entry.language)}, ${q(entry.workspace)}, ${q(entry.workspaceCatalogRelativePath)}, ${q(entry.displayName)}, ${q(entry.publicPackage)}, ${q(entry.maturityTier)}, ${entry.controlSdk ? 'true' : 'false'}, ${entry.runtimeBridge ? 'true' : 'false'}, ${q(entry.currentRole)}, ${q(entry.workspaceSummary)}, List.of(${entry.roleHighlights.map(q).join(', ')}), new MailLanguageWorkspaceDefaultProviderContract(${q(entry.defaultProviderContract?.providerKey ?? '')}, ${q(entry.defaultProviderContract?.pluginId ?? '')}, ${q(entry.defaultProviderContract?.driverId ?? '')}), new MailLanguageWorkspaceProviderSelectionContract(List.of(${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}), List.of(${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}), ${q(entry.providerSelectionContract?.defaultSource ?? '')}), new MailLanguageWorkspaceProviderSuppoMailontract(List.of(${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')})), new MailLanguageWorkspaceProviderActivationContract(List.of(${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')})), ${entry.runtimeBaseline ? `new MailLanguageWorkspaceRuntimeBaseline(${q(entry.runtimeBaseline.vendorSdkPackage)}, ${q(entry.runtimeBaseline.vendorSdkImportPath)}, ${q(entry.runtimeBaseline.recommendedEntrypoint)}, ${q(entry.runtimeBaseline.smokeCommand)}, ${q(entry.runtimeBaseline.smokeMode)}, List.of(${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}))` : 'null'}, new MailLanguageWorkspaceMetadataScaffold(${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')}), new MailLanguageWorkspaceResolutionScaffold(${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')}), new MailLanguageWorkspaceProviderPackageBoundaryContract(List.of(${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}), List.of(${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}), List.of(${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}), List.of(${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')})), new MailLanguageWorkspaceProviderPackageBoundary(${q(entry.providerPackageBoundary?.mode ?? '')}, ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, List.of(${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}), List.of(${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')})), ${renderProviderPackageScaffoldInitializer('java', entry.providerPackageScaffold)})`,
        )
        .join(',\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailLanguageWorkspaceCatalog {

  public static final List<MailLanguageWorkspaceCatalogEntry> ENTRIES = List.of(
${workspaceEntries}
  );

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}

  private MailLanguageWorkspaceCatalog() {
  }

  public record MailLanguageWorkspaceCatalogEntry(
      String language,
      String workspace,
      String workspaceCatalogRelativePath,
      String displayName,
      String publicPackage,
      String maturityTier,
      boolean controlSdk,
      boolean runtimeBridge,
      String currentRole,
      String workspaceSummary,
      List<String> roleHighlights,
      MailLanguageWorkspaceDefaultProviderContract defaultProviderContract,
      MailLanguageWorkspaceProviderSelectionContract providerSelectionContract,
      MailLanguageWorkspaceProviderSuppoMailontract providerSuppoMailontract,
      MailLanguageWorkspaceProviderActivationContract providerActivationContract,
      MailLanguageWorkspaceRuntimeBaseline runtimeBaseline,
      MailLanguageWorkspaceMetadataScaffold metadataScaffold,
      MailLanguageWorkspaceResolutionScaffold resolutionScaffold,
      MailLanguageWorkspaceProviderPackageBoundaryContract providerPackageBoundaryContract,
      MailLanguageWorkspaceProviderPackageBoundary providerPackageBoundary,
      MailLanguageWorkspaceProviderPackageScaffold providerPackageScaffold
  ) {
  }

  public record MailLanguageWorkspaceDefaultProviderContract(
      String providerKey,
      String pluginId,
      String driverId
  ) {
  }

  public record MailLanguageWorkspaceProviderSelectionContract(
      List<String> sourceTerms,
      List<String> precedence,
      String defaultSource
  ) {
  }

  public record MailLanguageWorkspaceProviderSuppoMailontract(
      List<String> statusTerms
  ) {
  }

  public record MailLanguageWorkspaceProviderActivationContract(
      List<String> statusTerms
  ) {
  }

  public record MailLanguageWorkspaceRuntimeBaseline(
      String vendorSdkPackage,
      String vendorSdkImportPath,
      String recommendedEntrypoint,
      String smokeCommand,
      String smokeMode,
      List<String> smokeVariants
  ) {
  }

  public record MailLanguageWorkspaceMetadataScaffold(
      String providerCatalogRelativePath,
      String capabilityCatalogRelativePath,
      String providerExtensionCatalogRelativePath,
      String providerPackageCatalogRelativePath,
      String providerActivationCatalogRelativePath,
      String providerSelectionRelativePath
  ) {
  }

  public record MailLanguageWorkspaceResolutionScaffold(
      String driverManagerRelativePath,
      String dataSourceRelativePath,
      String providerSupportRelativePath,
      String providerPackageLoaderRelativePath
  ) {
  }

  public record MailLanguageWorkspaceProviderPackageBoundaryContract(
      List<String> modeTerms,
      List<String> rootPublicPolicyTerms,
      List<String> lifecycleStatusTerms,
      List<String> runtimeBridgeStatusTerms
  ) {
  }

  public record MailLanguageWorkspaceProviderPackageBoundary(
      String mode,
      String rootPublicPolicy,
      List<String> lifecycleStatusTerms,
      List<String> runtimeBridgeStatusTerms
  ) {
  }

  public record MailLanguageWorkspaceProviderPackageScaffold(
      String relativePath,
      String directoryPattern,
      String packagePattern,
      String manifestFileName,
      String readmeFileName,
      String sourceFilePattern,
      String sourceSymbolPattern,
      List<String> templateTokens,
      List<String> sourceTemplateTokens,
      String referenceProviderKey,
      String referenceStatus,
      String referenceRuntimeBridgeStatus,
      String referenceVendorSdkPackage,
      String referenceVendorSdkVersion,
      String runtimeBridgeStatus,
      boolean rootPublic,
      String status
  ) {
  }
}
`),
        },
      ];
    }
    case 'csharp': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `        new(${q(entry.language)}, ${q(entry.workspace)}, ${q(entry.workspaceCatalogRelativePath)}, ${q(entry.displayName)}, ${q(entry.publicPackage)}, ${q(entry.maturityTier)}, ${entry.controlSdk ? 'true' : 'false'}, ${entry.runtimeBridge ? 'true' : 'false'}, ${q(entry.currentRole)}, ${q(entry.workspaceSummary)}, new List<string> { ${entry.roleHighlights.map(q).join(', ')} }, new(${q(entry.defaultProviderContract?.providerKey ?? '')}, ${q(entry.defaultProviderContract?.pluginId ?? '')}, ${q(entry.defaultProviderContract?.driverId ?? '')}), new(new List<string> { ${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')} }, new List<string> { ${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')} }, ${q(entry.providerSelectionContract?.defaultSource ?? '')}), new(new List<string> { ${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')} }), new(new List<string> { ${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')} }), ${entry.runtimeBaseline ? `new(${q(entry.runtimeBaseline.vendorSdkPackage)}, ${q(entry.runtimeBaseline.vendorSdkImportPath)}, ${q(entry.runtimeBaseline.recommendedEntrypoint)}, ${q(entry.runtimeBaseline.smokeCommand)}, ${q(entry.runtimeBaseline.smokeMode)}, new List<string> { ${entry.runtimeBaseline.smokeVariants.map(q).join(', ')} })` : 'null'}, new(${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')}), new(${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')}), new(new List<string> { ${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')} }, new List<string> { ${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')} }, new List<string> { ${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')} }, new List<string> { ${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')} }), new(${q(entry.providerPackageBoundary?.mode ?? '')}, ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, new List<string> { ${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')} }, new List<string> { ${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')} }), ${renderProviderPackageScaffoldInitializer('csharp', entry.providerPackageScaffold)}),`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
using System.Collections.Generic;
using System.Linq;

namespace Sdkwork.Mail.Sdk;

public sealed record MailLanguageWorkspaceCatalogEntry(
    string language,
    string workspace,
    string workspaceCatalogRelativePath,
    string displayName,
    string publicPackage,
    string maturityTier,
    bool controlSdk,
    bool runtimeBridge,
    string currentRole,
    string workspaceSummary,
    IReadOnlyList<string> roleHighlights,
    MailLanguageWorkspaceDefaultProviderContract defaultProviderContract,
    MailLanguageWorkspaceProviderSelectionContract providerSelectionContract,
    MailLanguageWorkspaceProviderSuppoMailontract providerSuppoMailontract,
    MailLanguageWorkspaceProviderActivationContract providerActivationContract,
    MailLanguageWorkspaceRuntimeBaseline? runtimeBaseline,
    MailLanguageWorkspaceMetadataScaffold metadataScaffold,
    MailLanguageWorkspaceResolutionScaffold resolutionScaffold,
    MailLanguageWorkspaceProviderPackageBoundaryContract providerPackageBoundaryContract,
    MailLanguageWorkspaceProviderPackageBoundary providerPackageBoundary,
    MailLanguageWorkspaceProviderPackageScaffold? providerPackageScaffold
);

public sealed record MailLanguageWorkspaceDefaultProviderContract(
    string providerKey,
    string pluginId,
    string driverId
);

public sealed record MailLanguageWorkspaceProviderSelectionContract(
    IReadOnlyList<string> sourceTerms,
    IReadOnlyList<string> precedence,
    string defaultSource
);

public sealed record MailLanguageWorkspaceProviderSuppoMailontract(
    IReadOnlyList<string> statusTerms
);

public sealed record MailLanguageWorkspaceProviderActivationContract(
    IReadOnlyList<string> statusTerms
);

public sealed record MailLanguageWorkspaceRuntimeBaseline(
    string vendorSdkPackage,
    string vendorSdkImportPath,
    string recommendedEntrypoint,
    string smokeCommand,
    string smokeMode,
    IReadOnlyList<string> smokeVariants
);

public sealed record MailLanguageWorkspaceMetadataScaffold(
    string providerCatalogRelativePath,
    string capabilityCatalogRelativePath,
    string providerExtensionCatalogRelativePath,
    string providerPackageCatalogRelativePath,
    string providerActivationCatalogRelativePath,
    string providerSelectionRelativePath
);

public sealed record MailLanguageWorkspaceResolutionScaffold(
    string driverManagerRelativePath,
    string dataSourceRelativePath,
    string providerSupportRelativePath,
    string providerPackageLoaderRelativePath
);

public sealed record MailLanguageWorkspaceProviderPackageBoundaryContract(
    IReadOnlyList<string> modeTerms,
    IReadOnlyList<string> rootPublicPolicyTerms,
    IReadOnlyList<string> lifecycleStatusTerms,
    IReadOnlyList<string> runtimeBridgeStatusTerms
);

public sealed record MailLanguageWorkspaceProviderPackageBoundary(
    string mode,
    string rootPublicPolicy,
    IReadOnlyList<string> lifecycleStatusTerms,
    IReadOnlyList<string> runtimeBridgeStatusTerms
);

public sealed record MailLanguageWorkspaceProviderPackageScaffold(
    string relativePath,
    string directoryPattern,
    string packagePattern,
    string manifestFileName,
    string readmeFileName,
    string sourceFilePattern,
    string sourceSymbolPattern,
    IReadOnlyList<string> templateTokens,
    IReadOnlyList<string> sourceTemplateTokens,
    string? referenceProviderKey,
    string? referenceStatus,
    string? referenceRuntimeBridgeStatus,
    string? referenceVendorSdkPackage,
    string? referenceVendorSdkVersion,
    string runtimeBridgeStatus,
    bool rootPublic,
    string status
);

public static class MailLanguageWorkspaceCatalog
{
    public static readonly IReadOnlyList<MailLanguageWorkspaceCatalogEntry> Entries =
    [
${workspaceEntries}
    ];

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
}
`),
        },
      ];
    }
    case 'swift': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `        .init(language: ${q(entry.language)}, workspace: ${q(entry.workspace)}, workspaceCatalogRelativePath: ${q(entry.workspaceCatalogRelativePath)}, displayName: ${q(entry.displayName)}, publicPackage: ${q(entry.publicPackage)}, maturityTier: ${q(entry.maturityTier)}, controlSdk: ${entry.controlSdk ? 'true' : 'false'}, runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'}, currentRole: ${q(entry.currentRole)}, workspaceSummary: ${q(entry.workspaceSummary)}, roleHighlights: [${entry.roleHighlights.map(q).join(', ')}], defaultProviderContract: .init(providerKey: ${q(entry.defaultProviderContract?.providerKey ?? '')}, pluginId: ${q(entry.defaultProviderContract?.pluginId ?? '')}, driverId: ${q(entry.defaultProviderContract?.driverId ?? '')}), providerSelectionContract: .init(sourceTerms: [${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}], precedence: [${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}], defaultSource: ${q(entry.providerSelectionContract?.defaultSource ?? '')}), providerSuppoMailontract: .init(statusTerms: [${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')}]), providerActivationContract: .init(statusTerms: [${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')}]), runtimeBaseline: ${entry.runtimeBaseline ? `.init(vendorSdkPackage: ${q(entry.runtimeBaseline.vendorSdkPackage)}, vendorSdkImportPath: ${q(entry.runtimeBaseline.vendorSdkImportPath)}, recommendedEntrypoint: ${q(entry.runtimeBaseline.recommendedEntrypoint)}, smokeCommand: ${q(entry.runtimeBaseline.smokeCommand)}, smokeMode: ${q(entry.runtimeBaseline.smokeMode)}, smokeVariants: [${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}])` : 'nil'}, metadataScaffold: .init(providerCatalogRelativePath: ${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, capabilityCatalogRelativePath: ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, providerExtensionCatalogRelativePath: ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, providerPackageCatalogRelativePath: ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, providerActivationCatalogRelativePath: ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, providerSelectionRelativePath: ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')}), resolutionScaffold: .init(driverManagerRelativePath: ${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, dataSourceRelativePath: ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, providerSupportRelativePath: ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, providerPackageLoaderRelativePath: ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')}), providerPackageBoundaryContract: .init(modeTerms: [${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}], rootPublicPolicyTerms: [${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}], lifecycleStatusTerms: [${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}], runtimeBridgeStatusTerms: [${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}]), providerPackageBoundary: .init(mode: ${q(entry.providerPackageBoundary?.mode ?? '')}, rootPublicPolicy: ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, lifecycleStatusTerms: [${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}], runtimeBridgeStatusTerms: [${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}]), providerPackageScaffold: ${renderProviderPackageScaffoldInitializer('swift', entry.providerPackageScaffold)}),`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
public struct MailLanguageWorkspaceCatalogEntry {
    public let language: String
    public let workspace: String
    public let workspaceCatalogRelativePath: String
    public let displayName: String
    public let publicPackage: String
    public let maturityTier: String
    public let controlSdk: Bool
    public let runtimeBridge: Bool
    public let currentRole: String
    public let workspaceSummary: String
    public let roleHighlights: [String]
    public let defaultProviderContract: MailLanguageWorkspaceDefaultProviderContract
    public let providerSelectionContract: MailLanguageWorkspaceProviderSelectionContract
    public let providerSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract
    public let providerActivationContract: MailLanguageWorkspaceProviderActivationContract
    public let runtimeBaseline: MailLanguageWorkspaceRuntimeBaseline?
    public let metadataScaffold: MailLanguageWorkspaceMetadataScaffold
    public let resolutionScaffold: MailLanguageWorkspaceResolutionScaffold
    public let providerPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract
    public let providerPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary
    public let providerPackageScaffold: MailLanguageWorkspaceProviderPackageScaffold?
}

public struct MailLanguageWorkspaceDefaultProviderContract {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
}

public struct MailLanguageWorkspaceProviderSelectionContract {
    public let sourceTerms: [String]
    public let precedence: [String]
    public let defaultSource: String
}

public struct MailLanguageWorkspaceProviderSuppoMailontract {
    public let statusTerms: [String]
}

public struct MailLanguageWorkspaceProviderActivationContract {
    public let statusTerms: [String]
}

public struct MailLanguageWorkspaceRuntimeBaseline {
    public let vendorSdkPackage: String
    public let vendorSdkImportPath: String
    public let recommendedEntrypoint: String
    public let smokeCommand: String
    public let smokeMode: String
    public let smokeVariants: [String]
}

public struct MailLanguageWorkspaceMetadataScaffold {
    public let providerCatalogRelativePath: String
    public let capabilityCatalogRelativePath: String
    public let providerExtensionCatalogRelativePath: String
    public let providerPackageCatalogRelativePath: String
    public let providerActivationCatalogRelativePath: String
    public let providerSelectionRelativePath: String
}

public struct MailLanguageWorkspaceResolutionScaffold {
    public let driverManagerRelativePath: String
    public let dataSourceRelativePath: String
    public let providerSupportRelativePath: String
    public let providerPackageLoaderRelativePath: String
}

public struct MailLanguageWorkspaceProviderPackageBoundaryContract {
    public let modeTerms: [String]
    public let rootPublicPolicyTerms: [String]
    public let lifecycleStatusTerms: [String]
    public let runtimeBridgeStatusTerms: [String]
}

public struct MailLanguageWorkspaceProviderPackageBoundary {
    public let mode: String
    public let rootPublicPolicy: String
    public let lifecycleStatusTerms: [String]
    public let runtimeBridgeStatusTerms: [String]
}

public struct MailLanguageWorkspaceProviderPackageScaffold {
    public let relativePath: String
    public let directoryPattern: String
    public let packagePattern: String
    public let manifestFileName: String
    public let readmeFileName: String
    public let sourceFilePattern: String
    public let sourceSymbolPattern: String
    public let templateTokens: [String]
    public let sourceTemplateTokens: [String]
    public let referenceProviderKey: String?
    public let referenceStatus: String?
    public let referenceRuntimeBridgeStatus: String?
    public let referenceVendorSdkPackage: String?
    public let referenceVendorSdkVersion: String?
    public let runtimeBridgeStatus: String
    public let rootPublic: Bool
    public let status: String
}

public enum MailLanguageWorkspaceCatalog {
    public static let entries: [MailLanguageWorkspaceCatalogEntry] = [
${workspaceEntries}
    ]

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
}
`),
        },
      ];
    }
    case 'kotlin': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `        MailLanguageWorkspaceCatalogEntry(${q(entry.language)}, ${q(entry.workspace)}, ${q(entry.workspaceCatalogRelativePath)}, ${q(entry.displayName)}, ${q(entry.publicPackage)}, ${q(entry.maturityTier)}, ${entry.controlSdk ? 'true' : 'false'}, ${entry.runtimeBridge ? 'true' : 'false'}, ${q(entry.currentRole)}, ${q(entry.workspaceSummary)}, listOf(${entry.roleHighlights.map(q).join(', ')}), MailLanguageWorkspaceDefaultProviderContract(${q(entry.defaultProviderContract?.providerKey ?? '')}, ${q(entry.defaultProviderContract?.pluginId ?? '')}, ${q(entry.defaultProviderContract?.driverId ?? '')}), MailLanguageWorkspaceProviderSelectionContract(listOf(${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}), listOf(${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}), ${q(entry.providerSelectionContract?.defaultSource ?? '')}), MailLanguageWorkspaceProviderSuppoMailontract(listOf(${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')})), MailLanguageWorkspaceProviderActivationContract(listOf(${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')})), ${entry.runtimeBaseline ? `MailLanguageWorkspaceRuntimeBaseline(${q(entry.runtimeBaseline.vendorSdkPackage)}, ${q(entry.runtimeBaseline.vendorSdkImportPath)}, ${q(entry.runtimeBaseline.recommendedEntrypoint)}, ${q(entry.runtimeBaseline.smokeCommand)}, ${q(entry.runtimeBaseline.smokeMode)}, listOf(${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}))` : 'null'}, MailLanguageWorkspaceMetadataScaffold(${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')}), MailLanguageWorkspaceResolutionScaffold(${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')}), MailLanguageWorkspaceProviderPackageBoundaryContract(listOf(${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}), listOf(${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}), listOf(${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}), listOf(${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')})), MailLanguageWorkspaceProviderPackageBoundary(${q(entry.providerPackageBoundary?.mode ?? '')}, ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, listOf(${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}), listOf(${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')})), ${renderProviderPackageScaffoldInitializer('kotlin', entry.providerPackageScaffold)}),`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
package com.sdkwork.Mail.metadata

data class MailLanguageWorkspaceCatalogEntry(
    val language: String,
    val workspace: String,
    val workspaceCatalogRelativePath: String,
    val displayName: String,
    val publicPackage: String,
    val maturityTier: String,
    val controlSdk: Boolean,
    val runtimeBridge: Boolean,
    val currentRole: String,
    val workspaceSummary: String,
    val roleHighlights: List<String>,
    val defaultProviderContract: MailLanguageWorkspaceDefaultProviderContract,
    val providerSelectionContract: MailLanguageWorkspaceProviderSelectionContract,
    val providerSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract,
    val providerActivationContract: MailLanguageWorkspaceProviderActivationContract,
    val runtimeBaseline: MailLanguageWorkspaceRuntimeBaseline?,
    val metadataScaffold: MailLanguageWorkspaceMetadataScaffold,
    val resolutionScaffold: MailLanguageWorkspaceResolutionScaffold,
    val providerPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract,
    val providerPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary,
    val providerPackageScaffold: MailLanguageWorkspaceProviderPackageScaffold?,
)

data class MailLanguageWorkspaceDefaultProviderContract(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
)

data class MailLanguageWorkspaceProviderSelectionContract(
    val sourceTerms: List<String>,
    val precedence: List<String>,
    val defaultSource: String,
)

data class MailLanguageWorkspaceProviderSuppoMailontract(
    val statusTerms: List<String>,
)

data class MailLanguageWorkspaceProviderActivationContract(
    val statusTerms: List<String>,
)

data class MailLanguageWorkspaceRuntimeBaseline(
    val vendorSdkPackage: String,
    val vendorSdkImportPath: String,
    val recommendedEntrypoint: String,
    val smokeCommand: String,
    val smokeMode: String,
    val smokeVariants: List<String>,
)

data class MailLanguageWorkspaceMetadataScaffold(
    val providerCatalogRelativePath: String,
    val capabilityCatalogRelativePath: String,
    val providerExtensionCatalogRelativePath: String,
    val providerPackageCatalogRelativePath: String,
    val providerActivationCatalogRelativePath: String,
    val providerSelectionRelativePath: String,
)

data class MailLanguageWorkspaceResolutionScaffold(
    val driverManagerRelativePath: String,
    val dataSourceRelativePath: String,
    val providerSupportRelativePath: String,
    val providerPackageLoaderRelativePath: String,
)

data class MailLanguageWorkspaceProviderPackageBoundaryContract(
    val modeTerms: List<String>,
    val rootPublicPolicyTerms: List<String>,
    val lifecycleStatusTerms: List<String>,
    val runtimeBridgeStatusTerms: List<String>,
)

data class MailLanguageWorkspaceProviderPackageBoundary(
    val mode: String,
    val rootPublicPolicy: String,
    val lifecycleStatusTerms: List<String>,
    val runtimeBridgeStatusTerms: List<String>,
)

data class MailLanguageWorkspaceProviderPackageScaffold(
    val relativePath: String,
    val directoryPattern: String,
    val packagePattern: String,
    val manifestFileName: String,
    val readmeFileName: String,
    val sourceFilePattern: String,
    val sourceSymbolPattern: String,
    val templateTokens: List<String>,
    val sourceTemplateTokens: List<String>,
    val referenceProviderKey: String?,
    val referenceStatus: String?,
    val referenceRuntimeBridgeStatus: String?,
    val referenceVendorSdkPackage: String?,
    val referenceVendorSdkVersion: String?,
    val runtimeBridgeStatus: String,
    val rootPublic: Boolean,
    val status: String,
)

object MailLanguageWorkspaceCatalog {
    val entries: List<MailLanguageWorkspaceCatalogEntry> = listOf(
${workspaceEntries}
    )

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
}
`),
        },
      ];
    }
    case 'go': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `    {Language: ${q(entry.language)}, Workspace: ${q(entry.workspace)}, WorkspaceCatalogRelativePath: ${q(entry.workspaceCatalogRelativePath)}, DisplayName: ${q(entry.displayName)}, PublicPackage: ${q(entry.publicPackage)}, MaturityTier: ${q(entry.maturityTier)}, ControlSdk: ${entry.controlSdk ? 'true' : 'false'}, RuntimeBridge: ${entry.runtimeBridge ? 'true' : 'false'}, CurrentRole: ${q(entry.currentRole)}, WorkspaceSummary: ${q(entry.workspaceSummary)}, RoleHighlights: []string{${entry.roleHighlights.map(q).join(', ')}}, DefaultProviderContract: MailLanguageWorkspaceDefaultProviderContract{ProviderKey: ${q(entry.defaultProviderContract?.providerKey ?? '')}, PluginId: ${q(entry.defaultProviderContract?.pluginId ?? '')}, DriverId: ${q(entry.defaultProviderContract?.driverId ?? '')}}, ProviderSelectionContract: MailLanguageWorkspaceProviderSelectionContract{SourceTerms: []string{${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}}, Precedence: []string{${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}}, DefaultSource: ${q(entry.providerSelectionContract?.defaultSource ?? '')}}, ProviderSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract{StatusTerms: []string{${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')}}}, ProviderActivationContract: MailLanguageWorkspaceProviderActivationContract{StatusTerms: []string{${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')}}}, RuntimeBaseline: ${entry.runtimeBaseline ? `&MailLanguageWorkspaceRuntimeBaseline{VendorSdkPackage: ${q(entry.runtimeBaseline.vendorSdkPackage)}, VendorSdkImportPath: ${q(entry.runtimeBaseline.vendorSdkImportPath)}, RecommendedEntrypoint: ${q(entry.runtimeBaseline.recommendedEntrypoint)}, SmokeCommand: ${q(entry.runtimeBaseline.smokeCommand)}, SmokeMode: ${q(entry.runtimeBaseline.smokeMode)}, SmokeVariants: []string{${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}}}` : 'nil'}, MetadataScaffold: MailLanguageWorkspaceMetadataScaffold{ProviderCatalogRelativePath: ${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, CapabilityCatalogRelativePath: ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, ProviderExtensionCatalogRelativePath: ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, ProviderPackageCatalogRelativePath: ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, ProviderActivationCatalogRelativePath: ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, ProviderSelectionRelativePath: ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')}}, ResolutionScaffold: MailLanguageWorkspaceResolutionScaffold{DriverManagerRelativePath: ${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, DataSourceRelativePath: ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, ProviderSupportRelativePath: ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, ProviderPackageLoaderRelativePath: ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')}}, ProviderPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract{ModeTerms: []string{${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}}, RootPublicPolicyTerms: []string{${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}}, LifecycleStatusTerms: []string{${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}}, RuntimeBridgeStatusTerms: []string{${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}}}, ProviderPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary{Mode: ${q(entry.providerPackageBoundary?.mode ?? '')}, RootPublicPolicy: ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, LifecycleStatusTerms: []string{${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}}, RuntimeBridgeStatusTerms: []string{${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}}}, ProviderPackageScaffold: ${renderProviderPackageScaffoldInitializer('go', entry.providerPackageScaffold)}},`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
package Mailstandard

func MailStringPtr(value string) *string {
    return &value
}

type MailLanguageWorkspaceCatalogEntry struct {
    Language                     string
    Workspace                    string
    WorkspaceCatalogRelativePath string
    DisplayName                  string
    PublicPackage                string
    MaturityTier                 string
    ControlSdk                   bool
    RuntimeBridge                bool
    CurrentRole                  string
    WorkspaceSummary             string
    RoleHighlights               []string
    DefaultProviderContract      MailLanguageWorkspaceDefaultProviderContract
    ProviderSelectionContract    MailLanguageWorkspaceProviderSelectionContract
    ProviderSuppoMailontract      MailLanguageWorkspaceProviderSuppoMailontract
    ProviderActivationContract   MailLanguageWorkspaceProviderActivationContract
    RuntimeBaseline              *MailLanguageWorkspaceRuntimeBaseline
    MetadataScaffold             MailLanguageWorkspaceMetadataScaffold
    ResolutionScaffold           MailLanguageWorkspaceResolutionScaffold
    ProviderPackageBoundaryContract MailLanguageWorkspaceProviderPackageBoundaryContract
    ProviderPackageBoundary      MailLanguageWorkspaceProviderPackageBoundary
    ProviderPackageScaffold      *MailLanguageWorkspaceProviderPackageScaffold
}

type MailLanguageWorkspaceDefaultProviderContract struct {
    ProviderKey string
    PluginId    string
    DriverId    string
}

type MailLanguageWorkspaceProviderSelectionContract struct {
    SourceTerms   []string
    Precedence    []string
    DefaultSource string
}

type MailLanguageWorkspaceProviderSuppoMailontract struct {
    StatusTerms []string
}

type MailLanguageWorkspaceProviderActivationContract struct {
    StatusTerms []string
}

type MailLanguageWorkspaceRuntimeBaseline struct {
    VendorSdkPackage        string
    VendorSdkImportPath     string
    RecommendedEntrypoint   string
    SmokeCommand            string
    SmokeMode               string
    SmokeVariants           []string
}

type MailLanguageWorkspaceMetadataScaffold struct {
    ProviderCatalogRelativePath       string
    CapabilityCatalogRelativePath     string
    ProviderExtensionCatalogRelativePath string
    ProviderPackageCatalogRelativePath string
    ProviderActivationCatalogRelativePath string
    ProviderSelectionRelativePath     string
}

type MailLanguageWorkspaceResolutionScaffold struct {
    DriverManagerRelativePath     string
    DataSourceRelativePath        string
    ProviderSupportRelativePath   string
    ProviderPackageLoaderRelativePath string
}

type MailLanguageWorkspaceProviderPackageBoundaryContract struct {
    ModeTerms                 []string
    RootPublicPolicyTerms     []string
    LifecycleStatusTerms      []string
    RuntimeBridgeStatusTerms  []string
}

type MailLanguageWorkspaceProviderPackageBoundary struct {
    Mode                     string
    RootPublicPolicy         string
    LifecycleStatusTerms     []string
    RuntimeBridgeStatusTerms []string
}

type MailLanguageWorkspaceProviderPackageScaffold struct {
    RelativePath        string
    DirectoryPattern    string
    PackagePattern      string
    ManifestFileName    string
    ReadmeFileName      string
    SourceFilePattern   string
    SourceSymbolPattern string
    TemplateTokens      []string
    SourceTemplateTokens []string
    ReferenceProviderKey *string
    ReferenceStatus *string
    ReferenceRuntimeBridgeStatus *string
    ReferenceVendorSdkPackage *string
    ReferenceVendorSdkVersion *string
    RuntimeBridgeStatus string
    RootPublic          bool
    Status              string
}

type MailLanguageWorkspaceCatalog struct{}

var OFFICIAL_mail_LANGUAGE_WORKSPACES = []MailLanguageWorkspaceCatalogEntry{
${workspaceEntries}
}

${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    case 'python': {
      const workspaceEntries = entries
        .map(
          (entry) =>
            `        MailLanguageWorkspaceCatalogEntry(${q(entry.language)}, ${q(entry.workspace)}, ${q(entry.workspaceCatalogRelativePath)}, ${q(entry.displayName)}, ${q(entry.publicPackage)}, ${q(entry.maturityTier)}, ${entry.controlSdk ? 'True' : 'False'}, ${entry.runtimeBridge ? 'True' : 'False'}, ${q(entry.currentRole)}, ${q(entry.workspaceSummary)}, [${entry.roleHighlights.map(q).join(', ')}], MailLanguageWorkspaceDefaultProviderContract(${q(entry.defaultProviderContract?.providerKey ?? '')}, ${q(entry.defaultProviderContract?.pluginId ?? '')}, ${q(entry.defaultProviderContract?.driverId ?? '')}), MailLanguageWorkspaceProviderSelectionContract([${(entry.providerSelectionContract?.sourceTerms ?? []).map(q).join(', ')}], [${(entry.providerSelectionContract?.precedence ?? []).map(q).join(', ')}], ${q(entry.providerSelectionContract?.defaultSource ?? '')}), MailLanguageWorkspaceProviderSuppoMailontract([${(entry.providerSuppoMailontract?.statusTerms ?? []).map(q).join(', ')}]), MailLanguageWorkspaceProviderActivationContract([${(entry.providerActivationContract?.statusTerms ?? []).map(q).join(', ')}]), ${entry.runtimeBaseline ? `MailLanguageWorkspaceRuntimeBaseline(${q(entry.runtimeBaseline.vendorSdkPackage)}, ${q(entry.runtimeBaseline.vendorSdkImportPath)}, ${q(entry.runtimeBaseline.recommendedEntrypoint)}, ${q(entry.runtimeBaseline.smokeCommand)}, ${q(entry.runtimeBaseline.smokeMode)}, [${entry.runtimeBaseline.smokeVariants.map(q).join(', ')}])` : 'None'}, MailLanguageWorkspaceMetadataScaffold(${q(entry.metadataScaffold?.providerCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.capabilityCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerExtensionCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerPackageCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerActivationCatalogRelativePath ?? '')}, ${q(entry.metadataScaffold?.providerSelectionRelativePath ?? '')}), MailLanguageWorkspaceResolutionScaffold(${q(entry.resolutionScaffold?.driverManagerRelativePath ?? '')}, ${q(entry.resolutionScaffold?.dataSourceRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerSupportRelativePath ?? '')}, ${q(entry.resolutionScaffold?.providerPackageLoaderRelativePath ?? '')}), MailLanguageWorkspaceProviderPackageBoundaryContract([${(entry.providerPackageBoundaryContract?.modeTerms ?? []).map(q).join(', ')}], [${(entry.providerPackageBoundaryContract?.rootPublicPolicyTerms ?? []).map(q).join(', ')}], [${(entry.providerPackageBoundaryContract?.lifecycleStatusTerms ?? []).map(q).join(', ')}], [${(entry.providerPackageBoundaryContract?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}]), MailLanguageWorkspaceProviderPackageBoundary(${q(entry.providerPackageBoundary?.mode ?? '')}, ${q(entry.providerPackageBoundary?.rootPublicPolicy ?? '')}, [${(entry.providerPackageBoundary?.lifecycleStatusTerms ?? []).map(q).join(', ')}], [${(entry.providerPackageBoundary?.runtimeBridgeStatusTerms ?? []).map(q).join(', ')}]), ${renderProviderPackageScaffoldInitializer('python', entry.providerPackageScaffold)}),`,
        )
        .join('\n');

      return [
        {
          relativePath: `${languageEntry.workspace}/${languageEntry.workspaceCatalogRelativePath}`,
          content: lines(`
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailLanguageWorkspaceCatalogEntry:
    language: str
    workspace: str
    workspaceCatalogRelativePath: str
    displayName: str
    publicPackage: str
    maturityTier: str
    controlSdk: bool
    runtimeBridge: bool
    currentRole: str
    workspaceSummary: str
    roleHighlights: list[str]
    defaultProviderContract: "MailLanguageWorkspaceDefaultProviderContract"
    providerSelectionContract: "MailLanguageWorkspaceProviderSelectionContract"
    providerSuppoMailontract: "MailLanguageWorkspaceProviderSuppoMailontract"
    providerActivationContract: "MailLanguageWorkspaceProviderActivationContract"
    runtimeBaseline: Optional["MailLanguageWorkspaceRuntimeBaseline"]
    metadataScaffold: "MailLanguageWorkspaceMetadataScaffold"
    resolutionScaffold: "MailLanguageWorkspaceResolutionScaffold"
    providerPackageBoundaryContract: "MailLanguageWorkspaceProviderPackageBoundaryContract"
    providerPackageBoundary: "MailLanguageWorkspaceProviderPackageBoundary"
    providerPackageScaffold: Optional["MailLanguageWorkspaceProviderPackageScaffold"]


@dataclass(frozen=True)
class MailLanguageWorkspaceDefaultProviderContract:
    providerKey: str
    pluginId: str
    driverId: str


@dataclass(frozen=True)
class MailLanguageWorkspaceProviderSelectionContract:
    sourceTerms: list[str]
    precedence: list[str]
    defaultSource: str


@dataclass(frozen=True)
class MailLanguageWorkspaceProviderSuppoMailontract:
    statusTerms: list[str]


@dataclass(frozen=True)
class MailLanguageWorkspaceProviderActivationContract:
    statusTerms: list[str]


@dataclass(frozen=True)
class MailLanguageWorkspaceRuntimeBaseline:
    vendorSdkPackage: str
    vendorSdkImportPath: str
    recommendedEntrypoint: str
    smokeCommand: str
    smokeMode: str
    smokeVariants: list[str]


@dataclass(frozen=True)
class MailLanguageWorkspaceMetadataScaffold:
    providerCatalogRelativePath: str
    capabilityCatalogRelativePath: str
    providerExtensionCatalogRelativePath: str
    providerPackageCatalogRelativePath: str
    providerActivationCatalogRelativePath: str
    providerSelectionRelativePath: str


@dataclass(frozen=True)
class MailLanguageWorkspaceResolutionScaffold:
    driverManagerRelativePath: str
    dataSourceRelativePath: str
    providerSupportRelativePath: str
    providerPackageLoaderRelativePath: str


@dataclass(frozen=True)
class MailLanguageWorkspaceProviderPackageBoundaryContract:
    modeTerms: list[str]
    rootPublicPolicyTerms: list[str]
    lifecycleStatusTerms: list[str]
    runtimeBridgeStatusTerms: list[str]


@dataclass(frozen=True)
class MailLanguageWorkspaceProviderPackageBoundary:
    mode: str
    rootPublicPolicy: str
    lifecycleStatusTerms: list[str]
    runtimeBridgeStatusTerms: list[str]


@dataclass(frozen=True)
class MailLanguageWorkspaceProviderPackageScaffold:
    relativePath: str
    directoryPattern: str
    packagePattern: str
    manifestFileName: str
    readmeFileName: str
    sourceFilePattern: str
    sourceSymbolPattern: str
    templateTokens: list[str]
    sourceTemplateTokens: list[str]
    referenceProviderKey: Optional[str]
    referenceStatus: Optional[str]
    referenceRuntimeBridgeStatus: Optional[str]
    referenceVendorSdkPackage: Optional[str]
    referenceVendorSdkVersion: Optional[str]
    runtimeBridgeStatus: str
    rootPublic: bool
    status: str


class MailLanguageWorkspaceCatalog:
    entries = [
${workspaceEntries}
    ]


${renderReservedLanguageWorkspaceLookupHelper(languageEntry.language)}
`),
        },
      ];
    }
    default:
      return [];
  }
}

function renderReservedLanguageRootPublicEntrypointPlan(languageEntry) {
  switch (languageEntry.language) {
    case 'flutter':
      return [
        {
          relativePath: `${languageEntry.workspace}/lib/mail_sdk.dart`,
          content: lines(`
library mail_sdk;

export 'src/mail_standard_contract.dart';
export 'src/mail_errors.dart';
export 'src/mail_types.dart';
export 'src/mail_provider_metadata.dart';
export 'src/mail_client.dart';
export 'src/mail_driver.dart';
export 'src/mail_runtime_surface.dart';
export 'src/mail_runtime_immutability.dart';
export 'src/mail_provider_catalog.dart';
export 'src/mail_provider_package_catalog.dart';
export 'src/mail_provider_activation_catalog.dart';
export 'src/mail_capability_catalog.dart';
export 'src/mail_provider_extension_catalog.dart';
export 'src/mail_language_workspace_catalog.dart';
export 'src/mail_provider_selection.dart';
export 'src/mail_provider_package_loader.dart';
export 'src/mail_provider_support.dart';
export 'src/mail_driver_manager.dart';
export 'src/mail_data_source.dart';
`),
        },
      ];
    case 'python':
      return [
        {
          relativePath: `${languageEntry.workspace}/sdkwork_mail_sdk/__init__.py`,
          content: lines(`
from .capability_catalog import (
    MailCapabilityCatalog,
    MailCapabilityCatalogEntry,
    get_mail_capability_catalog,
    get_mail_capability_descriptor,
)
from .data_source import MailDataSource, MailDataSourceOptions
from .driver_manager import MailDriverManager
from .language_workspace_catalog import (
    MailLanguageWorkspaceCatalog,
    MailLanguageWorkspaceCatalogEntry,
    get_mail_language_workspace_by_language,
)
from .provider_activation_catalog import (
    MailProviderActivationCatalog,
    MailProviderActivationCatalogEntry,
    get_mail_provider_activation_by_provider_key,
)
from .provider_catalog import (
    DEFAULT_mail_PROVIDER_KEY,
    MailProviderCatalog,
    MailProviderCatalogEntry,
    get_mail_provider_by_provider_key,
)
from .provider_extension_catalog import (
    MailProviderExtensionCatalog,
    MailProviderExtensionCatalogEntry,
    get_mail_provider_extension_catalog,
    get_mail_provider_extension_descriptor,
    get_mail_provider_extensions,
    get_mail_provider_extensions_for_provider,
    has_mail_provider_extension,
)
from .provider_package_catalog import (
    MailProviderPackageCatalog,
    MailProviderPackageCatalogEntry,
    get_mail_provider_package_by_package_identity,
    get_mail_provider_package_by_provider_key,
)
from .provider_package_loader import (
    MailProviderModuleNamespace,
    MailProviderPackageImportFn,
    MailProviderPackageInstallRequest,
    MailProviderPackageLoadRequest,
    MailProviderPackageLoader,
    MailProviderPackageLoaderException,
    MailResolvedProviderPackageLoadTarget,
    create_mail_provider_package_loader,
    install_mail_provider_package,
    install_mail_provider_packages,
    load_mail_provider_module,
    resolve_mail_provider_package_load_target,
)
from .provider_selection import (
    ParsedMailProviderUrl,
    mail_PROVIDER_SELECTION_PRECEDENCE,
    mail_PROVIDER_SELECTION_SOURCES,
    MailProviderSelection,
    MailProviderSelectionRequest,
    MailProviderSelectionSource,
    parse_mail_provider_url,
    resolve_mail_provider_selection,
)
from .provider_support import (
    mail_PROVIDER_SUPPORT_STATUSES,
    MailProviderSupport,
    MailProviderSupportStateRequest,
    MailProviderSupportStatus,
    create_mail_provider_support_state,
    resolve_mail_provider_support_status,
)
from .standard_contract import (
    MailClient,
    MailProviderDriver,
    MailRuntimeController,
    MailStandardContract,
)

__all__ = [
    "DEFAULT_mail_PROVIDER_KEY",
    "ParsedMailProviderUrl",
    "mail_PROVIDER_SELECTION_PRECEDENCE",
    "mail_PROVIDER_SELECTION_SOURCES",
    "mail_PROVIDER_SUPPORT_STATUSES",
    "MailCapabilityCatalog",
    "MailCapabilityCatalogEntry",
    "MailClient",
    "MailDataSource",
    "MailDataSourceOptions",
    "MailDriverManager",
    "MailLanguageWorkspaceCatalog",
    "MailLanguageWorkspaceCatalogEntry",
    "MailProviderActivationCatalog",
    "MailProviderActivationCatalogEntry",
    "MailProviderCatalog",
    "MailProviderCatalogEntry",
    "MailProviderDriver",
    "MailProviderExtensionCatalog",
    "MailProviderExtensionCatalogEntry",
    "MailProviderPackageCatalog",
    "MailProviderPackageCatalogEntry",
    "MailProviderPackageImportFn",
    "MailProviderPackageInstallRequest",
    "MailProviderPackageLoadRequest",
    "MailProviderPackageLoader",
    "MailProviderPackageLoaderException",
    "MailProviderModuleNamespace",
    "MailProviderSelection",
    "MailProviderSelectionRequest",
    "MailProviderSelectionSource",
    "MailProviderSupport",
    "MailProviderSupportStateRequest",
    "MailProviderSupportStatus",
    "MailResolvedProviderPackageLoadTarget",
    "MailRuntimeController",
    "MailStandardContract",
    "create_mail_provider_package_loader",
    "create_mail_provider_support_state",
    "get_mail_capability_catalog",
    "get_mail_capability_descriptor",
    "get_mail_language_workspace_by_language",
    "get_mail_provider_activation_by_provider_key",
    "get_mail_provider_by_provider_key",
    "get_mail_provider_extension_catalog",
    "get_mail_provider_extension_descriptor",
    "get_mail_provider_extensions",
    "get_mail_provider_extensions_for_provider",
    "get_mail_provider_package_by_package_identity",
    "get_mail_provider_package_by_provider_key",
    "has_mail_provider_extension",
    "install_mail_provider_package",
    "install_mail_provider_packages",
    "load_mail_provider_module",
    "parse_mail_provider_url",
    "resolve_mail_provider_package_load_target",
    "resolve_mail_provider_selection",
    "resolve_mail_provider_support_status",
]
`),
        },
      ];
    default:
      return [];
  }
}

function renderReservedLanguageProviderPackageLoaderPlan(languageEntry) {
  if (!languageEntry.resolutionScaffold?.providerPackageLoaderRelativePath) {
    return [];
  }

  return [
    {
      relativePath: `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerPackageLoaderRelativePath}`,
      content: renderReservedLanguageProviderPackageLoaderModule(languageEntry.language),
    },
  ];
}

export function buildReservedLanguageMaterializationPlan(languageEntry, assembly) {
  let basePlan;

  switch (languageEntry.language) {
    case 'flutter':
      basePlan = renderFlutterReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'rust':
      basePlan = renderRustReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'java':
      basePlan = renderJavaReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'csharp':
      basePlan = renderCsharpReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'swift':
      basePlan = renderSwiftReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'kotlin':
      basePlan = renderKotlinReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'go':
      basePlan = renderGoReservedLanguagePlan(languageEntry, assembly);
      break;
    case 'python':
      basePlan = renderPythonReservedLanguagePlan(languageEntry, assembly);
      break;
    default:
      throw new Error(`Unsupported reserved language scaffold materialization: ${languageEntry.language}`);
  }

  const providerSelectionPath =
    `${languageEntry.workspace}/${languageEntry.metadataScaffold.providerSelectionRelativePath}`;
  const providerSupportPath =
    `${languageEntry.workspace}/${languageEntry.resolutionScaffold.providerSupportRelativePath}`;
  const driverManagerPath =
    `${languageEntry.workspace}/${languageEntry.resolutionScaffold.driverManagerRelativePath}`;
  const dataSourcePath =
    `${languageEntry.workspace}/${languageEntry.resolutionScaffold.dataSourceRelativePath}`;
  const driverManagerContent = renderReservedLanguageDriverManagerModule(languageEntry.language);
  const dataSourceContent = renderReservedLanguageDataSourceModule(languageEntry.language);

  basePlan = basePlan.map((entry) => {
    if (entry.relativePath === providerSelectionPath) {
      return {
        ...entry,
        content: renderReservedLanguageProviderSelectionModule(languageEntry.language),
      };
    }

    if (entry.relativePath === providerSupportPath) {
      return {
        ...entry,
        content: renderReservedLanguageProviderSupportModule(languageEntry.language),
      };
    }

    if (entry.relativePath === driverManagerPath && driverManagerContent) {
      return {
        ...entry,
        content: driverManagerContent,
      };
    }

    if (entry.relativePath === dataSourcePath && dataSourceContent) {
      return {
        ...entry,
        content: dataSourceContent,
      };
    }

    return entry;
  });

  return [
    ...basePlan,
    ...renderReservedLanguageRootPublicEntrypointPlan(languageEntry),
    ...renderReservedLanguageWorkspaceCatalogPlan(languageEntry, assembly),
    ...renderReservedLanguageProviderActivationCatalogPlan(languageEntry, assembly),
    ...renderReservedLanguageProviderPackageLoaderPlan(languageEntry),
    ...renderReservedLanguageProviderPackageScaffoldPlan(languageEntry, assembly),
    ...renderReservedLanguageProviderPackageBoundaryPlan(languageEntry, assembly),
  ];
}
