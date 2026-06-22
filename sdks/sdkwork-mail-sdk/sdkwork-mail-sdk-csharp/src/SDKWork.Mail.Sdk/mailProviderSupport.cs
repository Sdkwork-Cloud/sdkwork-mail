namespace Sdkwork.Mail.Sdk;

using System.Collections.Generic;

public enum MailProviderSupportStatus
{
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown,
}

public sealed record MailProviderSupportStateRequest(
    string providerKey,
    bool builtin,
    bool official,
    bool registered
);

public sealed record MailProviderSupport(
    string providerKey,
    MailProviderSupportStatus status,
    bool builtin,
    bool official,
    bool registered
)
{
    public static readonly IReadOnlyList<string> MailProviderSupportStatuses =
    [
        "builtin_registered",
        "official_registered",
        "official_unregistered",
        "unknown",
    ];

    public static MailProviderSupportStatus ResolveMailProviderSupportStatus(
        MailProviderSupportStateRequest request
    )
    {
        if (request.official && request.registered)
        {
            return request.builtin
                ? MailProviderSupportStatus.builtin_registered
                : MailProviderSupportStatus.official_registered;
        }

        if (request.official)
        {
            return MailProviderSupportStatus.official_unregistered;
        }

        return MailProviderSupportStatus.unknown;
    }

    public static MailProviderSupport CreateMailProviderSupportState(
        MailProviderSupportStateRequest request
    )
    {
        return new MailProviderSupport(
            request.providerKey,
            ResolveMailProviderSupportStatus(request),
            request.builtin,
            request.official,
            request.registered
        );
    }
}
