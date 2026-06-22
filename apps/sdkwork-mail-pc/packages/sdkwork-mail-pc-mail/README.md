# sdkwork-mail-pc-Mail

## Purpose

Realtime audio, video, live mail inboxs, room state, and media controls.

## Placement

- Architecture: `pc-react`
- App root: `apps/sdkwork-mail-pc`
- Domain: `communication`
- Capability: `Mail`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level Mail workspace packages only

## Extraction sources

- `sdkwork-chat-pc-Mail`
- `sdkwork-react-backend-Mail`

## Next implementation steps

- Keep package contracts under the public `src` surface
- Keep reusable services behind injected Mail SDK clients
- Add UI composition surfaces under `src/components` as workflows mature
- Register routes or manifest metadata under `src/routes` or `src/manifests`
