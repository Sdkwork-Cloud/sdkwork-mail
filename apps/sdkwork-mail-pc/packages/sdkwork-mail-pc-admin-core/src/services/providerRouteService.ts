import type { AuthTokenManager } from "@sdkwork/sdk-common";

import type { ProviderRoute, ProviderRouteCommand } from "../types/providerRoute";
import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

interface ListResponse {
  items: ProviderRoute[];
  nextCursor?: string | null;
}

export class ProviderRouteService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(params?: {
    page?: number;
    limit?: number;
    cursor?: string;
    search?: string;
    sort?: string;
  }): Promise<ListResponse> {
    const response = await this.client.MailProviderRoutes.Mail.providerRoutes.list({
      page: params?.page,
      pageSize: params?.limit,
      cursor: params?.cursor,
      q: params?.search,
      sort: params?.sort,
    });
    return {
      items: (response.data?.items ?? []) as ProviderRoute[],
      nextCursor: (response.data?.nextCursor as string | null | undefined) ?? null,
    };
  }

  async create(command: ProviderRouteCommand): Promise<ProviderRoute> {
    const response = await this.client.MailProviderRoutes.Mail.providerRoutes.create(
      command as Parameters<
        typeof this.client.MailProviderRoutes.Mail.providerRoutes.create
      >[0],
    );
    if (!response.data) {
      throw new Error("Invalid response: missing provider route data");
    }
    return response.data as ProviderRoute;
  }

  async get(id: string): Promise<ProviderRoute> {
    const response = await this.client.MailProviderRoutes.Mail.providerRoutes.retrieve(id);
    if (!response.data) {
      throw new Error(`Mail provider route not found: ${id}`);
    }
    return response.data as ProviderRoute;
  }

  async update(id: string, command: ProviderRouteCommand): Promise<ProviderRoute> {
    const response = await this.client.MailProviderRoutes.Mail.providerRoutes.update(
      id,
      command as Parameters<
        typeof this.client.MailProviderRoutes.Mail.providerRoutes.update
      >[1],
    );
    if (!response.data) {
      throw new Error("Invalid response: missing provider route data");
    }
    return response.data as ProviderRoute;
  }

  async disable(id: string, reason?: string): Promise<ProviderRoute> {
    const response = await this.client.MailProviderRoutes.Mail.providerRoutes.disable(id, {
      reason,
    });
    if (!response.data) {
      throw new Error("Invalid response: missing provider route data");
    }
    return response.data as ProviderRoute;
  }
}
