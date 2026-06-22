public struct MailProviderPackageLoaderException: Error {
    public let code: String
    public let message: String

    public init(code: String, message: String) {
        self.code = code
        self.message = message
    }
}

public struct MailProviderPackageLoadRequest {
    public let providerKey: String?
    public let packageIdentity: String?

    public init(providerKey: String? = nil, packageIdentity: String? = nil) {
        self.providerKey = providerKey
        self.packageIdentity = packageIdentity
    }
}

public struct MailResolvedProviderPackageLoadTarget {
    public let packageEntry: MailProviderPackageCatalogEntry

    public init(packageEntry: MailProviderPackageCatalogEntry) {
        self.packageEntry = packageEntry
    }
}

public typealias MailProviderModuleNamespace = [String: String]
public typealias MailProviderPackageImportFn = (MailResolvedProviderPackageLoadTarget) throws -> MailProviderModuleNamespace
public typealias MailProviderPackageLoader = (MailProviderPackageLoadRequest) throws -> MailProviderModuleNamespace

public struct MailProviderPackageInstallRequest {
    public let driverManager: Any
    public let loadRequest: MailProviderPackageLoadRequest

    public init(driverManager: Any, loadRequest: MailProviderPackageLoadRequest) {
        self.driverManager = driverManager
        self.loadRequest = loadRequest
    }
}

public func resolveMailProviderPackageLoadTarget(
    _ request: MailProviderPackageLoadRequest
) throws -> MailResolvedProviderPackageLoadTarget {
    let packageByProviderKey = request.providerKey.flatMap(MailProviderPackageCatalog.getMailProviderPackageByProviderKey)
    let packageByIdentity = request.packageIdentity.flatMap(MailProviderPackageCatalog.getMailProviderPackageByPackageIdentity)

    if let providerKeyEntry = packageByProviderKey,
       let packageIdentityEntry = packageByIdentity,
       providerKeyEntry.packageIdentity != packageIdentityEntry.packageIdentity {
        throw MailProviderPackageLoaderException(
            code: "provider_package_identity_mismatch",
            message: "providerKey and packageIdentity must resolve to the same provider package boundary."
        )
    }

    guard let resolvedPackage = packageByProviderKey ?? packageByIdentity else {
        throw MailProviderPackageLoaderException(
            code: "provider_package_not_found",
            message: "No official provider package matches the requested provider boundary."
        )
    }

    return MailResolvedProviderPackageLoadTarget(packageEntry: resolvedPackage)
}

public func createMailProviderPackageLoader(
    importPackage: @escaping MailProviderPackageImportFn
) -> MailProviderPackageLoader {
    return { request in
        try loadMailProviderModule(request, importPackage: importPackage)
    }
}

public func loadMailProviderModule(
    _ request: MailProviderPackageLoadRequest,
    importPackage: MailProviderPackageImportFn
) throws -> MailProviderModuleNamespace {
    let target = try resolveMailProviderPackageLoadTarget(request)

    do {
        let namespace = try importPackage(target)
        if namespace.isEmpty {
            throw MailProviderPackageLoaderException(
                code: "provider_module_export_missing",
                message: "Reserved provider package loader scaffold requires an executable provider module namespace."
            )
        }

        return namespace
    } catch let error as MailProviderPackageLoaderException {
        throw error
    } catch {
        throw MailProviderPackageLoaderException(
            code: "provider_package_load_failed",
            message: "Reserved provider package loader scaffold could not load \(target.packageEntry.packageIdentity): \(error)"
        )
    }
}

public func installMailProviderPackage(
    _ request: MailProviderPackageInstallRequest,
    importPackage: MailProviderPackageImportFn
) throws {
    _ = try loadMailProviderModule(request.loadRequest, importPackage: importPackage)

    throw MailProviderPackageLoaderException(
        code: "provider_package_load_failed",
        message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
    )
}

public func installMailProviderPackages(
    _ requests: [MailProviderPackageInstallRequest],
    importPackage: MailProviderPackageImportFn
) throws {
    for request in requests {
        _ = try loadMailProviderModule(request.loadRequest, importPackage: importPackage)
    }

    if !requests.isEmpty {
        throw MailProviderPackageLoaderException(
            code: "provider_package_load_failed",
            message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
        )
    }
}
