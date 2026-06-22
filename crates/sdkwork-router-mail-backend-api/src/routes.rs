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
        .with_state(service)
}
