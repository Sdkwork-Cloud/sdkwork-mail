import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { MailTransactionalDeliveryResponse, SendTransactionalMailRequest } from '../types';


export class MailTransactionalMailTransactionalApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async send(body: SendTransactionalMailRequest): Promise<MailTransactionalDeliveryResponse> {
    return this.client.post<MailTransactionalDeliveryResponse>(appApiPath(`/mail/transactional/send`), body, undefined, undefined, 'application/json');
  }
}

export class MailTransactionalMailApi {
  private client: HttpClient;
  public readonly transactional: MailTransactionalMailTransactionalApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.transactional = new MailTransactionalMailTransactionalApi(client);
  }

}

export class MailTransactionalApi {
  private client: HttpClient;
  public readonly mail: MailTransactionalMailApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.mail = new MailTransactionalMailApi(client);
  }

}

export function createMailTransactionalApi(client: HttpClient): MailTransactionalApi {
  return new MailTransactionalApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
