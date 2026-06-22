import type { SdkworkAppClient } from "sdkwork-mail-app-sdk-generated-typescript";

export type MailAppSdkClient = SdkworkAppClient;

export interface MailAppSdkPort {
  client: MailAppSdkClient;
}
