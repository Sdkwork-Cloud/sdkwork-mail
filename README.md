# SDKWork Mail

`sdkwork-mail` is the standalone SDKWork Mail authority — a professional email application aligned with industry-grade clients (Gmail, Foxmail, Outlook).

It owns mailbox accounts, folders, threads, messages, attachments, labels, delivery/sync providers, and operator admin surfaces under the canonical `communication` domain with capability `mail`.

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

This workspace is wired to SDKWork platform frameworks (see `AGENTS.md`):

- **sdkwork-web-framework** — HTTP route crates, `WebRequestContext`, IAM web adapter, service router bootstrap
- **sdkwork-database** — `database/` lifecycle module, `db:*` scripts, SQLx repository bootstrap
- **sdkwork-utils** — `sdkwork-utils-rust` in service/plugins; `@sdkwork/utils` in PC/H5 commons packages
- **sdkwork-appbase** — IAM login/session for client surfaces
- **sdkwork-discovery** — intentionally **not** integrated (no RPC services yet)

## Project Structure

Standard SDKWork project-root dictionary (`SDKWORK_WORKSPACE_SPEC.md`):

```text
sdkwork-mail/
  apis/           # OpenAPI authorities under communication/
  apps/           # Runnable client roots (pc, h5, flutter, mini-program)
  crates/         # Rust service, repository, router, standalone-gateway crates
  database/       # sdkwork-database module (mail_ tables)
  sdks/           # SDK families and route manifests
  plugins/        # Mail transport/provider plugins
  tools/ scripts/ tests/ docs/ configs/ deployments/ jobs/ examples/
  .sdkwork/       # Local skills and plugins
```

Root-level `packages/` is **not** used. App packages live under `apps/<app-root>/packages/`.

## IM Boundary

- `sdkwork-im` may consume Mail SDKs for integrated messaging + mail UX.
- **`sdkwork-mail` must not depend on `sdkwork-im`.**

## Verification

```powershell
node --test tests/mail-workspace-standard.test.mjs
node ../sdkwork-specs/tools/check-database-framework-standard.mjs --root .
cargo check --workspace
pnpm run verify
```

## Development Status

The workspace skeleton, standards alignment, framework wiring, and client app surfaces are in place. Core domain APIs and database schema are being migrated from the initial contract skeleton toward full mail semantics (accounts, folders, threads, messages, attachments, IMAP/SMTP providers).

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

## Application Roots

- [apps directory index](apps/README.md)
