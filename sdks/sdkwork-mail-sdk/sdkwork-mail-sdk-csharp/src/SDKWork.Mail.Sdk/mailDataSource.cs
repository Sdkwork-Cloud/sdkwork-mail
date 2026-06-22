namespace Sdkwork.Mail.Sdk;

public sealed record MailDataSourceOptions(
    string? providerUrl = null,
    string? providerKey = null,
    string? tenantOverrideProviderKey = null,
    string? deploymentProfileProviderKey = null,
    string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
);

public sealed class MailDataSource
{
    private readonly MailDataSourceOptions _options;
    private readonly MailDriverManager _driverManager;

    public MailDataSource(
        MailDataSourceOptions? options = null,
        MailDriverManager? driverManager = null
    )
    {
        _options = options ?? new MailDataSourceOptions();
        _driverManager = driverManager ?? new MailDriverManager();
    }

    public MailProviderSelection DescribeSelection(MailDataSourceOptions? overrides = null)
    {
        var merged = merge(_options, overrides);
        return _driverManager.ResolveSelection(
            new MailProviderSelectionRequest(
                merged.providerUrl,
                merged.providerKey,
                merged.tenantOverrideProviderKey,
                merged.deploymentProfileProviderKey
            ),
            merged.defaultProviderKey
        );
    }

    public MailProviderSupport DescribeProviderSupport(MailDataSourceOptions? overrides = null)
    {
        return _driverManager.DescribeProviderSupport(DescribeSelection(overrides).providerKey);
    }

    public IReadOnlyList<MailProviderSupport> ListProviderSupport()
    {
        return _driverManager.ListProviderSupport();
    }

    private static MailDataSourceOptions merge(
        MailDataSourceOptions baseOptions,
        MailDataSourceOptions? overrides
    )
    {
        if (overrides is null)
        {
            return baseOptions;
        }

        return new MailDataSourceOptions(
            overrides.providerUrl ?? baseOptions.providerUrl,
            overrides.providerKey ?? baseOptions.providerKey,
            overrides.tenantOverrideProviderKey ?? baseOptions.tenantOverrideProviderKey,
            overrides.deploymentProfileProviderKey ?? baseOptions.deploymentProfileProviderKey,
            string.IsNullOrWhiteSpace(overrides.defaultProviderKey)
                ? baseOptions.defaultProviderKey
                : overrides.defaultProviderKey
        );
    }
}
