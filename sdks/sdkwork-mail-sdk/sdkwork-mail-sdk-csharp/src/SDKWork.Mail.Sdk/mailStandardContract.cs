namespace Sdkwork.Mail.Sdk;

public static class MailStandardContract
{
    public const string Symbol = "MailStandardContract";
}

public interface MailProviderDriver<TNativeClient>
{
    string ProviderKey { get; }

    MailClient<TNativeClient> CreateClient();
}

public interface MailDriverManager<TNativeClient>
{
    MailProviderDriver<TNativeClient> ResolveDriver(string providerKey);
}

public interface MailDataSource<TNativeClient>
{
    MailClient<TNativeClient> CreateClient();
}

public interface MailClient<TNativeClient>
{
    void ConnectTransport();

    void AuthenticateTransport();

    void DisconnectTransport();

    void SendMail();

    void ProbeMailbox();

    void SyncMailbox();

    void HealthCheck();

    TNativeClient? Unwrap();
}

public interface MailRuntimeController<TNativeClient>
{
    void ConnectTransport();

    void AuthenticateTransport();

    void DisconnectTransport();

    void SendMail();

    void ProbeMailbox();

    void SyncMailbox();

    void HealthCheck();
}
