package Mailstandard

import "fmt"

type MailProviderPackageLoaderError struct {
	Code    string
	Message string
}

func (e MailProviderPackageLoaderError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

type MailProviderPackageLoadRequest struct {
	ProviderKey     string
	PackageIdentity string
}

type MailResolvedProviderPackageLoadTarget struct {
	PackageEntry MailProviderPackageCatalogEntry
}

type MailProviderModuleNamespace map[string]string
type MailProviderPackageImportFn func(MailResolvedProviderPackageLoadTarget) (MailProviderModuleNamespace, error)
type MailProviderPackageLoader func(MailProviderPackageLoadRequest) (MailProviderModuleNamespace, error)

type MailProviderPackageInstallRequest struct {
	DriverManager any
	LoadRequest   MailProviderPackageLoadRequest
}

func ResolveMailProviderPackageLoadTarget(
	request MailProviderPackageLoadRequest,
) (MailResolvedProviderPackageLoadTarget, error) {
	var packageByProviderKey *MailProviderPackageCatalogEntry
	if request.ProviderKey != "" {
		packageByProviderKey = GetMailProviderPackageByProviderKey(request.ProviderKey)
	}

	var packageByIdentity *MailProviderPackageCatalogEntry
	if request.PackageIdentity != "" {
		packageByIdentity = GetMailProviderPackageByPackageIdentity(request.PackageIdentity)
	}

	if packageByProviderKey != nil && packageByIdentity != nil && packageByProviderKey.PackageIdentity != packageByIdentity.PackageIdentity {
		return MailResolvedProviderPackageLoadTarget{}, MailProviderPackageLoaderError{
			Code:    "provider_package_identity_mismatch",
			Message: "providerKey and packageIdentity must resolve to the same provider package boundary.",
		}
	}

	resolvedPackage := packageByProviderKey
	if resolvedPackage == nil {
		resolvedPackage = packageByIdentity
	}

	if resolvedPackage == nil {
		return MailResolvedProviderPackageLoadTarget{}, MailProviderPackageLoaderError{
			Code:    "provider_package_not_found",
			Message: "No official provider package matches the requested provider boundary.",
		}
	}

	return MailResolvedProviderPackageLoadTarget{PackageEntry: *resolvedPackage}, nil
}

func CreateMailProviderPackageLoader(importPackage MailProviderPackageImportFn) MailProviderPackageLoader {
	return func(request MailProviderPackageLoadRequest) (MailProviderModuleNamespace, error) {
		return LoadMailProviderModule(request, importPackage)
	}
}

func LoadMailProviderModule(
	request MailProviderPackageLoadRequest,
	importPackage MailProviderPackageImportFn,
) (MailProviderModuleNamespace, error) {
	target, err := ResolveMailProviderPackageLoadTarget(request)
	if err != nil {
		return nil, err
	}

	namespace, err := importPackage(target)
	if err != nil {
		return nil, MailProviderPackageLoaderError{
			Code:    "provider_package_load_failed",
			Message: fmt.Sprintf("Reserved provider package loader scaffold could not load %s: %v", target.PackageEntry.PackageIdentity, err),
		}
	}

	if len(namespace) == 0 {
		return nil, MailProviderPackageLoaderError{
			Code:    "provider_module_export_missing",
			Message: "Reserved provider package loader scaffold requires an executable provider module namespace.",
		}
	}

	return namespace, nil
}

func InstallMailProviderPackage(
	request MailProviderPackageInstallRequest,
	importPackage MailProviderPackageImportFn,
) error {
	if _, err := LoadMailProviderModule(request.LoadRequest, importPackage); err != nil {
		return err
	}

	return MailProviderPackageLoaderError{
		Code:    "provider_package_load_failed",
		Message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
	}
}

func InstallMailProviderPackages(
	requests []MailProviderPackageInstallRequest,
	importPackage MailProviderPackageImportFn,
) error {
	for _, request := range requests {
		if _, err := LoadMailProviderModule(request.LoadRequest, importPackage); err != nil {
			return err
		}
	}

	if len(requests) > 0 {
		return MailProviderPackageLoaderError{
			Code:    "provider_package_load_failed",
			Message: "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
		}
	}

	return nil
}
