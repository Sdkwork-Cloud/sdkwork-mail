const String MailRuntimeImmutabilityFrozenTerm = 'runtime-frozen';
const String MailRuntimeImmutabilitySnapshotTerm = 'immutable-snapshots';
const String MailRuntimeImmutabilityControllerContextTerm =
    'shallow-immutable-context';
const String MailRuntimeImmutabilityNativeClientTerm = 'mutable-native-client';

const Map<String, String> MailRuntimeImmutabilityStandard = <String, String>{
  'frozenTerm': MailRuntimeImmutabilityFrozenTerm,
  'snapshotTerm': MailRuntimeImmutabilitySnapshotTerm,
  'controllerContextTerm': MailRuntimeImmutabilityControllerContextTerm,
  'nativeClientTerm': MailRuntimeImmutabilityNativeClientTerm,
};
