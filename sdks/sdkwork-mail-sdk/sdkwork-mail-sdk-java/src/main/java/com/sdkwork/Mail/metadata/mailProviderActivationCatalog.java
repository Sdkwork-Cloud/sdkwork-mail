package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderActivationCatalog {

  public static final List<String> RECOGNIZED_ACTIVATION_STATUSES = List.of(
      "package-boundary",
      "control-metadata-only"
  );

  public static final List<MailProviderActivationCatalogEntry> ENTRIES = List.of(
      new MailProviderActivationCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "package-boundary", true, false, true, true, "com.sdkwork:Mail-sdk-provider-smtp"),
      new MailProviderActivationCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", "package-boundary", true, false, true, true, "com.sdkwork:Mail-sdk-provider-imap")
  );

public static Optional<MailProviderActivationCatalogEntry> getMailProviderActivationByProviderKey(String providerKey) {
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }


  private MailProviderActivationCatalog() {
  }

  public record MailProviderActivationCatalogEntry(
      String providerKey,
      String pluginId,
      String driverId,
      String activationStatus,
      boolean runtimeBridge,
      boolean rootPublic,
      boolean packageBoundary,
      boolean builtin,
      String packageIdentity
  ) {
  }
}
