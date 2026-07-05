import {
  createClient as createGeneratedMailAppClient,
  SdkworkAppClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkAppConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkAppClient, createGeneratedMailAppClient };
export type { SdkworkAppConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type SdkworkMailAppClient = SdkworkAppClient;

export function createMailAppClient(config: SdkworkAppConfig): SdkworkMailAppClient {
  return createGeneratedMailAppClient(config);
}

export function createClient(config: SdkworkAppConfig): SdkworkMailAppClient {
  return createMailAppClient(config);
}
