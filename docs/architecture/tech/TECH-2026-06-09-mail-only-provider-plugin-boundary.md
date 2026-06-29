# TECH: Mail-Only Provider Plugin Boundary

Status: active (implemented)  
Owner: SDKWork Mail maintainers  
Updated: 2026-06-29

## Goal

Make `sdkwork-mail` a **mailbox and mail-transport** authority. Provider plugins cover SMTP/IMAP (and future mail transport SPIs). Mail must not own RTC, media rooms, call signaling, or recording artifacts.

## Architecture

The Rust core and HTTP APIs expose mailbox resources only:

- Accounts, folders, threads, messages, labels, attachments metadata
- Provider accounts, sync, webhook ingress
- Templates, transactional deliveries, marketing consents
- Verification and transactional send on the app surface

Provider integrations are **metadata + SPI/plugin packages** under `plugins/mail-*`. Runtime vendor SDKs load only when an application installs the corresponding plugin package.

Attachment binaries are **not** stored in `mail_*` tables. Clients upload via `sdkwork-drive-app-sdk`; Mail validates `driveNodeId` references through `MailDriveAttachmentPort`.

## Implemented Boundaries

| Area | Rule | Status |
|------|------|--------|
| No IM/RTC APIs in Mail OpenAPI | No media-room, call, or recording routes | Enforced |
| No `sdkwork-im` dependency | Mail Cargo/TS manifests | Enforced |
| Provider plugins | `plugins/mail-smtp`, `plugins/mail-imap` only | Active |
| HTTP envelope | `SdkWorkApiResponse` / `ProblemDetail` | Enforced |
| Route manifests | Match Axum `routes.rs` paths | Synced |
| Drive attachments | Port + persistence on create message | Implemented |

## Tech Stack

Rust crates and SQL schemas, Node/OpenAPI materialization, generated TypeScript SDKs, `node:test`, `cargo test`, `pnpm`.

## Verification

```powershell
pnpm run test:contract:migration
pnpm run test:workspace-standard
pnpm run verify
```

## Related

- [../../mail-im-boundary.md](../../mail-im-boundary.md)
- [TECH-mail-im-boundary.md](TECH-mail-im-boundary.md)
- `plugins/README.md`
