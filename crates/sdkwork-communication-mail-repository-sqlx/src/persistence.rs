use sdkwork_communication_mail_service::{
    CreateMailMessageRequest, MailAccount, MailAccountStatus, MailAttachment, MailFolder,
    MailFolderKind, MailMessage, MailMessageRecipient, MailPersistenceError, MailPersistenceFuture,
    MailPersistencePort, MailPersistenceResult, MailProviderAccount, MailProviderAccountStatus,
    MailRecipientKind, MailThread, UpdateMailMessageRequest, utc_now_rfc3339_millis,
};
use sdkwork_utils_rust::{is_blank, sha256_hash};
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Clone)]
pub struct MailPostgresPersistencePort {
    pool: PgPool,
}

impl MailPostgresPersistencePort {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl MailPersistencePort for MailPostgresPersistencePort {
    fn list_accounts<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        owner_user_id: &'a str,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, Vec<MailAccount>> {
        Box::pin(async move {
            let rows = sqlx::query_as::<_, AccountRow>(
                r#"
                SELECT uuid, tenant_id, organization_id, owner_user_id, email_address, display_name,
                       provider_kind, status, sync_enabled, last_synced_at
                FROM mail_account
                WHERE tenant_id = $1::bigint
                  AND organization_id = $2::bigint
                  AND owner_user_id = $3::bigint
                  AND deleted_at IS NULL
                ORDER BY updated_at DESC
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(parse_id(owner_user_id))
            .fetch_all(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            Ok(rows.into_iter().map(AccountRow::into_account).collect())
        })
    }

    fn list_folders<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        account_id: &'a str,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, Vec<MailFolder>> {
        Box::pin(async move {
            let rows = sqlx::query_as::<_, FolderRow>(
                r#"
                SELECT uuid, account_id, folder_kind, name, parent_folder_id, unread_count, total_count, sort_order
                FROM mail_folder
                WHERE tenant_id = $1::bigint
                  AND organization_id = $2::bigint
                  AND account_id = $3
                  AND deleted_at IS NULL
                ORDER BY sort_order ASC, name ASC
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(account_id)
            .fetch_all(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            Ok(rows.into_iter().map(FolderRow::into_folder).collect())
        })
    }

    fn list_threads<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        folder_id: &'a str,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, Vec<MailThread>> {
        Box::pin(async move {
            let rows = sqlx::query_as::<_, ThreadRow>(
                r#"
                SELECT uuid, account_id, folder_id, subject, snippet, participant_summary,
                       message_count, unread_count, is_starred, last_message_at
                FROM mail_thread
                WHERE tenant_id = $1::bigint
                  AND organization_id = $2::bigint
                  AND folder_id = $3
                  AND deleted_at IS NULL
                ORDER BY last_message_at DESC NULLS LAST
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(folder_id)
            .fetch_all(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            Ok(rows.into_iter().map(ThreadRow::into_thread).collect())
        })
    }

    fn list_messages<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        folder_id: &'a str,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, Vec<MailMessage>> {
        Box::pin(async move {
            let rows = sqlx::query_as::<_, MessageRow>(
                r#"
                SELECT uuid, account_id, folder_id, thread_id, from_name, from_email, subject, snippet,
                       body_text, body_html, is_read, is_starred, is_draft, has_attachments,
                       sent_at, received_at, size_bytes, metadata
                FROM mail_message
                WHERE tenant_id = $1::bigint
                  AND organization_id = $2::bigint
                  AND folder_id = $3
                  AND deleted_at IS NULL
                ORDER BY received_at DESC NULLS LAST, created_at DESC
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(folder_id)
            .fetch_all(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            let mut messages = Vec::with_capacity(rows.len());
            for row in rows {
                messages.push(row.into_message(Vec::new(), Vec::new()));
            }
            Ok(messages)
        })
    }

    fn retrieve_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        message_id: &'a str,
    ) -> MailPersistenceFuture<'a, MailMessage> {
        Box::pin(async move {
            let row = sqlx::query_as::<_, MessageRow>(
                r#"
                SELECT uuid, account_id, folder_id, thread_id, from_name, from_email, subject, snippet,
                       body_text, body_html, is_read, is_starred, is_draft, has_attachments,
                       sent_at, received_at, size_bytes, metadata
                FROM mail_message
                WHERE tenant_id = $1::bigint
                  AND organization_id = $2::bigint
                  AND uuid = $3
                  AND deleted_at IS NULL
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(message_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(map_sqlx_error)?
            .ok_or_else(|| MailPersistenceError::NotFound(format!("message not found: {message_id}")))?;

            let recipients = load_recipients(&self.pool, message_id).await?;
            let attachments =
                load_attachments(&self.pool, tenant_id, organization_id, message_id).await?;
            Ok(row.into_message(recipients, attachments))
        })
    }

    fn create_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        owner_user_id: &'a str,
        request: CreateMailMessageRequest,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, MailMessage> {
        Box::pin(async move {
            if is_blank(Some(request.subject.as_str())) {
                return Err(MailPersistenceError::Conflict(
                    "subject is required".to_owned(),
                ));
            }

            let message_id = Uuid::new_v4().to_string();
            let thread_id = request
                .thread_id
                .clone()
                .unwrap_or_else(|| Uuid::new_v4().to_string());
            let folder_id = request
                .folder_id
                .clone()
                .unwrap_or_else(|| format!("folder-drafts-{owner_user_id}"));
            let now = utc_now_rfc3339_millis();
            let snippet = request
                .body_text
                .as_deref()
                .or(request.body_html.as_deref())
                .map(|body| body.chars().take(200).collect::<String>());
            let size_bytes = request
                .body_text
                .as_deref()
                .map(|value| value.len() as u64)
                .unwrap_or(0);

            sqlx::query(
                r#"
                INSERT INTO mail_message (
                    id, uuid, tenant_id, organization_id, account_id, folder_id, thread_id,
                    from_email, subject, snippet, body_text, body_html, is_read, is_starred,
                    is_draft, has_attachments, sent_at, received_at, size_bytes, metadata,
                    created_at, updated_at, version
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, FALSE, FALSE,
                    $13, FALSE, $14, $15, $16, $17,
                    NOW(), NOW(), 0
                )
                "#,
            )
            .bind(next_id())
            .bind(&message_id)
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(&request.account_id)
            .bind(&folder_id)
            .bind(&thread_id)
            .bind(owner_user_id)
            .bind(&request.subject)
            .bind(&snippet)
            .bind(&request.body_text)
            .bind(&request.body_html)
            .bind(request.is_draft)
            .bind(if request.is_draft {
                None::<String>
            } else {
                Some(now.clone())
            })
            .bind(Some(now.clone()))
            .bind(size_bytes as i64)
            .bind(&request.metadata)
            .execute(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            for recipient in request.to.into_iter().chain(request.cc).chain(request.bcc) {
                insert_recipient(
                    &self.pool,
                    tenant_id,
                    organization_id,
                    &message_id,
                    recipient,
                )
                .await?;
            }

            MailPostgresPersistencePort::new(self.pool.clone())
                .retrieve_message(tenant_id, organization_id, &message_id)
                .await
        })
    }

    fn update_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        message_id: &'a str,
        request: UpdateMailMessageRequest,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, MailMessage> {
        Box::pin(async move {
            let existing = MailPostgresPersistencePort::new(self.pool.clone())
                .retrieve_message(tenant_id, organization_id, message_id)
                .await?;

            let is_read = request.is_read.unwrap_or(existing.is_read);
            let is_starred = request.is_starred.unwrap_or(existing.is_starred);
            let is_draft = request.is_draft.unwrap_or(existing.is_draft);
            let folder_id = request.folder_id.unwrap_or(existing.folder_id);

            sqlx::query(
                r#"
                UPDATE mail_message
                SET is_read = $4, is_starred = $5, is_draft = $6, folder_id = $7, updated_at = NOW(), version = version + 1
                WHERE tenant_id = $1::bigint AND organization_id = $2::bigint AND uuid = $3 AND deleted_at IS NULL
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(message_id)
            .bind(is_read)
            .bind(is_starred)
            .bind(is_draft)
            .bind(&folder_id)
            .execute(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            MailPostgresPersistencePort::new(self.pool.clone())
                .retrieve_message(tenant_id, organization_id, message_id)
                .await
        })
    }

    fn delete_message<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
        message_id: &'a str,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, ()> {
        Box::pin(async move {
            let result = sqlx::query(
                r#"
                UPDATE mail_message
                SET deleted_at = NOW(), updated_at = NOW(), version = version + 1
                WHERE tenant_id = $1::bigint AND organization_id = $2::bigint AND uuid = $3 AND deleted_at IS NULL
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .bind(message_id)
            .execute(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            if result.rows_affected() == 0 {
                return Err(MailPersistenceError::NotFound(format!(
                    "message not found: {message_id}"
                )));
            }
            Ok(())
        })
    }

    fn list_provider_accounts<'a>(
        &'a self,
        tenant_id: &'a str,
        organization_id: &'a str,
    ) -> sdkwork_communication_mail_service::MailPersistenceFuture<'a, Vec<MailProviderAccount>>
    {
        Box::pin(async move {
            let rows = sqlx::query_as::<_, ProviderAccountRow>(
                r#"
                SELECT uuid, tenant_id, organization_id, provider_kind, name, host, port, use_tls, status
                FROM mail_provider_account
                WHERE tenant_id = $1::bigint AND organization_id = $2::bigint AND deleted_at IS NULL
                ORDER BY updated_at DESC
                "#,
            )
            .bind(parse_id(tenant_id))
            .bind(parse_id(organization_id))
            .fetch_all(&self.pool)
            .await
            .map_err(map_sqlx_error)?;

            Ok(rows
                .into_iter()
                .map(ProviderAccountRow::into_provider_account)
                .collect())
        })
    }
}

fn map_sqlx_error(error: sqlx::Error) -> MailPersistenceError {
    MailPersistenceError::Unavailable(error.to_string())
}

fn parse_id(value: &str) -> i64 {
    if let Ok(parsed) = value.parse::<i64>() {
        return parsed;
    }
    let digest = sha256_hash(value.as_bytes());
    i64::from_be_bytes(digest.as_bytes()[..8].try_into().unwrap_or([0; 8]))
}

fn next_id() -> i64 {
    Uuid::new_v4().as_u128() as i64
}

async fn load_recipients(
    pool: &PgPool,
    message_id: &str,
) -> MailPersistenceResult<Vec<MailMessageRecipient>> {
    let rows = sqlx::query_as::<_, RecipientRow>(
        r#"
        SELECT recipient_kind, name, email_address
        FROM mail_message_recipient
        WHERE message_id = $1
        ORDER BY id ASC
        "#,
    )
    .bind(message_id)
    .fetch_all(pool)
    .await
    .map_err(map_sqlx_error)?;

    Ok(rows.into_iter().map(RecipientRow::into_recipient).collect())
}

async fn load_attachments(
    pool: &PgPool,
    tenant_id: &str,
    organization_id: &str,
    message_id: &str,
) -> MailPersistenceResult<Vec<MailAttachment>> {
    let rows = sqlx::query_as::<_, AttachmentRow>(
        r#"
        SELECT uuid, message_id, file_name, content_type, size_bytes, drive_node_id, checksum_sha256
        FROM mail_attachment
        WHERE tenant_id = $1::bigint AND organization_id = $2::bigint AND message_id = $3 AND deleted_at IS NULL
        "#,
    )
    .bind(parse_id(tenant_id))
    .bind(parse_id(organization_id))
    .bind(message_id)
    .fetch_all(pool)
    .await
    .map_err(map_sqlx_error)?;

    Ok(rows
        .into_iter()
        .map(AttachmentRow::into_attachment)
        .collect())
}

async fn insert_recipient(
    pool: &PgPool,
    tenant_id: &str,
    organization_id: &str,
    message_id: &str,
    recipient: MailMessageRecipient,
) -> MailPersistenceResult<()> {
    sqlx::query(
        r#"
        INSERT INTO mail_message_recipient (
            id, uuid, tenant_id, organization_id, message_id, recipient_kind, name, email_address, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        "#,
    )
    .bind(next_id())
    .bind(Uuid::new_v4().to_string())
    .bind(parse_id(tenant_id))
    .bind(parse_id(organization_id))
    .bind(message_id)
    .bind(recipient_kind_code(recipient.recipient_kind))
    .bind(recipient.name)
    .bind(recipient.email_address)
    .execute(pool)
    .await
    .map_err(map_sqlx_error)?;
    Ok(())
}

fn recipient_kind_code(kind: MailRecipientKind) -> &'static str {
    match kind {
        MailRecipientKind::To => "to",
        MailRecipientKind::Cc => "cc",
        MailRecipientKind::Bcc => "bcc",
    }
}

#[derive(sqlx::FromRow)]
struct AccountRow {
    uuid: String,
    tenant_id: i64,
    organization_id: i64,
    owner_user_id: i64,
    email_address: String,
    display_name: Option<String>,
    provider_kind: String,
    status: i32,
    sync_enabled: bool,
    last_synced_at: Option<chrono::NaiveDateTime>,
}

impl AccountRow {
    fn into_account(self) -> MailAccount {
        MailAccount {
            id: self.uuid,
            tenant_id: self.tenant_id.to_string(),
            organization_id: self.organization_id.to_string(),
            owner_user_id: self.owner_user_id.to_string(),
            email_address: self.email_address,
            display_name: self.display_name,
            provider_kind: self.provider_kind,
            status: if self.status == 1 {
                MailAccountStatus::Active
            } else {
                MailAccountStatus::Disabled
            },
            sync_enabled: self.sync_enabled,
            last_synced_at: self.last_synced_at.map(|value| value.to_string()),
        }
    }
}

#[derive(sqlx::FromRow)]
struct FolderRow {
    uuid: String,
    account_id: String,
    folder_kind: String,
    name: String,
    parent_folder_id: Option<String>,
    unread_count: i32,
    total_count: i32,
    sort_order: i32,
}

impl FolderRow {
    fn into_folder(self) -> MailFolder {
        MailFolder {
            id: self.uuid,
            account_id: self.account_id,
            folder_kind: parse_folder_kind(self.folder_kind.as_str()),
            name: self.name,
            parent_folder_id: self.parent_folder_id,
            unread_count: self.unread_count.max(0) as u32,
            total_count: self.total_count.max(0) as u32,
            sort_order: self.sort_order,
        }
    }
}

fn parse_folder_kind(value: &str) -> MailFolderKind {
    match value {
        "sent" => MailFolderKind::Sent,
        "drafts" => MailFolderKind::Drafts,
        "trash" => MailFolderKind::Trash,
        "archive" => MailFolderKind::Archive,
        "spam" => MailFolderKind::Spam,
        "custom" => MailFolderKind::Custom,
        _ => MailFolderKind::Inbox,
    }
}

#[derive(sqlx::FromRow)]
struct ThreadRow {
    uuid: String,
    account_id: String,
    folder_id: String,
    subject: String,
    snippet: Option<String>,
    participant_summary: Option<String>,
    message_count: i32,
    unread_count: i32,
    is_starred: bool,
    last_message_at: Option<chrono::NaiveDateTime>,
}

impl ThreadRow {
    fn into_thread(self) -> MailThread {
        MailThread {
            id: self.uuid,
            account_id: self.account_id,
            folder_id: self.folder_id,
            subject: self.subject,
            snippet: self.snippet,
            participant_summary: self.participant_summary,
            message_count: self.message_count.max(0) as u32,
            unread_count: self.unread_count.max(0) as u32,
            is_starred: self.is_starred,
            last_message_at: self.last_message_at.map(|value| value.to_string()),
        }
    }
}

#[derive(sqlx::FromRow)]
struct MessageRow {
    uuid: String,
    account_id: String,
    folder_id: String,
    thread_id: String,
    from_name: Option<String>,
    from_email: String,
    subject: String,
    snippet: Option<String>,
    body_text: Option<String>,
    body_html: Option<String>,
    is_read: bool,
    is_starred: bool,
    is_draft: bool,
    has_attachments: bool,
    sent_at: Option<chrono::NaiveDateTime>,
    received_at: Option<chrono::NaiveDateTime>,
    size_bytes: i64,
    metadata: serde_json::Value,
}

impl MessageRow {
    fn into_message(
        self,
        recipients: Vec<MailMessageRecipient>,
        attachments: Vec<MailAttachment>,
    ) -> MailMessage {
        MailMessage {
            id: self.uuid,
            account_id: self.account_id,
            folder_id: self.folder_id,
            thread_id: self.thread_id,
            from_name: self.from_name,
            from_email: self.from_email,
            subject: self.subject,
            snippet: self.snippet,
            body_text: self.body_text,
            body_html: self.body_html,
            is_read: self.is_read,
            is_starred: self.is_starred,
            is_draft: self.is_draft,
            has_attachments: self.has_attachments,
            sent_at: self.sent_at.map(|value| value.to_string()),
            received_at: self.received_at.map(|value| value.to_string()),
            size_bytes: self.size_bytes.max(0) as u64,
            recipients,
            attachments,
            metadata: if self.metadata.is_null() {
                json!({})
            } else {
                self.metadata
            },
        }
    }
}

#[derive(sqlx::FromRow)]
struct RecipientRow {
    recipient_kind: String,
    name: Option<String>,
    email_address: String,
}

impl RecipientRow {
    fn into_recipient(self) -> MailMessageRecipient {
        MailMessageRecipient {
            recipient_kind: match self.recipient_kind.as_str() {
                "cc" => MailRecipientKind::Cc,
                "bcc" => MailRecipientKind::Bcc,
                _ => MailRecipientKind::To,
            },
            name: self.name,
            email_address: self.email_address,
        }
    }
}

#[derive(sqlx::FromRow)]
struct AttachmentRow {
    uuid: String,
    message_id: String,
    file_name: String,
    content_type: String,
    size_bytes: i64,
    drive_node_id: Option<String>,
    checksum_sha256: Option<String>,
}

impl AttachmentRow {
    fn into_attachment(self) -> MailAttachment {
        MailAttachment {
            id: self.uuid,
            message_id: self.message_id,
            file_name: self.file_name,
            content_type: self.content_type,
            size_bytes: self.size_bytes.max(0) as u64,
            drive_node_id: self.drive_node_id,
            checksum_sha256: self.checksum_sha256,
        }
    }
}

#[derive(sqlx::FromRow)]
struct ProviderAccountRow {
    uuid: String,
    tenant_id: i64,
    organization_id: i64,
    provider_kind: String,
    name: String,
    host: String,
    port: i32,
    use_tls: bool,
    status: i32,
}

impl ProviderAccountRow {
    fn into_provider_account(self) -> MailProviderAccount {
        MailProviderAccount {
            id: self.uuid,
            tenant_id: self.tenant_id.to_string(),
            organization_id: self.organization_id.to_string(),
            provider_kind: self.provider_kind,
            name: self.name,
            host: self.host,
            port: self.port.max(0) as u16,
            use_tls: self.use_tls,
            status: if self.status == 1 {
                MailProviderAccountStatus::Active
            } else {
                MailProviderAccountStatus::Disabled
            },
        }
    }
}
