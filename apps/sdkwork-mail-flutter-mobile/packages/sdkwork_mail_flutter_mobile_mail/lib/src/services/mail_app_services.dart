import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

import 'media_session_service.dart';
import 'participant_credential_service.dart';
import 'provider_profile_service.dart';

class MailAppServices {
  final MailInboxService MailInboxs;
  final ParticipantCredentialService participantCredentials;
  final ProviderProfileService providerProfiles;

  const MailAppServices({
    required this.MailInboxs,
    required this.participantCredentials,
    required this.providerProfiles,
  });
}

MailAppServices createMailAppServices(AppApiClient client) {
  return MailAppServices(
    MailInboxs: MailInboxService(client),
    participantCredentials: ParticipantCredentialService(client),
    providerProfiles: ProviderProfileService(client),
  );
}
