import { createMailAppServices, type MailAppServices } from "@sdkwork/Mail-pc-Mail";

import { getAppSdkClient } from "./appClient";

export function createAppServices(): MailAppServices {
  return createMailAppServices(getAppSdkClient());
}
