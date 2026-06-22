import 'package:sdkwork_mail_flutter_mobile_admin_core/sdkwork_mail_flutter_mobile_admin_core.dart';

import 'admin_auth.dart';
import 'environment.dart';

class MailAdminServices {
  final MailTemplateAdminService templates;
  final MailTransactionalDeliveryAdminService deliveries;
  final MailProviderAccountService providerAccounts;

  const MailAdminServices({
    required this.templates,
    required this.deliveries,
    required this.providerAccounts,
  });
}

MailAdminServices createAdminServices({required MailAdminSession session}) {
  final env = resolveEnvironment();
  final client = BackendApiClient(
    baseUrl: resolveBackendApiBaseUrl(env.backendApiBaseUrl),
    accessToken: session.accessToken,
    authToken: session.authToken,
    tenantId: session.tenantId,
    organizationId: session.organizationId,
    userId: session.userId,
    permissionScope: defaultAdminPermissionScope,
  );

  return MailAdminServices(
    templates: MailTemplateAdminService(client),
    deliveries: MailTransactionalDeliveryAdminService(client),
    providerAccounts: MailProviderAccountService(client),
  );
}
