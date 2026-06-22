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
  organizationId: "default",
  userId: "user",
};

export const DEFAULT_APP_PERMISSION_SCOPE = "Mail.media_session.read Mail.media_session.write";
