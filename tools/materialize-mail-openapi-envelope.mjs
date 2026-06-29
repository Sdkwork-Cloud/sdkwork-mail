#!/usr/bin/env node
/**
 * Materializes SdkWorkApiResponse envelopes onto Mail OpenAPI authorities and SDK copies.
 * Authority: API_SPEC.md section 15, migrate-openapi-legacy-envelope.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrapOpenApiEnvelope } from "../../sdkwork-specs/tools/lib/migrate-openapi-legacy-envelope.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const surfaces = [
  {
    authorityPath: "apis/app-api/communication/sdkwork-mail-app-api.openapi.json",
    family: "sdkwork-mail-app-sdk",
    authorityName: "sdkwork-mail-app-api",
  },
  {
    authorityPath: "apis/backend-api/communication/sdkwork-mail-backend-api.openapi.json",
    family: "sdkwork-mail-backend-sdk",
    authorityName: "sdkwork-mail-backend-api",
  },
];

async function main() {
  for (const surface of surfaces) {
    const authorityPath = resolve(root, surface.authorityPath);
    const raw = await readFile(authorityPath, "utf8");
    const document = bootstrapOpenApiEnvelope(JSON.parse(raw));
    const content = `${JSON.stringify(document, null, 2)}\n`;
    await writeFile(authorityPath, content, "utf8");

    const sdkOpenapiDir = resolve(root, "sdks", surface.family, "openapi");
    await mkdir(sdkOpenapiDir, { recursive: true });
    await writeFile(resolve(sdkOpenapiDir, `${surface.authorityName}.openapi.json`), content, "utf8");
    await writeFile(resolve(sdkOpenapiDir, `${surface.authorityName}.sdkgen.json`), content, "utf8");
    console.log(`Materialized ${surface.authorityName} envelope`);
  }
}

await main();
