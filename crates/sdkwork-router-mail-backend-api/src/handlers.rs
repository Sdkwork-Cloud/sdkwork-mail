use std::sync::Arc;

use axum::{
    Extension, Json,
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use sdkwork_mail_app_context::AppContext;
use serde::{Deserialize, Serialize};
use serde_json::{Value as JsonValue, json};

use crate::service::{MailBackendApiService, MailBackendListRequest};

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MailBackendListQuery {
    pub page: Option<u32>,
    pub page_size: Option<u32>,
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
