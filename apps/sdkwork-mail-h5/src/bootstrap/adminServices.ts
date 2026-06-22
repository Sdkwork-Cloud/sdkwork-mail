import {
  MailProviderAccountService,
  MailTemplateAdminService,
  MailTransactionalDeliveryAdminService,
} from "@sdkwork/Mail-h5-admin-core";

import {
  bootstrapAdminAuth,
  buildAdminSdkHeaders,
  loadAdminSession,
} from "./adminAuth";
import { resolveEnvironment } from "./environment";
import { getTokenManager } from "./tokenManager";

export interface MailAdminServices {
  templates: MailTemplateAdminService;
  deliveries: MailTransactionalDeliveryAdminService;
  providerAccounts: MailProviderAccountService;
}

export function createAdminServices(): MailAdminServices {
  const { backendApiBaseUrl } = resolveEnvironment();
  const session = bootstrapAdminAuth() ?? loadAdminSession();
  const tokenManager = getTokenManager();
  const clientOptions = session
    ? {
        tokenManager,
        authToken: session.authToken,
        accessToken: session.accessToken,
        tenantId: session.tenantId,
        organizationId: session.organizationId,
        headers: buildAdminSdkHeaders(session),
      }
    : { tokenManager };

  return {
    templates: new MailTemplateAdminService(backendApiBaseUrl, clientOptions),
    deliveries: new MailTransactionalDeliveryAdminService(backendApiBaseUrl, clientOptions),
    providerAccounts: new MailProviderAccountService(backendApiBaseUrl, clientOptions),
  };
}
