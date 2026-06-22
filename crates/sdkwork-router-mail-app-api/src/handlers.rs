use std::sync::Arc;

use axum::{
    Extension, Json,
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use sdkwork_communication_mail_service::{CreateMailMessageRequest, UpdateMailMessageRequest};
use sdkwork_mail_app_context::AppContext;
use serde::{Deserialize, Serialize};
use serde_json::{Value as JsonValue, json};

use crate::service::{MailAppApiError, MailAppApiService, MailListRequest};

#[derive(Clone, Debug, Eq, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailListQuery {
    pub account_id: Option<String>,
    pub folder_id: Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
    pub cursor: Option<String>,
    pub q: Option<String>,
    pub sort: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MailApiEnvelope<T>
where
    T: Serialize,
{
    pub code: String,
    pub message: String,
    pub request_id: String,
    pub data: T,
}

impl<T> MailApiEnvelope<T>
where
    T: Serialize,
{
    pub fn ok(data: T) -> Self {
        Self {
            code: "ok".to_owned(),
            message: "OK".to_owned(),
            request_id: uuid::Uuid::new_v4().to_string(),
            data,
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MailProblemEnvelope {
    pub code: String,
    pub message: String,
    pub request_id: String,
    pub data: JsonValue,
}

impl MailProblemEnvelope {
    fn from_error(error: &MailAppApiError) -> Self {
        Self {
            code: error.code().to_owned(),
            message: error.message().to_owned(),
            request_id: uuid::Uuid::new_v4().to_string(),
            data: json!({}),
        }
    }
}

fn org_id(context: &AppContext) -> Option<String> {
    context.organization_id.clone()
}

fn list_request(context: &AppContext, query: &MailListQuery) -> MailListRequest {
    MailListRequest {
        tenant_id: context.tenant_id.clone(),
        organization_id: org_id(context),
        owner_user_id: context.user_id.clone(),
        account_id: query.account_id.clone(),
        folder_id: query.folder_id.clone(),
        page: query.page,
        page_size: query.page_size,
        cursor: query.cursor.clone(),
        q: query.q.clone(),
        sort: query.sort.clone(),
    }
}

pub async fn list_accounts(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    respond(service.list_accounts(list_request(&context, &query)).await)
}

pub async fn list_folders(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    respond(service.list_folders(list_request(&context, &query)).await)
}

pub async fn list_threads(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    respond(service.list_threads(list_request(&context, &query)).await)
}

pub async fn list_messages(
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    respond(service.list_messages(list_request(&context, &query)).await)
}

pub async fn retrieve_message(
    Extension(context): Extension<AppContext>,
    Path(message_id): Path<String>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    let tenant_id = context.tenant_id.clone();
    let organization_id = org_id(&context);
    respond(
        service
            .retrieve_message(tenant_id, organization_id, message_id)
            .await,
    )
}

pub async fn create_message(
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<CreateMailMessageRequest>,
) -> Response {
    let tenant_id = context.tenant_id.clone();
    let organization_id = org_id(&context);
    let owner_user_id = context.user_id.clone();
    respond(
        service
            .create_message(tenant_id, organization_id, owner_user_id, body)
            .await,
    )
}

pub async fn update_message(
    Extension(context): Extension<AppContext>,
    Path(message_id): Path<String>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<UpdateMailMessageRequest>,
) -> Response {
    let tenant_id = context.tenant_id.clone();
    let organization_id = org_id(&context);
    respond(
        service
            .update_message(tenant_id, organization_id, message_id, body)
            .await,
    )
}

pub async fn delete_message(
    Extension(context): Extension<AppContext>,
    Path(message_id): Path<String>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    let tenant_id = context.tenant_id.clone();
    let organization_id = org_id(&context);
    match service
        .delete_message(tenant_id, organization_id, message_id)
        .await
    {
        Ok(()) => StatusCode::NO_CONTENT.into_response(),
        Err(error) => problem_response(error),
    }
}

fn respond<T: Serialize>(result: Result<T, MailAppApiError>) -> Response {
    match result {
        Ok(data) => (StatusCode::OK, Json(MailApiEnvelope::ok(data))).into_response(),
        Err(error) => problem_response(error),
    }
}

fn problem_response(error: MailAppApiError) -> Response {
    (
        error.status_code(),
        Json(MailProblemEnvelope::from_error(&error)),
    )
        .into_response()
}
