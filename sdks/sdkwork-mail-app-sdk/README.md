# SDKWork Mail App SDK

`sdkwork-mail-app-sdk` is generated from `sdkwork-mail-app-api` and owns user-facing Mail HTTP operations under `/app/v3/api/mail/*`.

The app SDK exposes mailbox operations: accounts, folders, threads, messages (list/create/retrieve/update/delete), verification, transactional send, and Drive-backed attachment references on create message. It does not expose IM signaling or RTC surfaces.

The generator wrapper is `bin/generate-sdk.mjs`. It materializes owner-only SDK input, validates route manifests, and calls the canonical SDKWork generator:

```text
..\sdkwork-sdk-generator\bin\sdkgen.js
```

Use `node bin/generate-sdk.mjs --check` to validate inputs without writing generated transport output.
