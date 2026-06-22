const List<String> MailRuntimeSurfaceMethods = <String>[
  'connectTransport',
  'authenticateTransport',
  'disconnectTransport',
  'sendMail',
  'probeMailbox',
  'syncMailbox',
  'healthCheck',
];

const String MailRuntimeSurfaceFailureCode = 'native_sdk_not_available';

const Map<String, Object> MailRuntimeSurfaceStandard = <String, Object>{
  'methodTerms': MailRuntimeSurfaceMethods,
  'failureCode': MailRuntimeSurfaceFailureCode,
};
