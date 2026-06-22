package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderPackageCatalog {

  public static final List<MailProviderPackageCatalogEntry> ENTRIES = List.of(
      new MailProviderPackageCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "com.sdkwork:Mail-sdk-provider-smtp", "providers/Mail-sdk-provider-smtp/pom.xml", "providers/Mail-sdk-provider-smtp/README.md", "providers/Mail-sdk-provider-smtp/src/main/java/com/sdkwork/Mail/provider/smtp/MailProviderSmtpPackageContract.java", "MailProviderSmtpPackageContract", true, false, "future-runtime-bridge-only", "reserved"),
      new MailProviderPackageCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", "com.sdkwork:Mail-sdk-provider-imap", "providers/Mail-sdk-provider-imap/pom.xml", "providers/Mail-sdk-provider-imap/README.md", "providers/Mail-sdk-provider-imap/src/main/java/com/sdkwork/Mail/provider/imap/MailProviderImapPackageContract.java", "MailProviderImapPackageContract", true, false, "future-runtime-bridge-only", "reserved")
  );

public static Optional<MailProviderPackageCatalogEntry> getMailProviderPackageByProviderKey(String providerKey) {
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }

  public static Optional<MailProviderPackageCatalogEntry> getMailProviderPackageByPackageIdentity(String packageIdentity) {
    for (var entry : ENTRIES) {
      if (entry.packageIdentity().equals(packageIdentity)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }


  private MailProviderPackageCatalog() {
  }

  public record MailProviderPackageCatalogEntry(
      String providerKey,
      String pluginId,
      String driverId,
      String packageIdentity,
      String manifestPath,
      String readmePath,
      String sourcePath,
      String sourceSymbol,
      boolean builtin,
      boolean rootPublic,
      String status,
      String runtimeBridgeStatus
  ) {
  }
}
