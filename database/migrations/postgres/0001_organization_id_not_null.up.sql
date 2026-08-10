-- sdkwork:migration
-- id: 0001_organization_id_not_null
-- engine: postgres
-- module: sdkwork-mail
-- purpose: Enforce organization_id NOT NULL DEFAULT on all tables in the
--   consolidated baseline. NULL rows (pre-standard data anomalies) are
--   backfilled with the platform sentinel before NOT NULL is set, and
--   NOT NULL columns without an explicit default receive the sentinel
--   default, keeping existing deployments consistent with fresh baseline
--   installs.
-- reversible: false
-- rollback: forward-fix (sentinel backfill is the canonical fix; NULL
--   organization rows are data anomalies)
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

UPDATE mail_account SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_account ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_account ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_folder SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_folder ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_folder ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_thread SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_thread ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_thread ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_message SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_message ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_message ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_message_recipient SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_message_recipient ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_message_recipient ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_attachment SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_attachment ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_attachment ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_label SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_label ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_label ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_provider_account SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_provider_account ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_provider_account ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_provider_credential SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_provider_credential ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_provider_credential ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_sync_state SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_sync_state ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_sync_state ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_outbox_event SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_outbox_event ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_outbox_event ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_audit_log SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_audit_log ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_audit_log ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_template SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_template ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_template ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_verification_challenge SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_verification_challenge ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_verification_challenge ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_transactional_delivery SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_transactional_delivery ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_transactional_delivery ALTER COLUMN organization_id SET NOT NULL;

UPDATE mail_marketing_consent SET organization_id = 0 WHERE organization_id IS NULL;
ALTER TABLE mail_marketing_consent ALTER COLUMN organization_id SET DEFAULT 0;
ALTER TABLE mail_marketing_consent ALTER COLUMN organization_id SET NOT NULL;

COMMIT;
