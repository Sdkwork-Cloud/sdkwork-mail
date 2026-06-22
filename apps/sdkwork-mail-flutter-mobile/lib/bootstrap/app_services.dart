import 'package:sdkwork_mail_flutter_mobile_Mail/sdkwork_mail_flutter_mobile_Mail.dart';

import 'app_auth.dart';
import 'sdk_clients.dart';

MailAppServices createAppServices({MailAppSession? session}) {
  final activeSession = session ?? loadAppSession() ?? defaultAppSession;
  final clients = createSdkClients(session: activeSession);
  return createMailAppServices(clients.app.appApi);
}
