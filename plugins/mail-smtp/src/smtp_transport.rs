use lettre::message::{MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};

use sdkwork_communication_mail_service::{
    MailOutboundMessage, MailTransportError, MailTransportFuture, MailTransportPort,
};

use crate::config::SmtpTransportConfig;
use crate::validate_outbound_message;

pub struct SmtpMailTransport {
    config: SmtpTransportConfig,
}

impl SmtpMailTransport {
    pub fn new(config: SmtpTransportConfig) -> Self {
        Self { config }
    }

    fn build_message(message: &MailOutboundMessage) -> Result<Message, MailTransportError> {
        let builder = Message::builder()
            .from(message.from_email.parse().map_err(|_| {
                MailTransportError::Configuration("fromEmail is invalid".to_owned())
            })?)
            .to(message
                .to_email
                .parse()
                .map_err(|_| MailTransportError::Configuration("toEmail is invalid".to_owned()))?)
            .subject(message.subject.clone());

        let body_text = message.body_text.clone().unwrap_or_default();
        let body_html = message.body_html.clone();

        let email = if let Some(html) = body_html.filter(|value| !value.trim().is_empty()) {
            builder.multipart(
                MultiPart::alternative()
                    .singlepart(
                        SinglePart::builder()
                            .header(lettre::message::header::ContentType::TEXT_PLAIN)
                            .body(if body_text.is_empty() {
                                strip_html_tags(&html)
                            } else {
                                body_text
                            }),
                    )
                    .singlepart(
                        SinglePart::builder()
                            .header(lettre::message::header::ContentType::TEXT_HTML)
                            .body(html),
                    ),
            )
        } else {
            builder.body(body_text)
        }
        .map_err(|error| MailTransportError::Delivery(error.to_string()))?;

        Ok(email)
    }

    async fn send_inner(&self, message: &MailOutboundMessage) -> Result<(), MailTransportError> {
        validate_outbound_message(message)?;
        let email = Self::build_message(message)?;

        let mut mailer_builder = if self.config.use_tls {
            AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&self.config.host)
                .map_err(|error| MailTransportError::Configuration(error.to_string()))?
        } else {
            AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous(&self.config.host)
        }
        .port(self.config.port);

        if let (Some(username), Some(password)) = (&self.config.username, &self.config.password) {
            mailer_builder =
                mailer_builder.credentials(Credentials::new(username.clone(), password.clone()));
        }

        let mailer = mailer_builder.build();

        mailer
            .send(email)
            .await
            .map_err(|error| MailTransportError::Delivery(error.to_string()))?;
        Ok(())
    }
}

impl MailTransportPort for SmtpMailTransport {
    fn send<'a>(&'a self, message: &'a MailOutboundMessage) -> MailTransportFuture<'a> {
        let transport = self.clone();
        let outbound = message.clone();
        Box::pin(async move { transport.send_inner(&outbound).await })
    }
}

impl Clone for SmtpMailTransport {
    fn clone(&self) -> Self {
        Self {
            config: self.config.clone(),
        }
    }
}

fn strip_html_tags(value: &str) -> String {
    let mut output = String::with_capacity(value.len());
    let mut in_tag = false;
    for ch in value.chars() {
        match ch {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ if !in_tag => output.push(ch),
            _ => {}
        }
    }
    output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builds_plaintext_message() {
        let message = MailOutboundMessage {
            from_email: "noreply@example.com".to_owned(),
            to_email: "user@example.com".to_owned(),
            subject: "Hello".to_owned(),
            body_text: Some("plain body".to_owned()),
            body_html: None,
        };
        validate_outbound_message(&message).expect("message should validate");
        SmtpMailTransport::build_message(&message).expect("message should build");
    }
}
