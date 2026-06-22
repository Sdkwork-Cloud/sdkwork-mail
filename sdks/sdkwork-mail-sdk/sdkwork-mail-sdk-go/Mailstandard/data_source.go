package Mailstandard

type MailDataSourceOptions struct {
    ProviderUrl                  string
    ProviderKey                  string
    TenantOverrideProviderKey    string
    DeploymentProfileProviderKey string
    DefaultProviderKey           string
}

type MailDataSource struct {
    options       MailDataSourceOptions
    driverManager MailDriverManager
}

func NewMailDataSourceOptions() MailDataSourceOptions {
    return MailDataSourceOptions{
        DefaultProviderKey: DEFAULT_mail_PROVIDER_KEY,
    }
}

func NewMailDataSource(options MailDataSourceOptions, driverManager MailDriverManager) MailDataSource {
    if !hasText(options.DefaultProviderKey) {
        options.DefaultProviderKey = DEFAULT_mail_PROVIDER_KEY
    }

    return MailDataSource{
        options:       options,
        driverManager: driverManager,
    }
}

func mergeMailDataSourceOptions(base MailDataSourceOptions, overrides *MailDataSourceOptions) MailDataSourceOptions {
    if overrides == nil {
        return base
    }

    merged := base
    if overrides.ProviderUrl != "" {
        merged.ProviderUrl = overrides.ProviderUrl
    }
    if overrides.ProviderKey != "" {
        merged.ProviderKey = overrides.ProviderKey
    }
    if overrides.TenantOverrideProviderKey != "" {
        merged.TenantOverrideProviderKey = overrides.TenantOverrideProviderKey
    }
    if overrides.DeploymentProfileProviderKey != "" {
        merged.DeploymentProfileProviderKey = overrides.DeploymentProfileProviderKey
    }
    if overrides.DefaultProviderKey != "" {
        merged.DefaultProviderKey = overrides.DefaultProviderKey
    }

    return merged
}

func (dataSource MailDataSource) describeSelection(overrides *MailDataSourceOptions) MailProviderSelection {
    merged := mergeMailDataSourceOptions(dataSource.options, overrides)
    return dataSource.driverManager.resolveSelection(
        MailProviderSelectionRequest{
            ProviderUrl:                  merged.ProviderUrl,
            ProviderKey:                  merged.ProviderKey,
            TenantOverrideProviderKey:    merged.TenantOverrideProviderKey,
            DeploymentProfileProviderKey: merged.DeploymentProfileProviderKey,
        },
        merged.DefaultProviderKey,
    )
}

func (dataSource MailDataSource) DescribeSelection(overrides *MailDataSourceOptions) MailProviderSelection {
    return dataSource.describeSelection(overrides)
}

func (dataSource MailDataSource) describeProviderSupport(overrides *MailDataSourceOptions) MailProviderSupport {
    selection := dataSource.describeSelection(overrides)
    return dataSource.driverManager.describeProviderSupport(selection.ProviderKey)
}

func (dataSource MailDataSource) DescribeProviderSupport(overrides *MailDataSourceOptions) MailProviderSupport {
    return dataSource.describeProviderSupport(overrides)
}

func (dataSource MailDataSource) listProviderSupport() []MailProviderSupport {
    return dataSource.driverManager.listProviderSupport()
}

func (dataSource MailDataSource) ListProviderSupport() []MailProviderSupport {
    return dataSource.listProviderSupport()
}
