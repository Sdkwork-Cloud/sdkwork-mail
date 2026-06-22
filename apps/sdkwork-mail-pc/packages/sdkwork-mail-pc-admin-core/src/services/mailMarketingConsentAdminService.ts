import type { AuthTokenManager } from "@sdkwork/sdk-common";

import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

export interface MailMarketingConsentRecord {
  id: string;
  recipientEmail: string;
  status: string;
  consentSource: string;
  grantedAt: string;
  revokedAt?: string | null;
}

export interface GrantMailMarketingConsentCommand {
  recipientEmail: string;
  consentSource?: string;
}

function unwrapEnvelope<T>(response: T | { data?: T }): T {
  if (response && typeof response === "object" && "data" in response) {
    const envelope = response as { data?: T };
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }
  return response as T;
}

export class MailMarketingConsentAdminService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(params?: { recipientEmail?: string }): Promise<MailMarketingConsentRecord[]> {
    const response = unwrapEnvelope(
      await this.client.mailMarketingConsents.mail.marketingConsents.list(params),
    );
    return (response.items ?? []) as MailMarketingConsentRecord[];
  }

  async grant(command: GrantMailMarketingConsentCommand): Promise<MailMarketingConsentRecord> {
    const response = unwrapEnvelope(
      await this.client.mailMarketingConsents.mail.marketingConsents.grant(command),
    );
    if (!response) {
      throw new Error("Invalid response: missing marketing consent data");
    }
    return response as MailMarketingConsentRecord;
  }

  async revoke(consentId: string): Promise<MailMarketingConsentRecord> {
    const response = unwrapEnvelope(
      await this.client.mailMarketingConsents.mail.marketingConsents.revoke(consentId),
    );
    if (!response) {
      throw new Error("Invalid response: missing marketing consent data");
    }
    return response as MailMarketingConsentRecord;
  }
}
