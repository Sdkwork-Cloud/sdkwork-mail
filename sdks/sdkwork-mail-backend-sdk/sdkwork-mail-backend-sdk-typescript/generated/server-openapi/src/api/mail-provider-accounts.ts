import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { MailProviderAccountListResponse } from '../types';


export class MailProviderAccountsMailProviderAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(): Promise<MailProviderAccountListResponse> {
    return this.client.get<MailProviderAccountListResponse>(backendApiPath(`/mail/provider_accounts`));
  }
}

export class MailProviderAccountsMailApi {
  private client: HttpClient;
  public readonly providerAccounts: MailProviderAccountsMailProviderAccountsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.providerAccounts = new MailProviderAccountsMailProviderAccountsApi(client);
  }

}

export class MailProviderAccountsApi {
  private client: HttpClient;
  public readonly mail: MailProviderAccountsMailApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.mail = new MailProviderAccountsMailApi(client);
  }

}

export function createMailProviderAccountsApi(client: HttpClient): MailProviderAccountsApi {
  return new MailProviderAccountsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
