export const MAIL_TRANSPORT_RUNTIME_SURFACE_METHODS = [
  'connectTransport',
  'authenticateTransport',
  'disconnectTransport',
  'sendMail',
  'probeMailbox',
  'syncMailbox',
  'healthCheck',
];

export function renderRustMailClientTraits() {
  return `
pub trait MailClient<TNativeClient> {
    fn connect_transport(&self);
    fn authenticate_transport(&self);
    fn disconnect_transport(&self);
    fn send_mail(&self);
    fn probe_mailbox(&self);
    fn sync_mailbox(&self);
    fn health_check(&self);
    fn unwrap(&self) -> Option<&TNativeClient>;
}

pub trait MailRuntimeController<TNativeClient> {
    fn connect_transport(&self);
    fn authenticate_transport(&self);
    fn disconnect_transport(&self);
    fn send_mail(&self);
    fn probe_mailbox(&self);
    fn sync_mailbox(&self);
    fn health_check(&self);
}`;
}

export function renderJavaMailStandardContractBody() {
  return `
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
  }`;
}

export function renderCsharpMailStandardContractBody() {
  return `
public interface IMailProviderDriver<TNativeClient>
{
    string ProviderKey();

    IMailClient<TNativeClient> CreateClient();
}

public interface IMailDriverManager<TNativeClient>
{
    IMailProviderDriver<TNativeClient> ResolveDriver(string providerKey);
}

public interface IMailDataSource<TNativeClient>
{
    IMailClient<TNativeClient> CreateClient();
}

public interface IMailClient<TNativeClient>
{
    void ConnectTransport();

    void AuthenticateTransport();

    void DisconnectTransport();

    void SendMail();

    void ProbeMailbox();

    void SyncMailbox();

    void HealthCheck();

    TNativeClient Unwrap();
}

public interface IMailRuntimeController<TNativeClient>
{
    void ConnectTransport();

    void AuthenticateTransport();

    void DisconnectTransport();

    void SendMail();

    void ProbeMailbox();

    void SyncMailbox();

    void HealthCheck();
}`;
}

export function renderSwiftMailStandardContractBody() {
  return `
public protocol MailProviderDriver {
    associatedtype NativeClient
    var providerKey: String { get }
    func createClient() -> any MailClient
}

public protocol MailDriverManager {
    associatedtype NativeClient
    func resolveDriver(providerKey: String) -> any MailProviderDriver
}

public protocol MailDataSource {
    associatedtype NativeClient
    func createClient() -> any MailClient
}

public protocol MailClient {
    associatedtype NativeClient
    func connectTransport() async throws
    func authenticateTransport() async throws
    func disconnectTransport() async throws
    func sendMail() async throws
    func probeMailbox() async throws
    func syncMailbox() async throws
    func healthCheck() async throws
    func unwrap() -> NativeClient?
}

public protocol MailRuntimeController {
    associatedtype NativeClient
    func connectTransport() async throws
    func authenticateTransport() async throws
    func disconnectTransport() async throws
    func sendMail() async throws
    func probeMailbox() async throws
    func syncMailbox() async throws
    func healthCheck() async throws
}`;
}

export function renderKotlinMailStandardContractBody() {
  return `
interface MailProviderDriver<TNativeClient> {
    fun providerKey(): String

    fun createClient(): MailClient<TNativeClient>
}

interface MailDriverManager<TNativeClient> {
    fun resolveDriver(providerKey: String): MailProviderDriver<TNativeClient>
}

interface MailDataSource<TNativeClient> {
    fun createClient(): MailClient<TNativeClient>
}

interface MailClient<TNativeClient> {
    fun connectTransport()

    fun authenticateTransport()

    fun disconnectTransport()

    fun sendMail()

    fun probeMailbox()

    fun syncMailbox()

    fun healthCheck()

    fun unwrap(): TNativeClient
}

interface MailRuntimeController<TNativeClient> {
    fun connectTransport()

    fun authenticateTransport()

    fun disconnectTransport()

    fun sendMail()

    fun probeMailbox()

    fun syncMailbox()

    fun healthCheck()
}`;
}

export function renderGoMailStandardContractBody() {
  return `
type MailProviderDriver[TNativeClient any] interface {
    ProviderKey() string
    CreateClient() MailClient[TNativeClient]
}

type MailDriverManager[TNativeClient any] interface {
    ResolveDriver(providerKey string) MailProviderDriver[TNativeClient]
}

type MailDataSource[TNativeClient any] interface {
    CreateClient() MailClient[TNativeClient]
}

type MailClient[TNativeClient any] interface {
    ConnectTransport() error
    AuthenticateTransport() error
    DisconnectTransport() error
    SendMail() error
    ProbeMailbox() error
    SyncMailbox() error
    HealthCheck() error
    Unwrap() *TNativeClient
}

type MailRuntimeController[TNativeClient any] interface {
    ConnectTransport() error
    AuthenticateTransport() error
    DisconnectTransport() error
    SendMail() error
    ProbeMailbox() error
    SyncMailbox() error
    HealthCheck() error
}`;
}

export function renderPythonMailStandardContractBody() {
  return `
class MailProviderDriver(Protocol[TNativeClient]):
    def provider_key(self) -> str:
        ...

    def create_client(self) -> "MailClient[TNativeClient]":
        ...


class MailDriverManager(Protocol[TNativeClient]):
    def resolve_driver(self, provider_key: str) -> MailProviderDriver[TNativeClient]:
        ...


class MailDataSource(Protocol[TNativeClient]):
    def create_client(self) -> "MailClient[TNativeClient]":
        ...


class MailClient(Protocol[TNativeClient]):
    def connect_transport(self) -> None:
        ...

    def authenticate_transport(self) -> None:
        ...

    def disconnect_transport(self) -> None:
        ...

    def send_mail(self) -> None:
        ...

    def probe_mailbox(self) -> None:
        ...

    def sync_mailbox(self) -> None:
        ...

    def health_check(self) -> None:
        ...

    def unwrap(self) -> TNativeClient:
        ...


class MailRuntimeController(Protocol[TNativeClient]):
    def connect_transport(self) -> None:
        ...

    def authenticate_transport(self) -> None:
        ...

    def disconnect_transport(self) -> None:
        ...

    def send_mail(self) -> None:
        ...

    def probe_mailbox(self) -> None:
        ...

    def sync_mailbox(self) -> None:
        ...

    def health_check(self) -> None:
        ...`;
}
