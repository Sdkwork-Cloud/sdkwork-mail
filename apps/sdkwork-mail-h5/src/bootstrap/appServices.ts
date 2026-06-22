import { createMailAppServices, type MailAppServices } from "@sdkwork/Mail-h5-Mail";

import { getAppSdkClient } from "./appClient";

export function createAppServices(): MailAppServices {
  return createMailAppServices(getAppSdkClient());
}
