use crate::driver_manager::MailDriverManager;
use crate::provider_catalog::DEFAULT_mail_PROVIDER_KEY;
use crate::provider_selection::{MailProviderSelection, MailProviderSelectionRequest};
use crate::provider_support::MailProviderSupport;

#[derive(Clone)]
#[allow(non_snake_case)]
pub struct MailDataSourceOptions {
    pub providerUrl: String,
    pub providerKey: String,
    pub tenantOverrideProviderKey: String,
    pub deploymentProfileProviderKey: String,
    pub defaultProviderKey: String,
}

#[allow(non_snake_case)]
pub struct MailDataSource {
    options: MailDataSourceOptions,
    driverManager: MailDriverManager,
}

impl MailDataSourceOptions {
    pub fn new() -> Self {
        Self {
            providerUrl: String::new(),
            providerKey: String::new(),
            tenantOverrideProviderKey: String::new(),
            deploymentProfileProviderKey: String::new(),
            defaultProviderKey: DEFAULT_mail_PROVIDER_KEY.to_string(),
        }
    }
}

impl Default for MailDataSourceOptions {
    fn default() -> Self {
        Self::new()
    }
}

impl MailDataSource {
    #[allow(non_snake_case)]
    pub fn new(options: MailDataSourceOptions, driverManager: MailDriverManager) -> Self {
        let mut resolved_options = options;
        if resolved_options.defaultProviderKey.trim().is_empty() {
          resolved_options.defaultProviderKey = DEFAULT_mail_PROVIDER_KEY.to_string();
        }

        Self {
            options: resolved_options,
            driverManager,
        }
    }

    #[allow(non_snake_case)]
    fn mergeMailDataSourceOptions(
        base: &MailDataSourceOptions,
        overrides: Option<&MailDataSourceOptions>,
    ) -> MailDataSourceOptions {
        let mut merged = base.clone();
        if let Some(value) = overrides {
            if !value.providerUrl.trim().is_empty() {
                merged.providerUrl = value.providerUrl.clone();
            }
            if !value.providerKey.trim().is_empty() {
                merged.providerKey = value.providerKey.clone();
            }
            if !value.tenantOverrideProviderKey.trim().is_empty() {
                merged.tenantOverrideProviderKey = value.tenantOverrideProviderKey.clone();
            }
            if !value.deploymentProfileProviderKey.trim().is_empty() {
                merged.deploymentProfileProviderKey = value.deploymentProfileProviderKey.clone();
            }
            if !value.defaultProviderKey.trim().is_empty() {
                merged.defaultProviderKey = value.defaultProviderKey.clone();
            }
        }
        merged
    }

    #[allow(non_snake_case)]
    fn describeSelectionInternal(&self, overrides: Option<&MailDataSourceOptions>) -> MailProviderSelection {
        let merged = Self::mergeMailDataSourceOptions(&self.options, overrides);
        self.driverManager.resolveSelection(
            &MailProviderSelectionRequest {
                providerUrl: if merged.providerUrl.trim().is_empty() { None } else { Some(merged.providerUrl) },
                providerKey: if merged.providerKey.trim().is_empty() { None } else { Some(merged.providerKey) },
                tenantOverrideProviderKey: if merged.tenantOverrideProviderKey.trim().is_empty() { None } else { Some(merged.tenantOverrideProviderKey) },
                deploymentProfileProviderKey: if merged.deploymentProfileProviderKey.trim().is_empty() { None } else { Some(merged.deploymentProfileProviderKey) },
            },
            Some(merged.defaultProviderKey.as_str()),
        )
    }

    #[allow(non_snake_case)]
    pub fn describeSelection(&self, overrides: Option<&MailDataSourceOptions>) -> MailProviderSelection {
        self.describeSelectionInternal(overrides)
    }

    #[allow(non_snake_case)]
    pub fn describeProviderSupport(&self, overrides: Option<&MailDataSourceOptions>) -> MailProviderSupport {
        let selection = self.describeSelectionInternal(overrides);
        self.driverManager.describeProviderSupport(selection.providerKey.as_str())
    }

    #[allow(non_snake_case)]
    pub fn listProviderSupport(&self) -> Vec<MailProviderSupport> {
        self.driverManager.listProviderSupport()
    }
}
