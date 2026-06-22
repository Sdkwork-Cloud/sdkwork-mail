import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("sdkwork-mail mini program runtime bundle exports mail helpers", () => {
  const bundlePath = path.join(root, "src/runtime/mail-app.js");
  assert.equal(existsSync(bundlePath), true, "src/runtime/mail-app.js must exist after build");
  const source = readFileSync(bundlePath, "utf8");
  assert.match(source, /bootstrapMailMiniProgram/u);
  assert.match(source, /sdkwork-mail-mini-program:session:v1/u);
  assert.match(source, /listMailAccounts/u);
  assert.match(source, /listMailFolders/u);
  assert.match(source, /listMailMessages/u);
  assert.match(source, /getMailMessage/u);
});
