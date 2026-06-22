import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_SDK_ERROR_CODES = freezeMailRuntimeValue([
  'provider_package_not_found',
  'provider_package_identity_mismatch',
  'provider_package_load_failed',
  'provider_module_export_missing',
  'provider_module_contract_mismatch',
  'driver_already_registered',
  'driver_not_found',
  'provider_not_official',
  'provider_not_supported',
  'provider_metadata_mismatch',
  'provider_selection_failed',
  'capability_not_supported',
  'invalid_provider_url',
  'invalid_native_config',
  'native_sdk_not_available',
  'vendor_error',
] as const);

export type MailSdkErrorCode = (typeof mail_SDK_ERROR_CODES)[number];

export const mail_SDK_ERROR_FALLBACK_CODE: MailSdkErrorCode = 'vendor_error';

export interface MailSdkExceptionOptions {
  code: MailSdkErrorCode;
  message: string;
  providerKey?: string;
  pluginId?: string;
  details?: Record<string, unknown>;
  cause?: unknown;
}

export class MailSdkException extends Error {
  readonly code: MailSdkErrorCode;
  readonly providerKey?: string;
  readonly pluginId?: string;
  readonly details?: Record<string, unknown>;

  constructor(options: MailSdkExceptionOptions) {
    super(options.message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'MailSdkException';
    this.code = options.code;
    this.providerKey = options.providerKey;
    this.pluginId = options.pluginId;
    this.details = options.details;
  }
}
