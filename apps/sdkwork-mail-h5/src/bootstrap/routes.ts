import { AdminRoutes } from "@sdkwork/mail-h5-admin-shell";
import { createMailAppRoutes } from "@sdkwork/mail-h5-shell";

export function createRoutes() {
  return [...createMailAppRoutes(), ...AdminRoutes().routes];
}
