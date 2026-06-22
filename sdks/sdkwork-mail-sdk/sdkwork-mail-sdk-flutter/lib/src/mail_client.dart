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
