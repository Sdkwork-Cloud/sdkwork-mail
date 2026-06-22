package com.sdkwork.Mail.metadata;

import java.util.List;

final class MailDataSourceOptions {

  public final String providerUrl;
  public final String providerKey;
  public final String tenantOverrideProviderKey;
  public final String deploymentProfileProviderKey;
  public final String defaultProviderKey;

  public MailDataSourceOptions() {
    this(null, null, null, null, MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY);
  }

  public MailDataSourceOptions(
      String providerUrl,
      String providerKey,
      String tenantOverrideProviderKey,
      String deploymentProfileProviderKey,
      String defaultProviderKey
  ) {
    this.providerUrl = providerUrl;
    this.providerKey = providerKey;
    this.tenantOverrideProviderKey = tenantOverrideProviderKey;
    this.deploymentProfileProviderKey = deploymentProfileProviderKey;
    this.defaultProviderKey = defaultProviderKey;
  }
}

public final class MailDataSource {

  private final MailDataSourceOptions options;
  private final MailDriverManager driverManager;

  public MailDataSource() {
    this(new MailDataSourceOptions(), new MailDriverManager());
  }

  public MailDataSource(
      MailDataSourceOptions options,
      MailDriverManager driverManager
  ) {
    this.options = options == null ? new MailDataSourceOptions() : options;
    this.driverManager = driverManager == null ? new MailDriverManager() : driverManager;
  }

  public MailProviderSelection describeSelection() {
    return describeSelection(null);
  }

  public MailProviderSelection describeSelection(MailDataSourceOptions overrides) {
    var merged = merge(options, overrides);
    return driverManager.resolveSelection(
        new MailProviderSelection.MailProviderSelectionRequest(
            merged.providerUrl,
            merged.providerKey,
            merged.tenantOverrideProviderKey,
            merged.deploymentProfileProviderKey
        ),
        merged.defaultProviderKey
    );
  }

  public MailProviderSupport describeProviderSupport() {
    return describeProviderSupport(null);
  }

  public MailProviderSupport describeProviderSupport(MailDataSourceOptions overrides) {
    return driverManager.describeProviderSupport(describeSelection(overrides).providerKey());
  }

  public List<MailProviderSupport> listProviderSupport() {
    return driverManager.listProviderSupport();
  }

  private static MailDataSourceOptions merge(
      MailDataSourceOptions base,
      MailDataSourceOptions overrides
  ) {
    if (overrides == null) {
      return base;
    }

    return new MailDataSourceOptions(
        overrides.providerUrl != null ? overrides.providerUrl : base.providerUrl,
        overrides.providerKey != null ? overrides.providerKey : base.providerKey,
        overrides.tenantOverrideProviderKey != null
            ? overrides.tenantOverrideProviderKey
            : base.tenantOverrideProviderKey,
        overrides.deploymentProfileProviderKey != null
            ? overrides.deploymentProfileProviderKey
            : base.deploymentProfileProviderKey,
        overrides.defaultProviderKey == null || overrides.defaultProviderKey.isBlank()
            ? base.defaultProviderKey
            : overrides.defaultProviderKey
    );
  }
}
