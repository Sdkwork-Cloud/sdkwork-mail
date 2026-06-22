import type { AuthTokenManager } from "@sdkwork/sdk-common";

import type {
  ProviderQueryJob,
  ProviderQueryJobCreateCommand,
  ProviderQuerySnapshot,
} from "../types/providerQueryJob";
import { createBackendMailClient, type MailBackendClientOptions } from "./backendClient";

interface SnapshotListResponse {
  items: ProviderQuerySnapshot[];
  nextCursor?: string | null;
}

export class ProviderQueryJobService {
  private readonly client;

  constructor(
    baseUrl: string,
    tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  ) {
    this.client = createBackendMailClient(baseUrl, tokenManagerOrOptions);
  }

  async create(command: ProviderQueryJobCreateCommand): Promise<ProviderQueryJob> {
    const response = await this.client.MailProviderQueryJobs.Mail.providerQueryJobs.create(command);
    if (!response.data) {
      throw new Error("Invalid response: missing provider query job data");
    }
    return response.data as ProviderQueryJob;
  }

  async get(id: string): Promise<ProviderQueryJob> {
    const response = await this.client.MailProviderQueryJobs.Mail.providerQueryJobs.retrieve(id);
    if (!response.data) {
      throw new Error(`Mail provider query job not found: ${id}`);
    }
    return response.data as ProviderQueryJob;
  }

  async listSnapshots(
    providerQueryJobId: string,
    params?: {
      page?: number;
      limit?: number;
      cursor?: string;
      search?: string;
      sort?: string;
    },
  ): Promise<SnapshotListResponse> {
    const response =
      await this.client.MailProviderQueryJobs.Mail.providerQueryJobs.snapshots.list(
        providerQueryJobId,
        {
          page: params?.page,
          pageSize: params?.limit,
          cursor: params?.cursor,
          q: params?.search,
          sort: params?.sort,
        },
      );
    return {
      items: (response.data?.items ?? []) as ProviderQuerySnapshot[],
      nextCursor: (response.data?.nextCursor as string | null | undefined) ?? null,
    };
  }
}
