use std::sync::Arc;

use axum::{
    Extension, Json,
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use sdkwork_communication_mail_service::{
    CreateMailProviderAccountRequest, CreateMailTemplateRequest, GrantMailMarketingConsentRequest,
    MailTemplateCategory, SyncMailProviderAccountRequest, UpdateMailTemplateRequest,
};
use sdkwork_mail_app_context::AppContext;
use serde::{Deserialize, Serialize};
use serde_json::{Value as JsonValue, json};

use crate::service::{MailBackendApiError, MailBackendApiService, MailBackendListRequest};

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailBackendListQuery {
    pub page: Option<u32>,
    pub page_size: Option<u32>,
    pub category: Option<MailTemplateCategory>,
    pub purpose: Option<String>,
    pub business_kind: Option<String>,
    pub recipient_email: Option<String>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MailApiEnvelope<T: Serialize> {
    code: String,
    message: String,
    request_id: String,
    data: T,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MailProblemEnvelope {
    code: String,
    message: String,
    request_id: String,
    data: JsonValue,
}

pub async fn list_provider_accounts(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    let result = service
        .list_provider_accounts(MailBackendListRequest {
            tenant_id: context.tenant_id,
            organization_id: context.organization_id,
            page: query.page,
            page_size: query.page_size,
        })
        .await;

    match result {
        Ok(data) => (
            StatusCode::OK,
            Json(MailApiEnvelope {
                code: "ok".to_owned(),
                message: "OK".to_owned(),
                request_id: uuid::Uuid::new_v4().to_string(),
                data,
            }),
        )
            .into_response(),
        Err(error) => (
            error.status_code(),
            Json(MailProblemEnvelope {
                code: error.code().to_owned(),
                message: error.message().to_owned(),
                request_id: uuid::Uuid::new_v4().to_string(),
                data: json!({}),
            }),
        )
            .into_response(),
    }
}

fn list_request(context: &AppContext, query: &MailBackendListQuery) -> MailBackendListRequest {
    MailBackendListRequest {
        tenant_id: context.tenant_id.clone(),
        organization_id: context.organization_id.clone(),
        page: query.page,
        page_size: query.page_size,
    }
}

fn respond_ok<T: Serialize>(data: T) -> Response {
    (
        StatusCode::OK,
        Json(MailApiEnvelope {
            code: "ok".to_owned(),
            message: "OK".to_owned(),
            request_id: uuid::Uuid::new_v4().to_string(),
            data,
        }),
    )
        .into_response()
}

fn respond_error(error: MailBackendApiError) -> Response {
    (
        error.status_code(),
        Json(MailProblemEnvelope {
            code: error.code().to_owned(),
            message: error.message().to_owned(),
            request_id: uuid::Uuid::new_v4().to_string(),
            data: json!({}),
        }),
    )
        .into_response()
}

pub async fn list_templates(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .list_templates(
            list_request(&context, &query),
            query.category,
            query.purpose,
        )
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn create_provider_account(
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<CreateMailProviderAccountRequest>,
) -> Response {
    match service
        .create_provider_account(context.tenant_id, context.organization_id, body)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn ping_provider_account(
    Extension(context): Extension<AppContext>,
    Path(account_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .ping_provider_account(context.tenant_id, context.organization_id, account_id)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn sync_provider_account(
    Extension(context): Extension<AppContext>,
    Path(account_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<SyncMailProviderAccountRequest>,
) -> Response {
    match service
        .sync_provider_account(
            context.tenant_id,
            context.organization_id,
            context.user_id,
            account_id,
            body,
        )
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn create_template(
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<CreateMailTemplateRequest>,
) -> Response {
    match service
        .create_template(context.tenant_id, context.organization_id, body)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn retrieve_template(
    Extension(context): Extension<AppContext>,
    Path(template_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .retrieve_template(context.tenant_id, context.organization_id, template_id)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn update_template(
    Extension(context): Extension<AppContext>,
    Path(template_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<UpdateMailTemplateRequest>,
) -> Response {
    match service
        .update_template(
            context.tenant_id,
            context.organization_id,
            template_id,
            body,
        )
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn delete_template(
    Extension(context): Extension<AppContext>,
    Path(template_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .delete_template(context.tenant_id, context.organization_id, template_id)
        .await
    {
        Ok(()) => StatusCode::NO_CONTENT.into_response(),
        Err(error) => respond_error(error),
    }
}

pub async fn list_transactional_deliveries(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .list_transactional_deliveries(
            list_request(&context, &query),
            query.business_kind,
            query.recipient_email,
        )
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn list_marketing_consents(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .list_marketing_consents(list_request(&context, &query), query.recipient_email)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn grant_marketing_consent(
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<GrantMailMarketingConsentRequest>,
) -> Response {
    match service
        .grant_marketing_consent(context.tenant_id, context.organization_id, body)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn revoke_marketing_consent(
    Extension(context): Extension<AppContext>,
    Path(consent_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .revoke_marketing_consent(context.tenant_id, context.organization_id, consent_id)
        .await
    {
        Ok(data) => respond_ok(data),
        Err(error) => respond_error(error),
    }
}

pub async fn receive_provider_webhook(
    Path(provider): Path<String>,
    Json(_body): Json<JsonValue>,
) -> Response {
    (
        StatusCode::ACCEPTED,
        Json(json!({
            "code": "accepted",
            "message": format!("provider webhook accepted for {provider}"),
            "requestId": uuid::Uuid::new_v4().to_string(),
            "data": {}
        })),
    )
        .into_response()
}
