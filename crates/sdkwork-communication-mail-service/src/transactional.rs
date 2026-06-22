use std::collections::HashMap;

use serde_json::{Map, Value as JsonValue};

use crate::sha256_hash;

pub const DEFAULT_VERIFICATION_CODE_LENGTH: usize = 6;
pub const DEFAULT_VERIFICATION_TTL_MINUTES: i64 = 10;
pub const DEFAULT_VERIFICATION_MAX_ATTEMPTS: i32 = 5;

pub fn verification_purpose_key(purpose: &str) -> &str {
    purpose
}

pub fn purpose_to_template_key(purpose: &str) -> &str {
    match purpose {
        "login_verification" => "login_verification",
        "password_reset" => "password_reset",
        "bind_email" => "bind_email",
        _ => "generic_otp",
    }
}

pub fn generate_numeric_verification_code(length: usize) -> String {
    let seed = sha256_hash(
        format!(
            "{}:{}",
            uuid::Uuid::new_v4(),
            sdkwork_utils_rust::format_datetime(sdkwork_utils_rust::now(), None)
        )
        .as_bytes(),
    );
    let bytes = seed.as_bytes();
    (0..length)
        .map(|index| ((bytes[index % bytes.len()] % 10) as char).to_string())
        .collect()
}

pub fn hash_verification_code(challenge_id: &str, code: &str) -> String {
    sha256_hash(format!("{challenge_id}:{code}").as_bytes())
}

pub fn render_template(template: &str, variables: &HashMap<String, String>) -> String {
    let mut rendered = template.to_owned();
    for (key, value) in variables {
        rendered = rendered.replace(&format!("{{{{{key}}}}}"), value);
    }
    rendered
}

pub fn json_to_string_map(value: &JsonValue) -> HashMap<String, String> {
    match value {
        JsonValue::Object(map) => map
            .iter()
            .map(|(key, value)| (key.clone(), json_scalar_to_string(value)))
            .collect(),
        _ => HashMap::new(),
    }
}

pub fn merge_template_variables(
    base: &HashMap<String, String>,
    extra: &JsonValue,
) -> HashMap<String, String> {
    let mut merged = base.clone();
    for (key, value) in json_to_string_map(extra) {
        merged.insert(key, value);
    }
    merged
}

pub fn build_verification_variables(
    code: &str,
    recipient_email: &str,
    expires_minutes: i64,
    extra: &JsonValue,
) -> HashMap<String, String> {
    let mut variables = HashMap::from([
        ("code".to_owned(), code.to_owned()),
        ("recipientEmail".to_owned(), recipient_email.to_owned()),
        ("expiresMinutes".to_owned(), expires_minutes.to_string()),
    ]);
    for (key, value) in json_to_string_map(extra) {
        variables.insert(key, value);
    }
    variables
}

fn json_scalar_to_string(value: &JsonValue) -> String {
    match value {
        JsonValue::String(text) => text.clone(),
        JsonValue::Number(number) => number.to_string(),
        JsonValue::Bool(flag) => flag.to_string(),
        JsonValue::Null => String::new(),
        JsonValue::Array(_) | JsonValue::Object(_) => value.to_string(),
    }
}

pub fn normalize_email(value: &str) -> Option<String> {
    let trimmed = value.trim();
    if trimmed.is_empty() || !trimmed.contains('@') {
        return None;
    }
    Some(trimmed.to_ascii_lowercase())
}

pub fn empty_object() -> JsonValue {
    JsonValue::Object(Map::new())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn render_template_replaces_variables() {
        let mut variables = HashMap::new();
        variables.insert("code".to_owned(), "123456".to_owned());
        variables.insert("name".to_owned(), "Alice".to_owned());
        let rendered = render_template("Hello {{name}}, code {{code}}", &variables);
        assert_eq!(rendered, "Hello Alice, code 123456");
    }

    #[test]
    fn hash_verification_code_is_stable() {
        let first = hash_verification_code("challenge-1", "654321");
        let second = hash_verification_code("challenge-1", "654321");
        assert_eq!(first, second);
    }
}
