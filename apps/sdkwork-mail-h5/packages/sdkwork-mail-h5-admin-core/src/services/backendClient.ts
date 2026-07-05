import { SdkworkBackendClient } from "@sdkwork/mail-backend-sdk";
import type { AuthTokenManager } from "@sdkwork/sdk-common";

export interface MailBackendClientOptions {
  tokenManager?: AuthTokenManager;
  authToken?: string;
  accessToken?: string;
  tenantId?: string;
  organizationId?: string;
  headers?: Record<string, string>;
}

export function createBackendMailClient(
  baseUrl: string,
  tokenManagerOrOptions?: AuthTokenManager | MailBackendClientOptions,
  maybeOptions?: MailBackendClientOptions,
): SdkworkBackendClient {
  const options =
    maybeOptions ??
    (tokenManagerOrOptions && "getAccessToken" in tokenManagerOrOptions
      ? { tokenManager: tokenManagerOrOptions }
      : (tokenManagerOrOptions as MailBackendClientOptions | undefined));

  const client = new SdkworkBackendClient({
    baseUrl,
    tokenManager: options?.tokenManager,
    authToken: options?.authToken,
    accessToken: options?.accessToken,
    tenantId: options?.tenantId,
    organizationId: options?.organizationId,
    headers: options?.headers,
  });

  if (options?.authToken) {
    client.setAuthToken(options.authToken);
  }
  if (options?.accessToken) {
    client.setAccessToken(options.accessToken);
  }

  return client;
}
