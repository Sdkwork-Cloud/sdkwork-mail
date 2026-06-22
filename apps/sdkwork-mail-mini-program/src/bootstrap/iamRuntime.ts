import { installWeixinFetch } from "@sdkwork/Mail-mp-host";

import { bootstrapAppAuth, consumeAppbaseCallbackSession } from "./appAuth";
import { registerHostAdapters } from "./hostAdapters";
import { initAppSdkClient } from "./appClient";

export function bootstrap(query: Record<string, string | undefined> = {}) {
  installWeixinFetch();
  registerHostAdapters();
  consumeAppbaseCallbackSession(query);
  bootstrapAppAuth();
  initAppSdkClient();
}
