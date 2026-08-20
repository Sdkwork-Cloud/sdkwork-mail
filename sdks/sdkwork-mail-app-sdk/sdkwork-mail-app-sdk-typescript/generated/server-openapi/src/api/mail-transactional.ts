import { appApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { MailTransactionalDeliveryResponse, SendTransactionalMailRequest } from '../types';


export class MailTransactionalMailTransactionalApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async send(body: SendTransactionalMailRequest, requestOptions?: ApiRequestOptions): Promise<MailTransactionalDeliveryResponse> {
    return this.client.request<MailTransactionalDeliveryResponse>(appApiPath(`/mail/transactional/send`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export class MailTransactionalMailApi {
  public readonly transactional: MailTransactionalMailTransactionalApi;

  constructor(client: HttpClient) {
    this.transactional = new MailTransactionalMailTransactionalApi(client);
  }

}

export class MailTransactionalApi {
  public readonly mail: MailTransactionalMailApi;

  constructor(client: HttpClient) {
    this.mail = new MailTransactionalMailApi(client);
  }

}

export function createMailTransactionalApi(client: HttpClient): MailTransactionalApi {
  return new MailTransactionalApi(client);
}
