use axum::{
    Json,
    http::{HeaderName, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
};
use sdkwork_utils_rust::{
    PageInfo, PageMode, SdkWorkApiResponse, SdkWorkCommandData, SdkWorkPageData,
    SdkWorkResourceData,
};
use sdkwork_web_core::{
    WebFrameworkError, WebFrameworkErrorKind, WebRequestContext, problem_response,
};
use serde::Serialize;

pub type ApiResult<T> = Result<T, ApiProblem>;

pub fn ok_json<T>(data: T) -> ApiResult<T> {
    Ok(data)
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MailListPayload<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<String>,
}

pub fn list_page_data<T>(
    items: Vec<T>,
    next_cursor: Option<String>,
    page: Option<u32>,
    page_size: Option<u32>,
    query_cursor: Option<&str>,
) -> SdkWorkPageData<T> {
    let mode = if query_cursor.is_some() || next_cursor.is_some() {
        PageMode::Cursor
    } else {
        PageMode::Offset
    };
    SdkWorkPageData {
        items,
        page_info: PageInfo {
            mode,
            page: page.map(|value| value as i32),
            page_size: page_size.map(|value| value as i32),
            total_items: None,
            total_pages: None,
            next_cursor,
            has_more: None,
        },
    }
}

pub fn item_data<T>(item: T) -> SdkWorkResourceData<T> {
    SdkWorkResourceData { item }
}

pub fn accepted_command() -> SdkWorkCommandData {
    SdkWorkCommandData::accepted()
}

fn success_response<T: Serialize>(
    ctx: &WebRequestContext,
    status: StatusCode,
    data: T,
) -> Result<Response, ApiProblem> {
    let trace_id = ctx.resolved_trace_id();
    let envelope = SdkWorkApiResponse::success(data, trace_id.clone());
    let mut response = (status, Json(envelope)).into_response();
    attach_trace_header(&mut response, &trace_id);
    Ok(response)
}

fn attach_trace_header(response: &mut Response, trace_id: &str) {
    if let Ok(value) = HeaderValue::from_str(trace_id) {
        response
            .headers_mut()
            .insert(HeaderName::from_static("x-sdkwork-trace-id"), value);
    }
}

pub fn finish_api_json<T: Serialize>(ctx: &WebRequestContext, result: ApiResult<T>) -> Response {
    match result {
        Ok(data) => success_response(ctx, StatusCode::OK, data)
            .unwrap_or_else(|problem| problem.into_response_for(ctx)),
        Err(problem) => problem.into_response_for(ctx),
    }
}

pub fn finish_api_created_json<T: Serialize>(
    ctx: &WebRequestContext,
    result: ApiResult<T>,
) -> Response {
    match result {
        Ok(data) => success_response(ctx, StatusCode::CREATED, data)
            .unwrap_or_else(|problem| problem.into_response_for(ctx)),
        Err(problem) => problem.into_response_for(ctx),
    }
}

pub fn finish_api_accepted_json<T: Serialize>(
    ctx: &WebRequestContext,
    result: ApiResult<T>,
) -> Response {
    match result {
        Ok(data) => success_response(ctx, StatusCode::ACCEPTED, data)
            .unwrap_or_else(|problem| problem.into_response_for(ctx)),
        Err(problem) => problem.into_response_for(ctx),
    }
}

pub fn no_content(ctx: &WebRequestContext) -> Response {
    let trace_id = ctx.resolved_trace_id();
    let mut response = StatusCode::NO_CONTENT.into_response();
    attach_trace_header(&mut response, &trace_id);
    response
}

#[derive(Debug)]
pub struct ApiProblem {
    message: String,
    status: StatusCode,
}

impl ApiProblem {
    pub fn bad_request(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::BAD_REQUEST,
        }
    }

    pub fn forbidden(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::FORBIDDEN,
        }
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::NOT_FOUND,
        }
    }

    pub fn conflict(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::CONFLICT,
        }
    }

    pub fn unavailable(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::SERVICE_UNAVAILABLE,
        }
    }

    pub fn internal_server_error(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn framework_error(&self) -> WebFrameworkError {
        let kind = match self.status {
            StatusCode::BAD_REQUEST => WebFrameworkErrorKind::BadRequest,
            StatusCode::FORBIDDEN => WebFrameworkErrorKind::Forbidden,
            StatusCode::NOT_FOUND => WebFrameworkErrorKind::NotFound,
            StatusCode::CONFLICT => WebFrameworkErrorKind::Conflict,
            StatusCode::SERVICE_UNAVAILABLE => WebFrameworkErrorKind::DependencyUnavailable,
            StatusCode::INTERNAL_SERVER_ERROR => WebFrameworkErrorKind::InternalServerError,
            _ => WebFrameworkErrorKind::InternalServerError,
        };
        WebFrameworkError {
            kind,
            message: self.message.clone(),
            retry_after_seconds: None,
        }
    }

    pub fn into_response_for(self, ctx: &WebRequestContext) -> Response {
        problem_response(&self.framework_error(), ctx.problem_correlation())
    }
}
