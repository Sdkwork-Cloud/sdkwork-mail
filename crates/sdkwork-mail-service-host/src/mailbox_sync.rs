use std::sync::Arc;

use sdkwork_communication_mail_service::{
    EnsureMailAccountRequest, IngestInboundMailMessageRequest, MailFolderKind,
    MailMailboxSyncParams, MailPersistencePort, MailProviderAccount, MailProviderCredential,
    MailProviderSyncResult, SyncMailProviderAccountRequest,
};
use sdkwork_mail_adapter_imap::{
    ImapMailSync, ImapTransportConfig, resolve_secret_ref as resolve_imap_secret,
};
use sdkwork_routes_mail_backend_api::service::MailBackendApiError;
use serde::{Deserialize, Serialize};
use serde_json::json;

const DEFAULT_SYNC_LIMIT: u32 = 50;

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ImapSyncCursor {
    uid_validity: Option<u32>,
    last_uid: u32,
}

pub async fn sync_provider_account(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    owner_user_id: String,
    provider_account_id: String,
    request: SyncMailProviderAccountRequest,
) -> Result<MailProviderSyncResult, MailBackendApiError> {
    let account = persistence
        .retrieve_provider_account(&tenant_id, &organization_id, &provider_account_id)
        .await
        .map_err(map_backend_persistence_error)?;

    if account.provider_kind != "imap" {
        return Err(MailBackendApiError::BadRequest(
            "provider sync is only supported for imap accounts".to_owned(),
        ));
    }

    let credential = persistence
        .retrieve_active_provider_credential(&tenant_id, &organization_id, &provider_account_id)
        .await
        .map_err(map_backend_persistence_error)?;

    sync_imap_account(
        persistence,
        tenant_id,
        organization_id,
        owner_user_id,
        account,
        credential,
        request,
    )
    .await
}

async fn sync_imap_account(
    persistence: Arc<dyn MailPersistencePort>,
    tenant_id: String,
    organization_id: String,
    owner_user_id: String,
    account: MailProviderAccount,
    credential: MailProviderCredential,
    request: SyncMailProviderAccountRequest,
) -> Result<MailProviderSyncResult, MailBackendApiError> {
    let password = resolve_imap_secret(&credential.secret_ref).ok_or_else(|| {
        MailBackendApiError::BadRequest(
            "imap provider credential secret_ref could not be resolved".to_owned(),
        )
    })?;

    let mailbox = request
        .mailbox
        .clone()
        .unwrap_or_else(|| "INBOX".to_owned());
    let sync = ImapMailSync::new(ImapTransportConfig {
        host: account.host.clone(),
        port: account.port,
        use_tls: account.use_tls,
        username: credential.username.clone(),
        password: Some(password),
        mailbox: mailbox.clone(),
    });

    let mail_account = persistence
        .ensure_mail_account(
            &tenant_id,
            &organization_id,
            EnsureMailAccountRequest {
                owner_user_id: owner_user_id.clone(),
                email_address: credential.username.clone(),
                display_name: Some(account.name.clone()),
                provider_kind: "imap".to_owned(),
                provider_account_id: account.id.clone(),
            },
        )
        .await
        .map_err(map_backend_persistence_error)?;

    let inbox_folder = persistence
        .ensure_system_folder(
            &tenant_id,
            &organization_id,
            &mail_account.id,
            MailFolderKind::Inbox,
            &mailbox,
        )
        .await
        .map_err(map_backend_persistence_error)?;

    let sync_state = persistence
        .retrieve_sync_state(
            &tenant_id,
            &organization_id,
            &mail_account.id,
            &inbox_folder.id,
            "imap",
        )
        .await
        .map_err(map_backend_persistence_error)?;

    let mut since_uid = request.since_uid.unwrap_or(0);
    let mut stored_uid_validity = None;
    if since_uid == 0 {
        if let Some(state) = sync_state
            .as_ref()
            .and_then(|value| value.cursor_token.as_ref())
        {
            if let Ok(cursor) = serde_json::from_str::<ImapSyncCursor>(state) {
                since_uid = cursor.last_uid;
                stored_uid_validity = cursor.uid_validity;
            }
        }
    }

    let limit = request.limit.unwrap_or(DEFAULT_SYNC_LIMIT);

    let probe = sync
        .probe_mailbox()
        .await
        .map_err(|error| MailBackendApiError::Unavailable(error.to_string()))?;
    if let (Some(stored), Some(current)) = (stored_uid_validity, probe.uid_validity) {
        if stored != current {
            since_uid = 0;
        }
    }

    let fetch_result = sync
        .sync_mailbox(MailMailboxSyncParams {
            since_uid,
            limit,
            mailbox: Some(mailbox.clone()),
        })
        .await
        .map_err(|error| MailBackendApiError::Unavailable(error.to_string()))?;

    let mut ingested_count = 0u32;
    for message in &fetch_result.fetched {
        let metadata = json!({
            "imap": {
                "uid": message.uid,
                "uidValidity": fetch_result.uid_validity,
                "mailbox": fetch_result.mailbox,
                "providerAccountId": account.id,
                "messageIdHeader": message.message_id_header,
            }
        });
        let snippet = message.subject.chars().take(200).collect::<String>();
        let ingest_result = persistence
            .ingest_inbound_message(
                &tenant_id,
                &organization_id,
                IngestInboundMailMessageRequest {
                    account_id: mail_account.id.clone(),
                    folder_id: inbox_folder.id.clone(),
                    from_name: message.from_name.clone(),
                    from_email: message.from_email.clone(),
                    subject: message.subject.clone(),
                    snippet: Some(snippet),
                    body_text: None,
                    received_at: message.received_at.clone(),
                    metadata,
                    imap_uid: message.uid,
                    imap_uid_validity: fetch_result.uid_validity,
                },
            )
            .await
            .map_err(map_backend_persistence_error)?;
        if ingest_result.is_some() {
            ingested_count += 1;
        }
    }

    let cursor = serde_json::to_string(&ImapSyncCursor {
        uid_validity: fetch_result.uid_validity,
        last_uid: fetch_result.highest_uid.unwrap_or(since_uid),
    })
    .map_err(|error| MailBackendApiError::Internal(error.to_string()))?;

    persistence
        .upsert_sync_state(
            &tenant_id,
            &organization_id,
            &mail_account.id,
            &inbox_folder.id,
            "imap",
            Some(cursor.as_str()),
            None,
        )
        .await
        .map_err(map_backend_persistence_error)?;

    let synced_at = sdkwork_communication_mail_service::utc_now_rfc3339_millis();
    persistence
        .touch_mail_account_synced_at(&tenant_id, &organization_id, &mail_account.id, &synced_at)
        .await
        .map_err(map_backend_persistence_error)?;

    Ok(MailProviderSyncResult {
        provider_kind: account.provider_kind,
        provider_account_id: account.id,
        mail_account_id: mail_account.id,
        folder_id: inbox_folder.id,
        synced_count: ingested_count,
        highest_uid: fetch_result.highest_uid,
        uid_validity: fetch_result.uid_validity,
        message: format!(
            "imap sync completed: fetched {} messages, ingested {} new messages into {}",
            fetch_result.synced_count, ingested_count, fetch_result.mailbox
        ),
    })
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
