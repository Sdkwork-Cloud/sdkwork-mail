import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { MailAccount } from '../types';


export class MailAccountsMailAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(appApiPath(`/mail/accounts`));
  }
}

export class MailAccountsMailApi {
  private client: HttpClient;
  public readonly accounts: MailAccountsMailAccountsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new MailAccountsMailAccountsApi(client);
  }

}

export class MailAccountsApi {
  private client: HttpClient;
  public readonly mail: MailAccountsMailApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.mail = new MailAccountsMailApi(client);
  }

}

export function createMailAccountsApi(client: HttpClient): MailAccountsApi {
  return new MailAccountsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
