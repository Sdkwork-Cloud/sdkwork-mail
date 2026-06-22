import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function readDartSources(relativeRoot) {
  const absoluteRoot = path.join(process.cwd(), relativeRoot);
  const sources = [];

  function walk(currentPath) {
    for (const entry of readdirSync(currentPath)) {
      const entryPath = path.join(currentPath, entry);
      const stats = statSync(entryPath);
      if (stats.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (entryPath.endsWith(".dart")) {
        sources.push(readFileSync(entryPath, "utf8"));
      }
    }
  }

  walk(absoluteRoot);
  return sources.join("\n");
}

test("sdkwork-mail migration contract rejects RTC media-session paths", () => {
  const appOpenApi = readFileSync(
    "apis/app-api/communication/sdkwork-mail-app-api.openapi.json",
    "utf8",
  );
  const backendOpenApi = readFileSync(
    "apis/backend-api/communication/sdkwork-mail-backend-api.openapi.json",
    "utf8",
  );
  assert.doesNotMatch(appOpenApi, /media_sessions|media_session|MailInboxs|rooms/u);
  assert.match(appOpenApi, /\/app\/v3\/api\/mail\/messages/u);
  assert.match(appOpenApi, /\/app\/v3\/api\/mail\/verification\/send/u);
  assert.match(appOpenApi, /\/app\/v3\/api\/mail\/transactional\/send/u);
  assert.doesNotMatch(backendOpenApi, /MailProviderQueryJob|MailProviderQuerySnapshot|mail-inboxs|rooms/u);
  assert.match(backendOpenApi, /\/backend\/v3\/api\/mail\/templates/u);
});

test("sdkwork-mail migration contract rejects RTC references in flutter mobile surfaces", () => {
  const flutterSource = [
    readDartSources("apps/sdkwork-mail-flutter-mobile/lib"),
    readDartSources("apps/sdkwork-mail-flutter-mobile/packages/sdkwork_mail_flutter_mobile_mail/lib"),
    readDartSources("apps/sdkwork-mail-flutter-mobile/packages/sdkwork_mail_flutter_mobile_admin_core/lib"),
    readFileSync(
      "apps/sdkwork-mail-flutter-mobile/packages/sdkwork_mail_flutter_mobile_core/lib/src/session/app_session.dart",
      "utf8",
    ),
  ].join("\n");

  assert.doesNotMatch(flutterSource, /media_sessions|media_session|volcengine|agora|ProviderQueryJob|RoomService/u);
  assert.match(flutterSource, /mail\.messages\.read/u);
  assert.match(flutterSource, /\/mail\/messages/u);
});

test("sdkwork-mail migration contract uses mail transport provider schemas only", () => {
  const schemaDir = path.join(process.cwd(), "configs/provider-schemas");
  const schemaNames = readdirSync(schemaDir).filter((name) => name.endsWith(".json")).sort();
  assert.deepEqual(schemaNames, ["imap.json", "smtp.json"]);
});

test("sdkwork-mail migration contract uses mail database tables", () => {
  const schema = readFileSync("database/contract/schema.yaml", "utf8");
  assert.match(schema, /mail_message/u);
  assert.doesNotMatch(schema, /mail_media_session|mail_room/u);
});
