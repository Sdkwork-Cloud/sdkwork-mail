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
    'join',
    'leave',
    'publish',
    'unpublish',
    'startScreenShare',
    'stopScreenShare',
    'muteAudio',
    'muteVideo',
  ];
  static const String runtimeSurfaceFailureCode = 'native_sdk_not_available';

  const MailStandardContract._();
}
