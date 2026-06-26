use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::{handlers, service::MailBackendApiService};

pub fn build_sdkwork_mail_backend_api_router(service: Arc<dyn MailBackendApiService>) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/mail/provider_accounts",
            get(handlers::list_provider_accounts).post(handlers::create_provider_account),
        )
        .route(
            "/backend/v3/api/mail/provider_accounts/{account_id}/ping",
            post(handlers::ping_provider_account),
        )
        .route(
            "/backend/v3/api/mail/provider_accounts/{account_id}/sync",
            post(handlers::sync_provider_account),
        )
        .route(
            "/backend/v3/api/mail/provider_webhooks/{provider}/events",
            post(handlers::receive_provider_webhook),
        )
        .route(
            "/backend/v3/api/mail/templates",
            get(handlers::list_templates).post(handlers::create_template),
        )
        .route(
            "/backend/v3/api/mail/templates/{template_id}",
            get(handlers::retrieve_template)
                .patch(handlers::update_template)
                .delete(handlers::delete_template),
        )
        .route(
            "/backend/v3/api/mail/transactional_deliveries",
            get(handlers::list_transactional_deliveries),
        )
        .route(
            "/backend/v3/api/mail/marketing_consents",
            get(handlers::list_marketing_consents).post(handlers::grant_marketing_consent),
        )
        .route(
            "/backend/v3/api/mail/marketing_consents/{consent_id}/revoke",
            post(handlers::revoke_marketing_consent),
        )
        .with_state(service)
}
