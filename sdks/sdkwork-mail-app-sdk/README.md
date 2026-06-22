# SDKWork Mail App SDK

`sdkwork-mail-app-sdk` is generated from `sdkwork-mail-app-api` and owns user-facing Mail HTTP operations under `/app/v3/api/Mail`.

The app SDK exposes Mail rooms, mail inboxs, participant credential issuance, and Drive-backed recording artifact references. It does not expose signaling, invitations, ringing, or business call lifecycle operations.

The generator wrapper is `bin/generate-sdk.mjs`. It materializes owner-only SDK input, validates route manifests, and calls the canonical SDKWork generator:

```text
..\sdkwork-sdk-generator\bin\sdkgen.js
```

Use `node bin/generate-sdk.mjs --check` to validate inputs without writing generated transport output.
