package com.sdkwork.Mail.standard;

public final class MailStandardContract {

  private MailStandardContract() {
  }

  public interface MailProviderDriver<TNativeClient> {
    String providerKey();

    MailClient<TNativeClient> createClient();
  }

  public interface MailDriverManager<TNativeClient> {
    MailProviderDriver<TNativeClient> resolveDriver(String providerKey);
  }

  public interface MailDataSource<TNativeClient> {
    MailClient<TNativeClient> createClient();
  }

  public interface MailClient<TNativeClient> {
    void connectTransport();

    void authenticateTransport();

    void disconnectTransport();

    void sendMail();

    void probeMailbox();

    void syncMailbox();

    void healthCheck();

    TNativeClient unwrap();
  }

  public interface MailRuntimeController<TNativeClient> {
    void connectTransport();

    void authenticateTransport();

    void disconnectTransport();

    void sendMail();

    void probeMailbox();

    void syncMailbox();

    void healthCheck();
  }
}
