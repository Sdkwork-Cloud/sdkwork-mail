import type { SdkworkAppClient } from "sdkwork-mail-app-sdk-generated-typescript";

import { getAppSdkClient, initAppSdkClient } from "./appClient";
import { resolveEnvironment } from "./environment";

export interface MailSdkClients {
  apiBaseUrl: string;
  backendApiBaseUrl: string;
  app: SdkworkAppClient;
}

export function bootstrapSdkClients(): MailSdkClients {
  const environment = resolveEnvironment();
  return {
    apiBaseUrl: environment.apiBaseUrl,
    backendApiBaseUrl: environment.backendApiBaseUrl,
    app: initAppSdkClient(),
  };
}

export { getAppSdkClient };
