import type {
  MailCapabilityNegotiationResult,
  MailCapabilityNegotiationSurfaceMap,
  MailCapabilitySet,
  MailCapabilitySupportState,
  MailProviderMetadata,
  MailProviderSelection,
} from './types.js';

function cloneReadonlyArray<T>(values: readonly T[]): readonly T[] {
  return [...values];
}

export function freezeMailRuntimeValue<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const nestedValue of Object.values(value as Record<string, unknown>)) {
      freezeMailRuntimeValue(nestedValue);
    }

    Object.freeze(value);
  }

  return value;
}

export function shallowFreezeMailRuntimeValue<T extends object>(value: T): T {
  if (!Object.isFrozen(value)) {
    Object.freeze(value);
  }

  return value;
}

export function cloneMailCapabilitySet(value: MailCapabilitySet): MailCapabilitySet {
  return freezeMailRuntimeValue({
    required: cloneReadonlyArray(value.required),
    optional: cloneReadonlyArray(value.optional),
  });
}

export function cloneMailProviderMetadata(value: MailProviderMetadata): MailProviderMetadata {
  return freezeMailRuntimeValue({
    ...value,
    urlSchemes: cloneReadonlyArray(value.urlSchemes),
    requiredCapabilities: cloneReadonlyArray(value.requiredCapabilities),
    optionalCapabilities: cloneReadonlyArray(value.optionalCapabilities),
    extensionKeys: cloneReadonlyArray(value.extensionKeys),
  });
}

export function cloneMailProviderSelection(value: MailProviderSelection): MailProviderSelection {
  return freezeMailRuntimeValue({
    ...value,
  });
}

export function cloneMailCapabilitySupportState(
  value: MailCapabilitySupportState,
): MailCapabilitySupportState {
  return freezeMailRuntimeValue({
    ...value,
  });
}

export function cloneMailCapabilityNegotiationSurfaceMap(
  value: MailCapabilityNegotiationSurfaceMap,
): MailCapabilityNegotiationSurfaceMap {
  return freezeMailRuntimeValue({
    controlPlane: cloneReadonlyArray(value.controlPlane),
    runtimeBridge: cloneReadonlyArray(value.runtimeBridge),
    crossSurface: cloneReadonlyArray(value.crossSurface),
  });
}

export function cloneMailCapabilityNegotiationResult(
  value: MailCapabilityNegotiationResult,
): MailCapabilityNegotiationResult {
  return freezeMailRuntimeValue({
    ...value,
    supportedRequired: cloneReadonlyArray(value.supportedRequired),
    missingRequired: cloneReadonlyArray(value.missingRequired),
    supportedOptional: cloneReadonlyArray(value.supportedOptional),
    missingOptional: cloneReadonlyArray(value.missingOptional),
    missingBySurface: cloneMailCapabilityNegotiationSurfaceMap(value.missingBySurface),
  });
}
