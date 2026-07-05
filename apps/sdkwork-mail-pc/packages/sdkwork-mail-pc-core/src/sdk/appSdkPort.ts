import type { SdkworkAppClient } from "@sdkwork/mail-app-sdk";

export type MailAppSdkClient = SdkworkAppClient;

export interface MailAppSdkPort {
  client: MailAppSdkClient;
}
