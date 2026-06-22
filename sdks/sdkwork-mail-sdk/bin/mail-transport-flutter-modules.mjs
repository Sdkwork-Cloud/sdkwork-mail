function lines(value) {
  return `${value.trim()}\n`;
}

export function renderMailTransportFlutterTypesModule() {
  return lines(`
import 'mail_provider_selection.dart';

enum MailTransportConnectionState {
  connected,
  disconnected,
}

class MailProviderMetadata {
  const MailProviderMetadata({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
    required this.displayName,
    required this.defaultSelected,
    this.urlSchemes = const <String>[],
    this.requiredCapabilities = const <String>[],
    this.optionalCapabilities = const <String>[],
    this.extensionKeys = const <String>[],
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
  final String displayName;
  final bool defaultSelected;
  final List<String> urlSchemes;
  final List<String> requiredCapabilities;
  final List<String> optionalCapabilities;
  final List<String> extensionKeys;
}

class MailCapabilitySet {
  const MailCapabilitySet({
    required this.required,
    required this.optional,
  });

  final List<String> required;
  final List<String> optional;
}

class MailTransportConnectOptions {
  const MailTransportConnectOptions({
    required this.accountId,
    this.metadata,
  });

  final String accountId;
  final Map<String, Object?>? metadata;
}

class MailTransportAuthenticateOptions {
  const MailTransportAuthenticateOptions({
    required this.username,
    this.secretRef,
    this.metadata,
  });

  final String username;
  final String? secretRef;
  final Map<String, Object?>? metadata;
}

class MailTransportDescriptor {
  const MailTransportDescriptor({
    required this.accountId,
    required this.providerKey,
    required this.connectionState,
  });

  final String accountId;
  final String providerKey;
  final MailTransportConnectionState connectionState;
}

class MailSendOptions {
  const MailSendOptions({
    this.messageId,
    required this.from,
    required this.to,
    required this.subject,
    this.bodyText,
    this.bodyHtml,
    this.metadata,
  });

  final String? messageId;
  final String from;
  final List<String> to;
  final String subject;
  final String? bodyText;
  final String? bodyHtml;
  final Map<String, Object?>? metadata;
}

class MailSendResult {
  const MailSendResult({
    required this.messageId,
    required this.accepted,
  });

  final String messageId;
  final List<String> accepted;
}

class MailMailboxProbeOptions {
  const MailMailboxProbeOptions({
    this.mailbox,
    this.metadata,
  });

  final String? mailbox;
  final Map<String, Object?>? metadata;
}

class MailMailboxProbeResult {
  const MailMailboxProbeResult({
    required this.mailbox,
    required this.exists,
    this.uidValidity,
    this.uidNext,
  });

  final String mailbox;
  final int exists;
  final int? uidValidity;
  final int? uidNext;
}

class MailMailboxSyncOptions {
  const MailMailboxSyncOptions({
    this.folderId,
    this.mailbox,
    this.sinceUid,
    this.limit,
    this.metadata,
  });

  final String? folderId;
  final String? mailbox;
  final int? sinceUid;
  final int? limit;
  final Map<String, Object?>? metadata;
}

class MailMailboxSyncResult {
  const MailMailboxSyncResult({
    required this.folderId,
    required this.syncedCount,
    this.highestUid,
    this.uidValidity,
  });

  final String folderId;
  final int syncedCount;
  final int? highestUid;
  final int? uidValidity;
}

class MailTransportHealthResult {
  const MailTransportHealthResult({
    required this.healthy,
    this.detail,
  });

  final bool healthy;
  final String? detail;
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
    required this.capabilities,
    required this.selection,
    required this.nativeClient,
  });

  final MailProviderMetadata metadata;
  final MailCapabilitySet capabilities;
  final MailProviderSelection selection;
  final TNativeClient nativeClient;
}
`);
}

export function renderMailTransportFlutterStandardContractModule(assembly) {
  const methodEntries = (assembly.runtimeSurfaceStandard?.methodTerms ?? [])
    .map((method) => `    '${method}',`)
    .join('\n');

  return lines(`
import 'mail_provider_selection.dart';
import 'mail_types.dart';

abstract interface class MailProviderDriver<TNativeClient> {
  MailProviderMetadata get metadata;
  Future<MailClient<TNativeClient>> connect(MailResolvedClientConfig config);
}

abstract interface class MailClient<TNativeClient> {
  MailProviderMetadata get metadata;
  MailCapabilitySet get capabilities;
  MailProviderSelection get selection;
  Future<MailTransportDescriptor> connectTransport(MailTransportConnectOptions options);
  Future<MailTransportDescriptor> authenticateTransport(
    MailTransportAuthenticateOptions options,
  );
  Future<MailTransportDescriptor> disconnectTransport();
  Future<MailSendResult> sendMail(MailSendOptions options);
  Future<MailMailboxProbeResult> probeMailbox([MailMailboxProbeOptions? options]);
  Future<MailMailboxSyncResult> syncMailbox([MailMailboxSyncOptions? options]);
  Future<MailTransportHealthResult> healthCheck();
  List<String> getProviderExtensions();
  bool supportsProviderExtension(String extensionKey);
  bool supportsCapability(String capability);
  void requireCapability(String capability);
  TNativeClient unwrap();
}

abstract interface class MailRuntimeController<TNativeClient> {
  Future<MailTransportDescriptor> connectTransport(
    MailTransportConnectOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTransportDescriptor> authenticateTransport(
    MailTransportAuthenticateOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTransportDescriptor> disconnectTransport(
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailSendResult> sendMail(
    MailSendOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailMailboxProbeResult> probeMailbox(
    MailMailboxProbeOptions? options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailMailboxSyncResult> syncMailbox(
    MailMailboxSyncOptions? options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTransportHealthResult> healthCheck(
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
${methodEntries}
  ];
  static const String runtimeSurfaceFailureCode = 'native_sdk_not_available';

  const MailStandardContract._();
}
`);
}

export function renderMailTransportFlutterClientModule() {
  return lines(`
import 'mail_errors.dart';
import 'mail_provider_metadata.dart';
import 'mail_provider_selection.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class StandardMailClient<TNativeClient> implements MailClient<TNativeClient> {
  StandardMailClient({
    required this.metadata,
    required MailCapabilitySet capabilities,
    required this.selection,
    required TNativeClient nativeClient,
    MailRuntimeController<TNativeClient>? runtimeController,
  })  : _capabilities = capabilities,
        _nativeClient = nativeClient,
        _runtimeController = runtimeController;

  @override
  final MailProviderMetadata metadata;

  @override
  final MailProviderSelection selection;

  final MailCapabilitySet _capabilities;
  final TNativeClient _nativeClient;
  final MailRuntimeController<TNativeClient>? _runtimeController;

  @override
  MailCapabilitySet get capabilities => MailCapabilitySet(
        required: List<String>.of(_capabilities.required, growable: false),
        optional: List<String>.of(_capabilities.optional, growable: false),
      );

  MailRuntimeControllerContext<TNativeClient> get _runtimeContext {
    return MailRuntimeControllerContext<TNativeClient>(
      metadata: metadata,
      capabilities: capabilities,
      selection: selection,
      nativeClient: _nativeClient,
    );
  }

  Never _throwMissingRuntimeMethod(String methodName) {
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

  MailRuntimeController<TNativeClient> _requireRuntimeController() {
    final runtimeController = _runtimeController;
    if (runtimeController != null) {
      return runtimeController;
    }
    return _throwMissingRuntimeMethod('runtimeController');
  }

  @override
  Future<MailTransportDescriptor> connectTransport(
    MailTransportConnectOptions options,
  ) {
    requireCapability('transport.connect');
    return _requireRuntimeController().connectTransport(options, _runtimeContext);
  }

  @override
  Future<MailTransportDescriptor> authenticateTransport(
    MailTransportAuthenticateOptions options,
  ) {
    requireCapability('transport.authenticate');
    return _requireRuntimeController().authenticateTransport(options, _runtimeContext);
  }

  @override
  Future<MailTransportDescriptor> disconnectTransport() {
    return _requireRuntimeController().disconnectTransport(_runtimeContext);
  }

  @override
  Future<MailSendResult> sendMail(MailSendOptions options) {
    requireCapability('smtp.send');
    return _requireRuntimeController().sendMail(options, _runtimeContext);
  }

  @override
  Future<MailMailboxProbeResult> probeMailbox([MailMailboxProbeOptions? options]) {
    requireCapability('imap.sync');
    return _requireRuntimeController().probeMailbox(options, _runtimeContext);
  }

  @override
  Future<MailMailboxSyncResult> syncMailbox([MailMailboxSyncOptions? options]) {
    requireCapability('imap.sync');
    return _requireRuntimeController().syncMailbox(options, _runtimeContext);
  }

  @override
  Future<MailTransportHealthResult> healthCheck() {
    requireCapability('health');
    return _requireRuntimeController().healthCheck(_runtimeContext);
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
    return _capabilities.required.contains(capability) ||
        _capabilities.optional.contains(capability);
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
