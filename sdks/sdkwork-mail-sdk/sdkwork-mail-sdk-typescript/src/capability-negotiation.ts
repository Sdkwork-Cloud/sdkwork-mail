import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type {
  MailCapabilityNegotiationRule,
  MailCapabilityNegotiationStatus,
} from './types.js';

export const mail_CAPABILITY_NEGOTIATION_STATUSES = freezeMailRuntimeValue([
  'supported',
  'degraded',
  'unsupported',
] as const);

export const mail_CAPABILITY_NEGOTIATION_RULES = freezeMailRuntimeValue({
  supported: 'all-requested-capabilities-available',
  degraded: 'all-required-capabilities-available_optional-capabilities-missing',
  unsupported: 'required-capabilities-missing',
} as const satisfies Record<MailCapabilityNegotiationStatus, MailCapabilityNegotiationRule>);

export function resolveMailCapabilityNegotiationStatus(
  missingRequiredCount: number,
  missingOptionalCount: number,
): MailCapabilityNegotiationStatus {
  if (missingRequiredCount > 0) {
    return 'unsupported';
  }

  if (missingOptionalCount > 0) {
    return 'degraded';
  }

  return 'supported';
}
