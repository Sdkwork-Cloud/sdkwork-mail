# SDKWork Mail SDK Workspace

`sdkwork-mail-sdk` is the provider-standard Mail transport workspace for SDKWork.

It is not an OpenAPI-generated HTTP SDK family. It owns provider-neutral mail transport contracts,
provider catalogs, provider package loader contracts, capability negotiation, and language
scaffold standards.
Business conversation delivery, invite lifecycle, session state, and user workflow orchestration
belong to the owning IM SDK and service layer.

## Scope

This workspace owns:

- provider-neutral contracts: `MailProviderDriver`, `MailDriverManager`, `MailDataSource`,
  `MailClient`, `MailProviderMetadata`, `MailSdkException`, and `unwrap()`
- provider discovery, provider selection, provider support classification, and provider package
  lookup contracts
- provider capability metadata and capability negotiation status
- stable mail transport runtime methods: `connectTransport`, `authenticateTransport`,
  `disconnectTransport`, `sendMail`, `probeMailbox`, `syncMailbox`, and `healthCheck`
- runtime immutability rules for assembly-driven metadata and runtime context snapshots
- TypeScript and Flutter provider-plugin mail transport baselines
- reserved scaffold boundaries for Rust, Java, C#, Swift, Kotlin, Go, and Python
- documentation and verification assets generated from `sdk-manifest.json`

This workspace does not own:

- app HTTP endpoints
- user invite workflows
- conversation delivery
- business lifecycle state
- token/session login for an application websocket
- provider transport engine reimplementation

## Architecture

The current standard follows a JDBC-style provider model:

- `MailProviderDriver`
- `MailDriverManager`
- `MailDataSource`
- `MailClient`
- `MailProviderMetadata`
- `MailSdkException`
- `unwrap()`

Applications supply SMTP/IMAP transport credentials from their own authenticated domain flow.
Mail SDK objects consume those inputs and drive mail transport behavior through the selected
provider adapter.

## Materialization

The root materializer keeps docs, catalog source files, workspace READMEs, and reserved-language
scaffolds aligned to `sdk-manifest.json`:

```powershell
node .\bin\patch-mail-transport-assembly.mjs
node .\bin\materialize-sdk.mjs
```

Generated and materialized files must be changed through the assembly or generator source, not by
editing generated output in place.

## Verification

Use these commands from the SDK family root:

```powershell
node .\bin\patch-mail-transport-assembly.mjs
node .\bin\materialize-sdk.mjs
node .\test\verify-sdk-automation.test.mjs
node .\bin\verify-sdk.mjs
node .\bin\smoke-sdk.mjs
```

Fast runtime smoke commands:

{{mail_FAST_RUNTIME_SMOKE_COMMANDS}}

Required runtime smoke steps:

{{mail_REQUIRED_RUNTIME_SMOKE_STEPS}}

Optional runtime smoke steps:

{{mail_OPTIONAL_RUNTIME_SMOKE_STEPS}}

## Current Runtime Baselines

- TypeScript: `@sdkwork/Mail-sdk` stays provider-neutral and loads concrete mail transport adapters
  through provider plugin packages such as `@sdkwork/Mail-sdk-provider-smtp`.
- Flutter: `mail_sdk` stays provider-neutral; provider-specific native bridges belong to plugin
  packages such as `mail_sdk_provider_smtp`.
- Reserved languages: catalog, provider package, provider selection, provider support, and loader
  scaffolds only until their runtime bridge is verified.

## Boundary Rule

Mail SDK package exports must stay mail-transport focused. If a consumer needs business workflow,
it must integrate the owning IM SDK facade and pass only transport credentials into this SDK.
