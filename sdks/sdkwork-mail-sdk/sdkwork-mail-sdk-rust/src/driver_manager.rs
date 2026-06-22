use crate::provider_activation_catalog::get_mail_provider_activation_by_provider_key;
use crate::provider_catalog::{get_mail_provider_by_provider_key, OFFICIAL_mail_PROVIDERS};
use crate::provider_selection::{
    resolve_mail_provider_selection, MailProviderSelection, MailProviderSelectionRequest,
};
use crate::provider_support::{
    create_mail_provider_support_state, MailProviderSupport, MailProviderSupportStateRequest,
};

pub struct MailDriverManager;

impl MailDriverManager {
    #[allow(non_snake_case)]
    pub fn resolveSelection(
        &self,
        request: &MailProviderSelectionRequest,
        defaultProviderKey: Option<&str>,
    ) -> MailProviderSelection {
        resolve_mail_provider_selection(request, defaultProviderKey)
    }

    #[allow(non_snake_case)]
    pub fn describeProviderSupport(&self, providerKey: &str) -> MailProviderSupport {
        let official = get_mail_provider_by_provider_key(providerKey).is_some();
        let activation = get_mail_provider_activation_by_provider_key(providerKey);

        create_mail_provider_support_state(MailProviderSupportStateRequest {
            providerKey: providerKey.to_string(),
            builtin: activation.is_some_and(|entry| entry.builtin),
            official,
            registered: activation.is_some_and(|entry| entry.runtimeBridge),
        })
    }

    #[allow(non_snake_case)]
    pub fn listProviderSupport(&self) -> Vec<MailProviderSupport> {
        OFFICIAL_mail_PROVIDERS
            .iter()
            .map(|entry| self.describeProviderSupport(entry.providerKey))
            .collect()
    }
}
