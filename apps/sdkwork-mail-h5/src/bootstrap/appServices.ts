import { createMailAppServices, type MailAppServices } from "@sdkwork/mail-h5-mail";

import { getAppSdkClient } from "./appClient";

export function createAppServices(): MailAppServices {
  return createMailAppServices(getAppSdkClient());
}
