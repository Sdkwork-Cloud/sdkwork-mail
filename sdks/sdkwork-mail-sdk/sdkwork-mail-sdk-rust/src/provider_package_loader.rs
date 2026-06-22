use std::collections::BTreeMap;

use crate::provider_package_catalog::{
    get_mail_provider_package_by_package_identity, get_mail_provider_package_by_provider_key,
    MailProviderPackageCatalogEntry,
};

#[derive(Debug, Clone)]
pub struct MailProviderPackageLoaderError {
    pub code: &'static str,
    pub message: String,
}

impl MailProviderPackageLoaderError {
    pub fn new(code: &'static str, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }
}

#[derive(Debug, Clone, Default)]
#[allow(non_snake_case)]
pub struct MailProviderPackageLoadRequest {
    pub providerKey: Option<String>,
    pub packageIdentity: Option<String>,
}

#[allow(non_snake_case)]
pub struct MailResolvedProviderPackageLoadTarget {
    pub packageEntry: &'static MailProviderPackageCatalogEntry,
}

pub type MailProviderModuleNamespace = BTreeMap<String, String>;
pub type MailProviderPackageImportFn =
    fn(&MailResolvedProviderPackageLoadTarget) -> Result<MailProviderModuleNamespace, MailProviderPackageLoaderError>;
pub type MailProviderPackageLoader = Box<
    dyn Fn(MailProviderPackageLoadRequest) -> Result<MailProviderModuleNamespace, MailProviderPackageLoaderError>,
>;

#[allow(non_snake_case)]
pub struct MailProviderPackageInstallRequest<TDriverManager> {
    pub driverManager: TDriverManager,
    pub loadRequest: MailProviderPackageLoadRequest,
}

pub fn resolve_mail_provider_package_load_target(
    request: &MailProviderPackageLoadRequest,
) -> Result<MailResolvedProviderPackageLoadTarget, MailProviderPackageLoaderError> {
    let package_by_provider_key = request
        .providerKey
        .as_deref()
        .and_then(get_mail_provider_package_by_provider_key);
    let package_by_identity = request
        .packageIdentity
        .as_deref()
        .and_then(get_mail_provider_package_by_package_identity);

    if let (Some(provider_key_entry), Some(package_identity_entry)) =
        (package_by_provider_key, package_by_identity)
    {
        if provider_key_entry.packageIdentity != package_identity_entry.packageIdentity {
            return Err(MailProviderPackageLoaderError::new(
                "provider_package_identity_mismatch",
                "providerKey and packageIdentity must resolve to the same provider package boundary.",
            ));
        }
    }

    let resolved_package = package_by_provider_key.or(package_by_identity).ok_or_else(|| {
        MailProviderPackageLoaderError::new(
            "provider_package_not_found",
            "No official provider package matches the requested provider boundary.",
        )
    })?;

    Ok(MailResolvedProviderPackageLoadTarget {
        packageEntry: resolved_package,
    })
}

pub fn create_mail_provider_package_loader(
    import_package: MailProviderPackageImportFn,
) -> MailProviderPackageLoader {
    Box::new(move |request| load_mail_provider_module(&request, import_package))
}

pub fn load_mail_provider_module(
    request: &MailProviderPackageLoadRequest,
    import_package: MailProviderPackageImportFn,
) -> Result<MailProviderModuleNamespace, MailProviderPackageLoaderError> {
    let target = resolve_mail_provider_package_load_target(request)?;
    let namespace = import_package(&target).map_err(|error| {
        if error.code == "provider_package_load_failed" || error.code == "provider_module_export_missing" {
            error
        } else {
            MailProviderPackageLoaderError::new(
                "provider_package_load_failed",
                format!(
                    "Reserved provider package loader scaffold could not load {}: {}",
                    target.packageEntry.packageIdentity, error.message
                ),
            )
        }
    })?;

    if namespace.is_empty() {
        return Err(MailProviderPackageLoaderError::new(
            "provider_module_export_missing",
            "Reserved provider package loader scaffold requires an executable provider module namespace.",
        ));
    }

    Ok(namespace)
}

pub fn install_mail_provider_package<TDriverManager>(
    request: &MailProviderPackageInstallRequest<TDriverManager>,
    import_package: MailProviderPackageImportFn,
) -> Result<(), MailProviderPackageLoaderError> {
    let _namespace = load_mail_provider_module(&request.loadRequest, import_package)?;

    Err(MailProviderPackageLoaderError::new(
        "provider_package_load_failed",
        "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
    ))
}

pub fn install_mail_provider_packages<TDriverManager>(
    requests: &[MailProviderPackageInstallRequest<TDriverManager>],
    import_package: MailProviderPackageImportFn,
) -> Result<(), MailProviderPackageLoaderError> {
    for request in requests {
        let _namespace = load_mail_provider_module(&request.loadRequest, import_package)?;
    }

    if !requests.is_empty() {
        return Err(MailProviderPackageLoaderError::new(
            "provider_package_load_failed",
            "Reserved provider package installer scaffold cannot register provider modules until a verified runtime bridge lands.",
        ));
    }

    Ok(())
}
