# Mail Config Templates

## Purpose

`configs/` is reserved for safe Mail config templates, schemas, profile examples, and non-secret defaults.

## Owner

sdkwork-mail.

## Allowed Content

- Config schemas.
- Development, test, staging, and production examples without secrets.
- Topology profiles under `topology/` and cloud gateway bundles under `sdkwork-api-cloud-gateway.sdkwork-mail.*.toml`.
- Provider config templates using placeholder values.

## Forbidden Content

- `.local` overrides.
- Live provider secrets, API keys, tokens, database URLs, or private keys.
- Runtime user config or generated deployment state.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/CONFIG_SPEC.md`
- `../sdkwork-specs/ENVIRONMENT_SPEC.md`

## Verification

```powershell
Run `pnpm run verify` from the repository root.
pnpm run test:topology-validate
pnpm run gateway:matrix:cloud
```
