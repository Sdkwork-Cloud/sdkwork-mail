import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { SendMailVerificationRequest, SendMailVerificationResponse, VerifyMailCodeRequest, VerifyMailCodeResponse } from '../types';


export class MailVerificationMailVerificationApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async send(body: SendMailVerificationRequest): Promise<SendMailVerificationResponse> {
    return this.client.post<SendMailVerificationResponse>(appApiPath(`/mail/verification/send`), body, undefined, undefined, 'application/json');
  }

async verify(body: VerifyMailCodeRequest): Promise<VerifyMailCodeResponse> {
    return this.client.post<VerifyMailCodeResponse>(appApiPath(`/mail/verification/verify`), body, undefined, undefined, 'application/json');
  }
}

export class MailVerificationMailApi {
  private client: HttpClient;
  public readonly verification: MailVerificationMailVerificationApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.verification = new MailVerificationMailVerificationApi(client);
  }

}

export class MailVerificationApi {
  private client: HttpClient;
  public readonly mail: MailVerificationMailApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.mail = new MailVerificationMailApi(client);
  }

}

export function createMailVerificationApi(client: HttpClient): MailVerificationApi {
  return new MailVerificationApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
