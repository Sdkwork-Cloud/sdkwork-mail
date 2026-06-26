use std::sync::Arc;

use sdkwork_communication_mail_service::{
    CreateMailProviderAccountRequest, CreateMailProviderAccountResult, MailPersistencePort,
    MailProviderAccount, MailProviderCredential, MailProviderPingResult, MailProviderSyncResult,
    MailSmtpTransportBinding, SyncMailProviderAccountRequest,
};
use sdkwork_mail_adapter_imap::{
    ImapMailSync, ImapTransportConfig, resolve_secret_ref as resolve_imap_secret,
};
use sdkwork_mail_adapter_smtp::{SmtpMailTransport, smtp_config_from_binding};
use sdkwork_routes_mail_backend_api::service::MailBackendApiError;

pub async fn sync_provider_account(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    owner_user_id: String,
    account_id: String,
    request: SyncMailProviderAccountRequest,
) -> Result<MailProviderSyncResult, MailBackendApiError> {
    crate::mailbox_sync::sync_provider_account(
        persistence,
        tenant_id,
        organization_id,
        owner_user_id,
        account_id,
        request,
    )
    .await
}

pub async fn create_provider_account(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    request: CreateMailProviderAccountRequest,
) -> Result<CreateMailProviderAccountResult, MailBackendApiError> {
    persistence
        .create_provider_account(&tenant_id, &organization_id, request)
        .await
        .map_err(map_backend_persistence_error)
}

pub async fn ping_provider_account(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    account_id: String,
) -> Result<MailProviderPingResult, MailBackendApiError> {
    let account = persistence
        .retrieve_provider_account(&tenant_id, &organization_id, &account_id)
        .await
        .map_err(map_backend_persistence_error)?;

    let credential = persistence
        .retrieve_active_provider_credential(&tenant_id, &organization_id, &account_id)
        .await
        .map_err(map_backend_persistence_error)?;

    match account.provider_kind.as_str() {
        "smtp" => ping_smtp_account(&account, &credential).await,
        "imap" => ping_imap_account(&account, &credential).await,
        provider_kind => Err(MailBackendApiError::BadRequest(format!(
            "unsupported provider kind for ping: {provider_kind}"
        ))),
    }
}

async fn ping_smtp_account(
    account: &MailProviderAccount,
    credential: &MailProviderCredential,
) -> Result<MailProviderPingResult, MailBackendApiError> {
    let binding = MailSmtpTransportBinding {
        provider_account_id: account.id.clone(),
        host: account.host.clone(),
        port: account.port,
        use_tls: account.use_tls,
        username: credential.username.clone(),
        secret_ref: credential.secret_ref.clone(),
        from_email: credential.username.clone(),
    };

    let config = smtp_config_from_binding(&binding).map_err(MailBackendApiError::BadRequest)?;
    let transport = SmtpMailTransport::new(config);
    match transport.verify_connection().await {
        Ok(()) => Ok(success_ping(account, "smtp connection verified")),
        Err(error) => Ok(failure_ping(account, error.to_string())),
    }
}

async fn ping_imap_account(
    account: &MailProviderAccount,
    credential: &MailProviderCredential,
) -> Result<MailProviderPingResult, MailBackendApiError> {
    let password = resolve_imap_secret(&credential.secret_ref).ok_or_else(|| {
        MailBackendApiError::BadRequest(
            "imap provider credential secret_ref could not be resolved".to_owned(),
        )
    })?;

    let sync = ImapMailSync::new(ImapTransportConfig {
        host: account.host.clone(),
        port: account.port,
        use_tls: account.use_tls,
        username: credential.username.clone(),
        password: Some(password),
        mailbox: "INBOX".to_owned(),
    });

    match sync.probe_mailbox().await {
        Ok(probe) => Ok(MailProviderPingResult {
            provider_kind: account.provider_kind.clone(),
            account_id: account.id.clone(),
            ok: true,
            message: format!(
                "imap mailbox {} contains {} messages (uid_validity={:?})",
                probe.mailbox, probe.exists, probe.uid_validity
            ),
        }),
        Err(error) => Ok(failure_ping(account, error.to_string())),
    }
}

fn success_ping(account: &MailProviderAccount, message: &str) -> MailProviderPingResult {
    MailProviderPingResult {
        provider_kind: account.provider_kind.clone(),
        account_id: account.id.clone(),
        ok: true,
        message: message.to_owned(),
    }
}

fn failure_ping(account: &MailProviderAccount, message: String) -> MailProviderPingResult {
    MailProviderPingResult {
        provider_kind: account.provider_kind.clone(),
        account_id: account.id.clone(),
        ok: false,
        message,
    }
}

fn map_backend_persistence_error(
    error: sdkwork_communication_mail_service::MailPersistenceError,
) -> MailBackendApiError {
    use sdkwork_communication_mail_service::MailPersistenceError;
    match error {
        MailPersistenceError::NotFound(message) => MailBackendApiError::NotFound(message),
        MailPersistenceError::Conflict(message) => MailBackendApiError::Conflict(message),
        MailPersistenceError::Unavailable(message) => MailBackendApiError::Unavailable(message),
    }
}
