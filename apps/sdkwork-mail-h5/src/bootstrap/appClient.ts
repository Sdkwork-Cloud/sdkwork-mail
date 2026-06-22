import { getMailAppSdkClient } from "@sdkwork/Mail-h5-core";
import type { SdkworkAppClient } from "sdkwork-mail-app-sdk-generated-typescript";

import { resolveEnvironment } from "./environment";

export function initAppSdkClient(): SdkworkAppClient {
  const environment = resolveEnvironment();
  return getMailAppSdkClient(environment.apiBaseUrl);
}

export function getAppSdkClient(): SdkworkAppClient {
  return initAppSdkClient();
}
