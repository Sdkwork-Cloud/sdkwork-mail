enum MailCapabilityNegotiationStatus {
  supported,
  degraded,
  unsupported,
}

const Map<MailCapabilityNegotiationStatus, String>
MailCapabilityNegotiationRules = <MailCapabilityNegotiationStatus, String>{
  MailCapabilityNegotiationStatus.supported:
      'all-requested-capabilities-available',
  MailCapabilityNegotiationStatus.degraded:
      'all-required-capabilities-available_optional-capabilities-missing',
  MailCapabilityNegotiationStatus.unsupported:
      'required-capabilities-missing',
};

const List<String> MailCapabilityNegotiationStatuses = <String>[
  'supported',
  'degraded',
  'unsupported',
];

MailCapabilityNegotiationStatus resolveMailCapabilityNegotiationStatus(
  int missingRequiredCount,
  int missingOptionalCount,
) {
  if (missingRequiredCount > 0) {
    return MailCapabilityNegotiationStatus.unsupported;
  }

  if (missingOptionalCount > 0) {
    return MailCapabilityNegotiationStatus.degraded;
  }

  return MailCapabilityNegotiationStatus.supported;
}
