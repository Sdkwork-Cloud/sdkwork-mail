# @sdkwork/Mail-sdk-provider-imap

Reserved TypeScript provider package boundary for IMAP Mail Sync.

- provider key: `imap`
- tier: `tier-a`
- builtin: `true`
- status: `package_reference_boundary`
- vendor sdk provisioning: `consumer-supplied`
- binding strategy: `native-factory`
- bundle policy: `must-not-bundle`
- runtime bridge status: `reserved`
- official vendor sdk requirement: `not-declared-until-bridge`
- required capabilities: `transport.connect`, `transport.authenticate`, `health`
- optional capabilities: `imap.sync`, `imap.folder-sync`, `imap.message-sync`
- provider extension keys: `imap.sync`

Rules:

- Reserved TypeScript provider package boundary
- reserves the official provider plugin boundary until a verified official runtime bridge is implemented
- accepts consumer-supplied `nativeFactory` and `runtimeController` hooks for application-owned bridge injection
- does not declare vendor SDK peer dependencies or expose an official bridge factory until the package owns a verified bridge
- depends on the core `@sdkwork/Mail-sdk` contracts
- registers through the `MailProviderModule` adapter contract
- ships executable `index.js` and `index.d.ts` entrypoints
- declares `exports` so `import` and `default` resolve to `index.js` and `types` resolve
  to `index.d.ts`
- driver factories and provider module symbols live only behind this provider package boundary
- the root `@sdkwork/Mail-sdk` package exposes provider-neutral SPI, catalogs, loader, manager, and
  data-source contracts but does not re-export this provider implementation
