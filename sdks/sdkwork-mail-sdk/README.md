# SDKWork Mail Transport SDK Workspace

> **Boundary notice:** This workspace is being realigned from legacy RTC/media provider scaffolds to **mail transport plugin standards** (SMTP/IMAP). Runtime media providers (Volcengine, Agora, LiveKit, etc.) belong in `sdkwork-im`, not `sdkwork-mail`. Authoritative HTTP integration for applications uses `sdkwork-mail-app-sdk` and `sdkwork-mail-backend-sdk`.

`sdkwork-mail-sdk` documents provider-neutral **transport** contracts and plugin package boundaries for SMTP/IMAP adapters under `plugins/`.

## Scope (target)

- transport plugin metadata and driver selection for SMTP/IMAP
- secret reference resolution conventions (`env:`, `secret://mail/`)
- language scaffolds for transport provider packages
- verification assets generated from `.sdkwork-assembly.json`

## Out of scope

- RTC/media session runtime (owned by `sdkwork-im`)
- app HTTP endpoints (owned by `sdkwork-mail-app-sdk` / OpenAPI authorities)
- user invite / conversation workflows (owned by IM SDKs)

## Application integration

Use generated SDK families instead of this workspace for HTTP:

- App: `sdks/sdkwork-mail-app-sdk`
- Backend: `sdks/sdkwork-mail-backend-sdk`

Transport execution for outbound mail is implemented in Rust plugins:

- `plugins/mail-smtp`
- `plugins/mail-imap`
