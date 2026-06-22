package com.sdkwork.Mail.metadata;

import java.util.List;

public record MailProviderSelection(String providerKey, MailProviderSelectionSource source) {

  public enum MailProviderSelectionSource {
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider
  }

  public record ParsedMailProviderUrl(String providerKey, String rawUrl) {
  }

  public record MailProviderSelectionRequest(
      String providerUrl,
      String providerKey,
      String tenantOverrideProviderKey,
      String deploymentProfileProviderKey
  ) {
  }

  public static final List<String> mail_PROVIDER_SELECTION_SOURCES = List.of(
      "provider_url",
      "provider_key",
      "tenant_override",
      "deployment_profile",
      "default_provider"
  );

  public static final List<String> mail_PROVIDER_SELECTION_PRECEDENCE = List.of(
      "provider_url",
      "provider_key",
      "tenant_override",
      "deployment_profile",
      "default_provider"
  );

  public static ParsedMailProviderUrl parseMailProviderUrl(String providerUrl) {
    var trimmed = providerUrl.trim();
    if (!trimmed.startsWith("Mail:") || !trimmed.contains("://")) {
      throw new IllegalArgumentException("Invalid Mail provider URL: " + providerUrl);
    }

    return new ParsedMailProviderUrl(
        trimmed.substring(4, trimmed.indexOf("://")).toLowerCase(),
        providerUrl
    );
  }

  public static MailProviderSelection resolveMailProviderSelection(
      MailProviderSelectionRequest request
  ) {
    return resolveMailProviderSelection(request, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public static MailProviderSelection resolveMailProviderSelection(
      MailProviderSelectionRequest request,
      String defaultProviderKey
  ) {
    var resolvedRequest = request == null
        ? new MailProviderSelectionRequest(null, null, null, null)
        : request;

    if (hasText(resolvedRequest.providerUrl())) {
      return new MailProviderSelection(
          parseMailProviderUrl(resolvedRequest.providerUrl()).providerKey(),
          MailProviderSelectionSource.provider_url
      );
    }

    if (hasText(resolvedRequest.providerKey())) {
      return new MailProviderSelection(
          resolvedRequest.providerKey().trim(),
          MailProviderSelectionSource.provider_key
      );
    }

    if (hasText(resolvedRequest.tenantOverrideProviderKey())) {
      return new MailProviderSelection(
          resolvedRequest.tenantOverrideProviderKey().trim(),
          MailProviderSelectionSource.tenant_override
      );
    }

    if (hasText(resolvedRequest.deploymentProfileProviderKey())) {
      return new MailProviderSelection(
          resolvedRequest.deploymentProfileProviderKey().trim(),
          MailProviderSelectionSource.deployment_profile
      );
    }

    return new MailProviderSelection(
        defaultProviderKey,
        MailProviderSelectionSource.default_provider
    );
  }

  private static boolean hasText(String value) {
    return value != null && !value.trim().isEmpty();
  }
}
