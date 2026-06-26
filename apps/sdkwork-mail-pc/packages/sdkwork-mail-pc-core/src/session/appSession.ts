export interface MailAppSession {
  accessToken: string;
  authToken: string;
  tenantId: string;
  organizationId: string;
  userId: string;
}

export const DEFAULT_APP_SESSION: MailAppSession = {
  accessToken: "dev-access-token",
  authToken: "dev-auth-token",
  tenantId: "default",
  organizationId: "0",
  userId: "user",
};

export const DEFAULT_APP_PERMISSION_SCOPE = "mail.messages.read mail.messages.write mail.verification.write mail.transactional.write";
