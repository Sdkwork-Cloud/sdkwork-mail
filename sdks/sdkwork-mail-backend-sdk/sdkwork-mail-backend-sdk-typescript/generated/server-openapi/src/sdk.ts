import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { MailProviderAccountsApi, createMailProviderAccountsApi } from './api/mail-provider-accounts';
import { MailProviderWebhooksApi, createMailProviderWebhooksApi } from './api/mail-provider-webhooks';
import { MailTemplatesApi, createMailTemplatesApi } from './api/mail-templates';
import { MailTransactionalDeliveriesApi, createMailTransactionalDeliveriesApi } from './api/mail-transactional-deliveries';
import { MailMarketingConsentsApi, createMailMarketingConsentsApi } from './api/mail-marketing-consents';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly mailProviderAccounts: MailProviderAccountsApi;
  public readonly mailProviderWebhooks: MailProviderWebhooksApi;
  public readonly mailTemplates: MailTemplatesApi;
  public readonly mailTransactionalDeliveries: MailTransactionalDeliveriesApi;
  public readonly mailMarketingConsents: MailMarketingConsentsApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.mailProviderAccounts = createMailProviderAccountsApi(this.httpClient);

    this.mailProviderWebhooks = createMailProviderWebhooksApi(this.httpClient);

    this.mailTemplates = createMailTemplatesApi(this.httpClient);

    this.mailTransactionalDeliveries = createMailTransactionalDeliveriesApi(this.httpClient);

    this.mailMarketingConsents = createMailMarketingConsentsApi(this.httpClient);
  }
  setAuthToken(token: string): this {
    this.httpClient.setAuthToken(token);
    return this;
  }

  setAccessToken(token: string): this {
    this.httpClient.setAccessToken(token);
    return this;
  }

  setTokenManager(manager: AuthTokenManager): this {
    this.httpClient.setTokenManager(manager);
    return this;
  }

  get http(): HttpClient {
    return this.httpClient;
  }
}

export function createClient(config: SdkworkBackendConfig): SdkworkBackendClient {
  return new SdkworkBackendClient(config);
}

export default SdkworkBackendClient;
