import { installWeixinFetch } from "@sdkwork/Mail-mp-host";

import { bootstrap } from "./iamRuntime";
import { createAppServices } from "./appServices";
import { resolveEnvironment, saveRuntimeEnvironment } from "./environment";

function getServices() {
  return createAppServices();
}

export function bootstrapMailMiniProgram(query: Record<string, string | undefined> = {}) {
  installWeixinFetch();
  bootstrap(query);
}

export async function listMailAccounts() {
  return getServices().listAccounts();
}

export async function listMailFolders(accountId: string) {
  return getServices().listFolders(accountId);
}

export async function listMailMessages(folderId: string) {
  return getServices().listMessages(folderId);
}

export async function getMailMessage(messageId: string) {
  return getServices().retrieveMessage(messageId);
}

export function configureMailRuntime(config: {
  apiBaseUrl?: string;
  appbaseLoginUrl?: string;
}) {
  return saveRuntimeEnvironment(config);
}

export function getMailRuntimeEnvironment() {
  return resolveEnvironment();
}
