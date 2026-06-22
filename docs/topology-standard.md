# SDKWork Mail Topology

Archetype: `application-http-gateway` (`specs/topology.spec.json`, `schemaVersion: 2`).

Platform standard: `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_ADOPTION.md`

## Default dev profile

`self-hosted.split-services.development` — start the Mail API server and a client renderer:

```bash
pnpm dev
pnpm dev:browser:postgres:split-services:standalone:local
pnpm dev:flutter-android
```

Cloud development profile:

```bash
pnpm dev:browser:postgres:split-services:cloud
```

Server-only smoke (no client renderer):

```bash
pnpm dev:server
```

## Surfaces

| Surface id | Plane | Service |
| --- | --- | --- |
| `application.public-ingress` | application | `sdkwork-mail-api-server` (`/app/v3/api/Mail/*`, `/backend/v3/api/Mail/*`) |
| `platform.api-gateway` | platform | `sdkwork-api-gateway` (sibling repo, IAM and shared SDKs) |

Product OpenAPI SDKs use `application.public-ingress`. IAM and platform SDKs use `platform.api-gateway`.

Loader: `scripts/lib/Mail-topology.mjs` → `@sdkwork/app-topology`.

## Client env keys

| App root | Application HTTP | Platform gateway |
| --- | --- | --- |
| `sdkwork-mail-pc` | `VITE_sdkwork_mail_PC_APPLICATION_PUBLIC_HTTP_URL` | `VITE_sdkwork_mail_PC_PLATFORM_API_GATEWAY_HTTP_URL` |
| `sdkwork-mail-h5` | `VITE_sdkwork_mail_H5_APPLICATION_PUBLIC_HTTP_URL` | `VITE_sdkwork_mail_H5_PLATFORM_API_GATEWAY_HTTP_URL` |
| `sdkwork-mail-flutter-mobile` | `sdkwork_mail_APPLICATION_PUBLIC_HTTP_URL` (dart-define) | `sdkwork_mail_PLATFORM_API_GATEWAY_HTTP_URL` (dart-define) |

Derived SDK base URLs in profile env:

- `VITE_sdkwork_mail_*_APP_API_BASE_URL` → `{application}/app/v3/api`
- `VITE_sdkwork_mail_*_BACKEND_API_BASE_URL` → `{application}/backend/v3/api`

Cloud gateway config bundles: `configs/sdkwork-api-gateway.sdkwork-mail.{development,production}.toml`.

Packaging:

```bash
pnpm gateway:bundle:cloud
pnpm gateway:matrix:cloud
```

## Validate

```bash
pnpm test:topology-validate
node --test tests/Mail-topology-contract.test.mjs
node --test tests/Mail-topology-baggage.test.mjs
```

Framework validator:

```bash
node ../sdkwork-app-topology/scripts/sdkwork-topology.mjs validate --root . --spec specs/topology.spec.json
```
