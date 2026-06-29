# Plan: Mail-Only Provider Plugin Boundary

Status: **completed** — see [TECH-2026-06-09-mail-only-provider-plugin-boundary.md](../../architecture/tech/TECH-2026-06-09-mail-only-provider-plugin-boundary.md) for the active architecture record.

Historical note: an earlier draft incorrectly referenced media rooms and recording artifacts from an IM-era migration. That content has been removed. Mail owns mailbox + transport provider plugins only.

## Outcome

- Mail HTTP APIs and SDKs expose mailbox, provider control-plane, and transactional mail operations
- SMTP/IMAP plugins live under `plugins/mail-*`
- Attachments reference Drive nodes; no binary storage in Mail
- No RTC/signaling ownership in this repository

## Verification

```powershell
pnpm run test:contract:migration
pnpm run verify
```
