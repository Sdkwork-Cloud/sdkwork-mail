import 'mail_provider_catalog.dart';

enum MailProviderSelectionSource {
  provider_url,
  provider_key,
  tenant_override,
  deployment_profile,
  default_provider,
}

final class ParsedMailProviderUrl {
  const ParsedMailProviderUrl({
    required this.providerKey,
    required this.rawUrl,
  });

  final String providerKey;
  final String rawUrl;
}

final class MailProviderSelection {
  const MailProviderSelection({
    required this.providerKey,
    required this.source,
  });

  final String providerKey;
  final MailProviderSelectionSource source;
}

final class MailProviderSelectionRequest {
  const MailProviderSelectionRequest({
    this.providerUrl,
    this.providerKey,
    this.tenantOverrideProviderKey,
    this.deploymentProfileProviderKey,
  });

  final String? providerUrl;
  final String? providerKey;
  final String? tenantOverrideProviderKey;
  final String? deploymentProfileProviderKey;
}

const List<String> MailProviderSelectionSources = <String>[
  'provider_url',
  'provider_key',
  'tenant_override',
  'deployment_profile',
  'default_provider',
];

const List<String> MailProviderSelectionPrecedence = <String>[
  'provider_url',
  'provider_key',
  'tenant_override',
  'deployment_profile',
  'default_provider',
];

bool _hasMailProviderSelectionText(String? value) =>
    value != null && value.trim().isNotEmpty;

ParsedMailProviderUrl parseMailProviderUrl(String providerUrl) {
  final trimmed = providerUrl.trim();
  if (!trimmed.startsWith('Mail:') || !trimmed.contains('://')) {
    throw ArgumentError.value(providerUrl, 'providerUrl', 'Invalid Mail provider URL');
  }

  return ParsedMailProviderUrl(
    providerKey: trimmed.substring(4).split('://').first.toLowerCase(),
    rawUrl: providerUrl,
  );
}

MailProviderSelection resolveMailProviderSelection(
  MailProviderSelectionRequest request, {
  String defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
}) {
  if (_hasMailProviderSelectionText(request.providerUrl)) {
    return MailProviderSelection(
      providerKey: parseMailProviderUrl(request.providerUrl!).providerKey,
      source: MailProviderSelectionSource.provider_url,
    );
  }

  if (_hasMailProviderSelectionText(request.providerKey)) {
    return MailProviderSelection(
      providerKey: request.providerKey!.trim(),
      source: MailProviderSelectionSource.provider_key,
    );
  }

  if (_hasMailProviderSelectionText(request.tenantOverrideProviderKey)) {
    return MailProviderSelection(
      providerKey: request.tenantOverrideProviderKey!.trim(),
      source: MailProviderSelectionSource.tenant_override,
    );
  }

  if (_hasMailProviderSelectionText(request.deploymentProfileProviderKey)) {
    return MailProviderSelection(
      providerKey: request.deploymentProfileProviderKey!.trim(),
      source: MailProviderSelectionSource.deployment_profile,
    );
  }

  return MailProviderSelection(
    providerKey: defaultProviderKey,
    source: MailProviderSelectionSource.default_provider,
  );
}
