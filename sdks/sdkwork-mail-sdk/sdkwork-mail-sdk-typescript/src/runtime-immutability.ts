import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_RUNTIME_IMMUTABILITY_FROZEN_TERM = 'runtime-frozen';

export const mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM = 'immutable-snapshots';

export const mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM = 'shallow-immutable-context';

export const mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM = 'mutable-native-client';

export const mail_RUNTIME_IMMUTABILITY_STANDARD = freezeMailRuntimeValue({
  frozenTerm: mail_RUNTIME_IMMUTABILITY_FROZEN_TERM,
  snapshotTerm: mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM,
  controllerContextTerm: mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM,
  nativeClientTerm: mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM,
} as const);
