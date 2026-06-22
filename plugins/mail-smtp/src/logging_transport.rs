use sdkwork_communication_mail_service::{
    MailOutboundMessage, MailTransportFuture, MailTransportPort,
};

pub struct LoggingMailTransport;

impl MailTransportPort for LoggingMailTransport {
    fn send<'a>(&'a self, message: &'a MailOutboundMessage) -> MailTransportFuture<'a> {
        let preview = message.clone();
        Box::pin(async move {
            tracing::info!(
                target: "sdkwork_mail_transport",
                to = %preview.to_email,
                from = %preview.from_email,
                subject = %preview.subject,
                "mail transport log mode accepted outbound message"
            );
            Ok(())
        })
    }
}
