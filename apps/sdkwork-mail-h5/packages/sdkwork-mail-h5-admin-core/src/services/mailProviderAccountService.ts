import type { AuthTokenManager } from "@sdkwork/sdk-common";

import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

function unwrapEnvelope<T>(response: T | { data?: T }): T {
  if (response && typeof response === "object" && "data" in response) {
    const envelope = response as { data?: T };
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }
  return response as T;
}

export interface MailTransportProviderAccount {
  id: string;
  providerKind: string;
  name: string;
  host: string;
  port: number;
  useTls: boolean;
  status: string;
}

export class MailProviderAccountService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(): Promise<MailTransportProviderAccount[]> {
    const response = unwrapEnvelope(
      await this.client.mailProviderAccounts.mail.providerAccounts.list(),
    );
    return (response.items ?? []) as MailTransportProviderAccount[];
  }
}
