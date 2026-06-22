package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderCatalog {

  public static final String DEFAULT_mail_PROVIDER_KEY = "smtp";

  public static final List<Entry> ENTRIES = List.of(
      new Entry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", true),
      new Entry("imap", "Mail-imap", "sdkwork-mail-driver-imap", false)
  );

public static Optional<Entry> getMailProviderByProviderKey(String providerKey) {
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }


  private MailProviderCatalog() {
  }

  public record Entry(String providerKey, String pluginId, String driverId, boolean defaultSelected) {
  }
}
