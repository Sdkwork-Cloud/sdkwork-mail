# @sdkwork/Mail-sdk-provider-volcengine

Reference TypeScript provider package boundary for Volcengine Mail.

- provider key: `volcengine`
- tier: `tier-a`
- builtin: `true`
- status: `package_reference_boundary`
- vendor sdk provisioning: `consumer-supplied`
- binding strategy: `native-factory`
- bundle policy: `must-not-bundle`
- runtime bridge status: `reference-baseline`
- official vendor sdk requirement: `required`
- required capabilities: `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization`
- optional capabilities: `screen-share`, `recording`, `artifact`, `cloud-mix`, `provider.active-query`
- provider extension keys: `volcengine.native-client`

Rules:

- Reference TypeScript provider package boundary
- wraps the official vendor SDK instead of re-implementing media runtime
- declares the official vendor SDK as an optional peer dependency and loads it only when this provider package is installed
- depends on the core `@sdkwork/Mail-sdk` contracts
- registers through the `MailProviderModule` adapter contract
- ships executable `index.js` and `index.d.ts` entrypoints
- declares `exports` so `import` and `default` resolve to `index.js` and `types` resolve
  to `index.d.ts`
- driver factories and provider module symbols live only behind this provider package boundary
- the root `@sdkwork/Mail-sdk` package exposes provider-neutral SPI, catalogs, loader, manager, and
  data-source contracts but does not re-export this provider implementation
