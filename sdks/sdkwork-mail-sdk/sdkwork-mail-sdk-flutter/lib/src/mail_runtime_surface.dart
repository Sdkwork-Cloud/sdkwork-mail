const List<String> MailRuntimeSurfaceMethods = <String>[
  'join',
  'leave',
  'publish',
  'unpublish',
  'startScreenShare',
  'stopScreenShare',
  'muteAudio',
  'muteVideo',
];

const String MailRuntimeSurfaceFailureCode = 'native_sdk_not_available';

const Map<String, Object> MailRuntimeSurfaceStandard = <String, Object>{
  'methodTerms': MailRuntimeSurfaceMethods,
  'failureCode': MailRuntimeSurfaceFailureCode,
};
