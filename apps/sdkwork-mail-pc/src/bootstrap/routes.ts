import { AdminRoutes } from "@sdkwork/Mail-pc-admin-shell";
import { createMailAppRoutes } from "@sdkwork/Mail-pc-shell";

export function createRoutes() {
  return [...createMailAppRoutes(), ...AdminRoutes().routes];
}
