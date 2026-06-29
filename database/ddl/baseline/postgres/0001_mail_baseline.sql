-- SDKWork Mail database baseline (communication/mail capability).
-- Tenant-isolated mailbox: accounts, folders, threads, messages, attachments, labels, transport providers.

CREATE TABLE IF NOT EXISTS mail_account (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    owner_user_id BIGINT NOT NULL,
    email_address VARCHAR(320) NOT NULL,
    display_name VARCHAR(200),
    provider_kind VARCHAR(32) NOT NULL DEFAULT 'internal',
    status INTEGER NOT NULL DEFAULT 1,
    sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_synced_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_account_uuid UNIQUE (uuid),
    CONSTRAINT uk_mail_account_tenant_email UNIQUE (tenant_id, organization_id, email_address)
);

CREATE INDEX IF NOT EXISTS idx_mail_account_tenant_owner_status
    ON mail_account (tenant_id, organization_id, owner_user_id, status, updated_at);

CREATE TABLE IF NOT EXISTS mail_folder (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    account_id VARCHAR(64) NOT NULL,
    folder_kind VARCHAR(32) NOT NULL,
    name VARCHAR(200) NOT NULL,
    parent_folder_id VARCHAR(64),
    unread_count INTEGER NOT NULL DEFAULT 0,
    total_count INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_folder_uuid UNIQUE (uuid),
    CONSTRAINT uk_mail_folder_account_kind_name UNIQUE (account_id, folder_kind, name)
);

CREATE INDEX IF NOT EXISTS idx_mail_folder_account_kind
    ON mail_folder (tenant_id, organization_id, account_id, folder_kind, sort_order);

CREATE TABLE IF NOT EXISTS mail_thread (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    account_id VARCHAR(64) NOT NULL,
    folder_id VARCHAR(64) NOT NULL,
    subject VARCHAR(998) NOT NULL,
    snippet VARCHAR(500),
    participant_summary VARCHAR(500),
    message_count INTEGER NOT NULL DEFAULT 0,
    unread_count INTEGER NOT NULL DEFAULT 0,
    is_starred BOOLEAN NOT NULL DEFAULT FALSE,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_thread_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_thread_folder_last_message
    ON mail_thread (tenant_id, organization_id, folder_id, last_message_at DESC);

CREATE TABLE IF NOT EXISTS mail_message (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    account_id VARCHAR(64) NOT NULL,
    folder_id VARCHAR(64) NOT NULL,
    thread_id VARCHAR(64) NOT NULL,
    message_id_header VARCHAR(998),
    in_reply_to VARCHAR(998),
    from_name VARCHAR(200),
    from_email VARCHAR(320) NOT NULL,
    subject VARCHAR(998) NOT NULL,
    snippet VARCHAR(500),
    body_text TEXT,
    body_html TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_starred BOOLEAN NOT NULL DEFAULT FALSE,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    has_attachments BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP,
    received_at TIMESTAMP,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_message_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_message_folder_received
    ON mail_message (tenant_id, organization_id, folder_id, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_mail_message_thread_received
    ON mail_message (tenant_id, organization_id, thread_id, received_at DESC);

CREATE TABLE IF NOT EXISTS mail_message_recipient (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    message_id VARCHAR(64) NOT NULL,
    recipient_kind VARCHAR(16) NOT NULL,
    name VARCHAR(200),
    email_address VARCHAR(320) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_message_recipient_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_message_recipient_message
    ON mail_message_recipient (message_id, recipient_kind);

CREATE TABLE IF NOT EXISTS mail_attachment (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    message_id VARCHAR(64) NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    content_type VARCHAR(200) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    drive_node_id VARCHAR(64),
    checksum_sha256 VARCHAR(128),
    inline_content_id VARCHAR(200),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_attachment_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_attachment_message
    ON mail_attachment (tenant_id, organization_id, message_id);

CREATE TABLE IF NOT EXISTS mail_label (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    account_id VARCHAR(64) NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(32),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_label_uuid UNIQUE (uuid),
    CONSTRAINT uk_mail_label_account_name UNIQUE (account_id, name)
);

CREATE TABLE IF NOT EXISTS mail_message_label (
    id BIGINT NOT NULL,
    message_id VARCHAR(64) NOT NULL,
    label_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_message_label_pair UNIQUE (message_id, label_id)
);

CREATE TABLE IF NOT EXISTS mail_provider_account (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    provider_kind VARCHAR(32) NOT NULL,
    name VARCHAR(200) NOT NULL,
    host VARCHAR(500) NOT NULL,
    port INTEGER NOT NULL,
    use_tls BOOLEAN NOT NULL DEFAULT TRUE,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_provider_account_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_provider_account_tenant_status
    ON mail_provider_account (tenant_id, organization_id, provider_kind, status);

CREATE TABLE IF NOT EXISTS mail_provider_credential (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    provider_account_id VARCHAR(64) NOT NULL,
    username VARCHAR(320) NOT NULL,
    secret_ref VARCHAR(500) NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_provider_credential_uuid UNIQUE (uuid)
);

CREATE TABLE IF NOT EXISTS mail_sync_state (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    account_id VARCHAR(64) NOT NULL,
    folder_id VARCHAR(64),
    provider_kind VARCHAR(32) NOT NULL,
    cursor_token VARCHAR(2000),
    last_synced_at TIMESTAMP,
    last_error VARCHAR(2000),
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_sync_state_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_sync_state_account_folder
    ON mail_sync_state (tenant_id, organization_id, account_id, folder_id);

CREATE TABLE IF NOT EXISTS mail_outbox_event (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    message_id VARCHAR(64) NOT NULL,
    event_kind VARCHAR(32) NOT NULL,
    status INTEGER NOT NULL DEFAULT 0,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_error VARCHAR(2000),
    scheduled_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_outbox_event_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_outbox_event_status_scheduled
    ON mail_outbox_event (tenant_id, organization_id, status, scheduled_at);

CREATE TABLE IF NOT EXISTS mail_audit_log (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    actor_user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    detail JSONB,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_audit_log_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_audit_log_tenant_created
    ON mail_audit_log (tenant_id, organization_id, created_at DESC);

-- Transactional / marketing mail: templates, verification challenges, delivery audit.

CREATE TABLE IF NOT EXISTS mail_template (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    template_key VARCHAR(64) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(32) NOT NULL DEFAULT 'transactional',
    purpose VARCHAR(64) NOT NULL,
    locale VARCHAR(16) NOT NULL DEFAULT 'zh-CN',
    subject_template VARCHAR(998) NOT NULL,
    body_html_template TEXT,
    body_text_template TEXT,
    variable_schema JSONB,
    status INTEGER NOT NULL DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_template_uuid UNIQUE (uuid),
    CONSTRAINT uk_mail_template_tenant_key_locale UNIQUE (tenant_id, organization_id, template_key, locale)
);

CREATE INDEX IF NOT EXISTS idx_mail_template_tenant_purpose
    ON mail_template (tenant_id, organization_id, purpose, status);

CREATE TABLE IF NOT EXISTS mail_verification_challenge (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    recipient_email VARCHAR(320) NOT NULL,
    purpose VARCHAR(64) NOT NULL,
    code_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    delivery_id VARCHAR(64),
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_verification_challenge_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_mail_verification_challenge_lookup
    ON mail_verification_challenge (tenant_id, organization_id, recipient_email, purpose, consumed_at, expires_at DESC);

CREATE TABLE IF NOT EXISTS mail_transactional_delivery (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    template_id VARCHAR(64),
    template_key VARCHAR(64) NOT NULL,
    business_kind VARCHAR(64) NOT NULL,
    recipient_email VARCHAR(320) NOT NULL,
    from_email VARCHAR(320),
    subject VARCHAR(998) NOT NULL,
    status INTEGER NOT NULL DEFAULT 0,
    provider_account_id VARCHAR(64),
    correlation_id VARCHAR(128),
    last_error VARCHAR(2000),
    sent_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_transactional_delivery_uuid UNIQUE (uuid)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_mail_transactional_delivery_correlation
    ON mail_transactional_delivery (tenant_id, organization_id, correlation_id)
    WHERE correlation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mail_transactional_delivery_tenant_created
    ON mail_transactional_delivery (tenant_id, organization_id, business_kind, created_at DESC);

CREATE TABLE IF NOT EXISTS mail_marketing_consent (
    id BIGINT NOT NULL,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL DEFAULT 0,
    recipient_email VARCHAR(320) NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    consent_source VARCHAR(64) NOT NULL DEFAULT 'admin',
    granted_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_mail_marketing_consent_uuid UNIQUE (uuid),
    CONSTRAINT uk_mail_marketing_consent_recipient UNIQUE (tenant_id, organization_id, recipient_email)
);

CREATE INDEX IF NOT EXISTS idx_mail_marketing_consent_lookup
    ON mail_marketing_consent (tenant_id, organization_id, recipient_email, status);
