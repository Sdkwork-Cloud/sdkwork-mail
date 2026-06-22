# Mail Runtime Plugins

## Purpose

`plugins/` stores Mail runtime provider plugin source packages.

## Owner

sdkwork-mail.

## Allowed Content

- `Mail-agora/`, `Mail-aliyun/`, `Mail-livekit/`, `Mail-tencent/`, and `Mail-volcengine/` provider implementations.
- Plugin-local component specs, source code, tests, and provider documentation.

## Forbidden Content

- Repository-local agent plugins; those belong in `.sdkwork/plugins/`.
- Service or repository crates that belong in `crates/`.
- Generated SDK transport output.
- Provider secrets or runtime credential files.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`
- `../sdkwork-specs/INTEGRATION_SPEC.md`

## Verification

Run `cargo test --workspace` and `node --test tests/Mail-workspace-standard.test.mjs`.
