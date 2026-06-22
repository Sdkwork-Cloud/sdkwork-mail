# SDKWork Mail Backend SDK

`sdkwork-mail-backend-sdk` is generated from `sdkwork-mail-backend-api` and owns backend/admin Mail HTTP operations under `/backend/v3/api/Mail`.

The generator wrapper is `bin/generate-sdk.mjs`. It materializes owner-only SDK input, validates route manifests, and calls the canonical SDKWork generator:

```text
..\sdkwork-sdk-generator\bin\sdkgen.js
```

Use `node bin/generate-sdk.mjs --check` to validate inputs without writing generated transport output.
