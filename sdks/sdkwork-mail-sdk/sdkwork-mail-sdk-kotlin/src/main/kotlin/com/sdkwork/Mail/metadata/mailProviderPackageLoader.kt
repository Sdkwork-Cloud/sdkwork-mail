package com.sdkwork.Mail.metadata

class MailProviderPackageLoaderException(
    val code: String,
    override val message: String,
) : RuntimeException(message)

data class MailProviderPackageLoadRequest(
    val providerKey: String? = null,
    val packageIdentity: String? = null,
)

data class MailResolvedProviderPackageLoadTarget(
    val packageEntry: MailProviderPackageCatalogEntry,
)

typealias MailProviderModuleNamespace = Map<String, String>
typealias MailProviderPackageImportFn = (MailResolvedProviderPackageLoadTarget) -> MailProviderModuleNamespace
typealias MailProviderPackageLoader = (MailProviderPackageLoadRequest) -> MailProviderModuleNamespace

data class MailProviderPackageInstallRequest(
    val driverManager: Any,
    val loadRequest: MailProviderPackageLoadRequest,
)

fun resolveMailProviderPackageLoadTarget(
    request: MailProviderPackageLoadRequest,
): MailResolvedProviderPackageLoadTarget {
    val packageByProviderKey = request.providerKey?.let { MailProviderPackageCatalog.getMailProviderPackageByProviderKey(it) }
    val packageByIdentity = request.packageIdentity?.let { MailProviderPackageCatalog.getMailProviderPackageByPackageIdentity(it) }

    if (packageByProviderKey != null
        && packageByIdentity != null
        && packageByProviderKey.packageIdentity != packageByIdentity.packageIdentity
    ) {
        throw MailProviderPackageLoaderException(
            code = "provider_package_identity_mismatch",
            message = "providerKey and packageIdentity must resolve to the same provider package boundary.",
        )
    }

    val resolvedPackage = packageByProviderKey ?: packageByIdentity
        ?: throw MailProviderPackageLoaderException(
            code = "provider_package_not_found",
            message = "No official provider package matches the requested provider boundary.",
        )

    return MailResolvedProviderPackageLoadTarget(packageEntry = resolvedPackage)
}

fun createMailProviderPackageLoader(
    importPackage: MailProviderPackageImportFn,
): MailProviderPackageLoader = { request ->
    loadMailProviderModule(request, importPackage)
}

fun loadMailProviderModule(
    request: MailProviderPackageLoadRequest,
    importPackage: MailProviderPackageImportFn,
): MailProviderModuleNamespace {
    val target = resolveMailProviderPackageLoadTarget(request)

    return try {
        val namespace = importPackage(target)
        if (namespace.isEmpty()) {
            throw MailProviderPackageLoaderException(
                code = "provider_module_export_missing",
                message = "Reserved provider package loader scaffold requires an executable provider module namespace.",
            )
        }

        namespace
    } catch (error: MailProviderPackageLoaderException) {
        throw error
    } catch (error: RuntimeException) {
        throw MailProviderPackageLoaderException(
            code = "provider_package_load_failed",
            message = "Reserved provider package loader scaffold could not load ${target.packageEntry.packageIdentity}: ${error.message}",
        )
    }
}

fun installMailProviderPackage(
    request: MailProviderPackageInstallRequest,
    importPackage: MailProviderPackageImportFn,
) {
    loadMailProviderModule(request.loadRequest, importPackage)

    throw MailProviderPackageLoaderException(
        code = "provider_package_load_failed",
        message = "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
    )
}

fun installMailProviderPackages(
    requests: Iterable<MailProviderPackageInstallRequest>,
    importPackage: MailProviderPackageImportFn,
) {
    val materializedRequests = requests.toList()
    materializedRequests.forEach { request ->
        loadMailProviderModule(request.loadRequest, importPackage)
    }

    if (materializedRequests.isNotEmpty()) {
        throw MailProviderPackageLoaderException(
            code = "provider_package_load_failed",
            message = "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
        )
    }
}
