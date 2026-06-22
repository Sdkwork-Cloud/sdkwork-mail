import { createClient, type SdkworkAppClient } from "sdkwork-mail-app-sdk-generated-typescript";
import type { AuthTokenManager } from "@sdkwork/sdk-common";

import { resolveAppSdkBaseUrl } from "../config/resolveAppSdkBaseUrl";
import { DEFAULT_APP_PERMISSION_SCOPE, type MailAppSession } from "../session/appSession";

export interface CreateMailAppSdkClientOptions {
  apiBaseUrl: string;
  session: MailAppSession | null;
  tokenManager?: AuthTokenManager;
  platform?: string;
}

export function buildMailAppSdkHeaders(session: MailAppSession): Record<string, string> {
  return {
    "x-sdkwork-tenant-id": session.tenantId,
    "x-sdkwork-organization-id": session.organizationId,
    "x-sdkwork-user-id": session.userId,
    "x-sdkwork-actor-id": session.userId,
    "x-sdkwork-permission-scope": DEFAULT_APP_PERMISSION_SCOPE,
  };
}

export function createMailAppSdkClient({
  apiBaseUrl,
  session,
  tokenManager,
  platform = "h5",
}: CreateMailAppSdkClientOptions): SdkworkAppClient {
  return createClient({
    baseUrl: resolveAppSdkBaseUrl(apiBaseUrl),
    tokenManager,
    authToken: session?.authToken,
    accessToken: session?.accessToken,
    tenantId: session?.tenantId,
    organizationId: session?.organizationId,
    headers: session ? buildMailAppSdkHeaders(session) : undefined,
    platform,
  });
}
