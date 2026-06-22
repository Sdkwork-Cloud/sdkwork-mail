import {
  OPTIONAL_mail_CAPABILITIES,
  REQUIRED_mail_CAPABILITIES,
  mail_CAPABILITY_CATALOG,
  getMailCapabilityCatalog,
  getMailCapabilityDescriptor,
  type MailCapabilityKey,
  type MailOptionalCapability,
  type MailRequiredCapability,
} from './capability-catalog.js';
import {
  cloneMailCapabilityNegotiationResult,
  cloneMailCapabilitySupportState,
  freezeMailRuntimeValue,
} from './runtime-freeze.js';
import {
  mail_CAPABILITY_NEGOTIATION_RULES,
  mail_CAPABILITY_NEGOTIATION_STATUSES,
  resolveMailCapabilityNegotiationStatus,
} from './capability-negotiation.js';
import type {
  MailCapabilityNegotiationRequest,
  MailCapabilityNegotiationResult,
  MailCapabilityNegotiationSurfaceMap,
  MailCapabilitySurface,
  MailCapabilitySet,
  MailCapabilitySupportState,
} from './types.js';

function uniqueValues<T extends string>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function createEmptySurfaceMap(): MailCapabilityNegotiationSurfaceMap {
  return {
    controlPlane: [],
    runtimeBridge: [],
    crossSurface: [],
  };
}

function toSurfaceBucket(surface: MailCapabilitySurface): keyof MailCapabilityNegotiationSurfaceMap {
  switch (surface) {
    case 'control-plane':
      return 'controlPlane';
    case 'runtime-bridge':
      return 'runtimeBridge';
    case 'cross-surface':
      return 'crossSurface';
  }

  throw new Error(`Mail capability surface is not recognized: ${surface}`);
}

export function createCapabilitySet(input: Partial<MailCapabilitySet>): MailCapabilitySet {
  return freezeMailRuntimeValue({
    required: uniqueValues(input.required ?? REQUIRED_mail_CAPABILITIES),
    optional: uniqueValues(input.optional ?? []),
  });
}

export function hasCapability(capabilities: MailCapabilitySet, capability: MailCapabilityKey): boolean {
  return capabilities.required.includes(capability as MailRequiredCapability)
    || capabilities.optional.includes(capability as MailOptionalCapability);
}

export function describeCapabilitySupport(
  capabilities: MailCapabilitySet,
  capability: MailCapabilityKey,
): MailCapabilitySupportState {
  const descriptor = getMailCapabilityDescriptor(capability);
  if (!descriptor) {
    throw new Error(`Mail capability descriptor not found: ${capability}`);
  }

  return cloneMailCapabilitySupportState({
    capabilityKey: capability,
    category: descriptor.category,
    surface: descriptor.surface,
    supported: hasCapability(capabilities, capability),
  });
}

export function negotiateCapabilities(
  capabilities: MailCapabilitySet,
  request: MailCapabilityNegotiationRequest,
): MailCapabilityNegotiationResult {
  const required = uniqueValues(request.required ?? []);
  const optional = uniqueValues((request.optional ?? []).filter((capability) => !required.includes(capability)));
  const supportedRequired: MailCapabilityKey[] = [];
  const missingRequired: MailCapabilityKey[] = [];
  const supportedOptional: MailCapabilityKey[] = [];
  const missingOptional: MailCapabilityKey[] = [];
  const missingBySurface = createEmptySurfaceMap();

  for (const capability of required) {
    const capabilityState = describeCapabilitySupport(capabilities, capability);
    if (capabilityState.supported) {
      supportedRequired.push(capability);
      continue;
    }

    missingRequired.push(capability);
    missingBySurface[toSurfaceBucket(capabilityState.surface)] = [
      ...missingBySurface[toSurfaceBucket(capabilityState.surface)],
      capability,
    ];
  }

  for (const capability of optional) {
    const capabilityState = describeCapabilitySupport(capabilities, capability);
    if (capabilityState.supported) {
      supportedOptional.push(capability);
      continue;
    }

    missingOptional.push(capability);
    missingBySurface[toSurfaceBucket(capabilityState.surface)] = [
      ...missingBySurface[toSurfaceBucket(capabilityState.surface)],
      capability,
    ];
  }

  return cloneMailCapabilityNegotiationResult({
    status: resolveMailCapabilityNegotiationStatus(
      missingRequired.length,
      missingOptional.length,
    ),
    supportedRequired,
    missingRequired,
    supportedOptional,
    missingOptional,
    missingBySurface,
  });
}

export {
  OPTIONAL_mail_CAPABILITIES,
  REQUIRED_mail_CAPABILITIES,
  mail_CAPABILITY_NEGOTIATION_RULES,
  mail_CAPABILITY_NEGOTIATION_STATUSES,
  mail_CAPABILITY_CATALOG,
  getMailCapabilityCatalog,
  getMailCapabilityDescriptor,
  resolveMailCapabilityNegotiationStatus,
};
