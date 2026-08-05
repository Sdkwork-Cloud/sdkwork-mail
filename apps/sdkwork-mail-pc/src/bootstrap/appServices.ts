import { createMailAppServices, type MailAppServices } from "@sdkwork/mail-pc-mail";

import { getAppSdkClient } from "./appClient";

export function createAppServices(): MailAppServices {
  return createMailAppServices(getAppSdkClient());
}
