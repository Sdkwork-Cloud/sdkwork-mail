package Mailstandard

type MailProviderSupportStateRequest struct {
    ProviderKey string
    Builtin     bool
    Official    bool
    Registered  bool
}

type MailProviderSupport struct {
    ProviderKey string
    Status      string
    Builtin     bool
    Official    bool
    Registered  bool
}

var MailProviderSupportStatuses = []string{
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
}

func ResolveMailProviderSupportStatus(request MailProviderSupportStateRequest) string {
    if request.Official && request.Registered {
        if request.Builtin {
            return "builtin_registered"
        }
        return "official_registered"
    }

    if request.Official {
        return "official_unregistered"
    }

    return "unknown"
}

func CreateMailProviderSupportState(
    request MailProviderSupportStateRequest,
) MailProviderSupport {
    return MailProviderSupport{
        ProviderKey: request.ProviderKey,
        Status:      ResolveMailProviderSupportStatus(request),
        Builtin:     request.Builtin,
        Official:    request.Official,
        Registered:  request.Registered,
    }
}
