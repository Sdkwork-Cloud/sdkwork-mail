package com.sdkwork.Mail.metadata;

import java.util.List;

public final class MailDriverManager {

  public MailProviderSelection resolveSelection(
      MailProviderSelection.MailProviderSelectionRequest request
  ) {
    return resolveSelection(request, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public MailProviderSelection resolveSelection(
      MailProviderSelection.MailProviderSelectionRequest request,
      String defaultProviderKey
  ) {
    return MailProviderSelection.resolveMailProviderSelection(request, defaultProviderKey);
  }

  public MailProviderSupport describeProviderSupport(String providerKey) {
    var official = MailProviderCatalog.getMailProviderByProviderKey(providerKey).isPresent();
    var activation = MailProviderActivationCatalog.getMailProviderActivationByProviderKey(providerKey);

    return MailProviderSupport.createMailProviderSupportState(
        new MailProviderSupport.MailProviderSupportStateRequest(
            providerKey,
            activation
                .map(MailProviderActivationCatalog.MailProviderActivationCatalogEntry::builtin)
                .orElse(false),
            official,
            activation
                .map(MailProviderActivationCatalog.MailProviderActivationCatalogEntry::runtimeBridge)
                .orElse(false)
        )
    );
  }

  public List<MailProviderSupport> listProviderSupport() {
    return MailProviderCatalog.ENTRIES.stream()
        .map(entry -> describeProviderSupport(entry.providerKey()))
        .toList();
  }
}
