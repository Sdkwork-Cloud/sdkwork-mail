import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("sdkwork-mail migration contract rejects RTC media-session paths", () => {
  const appOpenApi = readFileSync(
    "apis/app-api/communication/sdkwork-mail-app-api.openapi.json",
    "utf8",
  );
  assert.doesNotMatch(appOpenApi, /media_sessions|media_session|MailInboxs|rooms/u);
  assert.match(appOpenApi, /\/app\/v3\/api\/mail\/messages/u);
});

test("sdkwork-mail migration contract uses mail database tables", () => {
  const schema = readFileSync("database/contract/schema.yaml", "utf8");
  assert.match(schema, /mail_message/u);
  assert.doesNotMatch(schema, /mail_media_session|mail_room/u);
});
