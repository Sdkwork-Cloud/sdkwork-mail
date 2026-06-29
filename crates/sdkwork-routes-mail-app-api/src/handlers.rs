use std::sync::Arc;

use axum::{
    Extension, Json,
    extract::{Path, Query, State},
    response::Response,
};
use sdkwork_communication_mail_service::{
    CreateMailMessageRequest, SendMailVerificationRequest, SendTransactionalMailRequest,
    UpdateMailMessageRequest, VerifyMailCodeRequest,
};
use sdkwork_mail_app_context::AppContext;
use sdkwork_routes_mail_common::{
    ApiProblem, finish_api_json, item_data, list_page_data, no_content, ok_json,
};
use sdkwork_web_core::WebRequestContext;
use serde::Deserialize;

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

fn map_app_api_error(error: MailAppApiError) -> ApiProblem {
    match error {
        MailAppApiError::BadRequest(message) => ApiProblem::bad_request(message),
        MailAppApiError::Forbidden(message) => ApiProblem::forbidden(message),
        MailAppApiError::NotFound(message) => ApiProblem::not_found(message),
        MailAppApiError::Conflict(message) => ApiProblem::conflict(message),
        MailAppApiError::Unavailable(message) => ApiProblem::unavailable(message),
        MailAppApiError::Internal(message) => ApiProblem::internal_server_error(message),
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
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    finish_api_json(
        &ctx,
        match service.list_accounts(list_request(&context, &query)).await {
            Ok(data) => ok_json(list_page_data(
                data.items,
                data.next_cursor,
                query.page,
                query.page_size,
                query.cursor.as_deref(),
            )),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn list_folders(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    finish_api_json(
        &ctx,
        match service.list_folders(list_request(&context, &query)).await {
            Ok(data) => ok_json(list_page_data(
                data.items,
                data.next_cursor,
                query.page,
                query.page_size,
                query.cursor.as_deref(),
            )),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn list_threads(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    finish_api_json(
        &ctx,
        match service.list_threads(list_request(&context, &query)).await {
            Ok(data) => ok_json(list_page_data(
                data.items,
                data.next_cursor,
                query.page,
                query.page_size,
                query.cursor.as_deref(),
            )),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn list_messages(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Query(query): Query<MailListQuery>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    finish_api_json(
        &ctx,
        match service.list_messages(list_request(&context, &query)).await {
            Ok(data) => ok_json(list_page_data(
                data.items,
                data.next_cursor,
                query.page,
                query.page_size,
                query.cursor.as_deref(),
            )),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn retrieve_message(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(message_id): Path<String>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    finish_api_json(
        &ctx,
        match service
            .retrieve_message(context.tenant_id.clone(), org_id(&context), message_id)
            .await
        {
            Ok(message) => ok_json(item_data(message)),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn create_message(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<CreateMailMessageRequest>,
) -> Response {
    finish_api_json(
        &ctx,
        match service
            .create_message(
                context.tenant_id.clone(),
                org_id(&context),
                context.user_id.clone(),
                body,
            )
            .await
        {
            Ok(message) => ok_json(item_data(message)),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn update_message(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(message_id): Path<String>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<UpdateMailMessageRequest>,
) -> Response {
    finish_api_json(
        &ctx,
        match service
            .update_message(
                context.tenant_id.clone(),
                org_id(&context),
                message_id,
                body,
            )
            .await
        {
            Ok(message) => ok_json(item_data(message)),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn delete_message(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    Path(message_id): Path<String>,
    State(service): State<Arc<dyn MailAppApiService>>,
) -> Response {
    match service
        .delete_message(context.tenant_id.clone(), org_id(&context), message_id)
        .await
    {
        Ok(()) => no_content(&ctx),
        Err(error) => map_app_api_error(error).into_response_for(&ctx),
    }
}

pub async fn send_verification_code(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<SendMailVerificationRequest>,
) -> Response {
    finish_api_json(
        &ctx,
        match service
            .send_verification_code(context.tenant_id.clone(), org_id(&context), body)
            .await
        {
            Ok(result) => ok_json(item_data(result)),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn verify_verification_code(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<VerifyMailCodeRequest>,
) -> Response {
    finish_api_json(
        &ctx,
        match service
            .verify_verification_code(context.tenant_id.clone(), org_id(&context), body)
            .await
        {
            Ok(result) => ok_json(item_data(result)),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}

pub async fn send_transactional_mail(
    ctx: WebRequestContext,
    Extension(context): Extension<AppContext>,
    State(service): State<Arc<dyn MailAppApiService>>,
    Json(body): Json<SendTransactionalMailRequest>,
) -> Response {
    finish_api_json(
        &ctx,
        match service
            .send_transactional_mail(context.tenant_id.clone(), org_id(&context), body)
            .await
        {
            Ok(result) => ok_json(item_data(result)),
            Err(error) => Err(map_app_api_error(error)),
        },
    )
}
