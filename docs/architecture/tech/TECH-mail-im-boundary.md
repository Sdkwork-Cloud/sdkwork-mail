> Migrated from `docs/mail-im-boundary.md` on 2026-06-24.
> Owner: SDKWork maintainers

This document defines the dependency direction and responsibility split between `sdkwork-mail` and `sdkwork-im`.

## Dependency Direction

```
sdkwork-im (signaling, call workflow)
        │
        │ depends on (one-way)
        ▼
sdkwork-mail (providers, media runtime, call data, recordings)
        │
        │ persists recording artifacts via Drive references
        ▼
sdkwork-drive (file storage for recording artifacts)
```

**Rules**

| Rule | Owner |
|------|-------|
| `sdkwork-mail` must **not** depend on `sdkwork-im` crates, SDKs, APIs, or signaling tables | `sdkwork-mail` |
| `sdkwork-im` may depend on `sdkwork-mail` Rust crates, provider plugins, and `@sdkwork/Mail-sdk` | `sdkwork-im` |
| Mail authority (OpenAPI, route manifests, provider plugins, backend admin API) lives only in `sdkwork-mail` | `sdkwork-mail` |
| Call invitation, ringing, accept/reject/end, participant call lifecycle, and WebSocket call workflow live only in `sdkwork-im` | `sdkwork-im` |

There is no reverse dependency. If Mail code imports IM contracts or IM routes expose Mail provider authority, that is a boundary violation.

## Responsibility Split

### sdkwork-mail owns

- All Mail provider encapsulation (`plugins/Mail-*`, `MailProviderPort`)
- mail inbox lifecycle: rooms, mail inboxs, participants, credentials, tracks
- Provider webhooks, health, and active-provider query normalization
- Call **data** persistence: rooms, sessions, participants, quality samples, recording metadata
- Recording artifact export and **Drive-backed** storage references (`MailDriveReference`, `MailMediaArtifact`)
- App API: `/app/v3/api/Mail/*`
- Backend admin API: `/backend/v3/api/Mail/*`
- SDK families: `sdkwork-mail-sdk`, `sdkwork-mail-app-sdk`, `sdkwork-mail-backend-sdk`

### sdkwork-im owns

- Call **signaling** and conversation-integrated call workflow
- IM API: `/im/v3/api/calls/*` (start, invite, watch, accept, reject, end, retrieve)
- IM call state store and WebSocket business protocol for calls
- Orchestration: IM call service issues participant credentials through IM calls API, then delegates media join/publish to `@sdkwork/Mail-sdk`

### sdkwork-mail does **not** own

- Signaling routes (`/signals`, invitations, ringing state machines)
- WebSocket call subprotocols tied to IM conversation flow
- IM message or conversation APIs
- `/im/v3/api/Mail/*` or any Mail authority under IM API prefixes

### sdkwork-im does **not** own

- Mail provider plugin source (`plugins/Mail-*`)
- Mail OpenAPI / route manifest authority
- Duplicate `sdks/sdkwork-mail-sdk` workspace inside IM
- Pinned shadow checkouts such as `sdkwork-mail-im-compat` for long-term runtime use

## Client Integration Pattern

IM PC app (`sdkwork-im-pc`) follows this split:

| Layer | Service | SDK / API |
|-------|---------|-----------|
| Signaling | `CallService.ts` | `@sdkwork/im-sdk` → `.calls.*` |
| Media | `MailMediaService.ts` | `@sdkwork/Mail-sdk` → join, publish, mute |

Signaling must not import `@sdkwork/Mail-sdk`. Media must not re-implement call invite/accept/reject through Mail app APIs.

## API Ownership

| Concern | API prefix | Authority repo |
|---------|------------|----------------|
| Call signaling | `/im/v3/api/calls/*` | `sdkwork-im` |
| Media runtime | `/app/v3/api/Mail/*` | `sdkwork-mail` |
| Provider admin | `/backend/v3/api/Mail/*` | `sdkwork-mail` |

IM gateway proxies `/im/v3/api/calls/{*path}` only. It must **not** proxy `/app/v3/api/Mail/{*path}` as IM-owned surface.

## Recording And Drive

Mail stores recording **metadata** and canonical Drive references in Mail business tables. Binary recording files are stored through `sdkwork-drive`:

- Mail persists `MailDriveReference` (`drive://spaces/{space_id}/nodes/{node_id}`)
- Provider adapters export artifacts; Mail normalizes them into Drive-backed `MailMediaArtifact` records
- Mail tables do not persist provider bucket keys, presigned URLs, or raw object storage secrets

## Rust Integration (target)

`sdkwork-im` Rust runtime should consume **live** `sdkwork-mail` paths:

```toml
# sdkwork-im/Cargo.toml [workspace.dependencies] — target layout
sdkwork-communication-mail-service = { path = "../sdkwork-mail/crates/sdkwork-communication-mail-service" }
sdkwork-mail-adapter-volcengine = { path = "../sdkwork-mail/plugins/Mail-volcengine" }
# ... other plugins under ../sdkwork-mail/plugins/Mail-*
```

Forbidden in IM workspace:

- `../sdkwork-mail-im-compat/*` as runtime authority
- `sdkwork-mail-core` from legacy compat layout
- `sdkwork-mail-signaling-service` (signaling stays in IM)

## Migration Checklist (sdkwork-im)

When aligning a sibling `sdkwork-im` checkout:

1. Replace `../sdkwork-mail-im-compat` Cargo paths with `../sdkwork-mail/crates/` and `../sdkwork-mail/plugins/`.
2. Migrate `sdkwork-mail-core` usage to `sdkwork-communication-mail-service`.
3. Remove `sdks/sdkwork-mail-sdk` from IM; consume `../../../sdkwork-mail/sdks/sdkwork-mail-sdk` through the shared workspace package layout only.
4. Keep `CallService` on `@sdkwork/im-sdk` and `MailMediaService` on `@sdkwork/Mail-sdk`.
5. Ensure gateway uses `services/sdkwork-im-cloud-gateway` and routes calls, not Mail app API.

## Verification

From `sdkwork-mail` root:

```powershell
pnpm run test:contract:migration
```

Relevant contract tests:

- `sdkwork-mail Rust services do not depend back on sdkwork-im crates`
- `sdkwork-mail SDK does not depend on the IM SDK for signaling`
- `sdkwork-im PC app consumes the Mail SDK from sdkwork-mail`
- `sdkwork-im Rust runtime consumes Mail media/provider crates but not Mail signaling service`
- `sdkwork-im no longer owns the Mail SDK workspace source`

## Related Specs

- `../sdkwork-specs/DOMAIN_SPEC.md`
- `../sdkwork-specs/API_SPEC.md`
- `../sdkwork-specs/INTEGRATION_SPEC.md`
- `docs/superpowers/plans/2026-06-06-sdkwork-mail-authority-migration.md`

