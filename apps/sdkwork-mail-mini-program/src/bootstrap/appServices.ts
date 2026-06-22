import { createMailAppServices, type MailAppServices } from "@sdkwork/Mail-mp-Mail";

import { getAppSdkClient } from "./appClient";

let appServices: MailAppServices | null = null;

export function createAppServices(): MailAppServices {
  appServices = createMailAppServices(getAppSdkClient());
  return appServices;
}

export function getAppServices(): MailAppServices {
  return appServices ?? createAppServices();
}
