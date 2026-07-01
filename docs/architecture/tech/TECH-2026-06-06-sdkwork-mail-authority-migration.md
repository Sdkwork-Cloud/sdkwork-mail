# TECH: SDKWork Mail Authority Migration

Status: **completed**  
Owner: SDKWork Mail maintainers  
Updated: 2026-06-29

Historical plan archive: [../../superpowers/plans/2026-06-06-sdkwork-mail-authority-migration.md](../../superpowers/plans/2026-06-06-sdkwork-mail-authority-migration.md)

## Outcome

`sdkwork-mail` is the standalone **mailbox and mail-transport** authority:

- OpenAPI authorities under `apis/app-api/communication/` and `apis/backend-api/communication/`
- Generated SDK families under `sdks/sdkwork-mail-*-sdk`
- Rust service, repository, route, and gateway crates under `crates/`
- Runnable clients under `apps/sdkwork-mail-*`
- SMTP/IMAP provider plugins under `plugins/mail-*`

IM/call signaling remains in `sdkwork-im`. Mail must not depend on IM crates or APIs.

## Verification

```powershell
pnpm run verify
```
