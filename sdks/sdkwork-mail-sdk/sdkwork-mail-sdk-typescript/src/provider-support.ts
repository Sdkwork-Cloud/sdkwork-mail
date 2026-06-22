import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type {
  MailProviderSupportState,
  MailProviderSupportStateRequest,
  MailProviderSupportStatus,
} from './types.js';

export const mail_PROVIDER_SUPPORT_STATUSES = freezeMailRuntimeValue([
  'builtin_registered',
  'official_registered',
  'official_unregistered',
  'unknown',
] as const);

export function resolveMailProviderSupportStatus(
  request: MailProviderSupportStateRequest,
): MailProviderSupportStatus {
  if (request.official && request.registered) {
    return request.builtin ? 'builtin_registered' : 'official_registered';
  }

  if (request.official) {
    return 'official_unregistered';
  }

  return 'unknown';
}

export function createMailProviderSupportState(
  request: MailProviderSupportStateRequest,
): MailProviderSupportState {
  return freezeMailRuntimeValue({
    providerKey: request.providerKey,
    builtin: request.builtin,
    official: request.official,
    registered: request.registered,
    status: resolveMailProviderSupportStatus(request),
  });
}
