use std::sync::Arc;

use sdkwork_communication_mail_service::{
    CreateMailAttachmentInput, LocalMailDriveAttachmentPort, MailDriveAttachmentError,
    MailDriveAttachmentFuture, MailDriveAttachmentPort, validate_mail_attachment_fields,
};
use sdkwork_utils_rust::string::{is_blank, trim};

pub fn build_mail_drive_attachment_port_from_env() -> Arc<dyn MailDriveAttachmentPort> {
    match read_drive_facade_url() {
        Some(facade_url) => Arc::new(FacadeMailDriveAttachmentPort::from_env(facade_url)),
        None => Arc::new(LocalMailDriveAttachmentPort),
    }
}

fn read_drive_facade_url() -> Option<String> {
    std::env::var("SDKWORK_DRIVE_FACADE_URL")
        .ok()
        .map(|value| trim(&value).to_owned())
        .filter(|value| !is_blank(Some(value.as_str())))
}

#[derive(Clone)]
struct FacadeMailDriveAttachmentPort {
    base_url: String,
    client: reqwest::Client,
    auth_token: Option<String>,
    access_token: Option<String>,
}

impl FacadeMailDriveAttachmentPort {
    fn from_env(base_url: String) -> Self {
        let auth_token = std::env::var("SDKWORK_AUTH_TOKEN")
            .ok()
            .map(|value| trim(&value).to_owned())
            .filter(|value| !is_blank(Some(value.as_str())));
        let access_token = std::env::var("SDKWORK_ACCESS_TOKEN")
            .ok()
            .map(|value| trim(&value).to_owned())
            .filter(|value| !is_blank(Some(value.as_str())));
        Self {
            base_url: base_url.trim_end_matches('/').to_owned(),
            client: reqwest::Client::new(),
            auth_token,
            access_token,
        }
    }

    async fn validate_node_exists(&self, node_id: &str) -> Result<(), MailDriveAttachmentError> {
        let url = format!("{}/app/v3/api/drive/nodes/{node_id}", self.base_url);
        let mut request = self.client.get(url);
        if let Some(token) = &self.auth_token {
            request = request.header("Authorization", format!("Bearer {token}"));
        }
        if let Some(token) = &self.access_token {
            request = request.header("Access-Token", token);
        }
        let response = request.send().await.map_err(|error| {
            MailDriveAttachmentError::Unavailable(format!(
                "drive facade node lookup failed: {error}"
            ))
        })?;
        match response.status().as_u16() {
            200 => Ok(()),
            404 => Err(MailDriveAttachmentError::Validation(format!(
                "drive node not found: {node_id}"
            ))),
            403 => Err(MailDriveAttachmentError::Validation(format!(
                "drive node access denied: {node_id}"
            ))),
            status if status >= 500 => Err(MailDriveAttachmentError::Unavailable(format!(
                "drive facade returned status {status} for node {node_id}"
            ))),
            status => Err(MailDriveAttachmentError::Validation(format!(
                "drive node validation failed with status {status}: {node_id}"
            ))),
        }
    }
}

impl MailDriveAttachmentPort for FacadeMailDriveAttachmentPort {
    fn validate_attachments<'a>(
        &'a self,
        _tenant_id: &'a str,
        _owner_user_id: &'a str,
        attachments: &'a [CreateMailAttachmentInput],
    ) -> MailDriveAttachmentFuture<'a> {
        Box::pin(async move {
            for attachment in attachments {
                validate_mail_attachment_fields(attachment)?;
                self.validate_node_exists(attachment.drive_node_id.trim())
                    .await?;
            }
            Ok(())
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn read_drive_facade_url_returns_none_when_unset() {
        let previous = std::env::var("SDKWORK_DRIVE_FACADE_URL").ok();
        unsafe {
            std::env::remove_var("SDKWORK_DRIVE_FACADE_URL");
        }
        assert!(read_drive_facade_url().is_none());
        if let Some(value) = previous {
            unsafe {
                std::env::set_var("SDKWORK_DRIVE_FACADE_URL", value);
            }
        }
    }
}
