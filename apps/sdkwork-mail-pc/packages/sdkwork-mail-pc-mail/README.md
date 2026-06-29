# sdkwork-mail-pc-mail

## Purpose

Mailbox UI for SDKWork Mail: folders, threads, message list/read/compose, verification mail, and Drive-backed attachments.

## Placement

- Architecture: `pc-react`
- App root: `apps/sdkwork-mail-pc`
- Domain: `communication`
- Capability: `mail`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- `@sdkwork/mail-app-sdk` for generated Mail HTTP client
- Lower-level Mail workspace packages only

## Next implementation steps

- Keep package contracts under the public `src` surface
- Keep reusable services behind injected Mail SDK clients
- Add UI composition surfaces under `src/components` as workflows mature
- Register routes or manifest metadata under `src/routes` or `src/manifests`
