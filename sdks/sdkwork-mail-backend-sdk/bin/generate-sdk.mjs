#!/usr/bin/env node
import { runMailSdkGenerator } from "../../../tools/mail_sdk_generate.mjs";

await runMailSdkGenerator({
  familyName: "sdkwork-mail-backend-sdk",
  authorityName: "sdkwork-mail-backend-api",
  sdkType: "backend",
  apiPrefix: "/backend/v3/api",
  sourceRouteCrate: "sdkwork-routes-mail-backend-api",
  routeManifest:
    "sdks/_route-manifests/backend-api/sdkwork-routes-mail-backend-api.route-manifest.json",
  sourceOpenapi: "apis/backend-api/communication/sdkwork-mail-backend-api.openapi.json",
  defaultBaseUrl: "http://127.0.0.1:18090",
  sdkDependencies: [
    {
      workspace: "sdkwork-mail-sdk",
      role: "provider-runtime-sdk",
      required: true,
      dependencyMode: "consumer-sdk",
      apiPrefix: null,
      generatedTransportImportPolicy: "forbidden",
      packageByLanguage: {
        typescript: "@sdkwork/Mail-sdk",
        rust: "sdkwork-mail-sdk",
        java: "com.sdkwork:sdkwork-mail-sdk",
        python: "sdkwork-mail-sdk",
        go: "github.com/sdkwork/sdkwork-mail-sdk",
      },
    },
    {
      workspace: "sdkwork-drive-backend-sdk",
      role: "drive-media-resource-backend-capability",
      required: true,
      dependencyMode: "consumer-sdk",
      apiPrefix: "/backend/v3/api",
      apiAuthority: "sdkwork-drive.backend",
      generatedTransportImportPolicy: "forbidden",
      packageByLanguage: {
        typescript: "@sdkwork/drive-backend-sdk",
        rust: "sdkwork-drive-backend-sdk",
        java: "com.sdkwork:sdkwork-drive-backend-sdk",
        python: "sdkwork-drive-backend-sdk",
        go: "github.com/sdkwork/sdkwork-drive-backend-sdk",
      },
    },
  ],
}, process.argv.slice(2));
