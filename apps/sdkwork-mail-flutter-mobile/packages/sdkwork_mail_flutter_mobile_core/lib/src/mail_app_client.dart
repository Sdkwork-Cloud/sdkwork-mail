import 'app_api_client.dart';

class MailAppClientBundle {
  const MailAppClientBundle({required this.appApi});

  final AppApiClient appApi;
}

MailAppClientBundle createMailAppClient({
  required String apiBaseUrl,
  String? accessToken,
  String? authToken,
  String? tenantId,
  String? organizationId,
  String? userId,
  String permissionScope = 'Mail.*',
}) {
  return MailAppClientBundle(
    appApi: AppApiClient(
      baseUrl: resolveAppApiBaseUrl(apiBaseUrl),
      accessToken: accessToken,
      authToken: authToken,
      tenantId: tenantId,
      organizationId: organizationId,
      userId: userId,
      permissionScope: permissionScope,
    ),
  );
}
