import { AdminRoutes } from "@sdkwork/Mail-h5-admin-shell";
import { createMailAppRoutes } from "@sdkwork/Mail-h5-shell";

export function createRoutes() {
  return [...createMailAppRoutes(), ...AdminRoutes().routes];
}
