import { MailSdkException } from './errors.js';
import { DEFAULT_mail_PROVIDER_KEY } from './provider-catalog.js';
import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type {
  MailProviderSelection,
  MailProviderSelectionRequest,
  MailProviderSelectionSource,
} from './types.js';

const mail_PROVIDER_URL_PATTERN = /^Mail:([a-z0-9-]+):\/\/.+$/i;

export interface ParsedMailProviderUrl {
  providerKey: string;
  rawUrl: string;
}

export const mail_PROVIDER_SELECTION_SOURCES = freezeMailRuntimeValue([
  'provider_url',
  'provider_key',
  'tenant_override',
  'deployment_profile',
  'default_provider',
] as const);

export const mail_PROVIDER_SELECTION_PRECEDENCE = freezeMailRuntimeValue([
  ...mail_PROVIDER_SELECTION_SOURCES,
]);

export function parseMailProviderUrl(providerUrl: string): ParsedMailProviderUrl {
  const match = mail_PROVIDER_URL_PATTERN.exec(providerUrl.trim());
  if (!match) {
    throw new MailSdkException({
      code: 'invalid_provider_url',
      message: `Invalid Mail provider URL: ${providerUrl}`,
      details: { providerUrl },
    });
  }
  const providerKey = match[1];
  if (!providerKey) {
    throw new MailSdkException({
      code: 'invalid_provider_url',
      message: `Invalid Mail provider URL: ${providerUrl}`,
      details: { providerUrl },
    });
  }

  return freezeMailRuntimeValue({
    providerKey: providerKey.toLowerCase(),
    rawUrl: providerUrl,
  });
}

function createMailProviderSelection(
  providerKey: string,
  source: MailProviderSelectionSource,
): MailProviderSelection {
  return freezeMailRuntimeValue({
    providerKey,
    source,
  });
}

export function resolveMailProviderSelection(
  request: MailProviderSelectionRequest = {},
  defaultProviderKey: string = DEFAULT_mail_PROVIDER_KEY,
): MailProviderSelection {
  if (request.providerUrl) {
    return createMailProviderSelection(
      parseMailProviderUrl(request.providerUrl).providerKey,
      'provider_url',
    );
  }

  if (request.providerKey) {
    return createMailProviderSelection(request.providerKey, 'provider_key');
  }

  if (request.tenantOverrideProviderKey) {
    return createMailProviderSelection(
      request.tenantOverrideProviderKey,
      'tenant_override',
    );
  }

  if (request.deploymentProfileProviderKey) {
    return createMailProviderSelection(
      request.deploymentProfileProviderKey,
      'deployment_profile',
    );
  }

  return createMailProviderSelection(defaultProviderKey, 'default_provider');
}
