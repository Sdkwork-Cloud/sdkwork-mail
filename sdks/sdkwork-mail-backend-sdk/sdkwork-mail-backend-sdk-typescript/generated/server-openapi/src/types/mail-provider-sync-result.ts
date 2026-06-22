export interface MailProviderSyncResult {
  providerKind?: string;
  providerAccountId?: string;
  mailAccountId?: string;
  folderId?: string;
  syncedCount?: number;
  highestUid?: number;
  uidValidity?: number;
  message?: string;
}
