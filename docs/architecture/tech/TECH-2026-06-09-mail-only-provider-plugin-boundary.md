> Migrated from `docs/superpowers/plans/2026-06-09-mail-only-provider-plugin-boundary.md` on 2026-06-24.
> Owner: SDKWork maintainers

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `sdkwork-mail` a provider-neutral Mail media capability authority with no signaling ownership and no root SDK vendor coupling.

**Architecture:** The Rust core and backend API expose media rooms, mail inboxs, media participants, provider credentials, recording artifacts, quality samples, and provider control-plane resources only. Provider integrations are metadata and SPI/plugin packages; runtime vendor packages live in provider packages and are loaded only when an application installs them.

**Tech Stack:** Rust crates and SQL schemas, Node/OpenAPI materialization scripts, TypeScript SDK package, Flutter/Dart SDK scaffolds, `node:test`, `cargo test`, `pnpm`.

---

### Task 1: Boundary Tests

**Files:**
- Modify: `tests/Mail-migration-contract.test.mjs`
- Modify: `sdks/sdkwork-mail-sdk/sdkwork-mail-sdk-typescript/test/public-api-boundary.test.mjs`
- Modify: `sdks/sdkwork-mail-sdk/sdkwork-mail-sdk-typescript/test/official-provider-catalog.test.mjs`

- [ ] **Step 1: Add failing tests for Mail-only model names**

Assert that active Rust, SQL, OpenAPI, route manifests, and SDK root files do not contain `MailCallSession`, `MailCallParticipant`, `MailCallType`, `MailCallRecord`, `mail_call_*`, `mail_call_invitation`, `conversation_id`, `initiator_id`, `Invited`, or `ChatLog`.

- [ ] **Step 2: Add failing tests for plugin-only SDK roots**

Assert root TypeScript SDK does not export `./providers/*`, does not export `createBuiltinMailDriverManager`, and does not declare vendor dependencies such as `@volcengine/Mail`.

- [ ] **Step 3: Add failing tests for Flutter root package neutrality**

Assert root Flutter `pubspec.yaml` has no `volc_engine_Mail`, and `lib/mail_sdk.dart` does not export provider bridge files.

- [ ] **Step 4: Run narrow tests and confirm failures**

Run:

```powershell
node tests\Mail-migration-contract.test.mjs
pnpm --dir sdks/sdkwork-mail-sdk/sdkwork-mail-sdk-typescript test
```

Expected: failures identify the existing call/session/invitation and root provider exports.

### Task 2: Rust Core And Storage Cleanup

**Files:**
- Modify: `crates/sdkwork-communication-mail-service/src/lib.rs`
- Modify: `crates/sdkwork-mail-service-host/src/lib.rs`
- Modify: `crates/sdkwork-communication-mail-repository-sqlx/src/lib.rs`
- Modify: `crates/sdkwork-communication-mail-repository-sqlx/src/schema/postgres_Mail.sql`
- Modify: `crates/sdkwork-communication-mail-repository-sqlx/src/schema/sqlite_Mail.sql`

- [ ] **Step 1: Rename public Mail media models**

Rename call-shaped media contracts:

- `MailCallType` -> `MailMailInboxMode`
- `MailCallSessionStatus` -> `MailMailInboxStatus`
- `MailCallParticipant` -> `MailMediaParticipant`
- `MailCallSession` -> `MailMailInbox`
- `MailCallRecordKind` -> `MailRecordingArtifactKind`
- `MailCallRecordStatus` -> `MailRecordingArtifactStatus`
- `MailCallRecordArtifact` -> `MailMediaArtifact`
- `MailCallRecordList` -> `MailMediaArtifactList`

- [ ] **Step 2: Remove signaling lifecycle states**

Use media runtime states only: `Preparing`, `Active`, `Ended`, `Failed`, `Closing` for sessions and `Joining`, `Joined`, `Left`, `Kicked`, `Timeout` for participants. Remove `Invited`, `Ringing`, `Connecting`, `Terminated`, and `ChatLog`.

- [ ] **Step 3: Keep provider registry Mail-only**

Limit `ProviderDomain` to `Mail`, and remove object-storage, principal-profile, and IoT default plugins from the Mail registry.

- [ ] **Step 4: Rename database tables**

Use `mail_media_session`, `mail_media_participant`, and `mail_media_artifact`; remove `mail_call_invitation` entirely. Keep Drive references for media artifacts and avoid provider storage details.

- [ ] **Step 5: Run Rust-focused tests**

Run:

```powershell
cargo test -p sdkwork-communication-mail-service -p sdkwork-communication-mail-repository-sqlx -p sdkwork-mail-service-host
```

Expected: pass after implementation.

### Task 3: Backend API And OpenAPI Materialization

**Files:**
- Modify: `crates/sdkwork-router-mail-backend-api/src/lib.rs`
- Modify: `sdks/materialize-Mail-v3-openapi-boundaries.mjs`
- Regenerate: `sdks/_route-manifests/backend-api/sdkwork-router-mail-backend-api.route-manifest.json`
- Regenerate: `apis/backend-api/communication/sdkwork-mail-backend-api.openapi.json`
- Regenerate: `sdks/sdkwork-mail-backend-sdk/openapi/sdkwork-mail-backend-api.openapi.json`
- Regenerate: `sdks/sdkwork-mail-backend-sdk/openapi/sdkwork-mail-backend-api.sdkgen.json`
- Modify/regenerate: `sdks/sdkwork-mail-backend-sdk/specs/component.spec.json`

- [ ] **Step 1: Rename backend control routes**

Use `/backend/v3/api/Mail/mail-inboxs`, `/mail-inboxs/{MailInboxId}`, and `/mail-inboxs/{MailInboxId}/close`. Operation ids become `Mail.MailInboxs.list`, `retrieve`, and `close`.

- [ ] **Step 2: Rename schemas**

Materialize `MailMailInbox` and `MailMediaParticipant` schemas with media runtime states only.

- [ ] **Step 3: Regenerate OpenAPI**

Run:

```powershell
pnpm run materialize:openapi
```

Expected: backend OpenAPI and route manifest use mail inbox naming and no invitation/call lifecycle schemas.

### Task 4: SDK Plugin-Only Root

**Files:**
- Modify: `sdks/sdkwork-mail-sdk/.sdkwork-assembly.json`
- Modify: `sdks/sdkwork-mail-sdk/bin/materialize-sdk.mjs`
- Modify: `sdks/sdkwork-mail-sdk/bin/materialize-sdk-reserved-scaffolds.mjs`
- Regenerate SDK language/catalog files with `node sdks\sdkwork-mail-sdk\bin\materialize-sdk.mjs`

- [ ] **Step 1: Change assembly standards**

Set root public policy to `none`, provider activations to package boundary or control metadata only, root public export paths to provider-neutral contracts only, and runtime baselines to package-loader entrypoints rather than direct vendor SDK imports.

- [ ] **Step 2: Make TypeScript root provider-neutral**

Remove root provider module exports and `createBuiltinMailDriverManager`. Keep `MailDriverManager`, `MailDataSource`, `MailProviderPackageLoader`, `installMailProviderPackage`, and catalog accessors.

- [ ] **Step 3: Move provider runtime references into provider package metadata**

Provider package manifests and docs may reference their vendor packages. The root SDK package must not declare vendor dependencies or peer dependencies.

- [ ] **Step 4: Make Flutter root provider-neutral**

Root Flutter package exports only standard contracts and catalogs. Provider bridge files are not exported from `mail_sdk.dart`, and root `pubspec.yaml` has no vendor dependency.

- [ ] **Step 5: Regenerate SDK scaffolds**

Run:

```powershell
node sdks\sdkwork-mail-sdk\bin\materialize-sdk.mjs
```

Expected: materialized SDK metadata, docs, language catalogs, package manifests, and provider package scaffolds align to plugin-only root policy.

### Task 5: Verification

**Files:**
- All touched files

- [ ] **Step 1: Run boundary and SDK tests**

Run:

```powershell
pnpm run test:contract:migration
pnpm --dir sdks/sdkwork-mail-sdk/sdkwork-mail-sdk-typescript test
node sdks\sdkwork-mail-sdk\bin\verify-sdk.mjs
node sdks\sdkwork-mail-sdk\test\verify-sdk-automation.test.mjs
```

- [ ] **Step 2: Run materialization and workspace checks**

Run:

```powershell
pnpm run materialize:openapi
pnpm run sdk:check
pnpm run typecheck
pnpm test
```

- [ ] **Step 3: Run Rust tests**

Run:

```powershell
cargo test --workspace
```

- [ ] **Step 4: Report evidence and residual risk**

Summarize exact commands, key outputs, remaining generated-file churn, and any provider packages that are metadata scaffolds rather than production vendor bridges.

