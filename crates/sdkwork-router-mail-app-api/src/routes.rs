use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::{handlers, service::MailAppApiService};

pub fn build_sdkwork_mail_app_api_router(service: Arc<dyn MailAppApiService>) -> Router {
    Router::new()
        .route("/app/v3/api/mail/accounts", get(handlers::list_accounts))
        .route("/app/v3/api/mail/folders", get(handlers::list_folders))
        .route("/app/v3/api/mail/threads", get(handlers::list_threads))
        .route(
            "/app/v3/api/mail/messages",
            get(handlers::list_messages).post(handlers::create_message),
        )
        .route(
            "/app/v3/api/mail/messages/{message_id}",
            get(handlers::retrieve_message)
                .patch(handlers::update_message)
                .delete(handlers::delete_message),
        )
        .route(
            "/app/v3/api/mail/verification/send",
            post(handlers::send_verification_code),
        )
        .route(
            "/app/v3/api/mail/verification/verify",
            post(handlers::verify_verification_code),
        )
        .route(
            "/app/v3/api/mail/transactional/send",
            post(handlers::send_transactional_mail),
        )
        .with_state(service)
}
