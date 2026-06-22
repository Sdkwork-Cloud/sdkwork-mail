import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

class ParticipantCredentialService {
  final AppApiClient _client;

  ParticipantCredentialService(this._client);

  Future<String> issue(
    String MailInboxId,
    String participantId, {
    String reason = 'join',
  }) async {
    final data = await _client.postJson(
      '/Mail/media_sessions/${Uri.encodeComponent(MailInboxId)}/participants/${Uri.encodeComponent(participantId)}/credential',
      {'reason': reason},
    );
    final credential = data['credential'];
    if (credential is! String || credential.isEmpty) {
      throw StateError('Mail participant credential was not issued');
    }
    return credential;
  }
}
