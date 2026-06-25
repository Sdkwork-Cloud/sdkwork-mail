import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const MailH5Root = path.dirname(fileURLToPath(import.meta.url));
const MailRoot = path.resolve(MailH5Root, "../..");
const appbaseRoot = path.resolve(MailRoot, "../sdkwork-appbase");
const iamRoot = path.resolve(MailRoot, "../sdkwork-iam");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, MailH5Root, "");
  return {
    define: {
      "process.env.SDKWORK_ACCESS_TOKEN": JSON.stringify(env.SDKWORK_ACCESS_TOKEN ?? ""),
    },
            plugins: [react()],
    resolve: {
      alias: {
        "@sdkwork/auth-runtime-pc-react": path.resolve(iamRoot, "apps/sdkwork-iam-pc/packages/sdkwork-auth-runtime-pc-react/src/index.ts",
        ),
        "@sdkwork/iam-app-sdk": path.resolve(iamRoot, "sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/index.ts",
        ),
        "@sdkwork/iam-contracts": path.resolve(iamRoot, "apps/sdkwork-iam-common/packages/sdkwork-iam-contracts/src/index.ts",
        ),
        "@sdkwork/iam-runtime": path.resolve(iamRoot, "apps/sdkwork-iam-common/packages/sdkwork-iam-runtime/src/index.ts",
        ),
        "@sdkwork/iam-sdk-ports": path.resolve(iamRoot, "apps/sdkwork-iam-common/packages/sdkwork-iam-sdk-ports/src/index.ts",
        ),
        "@sdkwork/iam-service": path.resolve(iamRoot, "apps/sdkwork-iam-common/packages/sdkwork-iam-service/src/index.ts",
        ),
        "@sdkwork/runtime-bootstrap": path.resolve(
          appbaseRoot,
          "packages/common/foundation/sdkwork-runtime-bootstrap/src/index.ts",
        ),
      },
    },
    server: { port: 3001 },
  };
});
