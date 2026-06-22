import type { AuthTokenManager } from "@sdkwork/sdk-common";

import type { ProviderProfile, ProviderProfileCommand } from "../types/providerProfile";
import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

interface ListResponse {
  items: ProviderProfile[];
  nextCursor?: string | null;
}

export class ProviderProfileService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async list(params?: {
    provider?: string;
    page?: number;
    limit?: number;
    cursor?: string;
    search?: string;
    sort?: string;
  }): Promise<ListResponse> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.list({
      page: params?.page,
      pageSize: params?.limit,
      cursor: params?.cursor,
      q: params?.search,
      sort: params?.sort,
    });
    return {
      items: (response.data?.items ?? []) as ProviderProfile[],
      nextCursor: (response.data?.nextCursor as string | null | undefined) ?? null,
    };
  }

  async get(id: string): Promise<ProviderProfile> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.retrieve(id);
    if (!response.data) {
      throw new Error(`Mail provider profile not found: ${id}`);
    }
    return response.data as ProviderProfile;
  }

  async create(command: ProviderProfileCommand): Promise<ProviderProfile> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.create(
      command as Parameters<
        typeof this.client.MailProviderProfiles.Mail.providerProfiles.create
      >[0],
    );
    if (!response.data) {
      throw new Error("Invalid response: missing provider profile data");
    }
    return response.data as ProviderProfile;
  }

  async update(id: string, command: ProviderProfileCommand): Promise<ProviderProfile> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.update(
      id,
      command as Parameters<
        typeof this.client.MailProviderProfiles.Mail.providerProfiles.update
      >[1],
    );
    if (!response.data) {
      throw new Error("Invalid response: missing provider profile data");
    }
    return response.data as ProviderProfile;
  }

  async disable(id: string, reason?: string): Promise<ProviderProfile> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.disable(id, {
      reason,
    });
    if (!response.data) {
      throw new Error("Invalid response: missing provider profile data");
    }
    return response.data as ProviderProfile;
  }

  async verify(id: string, queryKind: string, timeoutMs?: number): Promise<unknown> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.verify(id, {
      queryKind: queryKind as Parameters<
        typeof this.client.MailProviderProfiles.Mail.providerProfiles.verify
      >[1]["queryKind"],
      timeoutMs,
    });
    return response.data;
  }

  async configureCapabilities(
    id: string,
    enabledCapabilities: string[],
    disabledCapabilities: string[],
  ): Promise<ProviderProfile> {
    const response = await this.client.MailProviderProfiles.Mail.providerProfiles.capabilities.configure(
      id,
      {
        enabledCapabilities,
        disabledCapabilities,
      },
    );
    const data = response.data as unknown as ProviderProfile | undefined;
    if (!data) {
      throw new Error("Invalid response: missing provider profile data");
    }
    return data;
  }
}
