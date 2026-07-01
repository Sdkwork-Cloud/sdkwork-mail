# Mail Documentation

## Purpose

`docs/` stores maintained Mail documentation, plans, runbooks, architecture notes, and migration records.

## Owner

sdkwork-mail maintainers.

## Key Documents

- [mail-im-boundary.md](mail-im-boundary.md) — dependency direction and API ownership between `sdkwork-mail` and `sdkwork-im`
- [architecture/tech/TECH_ARCHITECTURE.md](architecture/tech/TECH_ARCHITECTURE.md) — technical architecture overview
- [architecture/tech/TECH-mail-im-boundary.md](architecture/tech/TECH-mail-im-boundary.md) — IM boundary TECH shard
- [product/prd/PRD.md](product/prd/PRD.md) — product requirements

## Allowed Content

- Architecture and migration notes
- Runbooks and developer guides
- Changelogs and standardization records

## Forbidden Content

- API contract source files that belong in `apis/`
- Generated SDK transport output
- Secrets, runtime state, local overrides, or unreviewed scratch notes
- IM/RTC-era migration drafts (media rooms, call signaling, recording artifacts)

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/DOCUMENTATION_SPEC.md`
- `../sdkwork-specs/MIGRATION_SPEC.md`

## Verification

From repository root:

```powershell
pnpm run verify
```

## Canon Documents

| Document | Path |
| --- | --- |
| Product PRD | [product/prd/PRD.md](product/prd/PRD.md) |
| Technical architecture | [architecture/tech/TECH_ARCHITECTURE.md](architecture/tech/TECH_ARCHITECTURE.md) |
| Mail ↔ IM boundary | [mail-im-boundary.md](mail-im-boundary.md) |
| Topology standard | [topology-standard.md](topology-standard.md) |
