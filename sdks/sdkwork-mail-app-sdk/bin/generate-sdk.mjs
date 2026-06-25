#!/usr/bin/env node
import { runMailSdkGenerator } from "../../../tools/mail_sdk_generate.mjs";

await runMailSdkGenerator({
  familyName: "sdkwork-mail-app-sdk",
  authorityName: "sdkwork-mail-app-api",
  sdkType: "app",
  apiPrefix: "/app/v3/api",
  sourceRouteCrate: "sdkwork-router-mail-app-api",
  routeManifest:
    "sdks/_route-manifests/app-api/sdkwork-router-mail-app-api.route-manifest.json",
  sourceOpenapi: "apis/app-api/communication/sdkwork-mail-app-api.openapi.json",
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
      workspace: "sdkwork-drive-app-sdk",
      role: "drive-media-resource-app-capability",
      required: true,
      dependencyMode: "consumer-sdk",
      apiPrefix: "/app/v3/api",
      apiAuthority: "sdkwork-drive.app",
      generatedTransportImportPolicy: "forbidden",
      packageByLanguage: {
        typescript: "@sdkwork/drive-app-sdk",
        rust: "sdkwork-drive-app-sdk",
        java: "com.sdkwork:sdkwork-drive-app-sdk",
        python: "sdkwork-drive-app-sdk",
        go: "github.com/sdkwork/sdkwork-drive-app-sdk",
      },
    },
  ],
}, process.argv.slice(2));
