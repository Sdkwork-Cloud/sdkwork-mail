use std::sync::Arc;

use sdkwork_communication_mail_service::{
    MailOutboundMessage, MailTemplate, MailTransportError, MailTransportPort, render_template,
};
use sdkwork_routes_mail_app_api::service::MailAppApiError;

pub fn render_template_bodies(
    template: &MailTemplate,
    variables: &std::collections::HashMap<String, String>,
) -> (String, Option<String>, Option<String>) {
    let subject = render_template(&template.subject_template, variables);
    let body_text = template
        .body_text_template
        .as_ref()
        .map(|body| render_template(body, variables));
    let body_html = template
        .body_html_template
        .as_ref()
        .map(|body| render_template(body, variables));
    (subject, body_text, body_html)
}

pub async fn send_outbound_mail(
    transport: Arc<dyn MailTransportPort>,
    from_email: String,
    recipient_email: String,
    subject: String,
    body_text: Option<String>,
    body_html: Option<String>,
) -> Result<(), MailAppApiError> {
    transport
        .send(&MailOutboundMessage {
            from_email,
            to_email: recipient_email,
            subject,
            body_text,
            body_html,
        })
        .await
        .map_err(map_transport_error)
}

pub fn resolve_from_email(
    request_from: Option<&str>,
    fallback_from: Option<&str>,
) -> Result<String, MailAppApiError> {
    let candidate = request_from
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .or_else(|| {
            fallback_from
                .map(str::trim)
                .filter(|value| !value.is_empty())
        })
        .ok_or_else(|| {
            MailAppApiError::Unavailable(
                "fromEmail is not configured; set SDKWORK_MAIL_SMTP_FROM_EMAIL".to_owned(),
            )
        })?;
    Ok(candidate.to_owned())
}

fn map_transport_error(error: MailTransportError) -> MailAppApiError {
    match error {
        MailTransportError::Configuration(message) => MailAppApiError::Unavailable(message),
        MailTransportError::Delivery(message) => MailAppApiError::Unavailable(message),
    }
}
