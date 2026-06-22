import type { AuthTokenManager } from "@sdkwork/sdk-common";

import type { ProviderConfigSchema } from "../types/providerSchema";
import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

interface ApiEnvelope<T> {
  data?: T;
  message?: string;
}

export class ProviderSchemaService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async listSchemas(): Promise<ProviderConfigSchema[]> {
    const response = await this.client.http.get<ApiEnvelope<ProviderConfigSchema[]>>(
      "/backend/v3/api/Mail/provider_schemas",
    );
    if (!response.data) {
      throw new Error("Invalid response: missing provider schema data");
    }
    return response.data;
  }

  async getSchema(provider: string): Promise<ProviderConfigSchema> {
    const response = await this.client.http.get<ApiEnvelope<ProviderConfigSchema>>(
      `/backend/v3/api/Mail/provider_schemas/${encodeURIComponent(provider)}`,
    );
    if (!response.data) {
      throw new Error(`Mail provider schema not found: ${provider}`);
    }
    return response.data;
  }
}
