//! Shared HTTP response helpers for SDKWork Mail route crates.

pub mod response;

pub use response::{
    ApiProblem, ApiResult, accepted_command, finish_api_accepted_json, finish_api_created_json,
    finish_api_json, item_data, list_page_data, no_content, ok_json,
};
