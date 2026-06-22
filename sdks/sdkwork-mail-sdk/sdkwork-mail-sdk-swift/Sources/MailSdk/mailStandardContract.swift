public enum MailStandardContract {
    public static let symbol = "MailStandardContract"
}

public protocol MailProviderDriver {
    var providerKey: String { get }
}

public protocol MailDriverManager {
    func resolveDriver(providerKey: String)
}

public protocol MailDataSource {
    func createClient() async throws
}

public protocol MailClient {
    func connectTransport() async throws
    func authenticateTransport() async throws
    func disconnectTransport() async throws
    func sendMail() async throws
    func probeMailbox() async throws
    func syncMailbox() async throws
    func healthCheck() async throws
    func unwrap() -> Any?
}

public protocol MailRuntimeController {
    func connectTransport() async throws
    func authenticateTransport() async throws
    func disconnectTransport() async throws
    func sendMail() async throws
    func probeMailbox() async throws
    func syncMailbox() async throws
    func healthCheck() async throws
}
