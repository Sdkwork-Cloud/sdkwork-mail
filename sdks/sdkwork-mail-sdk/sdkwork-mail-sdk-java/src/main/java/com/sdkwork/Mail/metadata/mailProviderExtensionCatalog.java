package com.sdkwork.Mail.metadata;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public final class MailProviderExtensionCatalog {

  public static final List<String> RECOGNIZED_SURFACES = List.of(
      "control-plane",
      "runtime-bridge",
      "cross-surface"
  );

  public static final List<String> RECOGNIZED_ACCESSES = List.of(
      "unwrap-only",
      "extension-object"
  );

  public static final List<String> RECOGNIZED_STATUSES = List.of(
      "reference-baseline",
      "reserved"
  );

  public static final List<Entry> ENTRIES = List.of(
      new Entry("smtp.transport", "smtp", "SMTP Transport", "runtime-bridge", "unwrap-only", "reserved"),
      new Entry("imap.sync", "imap", "IMAP Sync", "runtime-bridge", "unwrap-only", "reserved")
  );

public static List<Entry> getMailProviderExtensionCatalog() {
    return ENTRIES;
  }

  public static Optional<Entry> getMailProviderExtensionDescriptor(String extensionKey) {
    for (var entry : ENTRIES) {
      if (entry.extensionKey().equals(extensionKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }

  public static List<Entry> getMailProviderExtensionsForProvider(String providerKey) {
    var resolved = new ArrayList<Entry>();
    for (var entry : ENTRIES) {
      if (entry.providerKey().equals(providerKey)) {
        resolved.add(entry);
      }
    }

    return List.copyOf(resolved);
  }

  public static List<Entry> getMailProviderExtensions(List<String> extensionKeys) {
    var resolved = new ArrayList<Entry>();
    for (var extensionKey : extensionKeys) {
      getMailProviderExtensionDescriptor(extensionKey).ifPresent(resolved::add);
    }

    return List.copyOf(resolved);
  }

  public static boolean hasMailProviderExtension(List<String> extensionKeys, String extensionKey) {
    return extensionKeys.contains(extensionKey)
        && getMailProviderExtensionDescriptor(extensionKey).isPresent();
  }


  private MailProviderExtensionCatalog() {
  }

  public record Entry(
      String extensionKey,
      String providerKey,
      String displayName,
      String surface,
      String access,
      String status
  ) {
  }
}
