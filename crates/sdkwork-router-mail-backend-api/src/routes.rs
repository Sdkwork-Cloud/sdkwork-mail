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
            get(handlers::list_provider_accounts),
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
        .with_state(service)
}
