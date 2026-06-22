package com.sdkwork.Mail.metadata;

import java.util.List;

public record MailProviderSupport(
    String providerKey,
    MailProviderSupportStatus status,
    boolean builtin,
    boolean official,
    boolean registered
) {

  public enum MailProviderSupportStatus {
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown
  }

  public record MailProviderSupportStateRequest(
      String providerKey,
      boolean builtin,
      boolean official,
      boolean registered
  ) {
  }

  public static final List<String> mail_PROVIDER_SUPPORT_STATUSES = List.of(
      "builtin_registered",
      "official_registered",
      "official_unregistered",
      "unknown"
  );

  public static MailProviderSupportStatus resolveMailProviderSupportStatus(
      MailProviderSupportStateRequest request
  ) {
    if (request.official() && request.registered()) {
      return request.builtin()
          ? MailProviderSupportStatus.builtin_registered
          : MailProviderSupportStatus.official_registered;
    }

    if (request.official()) {
      return MailProviderSupportStatus.official_unregistered;
    }

    return MailProviderSupportStatus.unknown;
  }

  public static MailProviderSupport createMailProviderSupportState(
      MailProviderSupportStateRequest request
  ) {
    return new MailProviderSupport(
        request.providerKey(),
        resolveMailProviderSupportStatus(request),
        request.builtin(),
        request.official(),
        request.registered()
    );
  }
}
