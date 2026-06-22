import type { MailSdkErrorCode } from './errors.js';
import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_RUNTIME_SURFACE_METHODS = freezeMailRuntimeValue(['connectTransport', 'authenticateTransport', 'disconnectTransport', 'sendMail', 'probeMailbox', 'syncMailbox', 'healthCheck'] as const);

export type MailRuntimeSurfaceMethodName = (typeof mail_RUNTIME_SURFACE_METHODS)[number];

export type MailRuntimeSurfaceFailureCode = Extract<MailSdkErrorCode, 'native_sdk_not_available'>;

export const mail_RUNTIME_SURFACE_FAILURE_CODE: MailRuntimeSurfaceFailureCode = 'native_sdk_not_available';

export const mail_RUNTIME_SURFACE_STANDARD = freezeMailRuntimeValue({
  methodTerms: mail_RUNTIME_SURFACE_METHODS,
  failureCode: mail_RUNTIME_SURFACE_FAILURE_CODE,
} as const);
