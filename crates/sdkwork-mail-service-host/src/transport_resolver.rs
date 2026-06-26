use std::sync::Arc;

use sdkwork_communication_mail_service::{MailPersistencePort, MailTransportPort};
use sdkwork_mail_adapter_smtp::build_smtp_transport_from_binding;
use sdkwork_routes_mail_app_api::service::MailAppApiError;

pub struct ResolvedMailTransport {
    pub transport: Arc<dyn MailTransportPort>,
    pub from_email: Option<String>,
    pub provider_account_id: Option<String>,
}

pub async fn resolve_transport_for_tenant(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: &str,
    organization_id: &str,
    fallback_transport: Arc<dyn MailTransportPort>,
) -> Result<ResolvedMailTransport, MailAppApiError> {
    let binding = persistence
        .resolve_active_smtp_transport_binding(tenant_id, organization_id)
        .await
        .map_err(map_persistence_error)?;

    if let Some(binding) = binding {
        let provider_account_id = binding.provider_account_id.clone();
        let from_email = binding.from_email.clone();
        let transport = build_smtp_transport_from_binding(&binding)
            .map_err(map_transport_configuration_error)?;
        return Ok(ResolvedMailTransport {
            transport,
            from_email: Some(from_email),
            provider_account_id: Some(provider_account_id),
        });
    }

    Ok(ResolvedMailTransport {
        transport: fallback_transport,
        from_email: None,
        provider_account_id: None,
    })
}

fn map_persistence_error(
    error: sdkwork_communication_mail_service::MailPersistenceError,
) -> MailAppApiError {
    match error {
        sdkwork_communication_mail_service::MailPersistenceError::NotFound(message) => {
            MailAppApiError::NotFound(message)
        }
        sdkwork_communication_mail_service::MailPersistenceError::Conflict(message) => {
            MailAppApiError::Conflict(message)
        }
        sdkwork_communication_mail_service::MailPersistenceError::Unavailable(message) => {
            MailAppApiError::Unavailable(message)
        }
    }
}

fn map_transport_configuration_error(error: String) -> MailAppApiError {
    MailAppApiError::Unavailable(error)
}
