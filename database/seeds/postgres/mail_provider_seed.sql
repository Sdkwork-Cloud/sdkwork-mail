-- Default SMTP transport provider account for bootstrap tenant (tenant 0 / org 0).
-- Credential secret_ref resolves through env:SDKWORK_MAIL_SMTP_PASSWORD at runtime.

INSERT INTO mail_provider_account (
    id, uuid, tenant_id, organization_id, provider_kind, name, host, port, use_tls, status,
    created_at, updated_at, version
) VALUES (
    920001, 'smtp-default-bootstrap', 0, 0, 'smtp', 'Default SMTP', '127.0.0.1', 1025, FALSE, 1,
    NOW(), NOW(), 0
)
ON CONFLICT DO NOTHING;

INSERT INTO mail_provider_credential (
    id, uuid, tenant_id, organization_id, provider_account_id, username, secret_ref, status,
    created_at, updated_at, version
) VALUES (
    920002, 'smtp-default-bootstrap-cred', 0, 0, 'smtp-default-bootstrap',
    'noreply@sdkwork-mail.local', 'env:SDKWORK_MAIL_SMTP_PASSWORD', 1,
    NOW(), NOW(), 0
)
ON CONFLICT DO NOTHING;
