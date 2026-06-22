import type { AuthTokenManager } from "@sdkwork/sdk-common";

import type { ProviderCredential, ProviderCredentialCommand } from "../types/providerCredential";
import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

interface ListResponse {
  items: ProviderCredential[];
  nextCursor?: string | null;
}

export class ProviderCredentialService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(
    providerApplicationId: string,
    params?: {
      page?: number;
      limit?: number;
      cursor?: string;
      search?: string;
      sort?: string;
    },
  ): Promise<ListResponse> {
    const response =
      await this.client.MailProviderCredentials.Mail.providerApplications.credentials.list(
        providerApplicationId,
        {
          page: params?.page,
          pageSize: params?.limit,
          cursor: params?.cursor,
          q: params?.search,
          sort: params?.sort,
        },
      );
    return {
      items: (response.data?.items ?? []) as ProviderCredential[],
      nextCursor: (response.data?.nextCursor as string | null | undefined) ?? null,
    };
  }

  async get(id: string): Promise<ProviderCredential> {
    const response =
      await this.client.MailProviderCredentials.Mail.providerCredentials.retrieve(id);
    if (!response.data) {
      throw new Error(`Mail provider credential not found: ${id}`);
    }
    return response.data as ProviderCredential;
  }

  async create(
    providerApplicationId: string,
    command: ProviderCredentialCommand,
  ): Promise<ProviderCredential> {
    const response =
      await this.client.MailProviderCredentials.Mail.providerApplications.credentials.create(
        providerApplicationId,
        command as Parameters<
          typeof this.client.MailProviderCredentials.Mail.providerApplications.credentials.create
        >[1],
      );
    if (!response.data) {
      throw new Error("Invalid response: missing provider credential data");
    }
    return response.data as ProviderCredential;
  }

  async update(id: string, command: ProviderCredentialCommand): Promise<ProviderCredential> {
    const response =
      await this.client.MailProviderCredentials.Mail.providerCredentials.update(
        id,
        command as Parameters<
          typeof this.client.MailProviderCredentials.Mail.providerCredentials.update
        >[1],
      );
    if (!response.data) {
      throw new Error("Invalid response: missing provider credential data");
    }
    return response.data as ProviderCredential;
  }

  async revoke(id: string, reason?: string): Promise<ProviderCredential> {
    const response = await this.client.MailProviderCredentials.Mail.providerCredentials.revoke(id, {
      reason,
    });
    if (!response.data) {
      throw new Error("Invalid response: missing provider credential data");
    }
    return response.data as ProviderCredential;
  }
}
