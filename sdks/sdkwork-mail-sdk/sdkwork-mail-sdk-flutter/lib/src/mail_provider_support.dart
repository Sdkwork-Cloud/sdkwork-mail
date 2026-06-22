enum MailProviderSupportStatus {
  builtin_registered,
  official_registered,
  official_unregistered,
  unknown,
}

final class MailProviderSupport {
  const MailProviderSupport({
    required this.providerKey,
    required this.status,
    required this.builtin,
    required this.official,
    required this.registered,
  });

  final String providerKey;
  final MailProviderSupportStatus status;
  final bool builtin;
  final bool official;
  final bool registered;
}

final class MailProviderSupportStateRequest {
  const MailProviderSupportStateRequest({
    required this.providerKey,
    required this.builtin,
    required this.official,
    required this.registered,
  });

  final String providerKey;
  final bool builtin;
  final bool official;
  final bool registered;
}

const List<String> MailProviderSupportStatuses = <String>[
  'builtin_registered',
  'official_registered',
  'official_unregistered',
  'unknown',
];

MailProviderSupportStatus resolveMailProviderSupportStatus(
  MailProviderSupportStateRequest request,
) {
  if (request.official && request.registered) {
    return request.builtin
        ? MailProviderSupportStatus.builtin_registered
        : MailProviderSupportStatus.official_registered;
  }

  if (request.official) {
    return MailProviderSupportStatus.official_unregistered;
  }

  return MailProviderSupportStatus.unknown;
}

MailProviderSupport createMailProviderSupportState(
  MailProviderSupportStateRequest request,
) {
  return MailProviderSupport(
    providerKey: request.providerKey,
    status: resolveMailProviderSupportStatus(request),
    builtin: request.builtin,
    official: request.official,
    registered: request.registered,
  );
}
