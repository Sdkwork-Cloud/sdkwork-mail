export {
  MailTemplateAdminService,
  MailTransactionalDeliveryAdminService,
} from "./services/mailTransactionalAdminService";
export type {
  MailTemplateRecord,
  MailTransactionalDeliveryRecord,
  CreateMailTemplateCommand,
  UpdateMailTemplateCommand,
} from "./services/mailTransactionalAdminService";
export { MailMarketingConsentAdminService } from "./services/mailMarketingConsentAdminService";
export type {
  MailMarketingConsentRecord,
  GrantMailMarketingConsentCommand,
} from "./services/mailMarketingConsentAdminService";
export { MailProviderAccountService } from "./services/mailProviderAccountService";
export type {
  MailTransportProviderAccount,
  CreateMailProviderAccountCommand,
  MailProviderPingResult,
} from "./services/mailProviderAccountService";

export { MailTemplateList } from "./components/MailTemplateList";
export { MailTemplateForm } from "./components/MailTemplateForm";
export { MailTransactionalDeliveryList } from "./components/MailTransactionalDeliveryList";
export { MailProviderAccountList } from "./components/MailProviderAccountList";
export { MailProviderAccountForm } from "./components/MailProviderAccountForm";
export { MailMarketingConsentList } from "./components/MailMarketingConsentList";
export { MailMarketingConsentForm } from "./components/MailMarketingConsentForm";

export const ADMIN_STYLESHEET_PATH = "./admin-styles.css";
