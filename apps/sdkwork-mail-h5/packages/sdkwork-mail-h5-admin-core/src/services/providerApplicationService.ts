import type { AuthTokenManager } from "@sdkwork/sdk-common";

import type {
  ProviderApplication,
  ProviderApplicationCommand,
} from "../types/providerApplication";
import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

interface ListResponse {
  items: ProviderApplication[];
  nextCursor?: string | null;
}

export class ProviderApplicationService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(
    providerAccountId: string,
    params?: {
      page?: number;
      limit?: number;
      cursor?: string;
      search?: string;
      sort?: string;
    },
  ): Promise<ListResponse> {
    const response =
      await this.client.MailProviderApplications.Mail.providerAccounts.applications.list(
        providerAccountId,
        {
          page: params?.page,
          pageSize: params?.limit,
          cursor: params?.cursor,
          q: params?.search,
          sort: params?.sort,
        },
      );
    return {
      items: (response.data?.items ?? []) as ProviderApplication[],
      nextCursor: (response.data?.nextCursor as string | null | undefined) ?? null,
    };
  }

  async get(id: string): Promise<ProviderApplication> {
    const response =
      await this.client.MailProviderApplications.Mail.providerApplications.retrieve(id);
    if (!response.data) {
      throw new Error(`Mail provider application not found: ${id}`);
    }
    return response.data as ProviderApplication;
  }

  async create(
    providerAccountId: string,
    command: ProviderApplicationCommand,
  ): Promise<ProviderApplication> {
    const response =
      await this.client.MailProviderApplications.Mail.providerAccounts.applications.create(
        providerAccountId,
        command as Parameters<
          typeof this.client.MailProviderApplications.Mail.providerAccounts.applications.create
        >[1],
      );
    if (!response.data) {
      throw new Error("Invalid response: missing provider application data");
    }
    return response.data as ProviderApplication;
  }

  async update(id: string, command: ProviderApplicationCommand): Promise<ProviderApplication> {
    const response =
      await this.client.MailProviderApplications.Mail.providerApplications.update(
        id,
        command as Parameters<
          typeof this.client.MailProviderApplications.Mail.providerApplications.update
        >[1],
      );
    if (!response.data) {
      throw new Error("Invalid response: missing provider application data");
    }
    return response.data as ProviderApplication;
  }

  async disable(id: string, reason?: string): Promise<ProviderApplication> {
    const response =
      await this.client.MailProviderApplications.Mail.providerApplications.disable(id, {
        reason,
      });
    if (!response.data) {
      throw new Error("Invalid response: missing provider application data");
    }
    return response.data as ProviderApplication;
  }
}
