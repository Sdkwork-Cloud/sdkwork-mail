use std::future::Future;
use std::pin::Pin;

use crate::models::CreateMailAttachmentInput;

pub type MailDriveAttachmentFuture<'a> =
    Pin<Box<dyn Future<Output = Result<(), MailDriveAttachmentError>> + Send + 'a>>;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MailDriveAttachmentError {
    Validation(String),
    Unavailable(String),
}

impl std::fmt::Display for MailDriveAttachmentError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Validation(message) | Self::Unavailable(message) => message.fmt(f),
        }
    }
}

impl std::error::Error for MailDriveAttachmentError {}

pub trait MailDriveAttachmentPort: Send + Sync {
    fn validate_attachments<'a>(
        &'a self,
        tenant_id: &'a str,
        owner_user_id: &'a str,
        attachments: &'a [CreateMailAttachmentInput],
    ) -> MailDriveAttachmentFuture<'a>;
}

#[derive(Clone, Copy, Debug, Default)]
pub struct LocalMailDriveAttachmentPort;

impl MailDriveAttachmentPort for LocalMailDriveAttachmentPort {
    fn validate_attachments<'a>(
        &'a self,
        _tenant_id: &'a str,
        _owner_user_id: &'a str,
        attachments: &'a [CreateMailAttachmentInput],
    ) -> MailDriveAttachmentFuture<'a> {
        Box::pin(async move {
            for attachment in attachments {
                validate_mail_attachment_fields(attachment)?;
            }
            Ok(())
        })
    }
}

pub fn validate_mail_attachment_fields(
    attachment: &CreateMailAttachmentInput,
) -> Result<(), MailDriveAttachmentError> {
    if sdkwork_utils_rust::string::is_blank(Some(attachment.drive_node_id.as_str())) {
        return Err(MailDriveAttachmentError::Validation(
            "attachment driveNodeId is required".to_owned(),
        ));
    }
    if sdkwork_utils_rust::string::is_blank(Some(attachment.file_name.as_str())) {
        return Err(MailDriveAttachmentError::Validation(
            "attachment fileName is required".to_owned(),
        ));
    }
    if sdkwork_utils_rust::string::is_blank(Some(attachment.content_type.as_str())) {
        return Err(MailDriveAttachmentError::Validation(
            "attachment contentType is required".to_owned(),
        ));
    }
    if attachment.size_bytes == 0 {
        return Err(MailDriveAttachmentError::Validation(
            "attachment sizeBytes must be greater than zero".to_owned(),
        ));
    }
    Ok(())
}
