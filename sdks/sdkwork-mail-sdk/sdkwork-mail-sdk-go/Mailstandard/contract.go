package Mailstandard

type MailStandardContract struct{}

type MailProviderDriver interface {
    ProviderKey() string
}

type MailDriverManager interface {
    ResolveDriver(providerKey string)
}

type MailDataSource interface {
    CreateClient()
}

type MailClient interface {
    ConnectTransport() error
    AuthenticateTransport() error
    DisconnectTransport() error
    SendMail() error
    ProbeMailbox() error
    SyncMailbox() error
    HealthCheck() error
    Unwrap() any
}

type MailRuntimeController interface {
    ConnectTransport() error
    AuthenticateTransport() error
    DisconnectTransport() error
    SendMail() error
    ProbeMailbox() error
    SyncMailbox() error
    HealthCheck() error
}
