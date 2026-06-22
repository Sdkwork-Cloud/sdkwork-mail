package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailCapabilityCatalog {

  public static final List<Entry> ENTRIES = List.of(
      new Entry("transport.connect", "required-baseline", "control-plane"),
      new Entry("transport.authenticate", "required-baseline", "control-plane"),
      new Entry("health", "required-baseline", "control-plane"),
      new Entry("smtp.send", "optional-advanced", "runtime-bridge"),
      new Entry("imap.sync", "optional-advanced", "runtime-bridge"),
      new Entry("imap.folder-sync", "optional-advanced", "runtime-bridge"),
      new Entry("imap.message-sync", "optional-advanced", "runtime-bridge"),
      new Entry("transport.retry", "optional-advanced", "control-plane"),
      new Entry("transport.pool", "optional-advanced", "control-plane")
  );

public static List<Entry> getMailCapabilityCatalog() {
    return ENTRIES;
  }

  public static Optional<Entry> getMailCapabilityDescriptor(String capabilityKey) {
    for (var entry : ENTRIES) {
      if (entry.capabilityKey().equals(capabilityKey)) {
        return Optional.of(entry);
      }
    }

    return Optional.empty();
  }


  private MailCapabilityCatalog() {
  }

  public record Entry(String capabilityKey, String category, String surface) {
  }
}
