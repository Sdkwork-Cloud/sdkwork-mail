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

export interface CreateMailProviderCredentialInput {
  username: string;
  secretRef: string;
}

export interface CreateMailProviderAccountCommand {
  providerKind: "smtp" | "imap";
  name: string;
  host: string;
  port: number;
  useTls: boolean;
  credential?: CreateMailProviderCredentialInput;
}

export interface MailProviderPingResult {
  providerKind: string;
  accountId: string;
  ok: boolean;
  message: string;
}

export interface MailProviderSyncResult {
  providerKind: string;
  providerAccountId: string;
  mailAccountId: string;
  folderId: string;
  syncedCount: number;
  highestUid?: number;
  uidValidity?: number;
  message: string;
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

  async create(command: CreateMailProviderAccountCommand): Promise<MailTransportProviderAccount> {
    const response = unwrapEnvelope(
      await this.client.mailProviderAccounts.mail.providerAccounts.create(command),
    );
    const account = (response as { account?: MailTransportProviderAccount }).account;
    if (!account) {
      throw new Error("Invalid response: missing provider account data");
    }
    return account;
  }

  async ping(accountId: string): Promise<MailProviderPingResult> {
    const response = unwrapEnvelope(
      await this.client.mailProviderAccounts.mail.providerAccounts.ping(accountId),
    );
    if (!response) {
      throw new Error("Invalid response: missing provider ping data");
    }
    return response as MailProviderPingResult;
  }

  async sync(accountId: string): Promise<MailProviderSyncResult> {
    const response = unwrapEnvelope(
      await this.client.mailProviderAccounts.mail.providerAccounts.sync(accountId, {}),
    );
    if (!response) {
      throw new Error("Invalid response: missing provider sync data");
    }
    return response as MailProviderSyncResult;
  }
}
