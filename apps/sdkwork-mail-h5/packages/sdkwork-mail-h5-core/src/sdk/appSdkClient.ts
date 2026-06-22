import type { SdkworkAppClient } from "sdkwork-mail-app-sdk-generated-typescript";

import { createMailAppSdkClient } from "./createAppSdkClient";
import {
  getMailGlobalTokenManager,
  readMailIamSessionTokens,
  toMailAppSession,
} from "../session/iamSession";

let MailAppSdkClient: SdkworkAppClient | null = null;
let MailAppSdkClientApiBaseUrl: string | null = null;

export function resetMailAppSdkClient(): void {
  MailAppSdkClient = null;
  MailAppSdkClientApiBaseUrl = null;
}

export function getMailAppSdkClient(apiBaseUrl: string): SdkworkAppClient {
  if (MailAppSdkClient && MailAppSdkClientApiBaseUrl === apiBaseUrl) {
    return MailAppSdkClient;
  }

  MailAppSdkClient = createMailAppSdkClient({
    apiBaseUrl,
    session: toMailAppSession(readMailIamSessionTokens()),
    tokenManager: getMailGlobalTokenManager(),
    platform: "h5",
  });
  MailAppSdkClientApiBaseUrl = apiBaseUrl;
  return MailAppSdkClient;
}
