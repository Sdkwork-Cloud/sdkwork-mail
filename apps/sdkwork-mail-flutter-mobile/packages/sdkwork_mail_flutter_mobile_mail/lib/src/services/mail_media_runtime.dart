class MailMediaRuntimeJoinInput {
  final String appId;
  final String sessionId;
  final String roomId;
  final String participantId;
  final String token;
  final String displayName;

  const MailMediaRuntimeJoinInput({
    required this.appId,
    required this.sessionId,
    required this.roomId,
    required this.participantId,
    required this.token,
    required this.displayName,
  });
}

class MailMediaRuntimeStatus {
  final bool connected;
  final String providerKey;
  final String? message;

  const MailMediaRuntimeStatus({
    required this.connected,
    required this.providerKey,
    this.message,
  });
}

abstract class MailMediaRuntimePort {
  Future<MailMediaRuntimeStatus> join(MailMediaRuntimeJoinInput input);
  Future<void> leave();
  MailMediaRuntimeStatus getStatus();
}

class StubMailMediaRuntime implements MailMediaRuntimePort {
  bool _connected = false;
  String _message = 'Mail media runtime is ready for credential-backed join.';

  @override
  Future<MailMediaRuntimeStatus> join(MailMediaRuntimeJoinInput input) async {
    _connected = true;
    _message =
        'Credential issued for ${input.participantId} in room ${input.roomId}. '
        'Native Mail provider join is not wired in this Flutter build.';
    return MailMediaRuntimeStatus(
      connected: true,
      providerKey: 'volcengine',
      message: _message,
    );
  }

  @override
  Future<void> leave() async {
    _connected = false;
    _message = 'Left mail inbox.';
  }

  @override
  MailMediaRuntimeStatus getStatus() {
    return MailMediaRuntimeStatus(
      connected: _connected,
      providerKey: 'volcengine',
      message: _message,
    );
  }
}

Future<MailMediaRuntimePort> createMailMediaRuntime() async {
  return StubMailMediaRuntime();
}
