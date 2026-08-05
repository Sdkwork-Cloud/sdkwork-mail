import { AdminRoutes } from "@sdkwork/mail-pc-admin-shell";
import { createMailAppRoutes } from "@sdkwork/mail-pc-shell";

export function createRoutes() {
  return [...createMailAppRoutes(), ...AdminRoutes().routes];
}
