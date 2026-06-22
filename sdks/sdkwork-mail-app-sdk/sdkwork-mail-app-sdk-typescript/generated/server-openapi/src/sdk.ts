import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { MailAccountsApi, createMailAccountsApi } from './api/mail-accounts';
import { MailFoldersApi, createMailFoldersApi } from './api/mail-folders';
import { MailThreadsApi, createMailThreadsApi } from './api/mail-threads';
import { MailMessagesApi, createMailMessagesApi } from './api/mail-messages';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly mailAccounts: MailAccountsApi;
  public readonly mailFolders: MailFoldersApi;
  public readonly mailThreads: MailThreadsApi;
  public readonly mailMessages: MailMessagesApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.mailAccounts = createMailAccountsApi(this.httpClient);

    this.mailFolders = createMailFoldersApi(this.httpClient);

    this.mailThreads = createMailThreadsApi(this.httpClient);

    this.mailMessages = createMailMessagesApi(this.httpClient);
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

export function createClient(config: SdkworkAppConfig): SdkworkAppClient {
  return new SdkworkAppClient(config);
}

export default SdkworkAppClient;
