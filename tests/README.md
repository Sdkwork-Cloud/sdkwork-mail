# Mail Cross-Package Tests

## Purpose

`tests/` stores repository-level Mail contract, migration, integration, and static verification tests.

## Owner

sdkwork-mail.

## Allowed Content

- Workspace structure tests.
- Migration and contract audits.
- Cross-package fixtures and static verification inputs.

## Forbidden Content

- Package-local unit tests that belong beside their crate or package.
- Runtime state, generated SDK output, credentials, or customer data.
- Unmaintained manual test scratch files.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/TEST_SPEC.md`
- `../sdkwork-specs/API_SPEC.md`

## Verification

Run `pnpm run verify` from the repository root. Narrow checks: `pnpm run test:workspace-standard` and `pnpm run test:contract:migration`.
