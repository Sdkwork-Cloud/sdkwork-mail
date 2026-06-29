# SDKWork Mail

`sdkwork-mail` is the standalone SDKWork Mail authority — a professional email application aligned with industry-grade clients (Gmail, Foxmail, Outlook).

It owns mailbox accounts, folders, threads, messages, Drive-backed attachments, labels, delivery/sync providers, and operator admin surfaces under the canonical `communication` domain with capability `mail`.

## Owned Surfaces

| Surface | Path / prefix |
| --- | --- |
| App API | `/app/v3/api/mail/*` — user mailbox, compose, read, search |
| Backend API | `/backend/v3/api/mail/*` — operator admin, provider accounts, audit |
| App SDK | `sdks/sdkwork-mail-app-sdk` |
| Backend SDK | `sdks/sdkwork-mail-backend-sdk` |
| Provider SDK | `sdks/sdkwork-mail-sdk` |
| Database tables | `mail_*` prefix via `database/` module |
| PC client | `apps/sdkwork-mail-pc` |
| H5 client | `apps/sdkwork-mail-h5` |
| Flutter mobile | `apps/sdkwork-mail-flutter-mobile` |
| Mini program | `apps/sdkwork-mail-mini-program` |

## Framework Integration

| Framework | Status |
| --- | --- |
| **sdkwork-web-framework** | Route crates use `WebRequestContext`, IAM adapter, and `SdkWorkApiResponse` / `ProblemDetail` mapping |
| **sdkwork-database** | `database/` lifecycle module, `db:*` scripts, SQLx repository bootstrap |
| **sdkwork-utils** | `sdkwork-utils-rust` in service/plugins/route-common; `@sdkwork/utils` in PC/H5 commons |
| **sdkwork-appbase** | IAM login/session for client surfaces |
| **sdkwork-drive** | Attachments reference `driveNodeId` from `sdkwork-drive-app-sdk`; server validates via `MailDriveAttachmentPort` |
| **sdkwork-discovery** | Deferred until RPC services are introduced |

## Attachment Upload Flow

1. Client uploads files through **`sdkwork-drive-app-sdk`** (Drive Uploader) and receives a `driveNodeId`.
2. Client creates or sends mail with `attachments[]` containing `driveNodeId`, file metadata, and optional checksum.
3. Mail API validates attachment references through `MailDriveAttachmentPort` and persists `mail_attachment.drive_node_id`.

Direct multipart upload to Mail APIs is not supported.

## Project Structure

```text
sdkwork-mail/
  apis/           # OpenAPI authorities under communication/
  apps/           # Runnable client roots (pc, h5, flutter, mini-program)
  crates/         # Rust service, repository, router, standalone-gateway crates
  database/       # sdkwork-database module (mail_ tables)
  sdks/           # SDK families and route manifests
  plugins/        # Mail transport/provider plugins
  tools/ scripts/ tests/ docs/ configs/ deployments/
  .sdkwork/       # Local skills and plugins
```

Root-level `packages/` is **not** used. App packages live under `apps/<app-root>/packages/`.

## IM Boundary

- `sdkwork-im` may consume Mail SDKs for integrated messaging + mail UX.
- **`sdkwork-mail` must not depend on `sdkwork-im`.**

## Verification

```powershell
pnpm install
node --test tests/mail-workspace-standard.test.mjs
node ../sdkwork-specs/tools/check-database-framework-standard.mjs --root .
pnpm run api:materialize
node ../sdkwork-specs/tools/check-api-response-envelope.mjs --workspace .
cargo check --workspace
pnpm run verify
```

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

## Application Roots

- [apps directory index](apps/README.md)
