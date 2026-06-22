package com.sdkwork.Mail.metadata;

import java.util.List;
import java.util.Optional;

public final class MailProviderPackageLoader {

  public static final String PROVIDER_PACKAGE_NOT_FOUND = "provider_package_not_found";
  public static final String PROVIDER_PACKAGE_IDENTITY_MISMATCH = "provider_package_identity_mismatch";
  public static final String PROVIDER_PACKAGE_LOAD_FAILED = "provider_package_load_failed";
  public static final String PROVIDER_MODULE_EXPORT_MISSING = "provider_module_export_missing";

  public record MailProviderPackageLoadRequest(
      String providerKey,
      String packageIdentity
  ) {
  }

  public record MailResolvedProviderPackageLoadTarget(
      MailProviderPackageCatalog.MailProviderPackageCatalogEntry packageEntry
  ) {
  }

  @FunctionalInterface
  public interface MailProviderPackageImportFn {
    Object importPackage(MailResolvedProviderPackageLoadTarget target);
  }

  @FunctionalInterface
  public interface MailProviderPackageLoaderFn {
    Object load(MailProviderPackageLoadRequest request);
  }

  public record MailProviderPackageInstallRequest(
      Object driverManager,
      MailProviderPackageLoadRequest loadRequest
  ) {
  }

  public static MailResolvedProviderPackageLoadTarget resolveMailProviderPackageLoadTarget(
      MailProviderPackageLoadRequest request
  ) {
    var resolvedRequest = request == null
        ? new MailProviderPackageLoadRequest(null, null)
        : request;
    var packageByProviderKey = Optional.ofNullable(resolvedRequest.providerKey())
        .flatMap(MailProviderPackageCatalog::getMailProviderPackageByProviderKey);
    var packageByIdentity = Optional.ofNullable(resolvedRequest.packageIdentity())
        .flatMap(MailProviderPackageCatalog::getMailProviderPackageByPackageIdentity);

    if (packageByProviderKey.isPresent() && packageByIdentity.isPresent()
        && !packageByProviderKey.get().packageIdentity().equals(packageByIdentity.get().packageIdentity())) {
      throw new MailProviderPackageLoaderException(
          PROVIDER_PACKAGE_IDENTITY_MISMATCH,
          "providerKey and packageIdentity must resolve to the same provider package boundary."
      );
    }

    var resolvedPackage = packageByProviderKey.or(() -> packageByIdentity).orElseThrow(() ->
        new MailProviderPackageLoaderException(
            PROVIDER_PACKAGE_NOT_FOUND,
            "No official provider package matches the requested provider boundary."
        )
    );

    return new MailResolvedProviderPackageLoadTarget(resolvedPackage);
  }

  public static MailProviderPackageLoaderFn createMailProviderPackageLoader(
      MailProviderPackageImportFn importPackage
  ) {
    return request -> loadMailProviderModule(request, importPackage);
  }

  public static Object loadMailProviderModule(
      MailProviderPackageLoadRequest request,
      MailProviderPackageImportFn importPackage
  ) {
    var target = resolveMailProviderPackageLoadTarget(request);

    try {
      var namespace = importPackage.importPackage(target);
      if (namespace == null) {
        throw new MailProviderPackageLoaderException(
            PROVIDER_MODULE_EXPORT_MISSING,
            "Reserved provider package loader scaffold requires an executable provider module namespace."
        );
      }

      return namespace;
    } catch (MailProviderPackageLoaderException error) {
      throw error;
    } catch (RuntimeException error) {
      throw new MailProviderPackageLoaderException(
          PROVIDER_PACKAGE_LOAD_FAILED,
          "Reserved provider package loader scaffold could not load "
              + target.packageEntry().packageIdentity()
              + ": "
              + error.getMessage()
      );
    }
  }

  public static void installMailProviderPackage(
      MailProviderPackageInstallRequest request,
      MailProviderPackageImportFn importPackage
  ) {
    loadMailProviderModule(request.loadRequest(), importPackage);

    throw new MailProviderPackageLoaderException(
        PROVIDER_PACKAGE_LOAD_FAILED,
        "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
    );
  }

  public static void installMailProviderPackages(
      List<MailProviderPackageInstallRequest> requests,
      MailProviderPackageImportFn importPackage
  ) {
    for (var request : requests) {
      loadMailProviderModule(request.loadRequest(), importPackage);
    }

    if (!requests.isEmpty()) {
      throw new MailProviderPackageLoaderException(
          PROVIDER_PACKAGE_LOAD_FAILED,
          "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands."
      );
    }
  }

  public static final class MailProviderPackageLoaderException extends RuntimeException {
    private final String code;

    public MailProviderPackageLoaderException(String code, String message) {
      super(message);
      this.code = code;
    }

    public String code() {
      return code;
    }
  }

  private MailProviderPackageLoader() {
  }
}
