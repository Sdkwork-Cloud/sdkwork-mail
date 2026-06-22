import type { MailAppSdkClient } from "@sdkwork/Mail-h5-core";

import type { MailAccount, MailFolder, MailMessage } from "../types/appApi";

export interface MailAppServices {
  listAccounts(): Promise<MailAccount[]>;
  listFolders(accountId: string): Promise<MailFolder[]>;
  listMessages(folderId: string): Promise<MailMessage[]>;
  retrieveMessage(messageId: string): Promise<MailMessage>;
}

function readItems<T>(payload: { items?: T[] } | undefined): T[] {
  return Array.isArray(payload?.items) ? payload.items : [];
}

export function createMailAppServices(client: MailAppSdkClient): MailAppServices {
  return {
    async listAccounts() {
      const response = await client.mailAccounts.mail.accounts.list();
      return readItems(response);
    },
    async listFolders(accountId) {
      const response = await client.mailFolders.mail.folders.list({ accountId });
      return readItems(response);
    },
    async listMessages(folderId) {
      const response = await client.mailMessages.mail.messages.list({ folderId });
      return readItems(response);
    },
    async retrieveMessage(messageId) {
      const response = await client.mailMessages.mail.messages.retrieve(messageId);
      if (!response.data) {
        throw new Error(`mail message not found: ${messageId}`);
      }
      return response.data;
    },
  };
}
