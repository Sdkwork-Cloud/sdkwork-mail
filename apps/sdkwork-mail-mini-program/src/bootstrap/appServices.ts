import { createMailAppServices, type MailAppServices } from "@sdkwork/mail-mp-mail";

import { getAppSdkClient } from "./appClient";

let appServices: MailAppServices | null = null;

export function createAppServices(): MailAppServices {
  appServices = createMailAppServices(getAppSdkClient());
  return appServices;
}

export function getAppServices(): MailAppServices {
  return appServices ?? createAppServices();
}
