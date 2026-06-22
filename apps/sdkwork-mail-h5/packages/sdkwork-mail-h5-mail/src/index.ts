export { createMailInboxWorkspaceManifest, MailPackageMeta } from "./mail";
export { MailMessageList } from "./components/MailMessageList";
export { InboxPage } from "./pages/InboxPage";
export { MessagePage } from "./pages/MessagePage";
export { createMailAppServices, type MailAppServices } from "./services/mailAppServices";
export type {
  CreateMailMessageRequest,
  MailAccount,
  MailFolder,
  MailMessage,
  MailThread,
  UpdateMailMessageRequest,
} from "./types/appApi";
