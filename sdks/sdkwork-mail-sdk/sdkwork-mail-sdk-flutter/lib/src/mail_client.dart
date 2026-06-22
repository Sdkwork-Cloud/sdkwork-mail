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
