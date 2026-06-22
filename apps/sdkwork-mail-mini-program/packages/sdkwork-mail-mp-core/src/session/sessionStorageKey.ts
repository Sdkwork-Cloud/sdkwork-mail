export const mail_MP_SESSION_STORAGE_KEY = "sdkwork-mail-mini-program:session:v1";

const LEGACY_mail_MP_SESSION_STORAGE_KEYS = ["sdkwork.Mail.app.session"] as const;

export function listLegacyMailMpSessionStorageKeys(): readonly string[] {
  return LEGACY_mail_MP_SESSION_STORAGE_KEYS;
}
