export {
  DEFAULT_APP_PERMISSION_SCOPE,
  DEFAULT_APP_SESSION,
  type MailAppSession,
} from "./session/appSession";
export {
  buildAppbaseLoginUrl,
  parseAppbaseCallbackSession,
  stripAppbaseCallbackFromLocation,
} from "./session/appbaseAuthBridge";
export {
  mail_MP_SESSION_STORAGE_KEY,
  listLegacyMailMpSessionStorageKeys,
} from "./session/sessionStorageKey";
export { resolveAppSdkBaseUrl } from "./config/resolveAppSdkBaseUrl";
export {
  buildMailAppSdkHeaders,
  createMailAppSdkClient,
  type CreateMailAppSdkClientOptions,
} from "./sdk/createAppSdkClient";
export { isBlank, trim, truncate } from "@sdkwork/utils";
export type { MailAppSdkClient, MailAppSdkPort } from "./sdk/appSdkPort";
