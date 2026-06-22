import { createWeixinSecureStorage } from "@sdkwork/Mail-mp-host";

export interface MailHostAdapters {
  secureStorage: ReturnType<typeof createWeixinSecureStorage> | null;
}

let activeHostAdapters: MailHostAdapters | null = null;

export function registerHostAdapters(): MailHostAdapters {
  if (!activeHostAdapters) {
    const hasWx = typeof (globalThis as { wx?: unknown }).wx !== "undefined";
    activeHostAdapters = {
      secureStorage: hasWx ? createWeixinSecureStorage() : null,
    };
  }
  return activeHostAdapters;
}

export function getHostAdapters(): MailHostAdapters {
  return activeHostAdapters ?? registerHostAdapters();
}
