> Migrated from `docs/superpowers/plans/2026-06-06-sdkwork-mail-authority-migration.md` on 2026-06-24.
> Owner: SDKWork maintainers

# SDKWork Mail Authority Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The user explicitly forbids subagent execution for this task.

**Goal:** Move Mail provider/media runtime SDK, backend provider management API, Rust provider/storage contracts, and UI capability code into `sdkwork-mail`, then remove Mail authority from `sdkwork-appbase` and duplicate Mail SDK authority from `sdkwork-im`. IM/call signaling remains owned by Craw Chat IM.

**Architecture:** `sdkwork-mail` becomes the Mail provider/media runtime authority. The provider/runtime Mail SDK from `sdkwork-im/sdks/sdkwork-mail-sdk` is copied to `sdks/sdkwork-mail-sdk`; backend/admin HTTP SDK families are generated from Mail backend route/OpenAPI authorities; Rust crates own Mail provider, storage, and backend API contracts. User-facing call signaling, invite/accept/reject/end, participant call lifecycle, WebSocket business protocol, and `/im/v3/api/calls/*` remain in Craw Chat IM. `sdkwork-appbase` keeps no Mail package, catalog item, or direct workspace alias.

**Tech Stack:** Node test runner, Vitest, TypeScript, Rust 2024, SQLx-style schema crates, OpenAPI 3.1.2, SDKWork `sdkgen`.

---

### Task 1: Migration Audit Gate

**Files:**
- Create: `tests/Mail-migration-contract.test.mjs`
- Create: `package.json`
- Create: `README.md`

- [ ] Write a failing Node audit test that asserts `sdkwork-mail` owns Mail SDK/UI/Rust/OpenAPI files and appbase/sdkwork-im do not retain Mail authority sources.
- [ ] Run `node --test tests/Mail-migration-contract.test.mjs` and confirm it fails because `sdkwork-mail` is empty.
- [ ] Add root package scripts for audit, typecheck, Rust tests, SDK check, and full verify.

### Task 2: Migrate Mail Provider SDK

**Files:**
- Copy: `<workspace-root>\sdkwork-im\sdks\sdkwork-mail-sdk` to `sdks/sdkwork-mail-sdk`
- Modify: `sdks/sdkwork-mail-sdk/README.md`

- [ ] Copy the active Mail SDK workspace into `sdkwork-mail`.
- [ ] Update documentation so the workspace is no longer described as Craw Chat-owned.
- [ ] Keep public package names such as `@sdkwork/Mail-sdk`.

### Task 3: Migrate Mail PC React Package

**Files:**
- Copy: `sdkwork-appbase/packages/pc-react/communication/sdkwork-mail-pc-react` to `apps/sdkwork-mail-pc/packages/sdkwork-mail-pc-Mail`
- Modify: `apps/sdkwork-mail-pc/packages/sdkwork-mail-pc-Mail/src/Mail.ts`
- Modify: `apps/sdkwork-mail-pc/packages/sdkwork-mail-pc-Mail/package.json`

- [ ] Copy the Mail PC React package into `sdkwork-mail`.
- [ ] Replace the `@sdkwork/appbase-pc-react` manifest dependency with local Mail manifest primitives so Mail UI no longer depends on appbase.
- [ ] Update package metadata to `sdkwork-mail`.

### Task 4: Add Rust Mail Storage And Backend Route Authorities

**Files:**
- Create: `Cargo.toml`
- Create: `rust-toolchain.toml`
- Create: `crates/sdkwork-communication-mail-service/*`
- Create: `crates/sdkwork-communication-mail-repository-sqlx/*`
- Create: `crates/sdkwork-routes-mail-backend-api/*`

- [ ] Add focused Rust crates for core contract metadata, storage schema contracts, and backend route catalogs.
- [ ] Add SQL schema files for Postgres and SQLite.
- [ ] Add Rust tests proving table contracts and route metadata.

### Task 5: Add OpenAPI And SDK Generation Boundaries

**Files:**
- Create: `sdks/materialize-Mail-v3-openapi-boundaries.mjs`
- Create: `sdks/sdkwork-mail-backend-sdk/*`
- Create: `sdks/_route-manifests/*`

- [ ] Materialize backend OpenAPI from Rust route catalogs.
- [ ] Add backend SDK family manifests and standard generator wrappers.
- [ ] Generate or check TypeScript SDK output with the canonical SDKWork generator.

### Task 6: Remove Appbase Mail Debt

**Files:**
- Delete: `sdkwork-appbase/packages/pc-react/communication/sdkwork-mail-pc-react`
- Modify: `sdkwork-appbase/pnpm-workspace.yaml`
- Modify: `sdkwork-appbase/tsconfig.base.json`
- Modify: `sdkwork-appbase/packages/pc-react/foundation/sdkwork-appbase-pc-react/src/catalog.ts`
- Modify: `sdkwork-appbase/packages/mobile-react/foundation/sdkwork-appbase-mobile-react/src/catalog.ts`
- Modify: `sdkwork-appbase/scripts/package-catalog.mjs`
- Modify: `sdkwork-appbase/README.md`

- [ ] Remove Mail package and catalog authority from appbase.
- [ ] Remove direct workspace aliases to sdkwork-im Mail SDK.
- [ ] Update tests/scripts that expected appbase-owned Mail packages.

### Task 7: Remove Craw Chat Mail SDK Authority

**Files:**
- Delete or replace: `sdkwork-im/sdks/sdkwork-mail-sdk`

- [ ] Remove the SDK source from sdkwork-im as an authority.
- [ ] Leave no package/build entrypoint that can publish a second Mail SDK source.

### Task 8: Verification Loop

**Files:**
- All changed files

- [ ] Run `node --test tests/Mail-migration-contract.test.mjs`.
- [ ] Run `pnpm run typecheck`.
- [ ] Run `pnpm test`.
- [ ] Run `cargo test --workspace`.
- [ ] Run SDK/OpenAPI checks.
- [ ] Search `sdkwork-appbase` and `sdkwork-im` for Mail authority leftovers and remove any remaining dead code.

