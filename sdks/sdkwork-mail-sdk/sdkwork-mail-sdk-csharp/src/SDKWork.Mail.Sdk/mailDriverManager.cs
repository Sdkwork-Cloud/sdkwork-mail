namespace Sdkwork.Mail.Sdk;

using System.Linq;

public sealed class MailDriverManager
{
    public MailProviderSelection ResolveSelection(
        MailProviderSelectionRequest? request = null,
        string defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    )
    {
        return MailProviderSelection.ResolveMailProviderSelection(request, defaultProviderKey);
    }

    public MailProviderSupport DescribeProviderSupport(string providerKey)
    {
        var official = MailProviderCatalog.GetMailProviderByProviderKey(providerKey) is not null;
        var activation = MailProviderActivationCatalog.GetMailProviderActivationByProviderKey(providerKey);

        return MailProviderSupport.CreateMailProviderSupportState(
            new MailProviderSupportStateRequest(
                providerKey,
                activation?.builtin ?? false,
                official,
                activation?.runtimeBridge ?? false
            )
        );
    }

    public IReadOnlyList<MailProviderSupport> ListProviderSupport()
    {
        return MailProviderCatalog.Entries
            .Select(entry => DescribeProviderSupport(entry.providerKey))
            .ToArray();
    }
}
