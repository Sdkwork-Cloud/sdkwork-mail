# SDKWork Mail Specs

## Purpose

`specs/` holds repository-level contracts for the Mail authority workspace.

## Owner

sdkwork-mail.

## Allowed Content

- `topology.spec.json` — runtime topology authority (`schemaVersion: 2`).
- `component.spec.json` — repository-level Mail authority workspace component contract.
- `database-prefix-registry.json` — canonical `mail_` table prefix governance.
- `database-table-registry.json` — Mail persistence table registry aligned with `mail_TABLES`.
- Component and integration specs referenced by crates, plugins, SDK families, and app roots.

## Related Specs

- `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_SPEC.md`
- `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_ADOPTION.md`
- `../docs/topology-standard.md`

## Verification

```powershell
node ../sdkwork-app-topology/scripts/sdkwork-topology.mjs validate --root . --spec specs/topology.spec.json
node --test tests/Mail-topology-contract.test.mjs
node --test tests/Mail-topology-baggage.test.mjs
```
