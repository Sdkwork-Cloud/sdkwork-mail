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
        ),
        ),
        ),
        ),
        ),
        ),
      },
    },
    server: { port: 3001 },
  };
});
