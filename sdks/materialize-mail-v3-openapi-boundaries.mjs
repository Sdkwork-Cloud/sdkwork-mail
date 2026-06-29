#!/usr/bin/env node
/**
 * @deprecated Use tools/materialize-mail-openapi-envelope.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync(
  process.execPath,
  [resolve(root, "tools/materialize-mail-openapi-envelope.mjs")],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
