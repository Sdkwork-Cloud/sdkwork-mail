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
