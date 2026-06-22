# SDKWork Mail SDK Verification Matrix

This document lists the verification entrypoints that keep `sdkwork-mail-sdk` aligned with the
assembly contract.

## Workspace Root

- `node bin/patch-mail-transport-assembly.mjs`
- `node bin/materialize-sdk.mjs`
- `node --test test/verify-sdk-automation.test.mjs`
- `node bin/verify-sdk.mjs`

## Runnable Language Baselines

- TypeScript: `sdkwork-mail-sdk-typescript` — `npm run smoke`, `npm run test`, `npm run build`
- Flutter: `sdkwork-mail-sdk-flutter` — `flutter analyze`

## Documentation Contracts

- `docs/usage-guide.md`
- `docs/typescript-smtp-runtime-usage.md`
- `docs/flutter-smtp-runtime-usage.md`

## Reserved Language Boundaries

Reserved language workspaces must preserve provider catalog, capability catalog, provider extension
catalog, provider selection, provider support, provider package catalog, provider activation
catalog, and language workspace catalog scaffolds without pretending they are executable runtimes.
