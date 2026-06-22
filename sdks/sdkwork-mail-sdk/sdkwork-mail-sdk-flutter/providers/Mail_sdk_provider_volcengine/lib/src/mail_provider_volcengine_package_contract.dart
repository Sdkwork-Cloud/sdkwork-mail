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

final class MailProviderVolcenginePackageContract {
  static const String providerKey = "volcengine";
  static const String pluginId = "Mail-volcengine";
  static const String driverId = "sdkwork-mail-driver-volcengine";
  static const String packageIdentity = "mail_sdk_provider_volcengine";
  static const String status = "package_reference_boundary";
  static const String runtimeBridgeStatus = "reference-baseline";
  static const bool rootPublic = false;
  static final MailProviderModule<MailVolcengineOfficialFlutterNativeClient>
      providerModule = VOLCENGINE_mail_PROVIDER_MODULE;

  const MailProviderVolcenginePackageContract._();
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
  packageName: "mail_sdk_provider_volcengine",
  metadata: VOLCENGINE_mail_PROVIDER_METADATA,
  builtin: getMailProviderPackageByProviderKey("volcengine")?.builtin ?? false,
  createDriver: createVolcengineMailDriver<MailVolcengineOfficialFlutterNativeClient>,
);

MailProviderMetadata _requireVolcengineProviderMetadata() {
  final metadata = getOfficialMailProviderMetadataByKey("volcengine");
  if (metadata == null) {
    throw const MailSdkException(
      code: 'provider_not_official',
      message: 'Volcengine Mail provider metadata is missing from the root Mail provider catalog.',
      providerKey: "volcengine",
      pluginId: "Mail-volcengine",
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
