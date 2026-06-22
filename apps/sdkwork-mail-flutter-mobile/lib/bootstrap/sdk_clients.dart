import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

import 'app_auth.dart';
import 'environment.dart';

class MailSdkClients {
  const MailSdkClients({
    required this.apiBaseUrl,
    required this.backendApiBaseUrl,
    required this.app,
  });

  final String apiBaseUrl;
  final String backendApiBaseUrl;
  final MailAppClientBundle app;
}

MailSdkClients? _activeSdkClients;

MailSdkClients createSdkClients({MailAppSession? session}) {
  final env = resolveEnvironment();
  final activeSession = session ?? loadAppSession();
  final bundle = createMailAppClient(
    apiBaseUrl: env.apiBaseUrl,
    accessToken: activeSession?.accessToken,
    authToken: activeSession?.authToken ?? activeSession?.accessToken,
    tenantId: activeSession?.tenantId ?? defaultAppSession.tenantId,
    organizationId: activeSession?.organizationId ?? defaultAppSession.organizationId,
    userId: activeSession?.userId ?? defaultAppSession.userId,
    permissionScope: defaultAppPermissionScope,
  );

  _activeSdkClients = MailSdkClients(
    apiBaseUrl: env.apiBaseUrl,
    backendApiBaseUrl: env.backendApiBaseUrl,
    app: bundle,
  );
  return _activeSdkClients!;
}

MailSdkClients getSdkClients() {
  return _activeSdkClients ?? createSdkClients();
}
