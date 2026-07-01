# SDKWork Mail Agent Guide

This repository is the SDKWork Mail authority workspace — a standalone email application aligned with industry-grade clients (Gmail, Foxmail, Outlook).

## Canonical Standards

- Workspace rules: `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- Agent execution: `../sdkwork-specs/SOUL.md`
- Standards entrypoint: `../sdkwork-specs/README.md`

## Architecture

- **Domain:** `communication` (canonical SDKWork domain for inboxes, messages, threads)
- **Capability:** `mail`
- **Database prefix:** `mail_`
- **HTTP surfaces:** `/app/v3/api/mail/*`, `/backend/v3/api/mail/*`
- **No RPC / discovery:** This workspace has no gRPC services; `sdkwork-discovery` is deferred until RPC is introduced.

## Framework Integration (Required)

| Framework | Usage |
| --- | --- |
| `sdkwork-web-framework` | All HTTP route crates (`sdkwork-routes-mail-*-api`) via `web_bootstrap.rs`, `WebRequestContext`, IAM adapter |
| `sdkwork-database` | Application-root `database/` module, lifecycle CLI (`db:*` scripts), repository bootstrap |
| `sdkwork-utils` | Rust: `sdkwork-utils-rust` in service/plugins/route-common; TypeScript: `@sdkwork/utils` via PC/H5/mini-program cores |
| `sdkwork-appbase` | IAM login/session, generated appbase SDKs for PC/H5 clients |
| `sdkwork-drive` | Drive-backed attachments via `sdkwork-drive-app-sdk` (`driveNodeId`) and `MailDriveAttachmentPort` server validation |
| `sdkwork-discovery` | intentionally **not** integrated (no RPC services yet) |

## Required Reading By Task

- API work: `../sdkwork-specs/API_SPEC.md`, `../sdkwork-specs/WEB_FRAMEWORK_SPEC.md`
- SDK work: `../sdkwork-specs/SDK_SPEC.md`, `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`
- Database work: `../sdkwork-specs/DATABASE_SPEC.md`, `../sdkwork-specs/DATABASE_FRAMEWORK_SPEC.md`
- Rust backend: `../sdkwork-specs/RUST_CODE_SPEC.md`, `../sdkwork-specs/WEB_BACKEND_SPEC.md`
- PC/H5 UI: `../sdkwork-specs/APP_PC_ARCHITECTURE_SPEC.md`, `../sdkwork-specs/APP_H5_ARCHITECTURE_SPEC.md`
- IAM/security: `../sdkwork-specs/IAM_SPEC.md`, `../sdkwork-specs/SECURITY_SPEC.md`
- Deployment/packaging: `../sdkwork-specs/DEPLOYMENT_SPEC.md`, `../sdkwork-specs/GITHUB_WORKFLOW_SPEC.md`

## Local Boundaries

- Mail-owned tables use the `mail_` prefix.
- API authorities live under `apis/app-api/communication/` and `apis/backend-api/communication/`.
- SDK families live under `sdks/` and must remain owner-only.
- Rust service, repository, route, and host crates live under `crates/`.
- Runnable client surfaces live under `apps/` (`sdkwork-mail-pc`, `sdkwork-mail-h5`, etc.).
- Root-level `packages/` is not allowed; app packages belong under `apps/<app-root>/packages/`.

## IM Boundary

- `sdkwork-im` may embed or depend on Mail SDKs for integrated messaging + mail UX.
- This repository must **not** depend on `sdkwork-im` or duplicate IM signaling APIs.

## Verification

```powershell
pnpm install
pnpm run verify
```

`pnpm run verify` is the canonical gate for sdkwork-specs alignment in this repository.

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

