use std::sync::Arc;

use axum::{
    Extension, Json,
    extract::{Path, Query, State},
    response::Response,
};
use sdkwork_communication_mail_service::{
    CreateMailProviderAccountRequest, CreateMailTemplateRequest, GrantMailMarketingConsentRequest,
    MailTemplateCategory, SyncMailProviderAccountRequest, UpdateMailTemplateRequest,
};
use sdkwork_mail_app_context::AppContext;
use sdkwork_routes_mail_common::{
    ApiProblem, accepted_command, finish_api_accepted_json, finish_api_json, item_data,
    list_page_data, no_content, ok_json,
};
use sdkwork_web_core::WebRequestContext;
use serde::Deserialize;
use serde_json::Value as JsonValue;

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

fn map_backend_api_error(error: MailBackendApiError) -> ApiProblem {
    match error {
        MailBackendApiError::BadRequest(message) => ApiProblem::bad_request(message),
        MailBackendApiError::Forbidden(message) => ApiProblem::forbidden(message),
        MailBackendApiError::NotFound(message) => ApiProblem::not_found(message),
        MailBackendApiError::Conflict(message) => ApiProblem::conflict(message),
        MailBackendApiError::Unavailable(message) => ApiProblem::unavailable(message),
        MailBackendApiError::Internal(message) => ApiProblem::internal_server_error(message),
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

fn finish_list<T>(
    ctx: &WebRequestContext,
    query: &MailBackendListQuery,
    result: Result<crate::service::MailBackendListData<T>, MailBackendApiError>,
) -> Response
where
    T: serde::Serialize,
{
    finish_api_json(
        ctx,
        match result {
            Ok(data) => ok_json(list_page_data(
                data.items,
                data.next_cursor,
                query.page,
                query.page_size,
                None,
            )),
            Err(error) => Err(map_backend_api_error(error)),
        },
    )
}

fn finish_item<T>(ctx: &WebRequestContext, result: Result<T, MailBackendApiError>) -> Response
where
    T: serde::Serialize,
{
    finish_api_json(
        ctx,
        match result {
            Ok(item) => ok_json(item_data(item)),
            Err(error) => Err(map_backend_api_error(error)),
        },
    )
}

pub async fn list_provider_accounts(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    finish_list(
        &ctx,
        &query,
        service
            .list_provider_accounts(list_request(&context, &query))
            .await,
    )
}

pub async fn list_templates(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    let category = query.category;
    let purpose = query.purpose.clone();
    finish_list(
        &ctx,
        &query,
        service
            .list_templates(list_request(&context, &query), category, purpose)
            .await,
    )
}

pub async fn create_provider_account(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<CreateMailProviderAccountRequest>,
) -> Response {
    finish_item(
        &ctx,
        service
            .create_provider_account(context.tenant_id, context.organization_id, body)
            .await,
    )
}

pub async fn ping_provider_account(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(account_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    finish_item(
        &ctx,
        service
            .ping_provider_account(context.tenant_id, context.organization_id, account_id)
            .await,
    )
}

pub async fn sync_provider_account(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(account_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<SyncMailProviderAccountRequest>,
) -> Response {
    finish_item(
        &ctx,
        service
            .sync_provider_account(
                context.tenant_id,
                context.organization_id,
                context.user_id,
                account_id,
                body,
            )
            .await,
    )
}

pub async fn create_template(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<CreateMailTemplateRequest>,
) -> Response {
    finish_item(
        &ctx,
        service
            .create_template(context.tenant_id, context.organization_id, body)
            .await,
    )
}

pub async fn retrieve_template(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(template_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    finish_item(
        &ctx,
        service
            .retrieve_template(context.tenant_id, context.organization_id, template_id)
            .await,
    )
}

pub async fn update_template(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(template_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<UpdateMailTemplateRequest>,
) -> Response {
    finish_item(
        &ctx,
        service
            .update_template(
                context.tenant_id,
                context.organization_id,
                template_id,
                body,
            )
            .await,
    )
}

pub async fn delete_template(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(template_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    match service
        .delete_template(context.tenant_id, context.organization_id, template_id)
        .await
    {
        Ok(()) => no_content(&ctx),
        Err(error) => map_backend_api_error(error).into_response_for(&ctx),
    }
}

pub async fn list_transactional_deliveries(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    finish_list(
        &ctx,
        &query,
        service
            .list_transactional_deliveries(
                list_request(&context, &query),
                query.business_kind.clone(),
                query.recipient_email.clone(),
            )
            .await,
    )
}

pub async fn list_marketing_consents(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailBackendListQuery>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    finish_list(
        &ctx,
        &query,
        service
            .list_marketing_consents(
                list_request(&context, &query),
                query.recipient_email.clone(),
            )
            .await,
    )
}

pub async fn grant_marketing_consent(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailBackendApiService>>,
    Json(body): Json<GrantMailMarketingConsentRequest>,
) -> Response {
    finish_item(
        &ctx,
        service
            .grant_marketing_consent(context.tenant_id, context.organization_id, body)
            .await,
    )
}

pub async fn revoke_marketing_consent(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(consent_id): Path<String>,
    State(service): State<Arc<dyn MailBackendApiService>>,
) -> Response {
    finish_item(
        &ctx,
        service
            .revoke_marketing_consent(context.tenant_id, context.organization_id, consent_id)
            .await,
    )
}

pub async fn receive_provider_webhook(
    ctx: WebRequestContext,
    Path(provider): Path<String>,
    Json(_body): Json<JsonValue>,
) -> Response {
    let _ = provider;
    finish_api_accepted_json(&ctx, ok_json(accepted_command()))
}
