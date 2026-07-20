# SDKWork Mail Topology

Archetype: `application-http-gateway` (`specs/topology.spec.json`, `schemaVersion: 2`).

Platform standard: `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_ADOPTION.md`

## Default dev profile

`standalone.split-services.development` — start the Mail API server and a client renderer:

```bash
pnpm dev
pnpm dev:browser:postgres:standalone:local
pnpm dev:flutter-android
```

Cloud development profile:

```bash
pnpm dev:browser:cloud
```

Server-only smoke (no client renderer):

```bash
pnpm dev:server
```

## Surfaces

| Surface id | Plane | Service |
| --- | --- | --- |
| `application.public-ingress` | application | `sdkwork-mail-standalone-gateway` (`/app/v3/api/Mail/*`, `/backend/v3/api/Mail/*`) |
| `platform.api-gateway` | platform | `sdkwork-api-cloud-gateway` (sibling repo, IAM and shared SDKs) |

Product OpenAPI SDKs use `application.public-ingress` on port `18090` in development. IAM and platform SDKs use `platform.api-gateway`.

## IAM tenant application bootstrap

Cloud split-services dev `MUST` inject `SDKWORK_APP_ROOT`, `SDKWORK_IAM_APP_ROOT`, and `SDKWORK_MAIL_APP_ROOT` so `sdkwork-iam-database-host` can register the tenant application when the platform gateway bootstraps IAM schema. The dev orchestrator merges `resolveIamDevEnv()` and `IAM_APPLICATION_BOOTSTRAP_ENV` from `scripts/lib/mail-topology.mjs`.

Loader: `scripts/lib/mail-topology.mjs` → `@sdkwork/app-topology`.

## Client env keys

| App root | Application HTTP | Platform gateway |
| --- | --- | --- |
| `sdkwork-mail-pc` | `VITE_sdkwork_mail_PC_APPLICATION_PUBLIC_HTTP_URL` | `VITE_sdkwork_mail_PC_PLATFORM_API_GATEWAY_HTTP_URL` |
| `sdkwork-mail-h5` | `VITE_sdkwork_mail_H5_APPLICATION_PUBLIC_HTTP_URL` | `VITE_sdkwork_mail_H5_PLATFORM_API_GATEWAY_HTTP_URL` |
| `sdkwork-mail-flutter-mobile` | `sdkwork_mail_APPLICATION_PUBLIC_HTTP_URL` (dart-define) | `sdkwork_mail_PLATFORM_API_GATEWAY_HTTP_URL` (dart-define) |

Derived SDK base URLs in profile env:

- `VITE_sdkwork_mail_*_APP_API_BASE_URL` → `{application}/app/v3/api`
- `VITE_sdkwork_mail_*_BACKEND_API_BASE_URL` → `{application}/backend/v3/api`

Cloud gateway config bundles: `configs/sdkwork-api-cloud-gateway.sdkwork-mail.{development,production}.toml`.

Packaging:

```bash
pnpm gateway:package:cloud
pnpm gateway:matrix:cloud
```

## Validate

```bash
pnpm test:topology-validate
node --test tests/mail-topology-contract.test.mjs
node --test tests/mail-topology-baggage.test.mjs
```

Framework validator:

```bash
node ../sdkwork-app-topology/scripts/sdkwork-topology.mjs validate --root . --spec specs/topology.spec.json
```
