export {
  MailTemplateAdminService,
  MailTransactionalDeliveryAdminService,
} from "./services/mailTransactionalAdminService";
export type {
  MailTemplateRecord,
  MailTransactionalDeliveryRecord,
  CreateMailTemplateCommand,
} from "./services/mailTransactionalAdminService";
export { MailProviderAccountService } from "./services/mailProviderAccountService";
export type { MailTransportProviderAccount } from "./services/mailProviderAccountService";

export { MailTemplateList } from "./components/MailTemplateList";
export { MailTemplateForm } from "./components/MailTemplateForm";
export { MailTransactionalDeliveryList } from "./components/MailTransactionalDeliveryList";
export { MailProviderAccountList } from "./components/MailProviderAccountList";

export const ADMIN_STYLESHEET_PATH = "./admin-styles.css";
