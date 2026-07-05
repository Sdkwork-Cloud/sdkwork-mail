import {
  createClient as createGeneratedMailBackendClient,
  SdkworkBackendClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkBackendConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkBackendClient, createGeneratedMailBackendClient };
export type { SdkworkBackendConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type SdkworkMailBackendClient = SdkworkBackendClient;

export function createMailBackendClient(config: SdkworkBackendConfig): SdkworkMailBackendClient {
  return createGeneratedMailBackendClient(config);
}

export function createClient(config: SdkworkBackendConfig): SdkworkMailBackendClient {
  return createMailBackendClient(config);
}
