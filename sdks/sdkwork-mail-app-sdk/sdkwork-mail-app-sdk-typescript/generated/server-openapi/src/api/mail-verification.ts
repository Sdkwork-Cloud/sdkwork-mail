import { appApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { SendMailVerificationRequest, SendMailVerificationResponse, VerifyMailCodeRequest, VerifyMailCodeResponse } from '../types';


export class MailVerificationMailVerificationApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async send(body: SendMailVerificationRequest, requestOptions?: ApiRequestOptions): Promise<SendMailVerificationResponse> {
    return this.client.request<SendMailVerificationResponse>(appApiPath(`/mail/verification/send`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

async verify(body: VerifyMailCodeRequest, requestOptions?: ApiRequestOptions): Promise<VerifyMailCodeResponse> {
    return this.client.request<VerifyMailCodeResponse>(appApiPath(`/mail/verification/verify`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export class MailVerificationMailApi {
  public readonly verification: MailVerificationMailVerificationApi;

  constructor(client: HttpClient) {
    this.verification = new MailVerificationMailVerificationApi(client);
  }

}

export class MailVerificationApi {
  public readonly mail: MailVerificationMailApi;

  constructor(client: HttpClient) {
    this.mail = new MailVerificationMailApi(client);
  }

}

export function createMailVerificationApi(client: HttpClient): MailVerificationApi {
  return new MailVerificationApi(client);
}
