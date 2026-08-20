import { appApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { MailAccount } from '../types';


export class MailAccountsMailAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(requestOptions?: ApiRequestOptions): Promise<{ items: MailAccount[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    return this.client.request<{ items: MailAccount[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appApiPath(`/mail/accounts`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }
}

export class MailAccountsMailApi {
  public readonly accounts: MailAccountsMailAccountsApi;

  constructor(client: HttpClient) {
    this.accounts = new MailAccountsMailAccountsApi(client);
  }

}

export class MailAccountsApi {
  public readonly mail: MailAccountsMailApi;

  constructor(client: HttpClient) {
    this.mail = new MailAccountsMailApi(client);
  }

}

export function createMailAccountsApi(client: HttpClient): MailAccountsApi {
  return new MailAccountsApi(client);
}
