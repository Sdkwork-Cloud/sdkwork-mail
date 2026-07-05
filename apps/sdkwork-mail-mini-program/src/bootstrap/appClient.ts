import { createMailAppSdkClient } from "@sdkwork/Mail-mp-core";
import type { SdkworkAppClient } from "@sdkwork/mail-app-sdk";

import { loadAppSession } from "./appAuth";
import { resolveEnvironment } from "./environment";
import { getTokenManager } from "./tokenManager";

let appSdkClient: SdkworkAppClient | null = null;

export function initAppSdkClient(): SdkworkAppClient {
  const environment = resolveEnvironment();
  appSdkClient = createMailAppSdkClient({
    apiBaseUrl: environment.apiBaseUrl,
    session: loadAppSession(),
    tokenManager: getTokenManager(),
    platform: "mp-weixin",
  });
  return appSdkClient;
}

export function getAppSdkClient(): SdkworkAppClient {
  return appSdkClient ?? initAppSdkClient();
}
