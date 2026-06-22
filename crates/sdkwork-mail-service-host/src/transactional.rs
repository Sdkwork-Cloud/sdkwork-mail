use std::sync::Arc;

use sdkwork_communication_mail_service::{
    CreateMailTemplateRequest, DEFAULT_VERIFICATION_CODE_LENGTH, DEFAULT_VERIFICATION_TTL_MINUTES,
    GrantMailMarketingConsentRequest, MailMarketingConsent, MailPersistencePort, MailTemplate,
    MailTemplateCategory, MailTransactionalDelivery, MailTransportPort,
    SendMailVerificationRequest, SendMailVerificationResult, SendTransactionalMailRequest,
    UpdateMailTemplateRequest, VerifyMailCodeRequest, VerifyMailCodeResult,
    build_verification_variables, generate_numeric_verification_code, hash_verification_code,
    json_to_string_map, normalize_email, utc_now_rfc3339_millis,
};
use sdkwork_router_mail_app_api::service::MailAppApiError;
use sdkwork_router_mail_backend_api::service::MailBackendApiError;
use serde_json::json;

use crate::outbound::{render_template_bodies, resolve_from_email, send_outbound_mail};
use crate::transport_resolver::resolve_transport_for_tenant;

pub async fn send_verification_code(
    persistence: Arc<dyn MailPersistencePort>,
    fallback_transport: Arc<dyn MailTransportPort>,
    default_from_email: Option<String>,
    tenant_id: String,
    organization_id: String,
    request: SendMailVerificationRequest,
) -> Result<SendMailVerificationResult, MailAppApiError> {
    let recipient_email = normalize_email(&request.recipient_email)
        .ok_or_else(|| MailAppApiError::BadRequest("recipientEmail is invalid".to_owned()))?;
    let locale = request.locale.clone().unwrap_or_else(|| "zh-CN".to_owned());
    let template_key = request
        .template_key
        .clone()
        .unwrap_or_else(|| request.purpose.default_template_key().to_owned());

    let template = persistence
        .retrieve_template_by_key(&tenant_id, &organization_id, &template_key, &locale)
        .await
        .map_err(map_app_persistence_error)?;

    let code = generate_numeric_verification_code(DEFAULT_VERIFICATION_CODE_LENGTH);
    let challenge_uuid = uuid::Uuid::new_v4().to_string();
    let code_hash = hash_verification_code(&challenge_uuid, &code);
    let expires_at = expires_at_rfc3339(DEFAULT_VERIFICATION_TTL_MINUTES);
    let variables = build_verification_variables(
        &code,
        &recipient_email,
        DEFAULT_VERIFICATION_TTL_MINUTES,
        &request.variables,
    );
    let (subject, body_text, body_html) = render_template_bodies(&template, &variables);
    let resolved = resolve_transport_for_tenant(
        persistence.clone(),
        &tenant_id,
        &organization_id,
        fallback_transport,
    )
    .await?;
    let from_email = resolve_from_email(
        None,
        resolved
            .from_email
            .as_deref()
            .or(default_from_email.as_deref()),
    )?;
    send_outbound_mail(
        resolved.transport,
        from_email,
        recipient_email.clone(),
        subject.clone(),
        body_text,
        body_html,
    )
    .await?;

    let delivery = persistence
        .create_transactional_delivery(
            &tenant_id,
            &organization_id,
            Some(&template.id),
            &template.template_key,
            request.purpose.as_str(),
            &recipient_email,
            None,
            &subject,
            request.correlation_id.as_deref(),
            json!({
                "kind": "verification",
                "purpose": request.purpose.as_str(),
                "locale": locale,
            }),
        )
        .await
        .map_err(map_app_persistence_error)?;

    let challenge_id = persistence
        .create_verification_challenge(
            &tenant_id,
            &organization_id,
            &challenge_uuid,
            &recipient_email,
            request.purpose,
            &code_hash,
            &expires_at,
            Some(&delivery.id),
            request.variables,
        )
        .await
        .map_err(map_app_persistence_error)?;

    let sent_at = utc_now_rfc3339_millis();
    let _ = persistence
        .mark_transactional_delivery_sent(
            &delivery.id,
            &sent_at,
            resolved.provider_account_id.as_deref(),
        )
        .await
        .map_err(map_app_persistence_error)?;

    Ok(SendMailVerificationResult {
        challenge_id,
        delivery_id: delivery.id,
        expires_at,
        recipient_email,
    })
}

pub async fn verify_verification_code(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    request: VerifyMailCodeRequest,
) -> Result<VerifyMailCodeResult, MailAppApiError> {
    let recipient_email = normalize_email(&request.recipient_email)
        .ok_or_else(|| MailAppApiError::BadRequest("recipientEmail is invalid".to_owned()))?;
    if request.code.trim().len() < 4 {
        return Err(MailAppApiError::BadRequest(
            "verification code is too short".to_owned(),
        ));
    }

    let challenge = persistence
        .find_active_verification_challenge(
            &tenant_id,
            &organization_id,
            &recipient_email,
            request.purpose,
            request.challenge_id.as_deref(),
        )
        .await
        .map_err(map_app_persistence_error)?;

    if challenge.attempt_count >= challenge.max_attempts {
        return Err(MailAppApiError::Conflict(
            "verification attempts exceeded".to_owned(),
        ));
    }

    let expected_hash = hash_verification_code(&challenge.id, request.code.trim());
    if expected_hash != challenge.code_hash {
        persistence
            .increment_verification_attempt(&challenge.id)
            .await
            .map_err(map_app_persistence_error)?;
        return Err(MailAppApiError::BadRequest(
            "verification code is invalid".to_owned(),
        ));
    }

    let consumed_at = utc_now_rfc3339_millis();
    persistence
        .consume_verification_challenge(&challenge.id, &consumed_at)
        .await
        .map_err(map_app_persistence_error)?;

    Ok(VerifyMailCodeResult {
        verified: true,
        challenge_id: challenge.id,
        consumed_at,
    })
}

pub async fn send_transactional_mail(
    persistence: Arc<dyn MailPersistencePort>,
    fallback_transport: Arc<dyn MailTransportPort>,
    default_from_email: Option<String>,
    tenant_id: String,
    organization_id: String,
    request: SendTransactionalMailRequest,
) -> Result<MailTransactionalDelivery, MailAppApiError> {
    let recipient_email = normalize_email(&request.recipient_email)
        .ok_or_else(|| MailAppApiError::BadRequest("recipientEmail is invalid".to_owned()))?;
    let locale = request.locale.clone().unwrap_or_else(|| "zh-CN".to_owned());

    let template = persistence
        .retrieve_template_by_key(&tenant_id, &organization_id, &request.template_key, &locale)
        .await
        .map_err(map_app_persistence_error)?;

    if template.category == MailTemplateCategory::Marketing {
        let has_consent = persistence
            .has_active_marketing_consent(&tenant_id, &organization_id, &recipient_email)
            .await
            .map_err(map_app_persistence_error)?;
        if !has_consent {
            return Err(MailAppApiError::Forbidden(
                "recipient has not granted marketing consent".to_owned(),
            ));
        }
    }

    let variables = json_to_string_map(&request.variables);
    let (subject, body_text, body_html) = render_template_bodies(&template, &variables);
    let resolved = resolve_transport_for_tenant(
        persistence.clone(),
        &tenant_id,
        &organization_id,
        fallback_transport,
    )
    .await?;
    let from_email = resolve_from_email(
        request.from_email.as_deref(),
        resolved
            .from_email
            .as_deref()
            .or(default_from_email.as_deref()),
    )?;
    send_outbound_mail(
        resolved.transport,
        from_email.clone(),
        recipient_email.clone(),
        subject.clone(),
        body_text,
        body_html,
    )
    .await?;

    let delivery = persistence
        .create_transactional_delivery(
            &tenant_id,
            &organization_id,
            Some(&template.id),
            &template.template_key,
            &template.purpose,
            &recipient_email,
            request.from_email.as_deref(),
            &subject,
            request.correlation_id.as_deref(),
            json!({
                "kind": "transactional",
                "locale": locale,
                "variables": request.variables,
            }),
        )
        .await
        .map_err(map_app_persistence_error)?;

    let sent_at = utc_now_rfc3339_millis();
    persistence
        .mark_transactional_delivery_sent(
            &delivery.id,
            &sent_at,
            resolved.provider_account_id.as_deref(),
        )
        .await
        .map_err(map_app_persistence_error)
}

pub async fn list_templates(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    category: Option<MailTemplateCategory>,
    purpose: Option<String>,
) -> Result<Vec<MailTemplate>, MailBackendApiError> {
    persistence
        .list_templates(&tenant_id, &organization_id, category, purpose.as_deref())
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn create_template(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    request: CreateMailTemplateRequest,
) -> Result<MailTemplate, MailBackendApiError> {
    persistence
        .create_template(&tenant_id, &organization_id, request)
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn retrieve_template(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    template_id: String,
) -> Result<MailTemplate, MailBackendApiError> {
    persistence
        .retrieve_template(&tenant_id, &organization_id, &template_id)
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn update_template(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    template_id: String,
    request: UpdateMailTemplateRequest,
) -> Result<MailTemplate, MailBackendApiError> {
    persistence
        .update_template(&tenant_id, &organization_id, &template_id, request)
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn delete_template(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    template_id: String,
) -> Result<(), MailBackendApiError> {
    persistence
        .delete_template(&tenant_id, &organization_id, &template_id)
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn list_transactional_deliveries(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    business_kind: Option<String>,
    recipient_email: Option<String>,
) -> Result<Vec<MailTransactionalDelivery>, MailBackendApiError> {
    persistence
        .list_transactional_deliveries(
            &tenant_id,
            &organization_id,
            business_kind.as_deref(),
            recipient_email.as_deref(),
        )
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn list_marketing_consents(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    recipient_email: Option<String>,
) -> Result<Vec<MailMarketingConsent>, MailBackendApiError> {
    persistence
        .list_marketing_consents(&tenant_id, &organization_id, recipient_email.as_deref())
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn grant_marketing_consent(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    request: GrantMailMarketingConsentRequest,
) -> Result<MailMarketingConsent, MailBackendApiError> {
    persistence
        .grant_marketing_consent(&tenant_id, &organization_id, request)
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn revoke_marketing_consent(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    consent_id: String,
) -> Result<MailMarketingConsent, MailBackendApiError> {
    persistence
        .revoke_marketing_consent(&tenant_id, &organization_id, &consent_id)
        .await
        .map_err(map_backend_persistence_error)
}

fn expires_at_rfc3339(minutes: i64) -> String {
    let seconds = minutes.saturating_mul(60);
    sdkwork_utils_rust::format_datetime(
        sdkwork_utils_rust::now() + std::time::Duration::from_secs(seconds as u64),
        None,
    )
}

fn map_app_persistence_error(
    error: sdkwork_communication_mail_service::MailPersistenceError,
) -> MailAppApiError {
    match error {
        sdkwork_communication_mail_service::MailPersistenceError::NotFound(message) => {
            MailAppApiError::NotFound(message)
        }
        sdkwork_communication_mail_service::MailPersistenceError::Conflict(message) => {
            MailAppApiError::Conflict(message)
        }
        sdkwork_communication_mail_service::MailPersistenceError::Unavailable(message) => {
            MailAppApiError::Unavailable(message)
        }
    }
}

fn map_backend_persistence_error(
    error: sdkwork_communication_mail_service::MailPersistenceError,
) -> MailBackendApiError {
    match error {
        sdkwork_communication_mail_service::MailPersistenceError::NotFound(message) => {
            MailBackendApiError::NotFound(message)
        }
        sdkwork_communication_mail_service::MailPersistenceError::Conflict(message) => {
            MailBackendApiError::Conflict(message)
        }
        sdkwork_communication_mail_service::MailPersistenceError::Unavailable(message) => {
            MailBackendApiError::Unavailable(message)
        }
    }
}
