namespace Sdkwork.Mail.Sdk;

using System;
using System.Collections.Generic;
using System.Linq;

public sealed class MailProviderPackageLoaderException : Exception
{
    public MailProviderPackageLoaderException(string code, string message)
        : base(message)
    {
        this.code = code;
    }

    public string code { get; }
}

public sealed record MailProviderPackageLoadRequest(
    string? providerKey = null,
    string? packageIdentity = null
);

public sealed record MailResolvedProviderPackageLoadTarget(
    MailProviderPackageCatalogEntry packageEntry
);

public delegate object? MailProviderPackageImportFn(MailResolvedProviderPackageLoadTarget target);
public delegate object? MailProviderPackageLoaderFn(MailProviderPackageLoadRequest request);

public sealed record MailProviderPackageInstallRequest(
    object driverManager,
    MailProviderPackageLoadRequest loadRequest
);

public static class MailProviderPackageLoader
{
    public const string ProviderPackageNotFound = "provider_package_not_found";
    public const string ProviderPackageIdentityMismatch = "provider_package_identity_mismatch";
    public const string ProviderPackageLoadFailed = "provider_package_load_failed";
    public const string ProviderModuleExportMissing = "provider_module_export_missing";

    public static MailResolvedProviderPackageLoadTarget ResolveMailProviderPackageLoadTarget(
        MailProviderPackageLoadRequest? request
    )
    {
        request ??= new MailProviderPackageLoadRequest();
        var packageByProviderKey = string.IsNullOrWhiteSpace(request.providerKey)
            ? null
            : MailProviderPackageCatalog.GetMailProviderPackageByProviderKey(request.providerKey!);
        var packageByIdentity = string.IsNullOrWhiteSpace(request.packageIdentity)
            ? null
            : MailProviderPackageCatalog.GetMailProviderPackageByPackageIdentity(request.packageIdentity!);

        if (packageByProviderKey is not null
            && packageByIdentity is not null
            && !string.Equals(packageByProviderKey.packageIdentity, packageByIdentity.packageIdentity, StringComparison.Ordinal))
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageIdentityMismatch,
                "providerKey and packageIdentity must resolve to the same provider package boundary."
            );
        }

        var resolvedPackage = packageByProviderKey ?? packageByIdentity;
        if (resolvedPackage is null)
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageNotFound,
                "No official provider package matches the requested provider boundary."
            );
        }

        return new MailResolvedProviderPackageLoadTarget(resolvedPackage);
    }

    public static MailProviderPackageLoaderFn CreateMailProviderPackageLoader(
        MailProviderPackageImportFn importPackage
    ) => request => LoadMailProviderModule(request, importPackage);

    public static object? LoadMailProviderModule(
        MailProviderPackageLoadRequest request,
        MailProviderPackageImportFn importPackage
    )
    {
        var target = ResolveMailProviderPackageLoadTarget(request);

        try
        {
            var providerModule = importPackage(target);
            if (providerModule is null)
            {
                throw new MailProviderPackageLoaderException(
                    ProviderModuleExportMissing,
                    "Reserved provider package loader scaffold requires an executable provider module namespace."
                );
            }

            return providerModule;
        }
        catch (MailProviderPackageLoaderException)
        {
            throw;
        }
        catch (Exception error)
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageLoadFailed,
                $"Reserved provider package loader scaffold could not load {target.packageEntry.packageIdentity}: {error.Message}"
            );
        }
    }

    public static void InstallMailProviderPackage(
        MailProviderPackageInstallRequest request,
        MailProviderPackageImportFn importPackage
    )
    {
        _ = LoadMailProviderModule(request.loadRequest, importPackage);

        throw new MailProviderPackageLoaderException(
            ProviderPackageLoadFailed,
            "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
        );
    }

    public static void InstallMailProviderPackages(
        IReadOnlyList<MailProviderPackageInstallRequest> requests,
        MailProviderPackageImportFn importPackage
    )
    {
        foreach (var request in requests)
        {
            _ = LoadMailProviderModule(request.loadRequest, importPackage);
        }

        if (requests.Count > 0)
        {
            throw new MailProviderPackageLoaderException(
                ProviderPackageLoadFailed,
                "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
            );
        }
    }
}
