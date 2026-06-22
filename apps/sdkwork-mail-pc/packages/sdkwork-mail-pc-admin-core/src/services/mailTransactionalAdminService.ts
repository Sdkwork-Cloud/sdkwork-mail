import type { AuthTokenManager } from "@sdkwork/sdk-common";

import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

export interface MailTemplateRecord {
  id: string;
  templateKey: string;
  name: string;
  category: string;
  purpose: string;
  locale: string;
  subjectTemplate: string;
  bodyHtmlTemplate?: string | null;
  bodyTextTemplate?: string | null;
  status: string;
}

export interface MailTransactionalDeliveryRecord {
  id: string;
  templateKey: string;
  businessKind: string;
  recipientEmail: string;
  subject: string;
  status: string;
  sentAt?: string | null;
  createdAt: string;
}

export interface CreateMailTemplateCommand {
  templateKey: string;
  name: string;
  category: "transactional" | "marketing";
  purpose: string;
  locale?: string;
  subjectTemplate: string;
  bodyHtmlTemplate?: string;
  bodyTextTemplate?: string;
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

export class MailTemplateAdminService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(params?: { category?: string; purpose?: string }): Promise<MailTemplateRecord[]> {
    const response = unwrapEnvelope(
      await this.client.mailTemplates.mail.templates.list(params),
    );
    return (response.items ?? []) as MailTemplateRecord[];
  }

  async create(command: CreateMailTemplateCommand): Promise<MailTemplateRecord> {
    const response = unwrapEnvelope(
      await this.client.mailTemplates.mail.templates.create(command),
    );
    if (!response) {
      throw new Error("Invalid response: missing template data");
    }
    return response as MailTemplateRecord;
  }
}

export class MailTransactionalDeliveryAdminService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(params?: {
    businessKind?: string;
    recipientEmail?: string;
  }): Promise<MailTransactionalDeliveryRecord[]> {
    const response = unwrapEnvelope(
      await this.client.mailTransactionalDeliveries.mail.transactionalDeliveries.list(params),
    );
    return (response.items ?? []) as MailTransactionalDeliveryRecord[];
  }
}
