#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MailRoot = resolve(__dirname, "..");

const routeSources = [
  {
    packageName: "sdkwork-routes-mail-app-api",
    surface: "app-api",
    owner: "sdkwork-mail",
    domain: "Mail",
    capability: "Mail",
    sdkOwner: "sdkwork-mail",
    familyName: "sdkwork-mail-app-sdk",
    authorityName: "sdkwork-mail-app-api",
    title: "SDKWork Mail App API",
    description:
      "App/client contract for Mail rooms, mail inboxs, participant credentials, and recording artifacts.",
    prefix: "/app/v3/api",
    apiContext: "AppRequestContext",
    sdkType: "app",
    authMode: "dual-token",
    path: resolve(MailRoot, "crates/sdkwork-routes-mail-app-api/src/paths.rs"),
    arrayName: "MAIL_APP_ROUTES",
    routeType: "MailAppRoute",
    manifestPath:
      "sdks/_route-manifests/app-api/sdkwork-routes-mail-app-api.route-manifest.json",
    sourceOpenapiPath: "apis/app-api/communication/sdkwork-mail-app-api.openapi.json",
  },
  {
    packageName: "sdkwork-routes-mail-backend-api",
    surface: "backend-api",
    owner: "sdkwork-mail",
    domain: "Mail",
    capability: "Mail",
    sdkOwner: "sdkwork-mail",
    familyName: "sdkwork-mail-backend-sdk",
    authorityName: "sdkwork-mail-backend-api",
    title: "SDKWork Mail Backend API",
    description:
      "Backend/admin contract for SDKWork Mail rooms, provider profiles, provider routes, mail inboxs, media artifacts, provider webhooks, active provider query jobs, and quality samples.",
    prefix: "/backend/v3/api",
    apiContext: "BackendRequestContext",
    sdkType: "backend",
    authMode: "dual-token",
    path: resolve(MailRoot, "crates/sdkwork-routes-mail-backend-api/src/paths.rs"),
    arrayName: "MAIL_BACKEND_ROUTES",
    routeType: "MailBackendRoute",
    manifestPath:
      "sdks/_route-manifests/backend-api/sdkwork-routes-mail-backend-api.route-manifest.json",
    sourceOpenapiPath: "apis/backend-api/communication/sdkwork-mail-backend-api.openapi.json",
  },
];

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);
const PROVIDER_WEBHOOK_RECEIVE_OPERATION_ID = "Mail.providerWebhooks.events.receive";
const PROVIDER_WEBHOOK_SIGNATURE_HEADERS = [
  "X-Volc-Signature",
  "X-VolcEngine-Signature",
  "X-Volc-Sign",
  "X-TC-Signature",
  "X-Tencent-Signature",
  "Sign",
  "Agora-Signature-V2",
  "Agora-Signature",
  "X-Agora-Signature",
  "X-Acs-Signature",
  "X-Aliyun-Signature",
  "X-Acs-Content-Sha256",
  "Authorization",
  "LiveKit-Signature",
  "X-LiveKit-Signature",
  "X-LK-Signature",
];

async function main() {
  for (const source of routeSources) {
    const routes = await collectRoutes(source);
    if (routes.length === 0) {
      throw new Error(`No Mail routes were materialized from ${source.packageName}.`);
    }
    validateRoutes(source, routes);
    const routeManifest = buildRouteManifest(source, routes);
    const openapi = buildOpenApi(source, routes);
    await writeRouteManifest(source, routeManifest);
    await writeSurfaceOpenApi(source, openapi);
    console.log(`Materialized ${routes.length} ${source.surface} Mail operations.`);
  }
}

async function collectRoutes(source) {
  const content = await readFile(source.path, "utf8");
  const stringConstants = collectStringConstants(content);
  const arrayPattern = new RegExp(
    `pub\\s+const\\s+${escapeRegExp(source.arrayName)}\\s*:\\s*&\\[${escapeRegExp(source.routeType)}\\]\\s*=\\s*&\\[(?<body>[\\s\\S]*?)\\];`,
    "m",
  );
  const arrayMatch = content.match(arrayPattern);
  if (!arrayMatch?.groups?.body) {
    throw new Error(`Unable to find ${source.arrayName} in ${relativeForDisplay(source.path)}.`);
  }

  const routePattern = new RegExp(
    `${escapeRegExp(source.routeType)}\\s*\\{\\s*method:\\s*"(?<method>[^"]+)",\\s*path:\\s*(?<pathToken>"[^"]+"|[A-Z][A-Z0-9_]*),\\s*tag:\\s*"(?<tag>[^"]+)",\\s*operation_id:\\s*"(?<operationId>[^"]+)",\\s*owner:\\s*mail_OWNER,\\s*permission:\\s*"(?<permission>[^"]+)",\\s*\\}`,
    "g",
  );
  const routes = [];
  for (const match of arrayMatch.groups.body.matchAll(routePattern)) {
    const path = resolveRustStringValue(match.groups.pathToken, stringConstants);
    routes.push({
      method: match.groups.method.toUpperCase(),
      path,
      tag: match.groups.tag,
      operationId: match.groups.operationId,
      permission: match.groups.permission,
      owner: source.owner,
      sourcePackageName: source.packageName,
      sourceFile: relativeForDisplay(source.path),
    });
  }

  const byKey = new Map();
  for (const route of routes) {
    const key = `${route.method} ${route.path}`;
    const previous = byKey.get(key);
    if (previous && previous.operationId !== route.operationId) {
      throw new Error(
        `Conflicting Mail route metadata for ${key}: ${previous.operationId} vs ${route.operationId}`,
      );
    }
    byKey.set(key, route);
  }

  return Array.from(byKey.values()).sort(compareRoutes);
}

function collectStringConstants(content) {
  const constants = new Map();
  const pattern = /pub\s+const\s+(?<name>[A-Z][A-Z0-9_]*)\s*:\s*&str\s*=\s*"(?<value>[^"]*)";/g;
  for (const match of content.matchAll(pattern)) {
    constants.set(match.groups.name, match.groups.value);
  }
  return constants;
}

function resolveRustStringValue(token, constants) {
  if (token.startsWith('"') && token.endsWith('"')) {
    return token.slice(1, -1);
  }
  const value = constants.get(token);
  if (!value) {
    throw new Error(`Unable to resolve Rust string constant ${token}.`);
  }
  return value;
}

function validateRoutes(source, routes) {
  for (const route of routes) {
    const method = route.method.toLowerCase();
    if (!HTTP_METHODS.has(method)) {
      throw new Error(`${route.operationId} uses unsupported method ${route.method}.`);
    }
    if (!route.path.startsWith(`${source.prefix}/Mail`)) {
      throw new Error(`${route.operationId} must start with ${source.prefix}/Mail.`);
    }
    if (!route.operationId.startsWith("Mail.")) {
      throw new Error(`${route.operationId} must use Mail.* operationId namespace.`);
    }
    if (!route.permission.startsWith("Mail.")) {
      throw new Error(`${route.operationId} must declare an Mail.* permission.`);
    }
  }
}

function buildRouteManifest(source, routes) {
  return {
    schemaVersion: 1,
    kind: "sdkwork.route.manifest",
    packageName: source.packageName,
    surface: source.surface,
    owner: source.owner,
    domain: source.domain,
    capability: source.capability,
    apiAuthority: source.authorityName,
    sdkFamily: source.familyName,
    prefix: source.prefix,
    source: {
      crateRoot: relativeForDisplay(dirname(source.path)),
      crateImport: source.packageName.replaceAll("-", "_"),
    },
    routes: routes.map((route) => ({
      method: route.method,
      path: route.path,
      operationId: route.operationId,
      tags: [route.tag],
      requestContext: "WebRequestContext",
      apiSurface: source.surface,
      auth: {
        mode: "dual-token",
        required: true,
        permission: route.permission,
        tenantScope: "tenant",
        dataScope: "organization",
      },
      handler: {
        module: "crate::handlers",
        name: toHandlerName(route.operationId),
      },
      schemas: {
        request: operationRequestSchemaName(route),
        response: operationResponseSchemaName(route),
        problem: "ProblemDetail",
      },
      ...routeAuthManifest(route),
      ownership: {
        owner: source.owner,
        apiAuthority: source.authorityName,
      },
      source: {
        packageName: source.packageName,
        file: route.sourceFile,
      },
    })),
  };
}

async function writeRouteManifest(source, routeManifest) {
  const manifestPath = resolve(MailRoot, source.manifestPath);
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(routeManifest, null, 2)}\n`, "utf8");
}

async function writeSurfaceOpenApi(source, openapi) {
  const familyRoot = resolve(MailRoot, "sdks", source.familyName);
  const openapiRoot = resolve(familyRoot, "openapi");
  await mkdir(openapiRoot, { recursive: true });
  const content = `${JSON.stringify(openapi, null, 2)}\n`;
  const sourceOpenapiPath = resolve(MailRoot, source.sourceOpenapiPath);
  await mkdir(dirname(sourceOpenapiPath), { recursive: true });
  await writeFile(sourceOpenapiPath, content, "utf8");
  await writeFile(resolve(openapiRoot, `${source.authorityName}.openapi.json`), content, "utf8");
  await writeFile(resolve(openapiRoot, `${source.authorityName}.sdkgen.json`), content, "utf8");
}

function buildOpenApi(source, routes) {
  const paths = {};
  for (const route of routes) {
    const pathItem = paths[route.path] ?? {};
    pathItem[route.method.toLowerCase()] = buildOperation(source, route);
    paths[route.path] = pathItem;
  }

  const tags = Array.from(new Set(routes.map((route) => route.tag)))
    .sort()
    .map((name) => ({
      name,
      description: `${toTitle(name)} API resources.`,
      "x-sdk-nested-resource-surface": true,
    }));

  return pruneUnusedSchemas({
    openapi: "3.1.2",
    info: {
      title: source.title,
      version: "1.0.0",
      description: source.description,
      "x-sdkwork-api-authority": source.authorityName,
      "x-sdkwork-sdk-family": source.familyName,
      "x-sdkwork-owner": source.owner,
      "x-sdkwork-domain": source.domain,
    },
    servers: [
      {
        url: "http://127.0.0.1:18090",
        description: "Local sdkwork-mail runtime",
      },
    ],
    tags,
    security: securityRequirement(source),
    paths,
    components: {
      securitySchemes: securitySchemes(source),
      schemas: buildSchemas(),
    },
    "x-sdkwork-materialized-from": [
      {
        owner: source.owner,
        path: relativeForDisplay(source.path),
        packageName: source.packageName,
      },
    ],
    "x-sdkwork-route-manifest": source.manifestPath,
    "x-sdkwork-request-context": {
      contextObject: source.apiContext,
      serverRequestId: "server-owned",
      clientRequestIdHeader: "forbidden",
      tenantSource: "AuthToken + AccessToken",
      organizationSource: "AuthToken + AccessToken",
      userSource: "AuthToken + AccessToken",
    },
  });
}

function pruneUnusedSchemas(openapi) {
  const allSchemas = openapi.components?.schemas ?? {};
  const usedSchemas = new Set();

  const visit = (value) => {
    if (!value || typeof value !== "object") {
      return;
    }
    if (typeof value.$ref === "string") {
      const schemaName = schemaNameFromRef(value.$ref);
      if (schemaName && allSchemas[schemaName] && !usedSchemas.has(schemaName)) {
        usedSchemas.add(schemaName);
        visit(allSchemas[schemaName]);
      }
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }
      return;
    }
    for (const child of Object.values(value)) {
      visit(child);
    }
  };

  visit(openapi.paths);

  const prunedSchemas = {};
  for (const [schemaName, schema] of Object.entries(allSchemas)) {
    if (usedSchemas.has(schemaName)) {
      prunedSchemas[schemaName] = schema;
    }
  }
  openapi.components.schemas = prunedSchemas;
  return openapi;
}

function schemaNameFromRef(ref) {
  const prefix = "#/components/schemas/";
  return ref.startsWith(prefix) ? ref.slice(prefix.length) : null;
}

function buildOperation(source, route) {
  const method = route.method.toLowerCase();
  const operationAuth = operationAuthMetadata(source, route);
  const operation = {
    tags: [route.tag],
    summary: `${toTitle(route.operationId)}.`,
    operationId: route.operationId,
    parameters: extractPathParameters(route.path),
    responses: {
      200: jsonResponse("Success", `#/components/schemas/${operationResponseSchemaName(route)}`),
      400: problemResponse("Bad request"),
      401: problemResponse("Unauthorized"),
      403: problemResponse("Forbidden"),
      404: problemResponse("Not found"),
      409: problemResponse("Conflict"),
      500: problemResponse("Internal server error"),
    },
    security: operationAuth.security,
    "x-sdkwork-owner": source.sdkOwner,
    "x-sdkwork-api-authority": source.authorityName,
    "x-sdkwork-source-route-crate": source.packageName,
    "x-sdkwork-domain": source.domain,
    "x-sdkwork-resource": route.operationId.split(".").slice(0, -1).join("."),
    "x-sdkwork-request-context": "WebRequestContext",
    "x-sdkwork-api-surface": source.surface,
    "x-sdkwork-server-request-id": true,
    "x-sdkwork-permission": route.permission,
    "x-sdkwork-auth-mode": operationAuth.authMode,
  };

  if (operationAuth.providerWebhookSignature) {
    operation["x-sdkwork-provider-webhook-signature"] = true;
    operation["x-sdkwork-provider-webhook-signature-headers"] =
      PROVIDER_WEBHOOK_SIGNATURE_HEADERS;
    operation["x-sdkwork-request-context"] = "ProviderWebhookRequestContext";
    operation["x-sdkwork-forbid-credential-headers"] = true;
  }

  if (operationAuth.rateLimitTier) {
    operation["x-sdkwork-rate-limit-tier"] = operationAuth.rateLimitTier;
  }

  if (usesJsonBody(method)) {
    operation.requestBody = {
      required: method !== "patch",
      content: {
        "application/json": {
          schema: { $ref: `#/components/schemas/${operationRequestSchemaName(route)}` },
        },
      },
    };
  }

  if (isListOperation(route)) {
    operation.parameters.push(
      queryParameter("page", { type: "integer", minimum: 1, default: 1 }),
      queryParameter("page_size", { type: "integer", minimum: 1, maximum: 200, default: 20 }),
      queryParameter("cursor", { type: "string" }),
      queryParameter("sort", { type: "string" }),
      queryParameter("q", { type: "string" }),
    );
  }

  return operation;
}

function securityRequirement() {
  return [{ AuthToken: [], AccessToken: [] }];
}

function operationAuthMetadata(source, route) {
  if (route.operationId === PROVIDER_WEBHOOK_RECEIVE_OPERATION_ID) {
    return {
      authMode: "anonymous",
      providerWebhookSignature: true,
      security: [],
      rateLimitTier: "openApiDefault",
    };
  }

  return {
    authMode: source.authMode,
    providerWebhookSignature: false,
    security: securityRequirement(source),
  };
}

function routeAuthManifest(route) {
  if (route.operationId === PROVIDER_WEBHOOK_RECEIVE_OPERATION_ID) {
    return {
      rateLimitTier: "openApiDefault",
      auth: {
        mode: "public",
        required: true,
        permission: route.permission,
        tenantScope: "tenant",
        dataScope: "organization",
        providerWebhookSignature: true,
      },
    };
  }

  return {
    auth: {
      mode: "dual-token",
      required: true,
      permission: route.permission,
      tenantScope: "tenant",
      dataScope: "organization",
    },
  };
}

function securitySchemes() {
  return {
    AuthToken: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "SDKWork auth token carried as Authorization: Bearer <auth_token>.",
    },
    AccessToken: {
      type: "apiKey",
      in: "header",
      name: "Access-Token",
      description: "SDKWork access isolation token.",
    },
  };
}

function buildSchemas() {
  return {
    MailApiResult: {
      type: "object",
      additionalProperties: false,
      required: ["code", "message", "requestId", "data"],
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        requestId: {
          type: "string",
          format: "uuid",
          description: "Server-owned request correlation id.",
        },
        data: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    MailOperationCommand: {
      type: "object",
      additionalProperties: true,
      description:
        "Operation-specific Mail command payload defined by the owning sdkwork-mail Rust route/service module.",
    },
    MediaKind: {
      type: "string",
      enum: ["image", "video", "audio", "voice", "document", "archive", "model", "other"],
    },
    MediaSource: {
      type: "string",
      enum: ["drive", "external_url", "data_url", "provider_asset", "generated"],
    },
    MediaChecksum: {
      type: "object",
      additionalProperties: false,
      required: ["algorithm", "value"],
      properties: {
        algorithm: { type: "string", enum: ["sha256", "md5", "etag"] },
        value: { type: "string" },
      },
    },
    MediaAccess: {
      type: "object",
      additionalProperties: false,
      required: ["visibility"],
      properties: {
        visibility: {
          type: "string",
          enum: ["private", "tenant", "organization", "public", "signed"],
        },
        expiresAt: { type: ["string", "null"], format: "date-time" },
      },
    },
    MediaResource: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "source"],
      properties: {
        id: { type: ["string", "null"] },
        kind: { $ref: "#/components/schemas/MediaKind" },
        source: { $ref: "#/components/schemas/MediaSource" },
        url: {
          type: ["string", "null"],
          format: "uri",
          description: "Delivery URL. It is optional and may be temporary.",
        },
        publicUrl: { type: ["string", "null"], format: "uri" },
        uri: { type: ["string", "null"] },
        objectBlobId: { type: ["string", "null"] },
        fileName: { type: ["string", "null"], maxLength: 512 },
        mimeType: { type: ["string", "null"], maxLength: 256 },
        sizeBytes: { type: ["string", "null"], pattern: "^[0-9]+$" },
        checksum: { $ref: "#/components/schemas/MediaChecksum" },
        width: { type: ["integer", "null"], minimum: 0 },
        height: { type: ["integer", "null"], minimum: 0 },
        durationSeconds: { type: ["number", "null"], minimum: 0 },
        altText: { type: ["string", "null"], maxLength: 512 },
        title: { type: ["string", "null"], maxLength: 255 },
        access: { $ref: "#/components/schemas/MediaAccess" },
        metadata: {
          type: "object",
          additionalProperties: true,
          description:
            "Extension metadata. Drive-backed Mail recordings include metadata.drive.spaceType = Mail.",
        },
      },
    },
    MailDriveReference: {
      type: "object",
      additionalProperties: false,
      required: ["driveUri", "spaceId", "spaceType", "nodeId"],
      properties: {
        driveUri: {
          type: "string",
          pattern: "^drive://spaces/.+/nodes/.+$",
        },
        spaceId: { type: "string" },
        spaceType: {
          type: "string",
          enum: ["Mail"],
          description:
            "Dedicated Drive space type for SDKWork Mail recording and artifact archives.",
        },
        nodeId: { type: "string" },
        nodeVersion: { type: ["string", "null"] },
      },
    },
    MailRoom: {
      type: "object",
      additionalProperties: false,
      required: ["id", "tenantId", "organizationId", "ownerUserId", "title", "status"],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        ownerUserId: { type: "string" },
        title: { type: "string" },
        status: { type: "string", enum: ["active", "archived", "disabled"] },
      },
    },
    MailRoomListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailRoom" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailRoomResponse: envelope({ $ref: "#/components/schemas/MailRoom" }),
    MailCreateMailInboxRequest: {
      type: "object",
      additionalProperties: false,
      required: ["roomId", "mediaMode"],
      properties: {
        roomId: { type: "string" },
        mediaMode: { type: "string", enum: ["audio", "video", "live"] },
        providerProfileId: { type: ["string", "null"] },
        provider: { type: ["string", "null"] },
        region: { type: ["string", "null"] },
        recordingRequested: { type: "boolean", default: false },
        metadata: { type: "object", additionalProperties: true },
      },
    },
    MailCloseMailInboxRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailMailInbox: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "roomId",
        "tenantId",
        "organizationId",
        "ownerUserId",
        "mediaMode",
        "status",
        "participants",
      ],
      properties: {
        id: { type: "string" },
        roomId: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        ownerUserId: { type: "string" },
        mediaMode: { type: "string", enum: ["audio", "video", "live"] },
        status: {
          type: "string",
          enum: ["preparing", "active", "closing", "ended", "failed"],
        },
        providerProfileId: { type: ["string", "null"] },
        providerSessionId: { type: ["string", "null"] },
        startedAt: { type: ["string", "null"], format: "date-time" },
        connectedAt: { type: ["string", "null"], format: "date-time" },
        endedAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        endReason: { type: ["string", "null"], maxLength: 500 },
        endSource: {
          type: ["string", "null"],
          enum: [
            "manual_close",
            "provider_webhook",
            "active_provider_query",
            "provider_state_sync",
            "timeout",
            "system_reconcile",
            "unknown",
            null,
          ],
        },
        participantCount: { type: "integer", minimum: 0 },
        maxConcurrentParticipants: { type: "integer", minimum: 0 },
        qualitySummary: {
          anyOf: [
            { $ref: "#/components/schemas/MailMailInboxCompletionQualitySummary" },
            { type: "null" },
          ],
        },
        recordingSummary: {
          anyOf: [
            { $ref: "#/components/schemas/MailMailInboxCompletionRecordingSummary" },
            { type: "null" },
          ],
        },
        completionRecordedAt: { type: ["string", "null"], format: "date-time" },
        lastProviderWebhookEventId: { type: ["string", "null"] },
        lastProviderQueryJobId: { type: ["string", "null"] },
        participants: {
          type: "array",
          items: { $ref: "#/components/schemas/MailMediaParticipant" },
        },
      },
    },
    MailMailInboxListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailMailInbox" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailMailInboxResponse: envelope({ $ref: "#/components/schemas/MailMailInbox" }),
    MailMediaParticipant: {
      type: "object",
      additionalProperties: false,
      required: ["id", "MailInboxId", "userId", "displayName", "role", "state"],
      properties: {
        id: { type: "string" },
        MailInboxId: { type: "string" },
        userId: { type: "string" },
        displayName: { type: "string" },
        role: { type: "string", enum: ["host", "guest", "listener"] },
        state: { type: "string", enum: ["joining", "joined", "left", "kicked", "timeout"] },
        audioMuted: { type: "boolean" },
        videoMuted: { type: "boolean" },
        screenShareActive: { type: "boolean" },
        providerParticipantId: { type: ["string", "null"] },
        joinedAt: { type: ["string", "null"], format: "date-time" },
        leftAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        leaveReason: { type: ["string", "null"], maxLength: 500 },
        lastSeenAt: { type: ["string", "null"], format: "date-time" },
      },
    },
    MailParticipantCredential: {
      type: "object",
      additionalProperties: false,
      required: ["tenantId", "MailInboxId", "participantId", "credential", "expiresAt"],
      properties: {
        tenantId: { type: "string" },
        MailInboxId: { type: "string" },
        participantId: { type: "string" },
        credential: { type: "string" },
        expiresAt: { type: "string", format: "date-time" },
      },
    },
    MailParticipantCredentialResponse: envelope({
      $ref: "#/components/schemas/MailParticipantCredential",
    }),
    MailMediaArtifact: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "tenantId",
        "MailInboxId",
        "ownerUserId",
        "artifactKind",
        "artifactStatus",
        "mediaRole",
        "drive",
        "resource",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: ["string", "null"] },
        MailInboxId: { type: "string" },
        ownerUserId: { type: "string" },
        artifactKind: {
          type: "string",
          enum: ["recording", "transcript", "screen_share", "snapshot", "other"],
        },
        artifactStatus: {
          type: "string",
          enum: ["pending", "processing", "ready", "failed", "deleted"],
        },
        mediaRole: { type: "string" },
        providerProfileId: { type: ["string", "null"] },
        providerArtifactId: { type: ["string", "null"] },
        drive: { $ref: "#/components/schemas/MailDriveReference" },
        resource: { $ref: "#/components/schemas/MediaResource" },
        resourceHash: { type: ["string", "null"] },
        startedAt: { type: ["string", "null"], format: "date-time" },
        endedAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        failureReason: { type: ["string", "null"], maxLength: 500 },
        sourceProviderWebhookEventId: { type: ["string", "null"] },
        sourceProviderQueryJobId: { type: ["string", "null"] },
      },
    },
    MailMediaArtifactListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailMediaArtifact" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailMediaArtifactResponse: envelope({ $ref: "#/components/schemas/MailMediaArtifact" }),
    MailMediaTrack: {
      type: "object",
      additionalProperties: false,
      required: ["id", "MailInboxId", "participantId", "trackKind", "trackSource", "status"],
      properties: {
        id: { type: "string" },
        MailInboxId: { type: "string" },
        participantId: { type: "string" },
        trackKind: { type: "string", enum: ["audio", "video", "screen_share", "data"] },
        trackSource: {
          type: "string",
          enum: ["microphone", "camera", "screen", "system", "custom"],
        },
        providerTrackId: { type: ["string", "null"] },
        status: { type: "string", enum: ["publishing", "muted", "stopped", "failed"] },
        startedAt: { type: ["string", "null"], format: "date-time" },
        endedAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        mutedDurationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        endReason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailMailInboxCompletionQualitySummary: {
      type: "object",
      additionalProperties: false,
      required: ["sampleCount", "participantSampleCount"],
      properties: {
        sampleCount: { type: "integer", minimum: 0 },
        participantSampleCount: { type: "integer", minimum: 0 },
        avgLatencyMs: { type: ["integer", "null"], minimum: 0 },
        maxLatencyMs: { type: ["integer", "null"], minimum: 0 },
        avgJitterMs: { type: ["integer", "null"], minimum: 0 },
        maxJitterMs: { type: ["integer", "null"], minimum: 0 },
        maxPacketLossRate: { type: ["string", "null"] },
        minBitrateKbps: { type: ["integer", "null"], minimum: 0 },
        avgBitrateKbps: { type: ["integer", "null"], minimum: 0 },
        firstSampledAt: { type: ["string", "null"], format: "date-time" },
        lastSampledAt: { type: ["string", "null"], format: "date-time" },
      },
    },
    MailMailInboxCompletionRecordingSummary: {
      type: "object",
      additionalProperties: false,
      required: [
        "artifactCount",
        "recordingArtifactCount",
        "readyArtifactCount",
        "failedArtifactCount",
        "processingArtifactCount",
        "driveResourceCount",
      ],
      properties: {
        artifactCount: { type: "integer", minimum: 0 },
        recordingArtifactCount: { type: "integer", minimum: 0 },
        readyArtifactCount: { type: "integer", minimum: 0 },
        failedArtifactCount: { type: "integer", minimum: 0 },
        processingArtifactCount: { type: "integer", minimum: 0 },
        totalDurationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        driveResourceCount: { type: "integer", minimum: 0 },
      },
    },
    MailMailInboxCompletionParticipantSummary: {
      type: "object",
      additionalProperties: false,
      required: ["participantId", "userId", "displayName", "role", "state"],
      properties: {
        participantId: { type: "string" },
        userId: { type: "string" },
        displayName: { type: "string" },
        role: { type: "string", enum: ["host", "guest", "listener"] },
        state: { type: "string", enum: ["joining", "joined", "left", "kicked", "timeout"] },
        joinedAt: { type: ["string", "null"], format: "date-time" },
        leftAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        leaveReason: { type: ["string", "null"], maxLength: 500 },
        providerParticipantId: { type: ["string", "null"] },
      },
    },
    MailMailInboxCompletionTrackSummary: {
      type: "object",
      additionalProperties: false,
      required: ["trackId", "participantId", "trackKind", "trackSource", "status"],
      properties: {
        trackId: { type: "string" },
        participantId: { type: "string" },
        trackKind: { type: "string", enum: ["audio", "video", "screen_share", "data"] },
        trackSource: {
          type: "string",
          enum: ["microphone", "camera", "screen", "system", "custom"],
        },
        status: { type: "string", enum: ["publishing", "muted", "stopped", "failed"] },
        startedAt: { type: ["string", "null"], format: "date-time" },
        endedAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        mutedDurationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        endReason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailMailInboxCompletionArtifactSummary: {
      type: "object",
      additionalProperties: false,
      required: [
        "artifactId",
        "artifactKind",
        "artifactStatus",
        "mediaRole",
        "driveUri",
        "driveSpaceId",
        "driveSpaceType",
        "driveNodeId",
      ],
      properties: {
        artifactId: { type: "string" },
        artifactKind: {
          type: "string",
          enum: ["recording", "transcript", "screen_share", "snapshot", "other"],
        },
        artifactStatus: {
          type: "string",
          enum: ["pending", "processing", "ready", "failed", "deleted"],
        },
        mediaRole: { type: "string" },
        driveUri: { type: "string", pattern: "^drive://spaces/.+/nodes/.+$" },
        driveSpaceId: { type: "string" },
        driveSpaceType: {
          type: "string",
          enum: ["Mail"],
          description:
            "Dedicated Drive space type used by SDKWork Mail post-session recording and artifact archives.",
        },
        driveNodeId: { type: "string" },
        driveNodeVersion: { type: ["string", "null"] },
        providerArtifactId: { type: ["string", "null"] },
        startedAt: { type: ["string", "null"], format: "date-time" },
        endedAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        failureReason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailMailInboxCompletionRecord: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "tenantId",
        "organizationId",
        "MailInboxId",
        "roomId",
        "ownerUserId",
        "mediaMode",
        "sessionStatus",
        "participantCount",
        "maxConcurrentParticipants",
        "qualitySummary",
        "recordingSummary",
        "participants",
        "tracks",
        "artifacts",
        "completionSnapshotHash",
        "recordedAt",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        MailInboxId: { type: "string" },
        roomId: { type: "string" },
        ownerUserId: { type: "string" },
        providerProfileId: { type: ["string", "null"] },
        providerSessionId: { type: ["string", "null"] },
        mediaMode: { type: "string", enum: ["audio", "video", "live"] },
        sessionStatus: {
          type: "string",
          enum: ["preparing", "active", "closing", "ended", "failed"],
        },
        startedAt: { type: ["string", "null"], format: "date-time" },
        connectedAt: { type: ["string", "null"], format: "date-time" },
        endedAt: { type: ["string", "null"], format: "date-time" },
        durationMs: { type: ["string", "null"], pattern: "^[0-9]+$" },
        endReason: { type: ["string", "null"], maxLength: 500 },
        endSource: {
          type: ["string", "null"],
          enum: [
            "manual_close",
            "provider_webhook",
            "active_provider_query",
            "provider_state_sync",
            "timeout",
            "system_reconcile",
            "unknown",
            null,
          ],
        },
        participantCount: { type: "integer", minimum: 0 },
        maxConcurrentParticipants: { type: "integer", minimum: 0 },
        qualitySummary: { $ref: "#/components/schemas/MailMailInboxCompletionQualitySummary" },
        recordingSummary: {
          $ref: "#/components/schemas/MailMailInboxCompletionRecordingSummary",
        },
        participants: {
          type: "array",
          items: { $ref: "#/components/schemas/MailMailInboxCompletionParticipantSummary" },
        },
        tracks: {
          type: "array",
          items: { $ref: "#/components/schemas/MailMailInboxCompletionTrackSummary" },
        },
        artifacts: {
          type: "array",
          items: { $ref: "#/components/schemas/MailMailInboxCompletionArtifactSummary" },
        },
        sourceWebhookEventId: { type: ["string", "null"] },
        sourceProviderQueryJobId: { type: ["string", "null"] },
        completionSnapshot: { type: "object", additionalProperties: true },
        completionSnapshotHash: { type: "string" },
        recordedAt: { type: "string", format: "date-time" },
      },
    },
    MailMailInboxCompletionRecordResponse: envelope({
      $ref: "#/components/schemas/MailMailInboxCompletionRecord",
    }),
    MailProviderAccount: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "tenantId",
        "organizationId",
        "provider",
        "code",
        "name",
        "status",
        "environment",
        "version",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        provider: { type: "string" },
        code: { type: "string" },
        name: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "archived"] },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        externalTenantId: { type: ["string", "null"] },
        cloudAccountId: { type: ["string", "null"] },
        projectId: { type: ["string", "null"] },
        resourceGroupId: { type: ["string", "null"] },
        lastVerifiedAt: { type: ["string", "null"], format: "date-time" },
        lastVerificationError: { type: ["string", "null"], maxLength: 1000 },
        createdBy: { type: ["string", "null"] },
        updatedBy: { type: ["string", "null"] },
        createdAt: { type: ["string", "null"], format: "date-time" },
        updatedAt: { type: ["string", "null"], format: "date-time" },
        version: { type: "string", pattern: "^[0-9]+$" },
        deletedAt: { type: ["string", "null"], format: "date-time" },
        deletedBy: { type: ["string", "null"] },
      },
    },
    MailProviderAccountCommand: {
      type: "object",
      additionalProperties: false,
      required: ["provider", "code", "name", "environment"],
      properties: {
        provider: { type: "string" },
        code: { type: "string" },
        name: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "archived"] },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        externalTenantId: { type: ["string", "null"] },
        cloudAccountId: { type: ["string", "null"] },
        projectId: { type: ["string", "null"] },
        resourceGroupId: { type: ["string", "null"] },
      },
    },
    MailProviderAccountDisableRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailProviderAccountListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderAccount" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderAccountResponse: envelope({
      $ref: "#/components/schemas/MailProviderAccount",
    }),
    MailProviderApplication: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "tenantId",
        "organizationId",
        "providerAccountId",
        "provider",
        "code",
        "name",
        "status",
        "environment",
        "providerApplicationId",
        "providerApplicationIdKind",
        "configSnapshot",
        "version",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        providerAccountId: { type: "string" },
        provider: { type: "string" },
        code: { type: "string" },
        name: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "archived"] },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        region: { type: ["string", "null"] },
        providerApplicationId: { type: "string" },
        providerApplicationIdKind: {
          type: "string",
          enum: ["volcengine_app_id", "tencent_sdk_app_id", "provider_application_id"],
        },
        accessEndpoint: { type: ["string", "null"], format: "uri" },
        apiEndpoint: { type: ["string", "null"], format: "uri" },
        apiHost: { type: ["string", "null"] },
        apiVersion: { type: ["string", "null"] },
        webhookCallbackUrl: { type: ["string", "null"], format: "uri" },
        configSnapshot: { type: "object", additionalProperties: true },
        lastVerifiedAt: { type: ["string", "null"], format: "date-time" },
        lastVerificationError: { type: ["string", "null"], maxLength: 1000 },
        createdBy: { type: ["string", "null"] },
        updatedBy: { type: ["string", "null"] },
        createdAt: { type: ["string", "null"], format: "date-time" },
        updatedAt: { type: ["string", "null"], format: "date-time" },
        version: { type: "string", pattern: "^[0-9]+$" },
        deletedAt: { type: ["string", "null"], format: "date-time" },
        deletedBy: { type: ["string", "null"] },
      },
    },
    MailProviderApplicationCommand: {
      type: "object",
      additionalProperties: false,
      required: [
        "code",
        "name",
        "environment",
        "providerApplicationId",
        "providerApplicationIdKind",
        "configSnapshot",
      ],
      properties: {
        code: { type: "string" },
        name: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "archived"] },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        region: { type: ["string", "null"] },
        providerApplicationId: { type: "string" },
        providerApplicationIdKind: {
          type: "string",
          enum: ["volcengine_app_id", "tencent_sdk_app_id", "provider_application_id"],
        },
        accessEndpoint: { type: ["string", "null"], format: "uri" },
        apiEndpoint: { type: ["string", "null"], format: "uri" },
        apiHost: { type: ["string", "null"] },
        apiVersion: { type: ["string", "null"] },
        webhookCallbackUrl: { type: ["string", "null"], format: "uri" },
        configSnapshot: { type: "object", additionalProperties: true },
      },
    },
    MailProviderApplicationDisableRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailProviderApplicationListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderApplication" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderApplicationResponse: envelope({
      $ref: "#/components/schemas/MailProviderApplication",
    }),
    MailProviderCredential: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "tenantId",
        "organizationId",
        "providerAccountId",
        "providerApplicationId",
        "provider",
        "credentialRole",
        "credentialLabel",
        "credentialRef",
        "status",
        "version",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        providerAccountId: { type: "string" },
        providerApplicationId: { type: "string" },
        provider: { type: "string" },
        credentialRole: {
          type: "string",
          enum: [
            "mail_token_signing",
            "open_api_signing",
            "usersig_signing",
            "cloud_api_signing",
            "webhook_signing",
          ],
        },
        credentialLabel: { type: "string" },
        credentialRef: {
          type: "string",
          description:
            "Reference to secret-managed provider credential material. Raw provider secrets are never returned by the Mail API.",
        },
        credentialFingerprint: { type: ["string", "null"] },
        secretVersion: { type: ["string", "null"] },
        status: {
          type: "string",
          enum: ["active", "pending", "disabled", "revoked", "expired"],
        },
        validFrom: { type: ["string", "null"], format: "date-time" },
        expiresAt: { type: ["string", "null"], format: "date-time" },
        rotationDueAt: { type: ["string", "null"], format: "date-time" },
        rotatedAt: { type: ["string", "null"], format: "date-time" },
        revokedAt: { type: ["string", "null"], format: "date-time" },
        lastVerifiedAt: { type: ["string", "null"], format: "date-time" },
        lastUsedAt: { type: ["string", "null"], format: "date-time" },
        createdBy: { type: ["string", "null"] },
        updatedBy: { type: ["string", "null"] },
        createdAt: { type: ["string", "null"], format: "date-time" },
        updatedAt: { type: ["string", "null"], format: "date-time" },
        version: { type: "string", pattern: "^[0-9]+$" },
      },
    },
    MailProviderCredentialCommand: {
      type: "object",
      additionalProperties: false,
      required: ["credentialRole", "credentialLabel", "credentialRef"],
      properties: {
        credentialRole: {
          type: "string",
          enum: [
            "mail_token_signing",
            "open_api_signing",
            "usersig_signing",
            "cloud_api_signing",
            "webhook_signing",
          ],
        },
        credentialLabel: { type: "string" },
        credentialRef: { type: "string" },
        credentialFingerprint: { type: ["string", "null"] },
        secretVersion: { type: ["string", "null"] },
        status: {
          type: "string",
          enum: ["active", "pending", "disabled", "revoked", "expired"],
        },
        validFrom: { type: ["string", "null"], format: "date-time" },
        expiresAt: { type: ["string", "null"], format: "date-time" },
        rotationDueAt: { type: ["string", "null"], format: "date-time" },
      },
    },
    MailProviderCredentialRevokeRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailProviderCredentialListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderCredential" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderCredentialResponse: envelope({
      $ref: "#/components/schemas/MailProviderCredential",
    }),
    MailProviderProfile: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "provider",
        "code",
        "name",
        "status",
        "isDefault",
        "priority",
        "environment",
        "capabilities",
        "healthStatus",
        "version",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        provider: { type: "string" },
        code: { type: "string" },
        name: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "archived"] },
        isDefault: { type: "boolean" },
        priority: { type: "integer", minimum: 0 },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        region: { type: ["string", "null"] },
        providerAppId: { type: ["string", "null"] },
        endpoint: { type: ["string", "null"], format: "uri" },
        credentialRef: {
          type: ["string", "null"],
          description:
            "Reference to secret-managed provider credentials. Raw provider secrets are never returned by the Mail API.",
        },
        credentialFingerprint: { type: ["string", "null"] },
        webhookSecretRef: {
          type: ["string", "null"],
          description:
            "Reference to secret-managed webhook verification material. Raw webhook secrets are never returned by the Mail API.",
        },
        webhookSecretFingerprint: { type: ["string", "null"] },
        capabilities: { $ref: "#/components/schemas/MailProviderCapabilitySnapshot" },
        configSnapshot: { type: "object", additionalProperties: true },
        healthStatus: {
          type: "string",
          enum: ["unknown", "healthy", "degraded", "unhealthy"],
        },
        lastVerifiedAt: { type: ["string", "null"], format: "date-time" },
        lastVerificationLatencyMs: { type: ["integer", "null"], minimum: 0 },
        lastVerificationError: { type: ["string", "null"], maxLength: 1000 },
        createdAt: { type: ["string", "null"], format: "date-time" },
        updatedAt: { type: ["string", "null"], format: "date-time" },
        version: { type: "string", pattern: "^[0-9]+$" },
      },
    },
    MailActiveProviderProfile: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "provider",
        "code",
        "name",
        "isDefault",
        "priority",
        "environment",
        "capabilities",
        "healthStatus",
      ],
      properties: {
        id: { type: "string" },
        provider: { type: "string" },
        code: { type: "string" },
        name: { type: "string" },
        isDefault: { type: "boolean" },
        priority: { type: "integer", minimum: 0 },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        region: { type: ["string", "null"] },
        providerAppId: { type: ["string", "null"] },
        endpoint: { type: ["string", "null"], format: "uri" },
        capabilities: { $ref: "#/components/schemas/MailProviderCapabilitySnapshot" },
        healthStatus: {
          type: "string",
          enum: ["unknown", "healthy", "degraded", "unhealthy"],
        },
      },
    },
    MailProviderCapabilitySnapshot: {
      type: "object",
      additionalProperties: false,
      required: [
        "audio",
        "video",
        "live",
        "screenShare",
        "recording",
        "webhook",
        "activeQuery",
      ],
      properties: {
        audio: { type: "boolean" },
        video: { type: "boolean" },
        live: { type: "boolean" },
        screenShare: { type: "boolean" },
        recording: { type: "boolean" },
        webhook: { type: "boolean" },
        activeQuery: { type: "boolean" },
        maxParticipants: { type: ["integer", "null"], minimum: 0 },
        supportedRegions: {
          type: "array",
          items: { type: "string" },
        },
        providerFeatures: { type: "object", additionalProperties: true },
      },
    },
    MailProviderProfileCommand: {
      type: "object",
      additionalProperties: false,
      required: [
        "provider",
        "code",
        "name",
        "environment",
        "capabilities",
        "configSnapshot",
      ],
      properties: {
        provider: { type: "string" },
        code: { type: "string" },
        name: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "archived"] },
        isDefault: { type: "boolean", default: false },
        priority: { type: "integer", minimum: 0, default: 100 },
        environment: {
          type: "string",
          enum: ["production", "staging", "development", "test", "sandbox"],
        },
        region: { type: ["string", "null"] },
        providerAppId: { type: ["string", "null"] },
        endpoint: { type: ["string", "null"], format: "uri" },
        credentialRef: { type: ["string", "null"] },
        webhookSecretRef: { type: ["string", "null"] },
        capabilities: { $ref: "#/components/schemas/MailProviderCapabilitySnapshot" },
        configSnapshot: { type: "object", additionalProperties: true },
      },
    },
    MailProviderProfileDisableRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailProviderProfileVerifyRequest: {
      type: "object",
      additionalProperties: false,
      required: ["queryKind"],
      properties: {
        queryKind: {
          type: "string",
          enum: ["credential", "webhook", "active_query", "recording", "full"],
        },
        timeoutMs: { type: ["integer", "null"], minimum: 1000, maximum: 60000 },
      },
    },
    MailProviderProfileVerifyResult: {
      type: "object",
      additionalProperties: false,
      required: ["providerProfileId", "provider", "status", "verifiedAt"],
      properties: {
        providerProfileId: { type: "string" },
        provider: { type: "string" },
        status: {
          type: "string",
          enum: ["healthy", "degraded", "unhealthy"],
        },
        verifiedAt: { type: "string", format: "date-time" },
        latencyMs: { type: ["integer", "null"], minimum: 0 },
        checks: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderProfileVerifyCheck" },
        },
      },
    },
    MailProviderProfileVerifyCheck: {
      type: "object",
      additionalProperties: false,
      required: ["name", "status"],
      properties: {
        name: { type: "string" },
        status: { type: "string", enum: ["passed", "warning", "failed", "skipped"] },
        detail: { type: ["string", "null"] },
      },
    },
    MailProviderProfileListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderProfile" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailActiveProviderProfileListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailActiveProviderProfile" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderProfileResponse: envelope({ $ref: "#/components/schemas/MailProviderProfile" }),
    MailProviderProfileVerifyResultResponse: envelope({
      $ref: "#/components/schemas/MailProviderProfileVerifyResult",
    }),
    MailProviderRoute: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "tenantId",
        "organizationId",
        "providerProfileId",
        "routeType",
        "priority",
        "status",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        providerProfileId: { type: "string" },
        routeType: { type: "string", enum: ["region"] },
        region: { type: ["string", "null"] },
        priority: { type: "integer" },
        status: { type: "string", enum: ["active", "disabled"] },
      },
    },
    MailProviderRouteCommand: {
      type: "object",
      additionalProperties: false,
      required: ["providerProfileId", "routeType"],
      properties: {
        providerProfileId: { type: "string" },
        routeType: { type: "string", enum: ["region"] },
        region: { type: ["string", "null"] },
        priority: { type: "integer", default: 100 },
        status: { type: "string", enum: ["active", "disabled"] },
      },
    },
    MailProviderRouteDisableRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: ["string", "null"], maxLength: 500 },
      },
    },
    MailProviderRouteListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderRoute" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderRouteResponse: envelope({ $ref: "#/components/schemas/MailProviderRoute" }),
    MailQualitySample: {
      type: "object",
      additionalProperties: false,
      required: ["id", "MailInboxId", "sampledAt"],
      properties: {
        id: { type: "string" },
        MailInboxId: { type: "string" },
        participantId: { type: ["string", "null"] },
        latencyMs: { type: ["integer", "null"] },
        packetLossRate: { type: ["string", "null"] },
        jitterMs: { type: ["integer", "null"] },
        bitrateKbps: { type: ["integer", "null"] },
        sampledAt: { type: "string", format: "date-time" },
      },
    },
    MailQualitySampleListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailQualitySample" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderWebhookEvent: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "provider",
        "eventType",
        "eventKind",
        "payloadHash",
        "receivedAt",
        "status",
      ],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        provider: { type: "string" },
        providerProfileId: { type: ["string", "null"] },
        externalEventId: { type: ["string", "null"] },
        eventType: { type: "string" },
        eventKind: {
          type: "string",
          enum: [
            "room_started",
            "room_ended",
            "participant_joined",
            "participant_left",
            "recording_started",
            "recording_completed",
            "recording_failed",
            "media_track_started",
            "media_track_stopped",
            "quality_sample",
            "unknown",
          ],
        },
        roomId: { type: ["string", "null"] },
        MailInboxId: { type: ["string", "null"] },
        participantId: { type: ["string", "null"] },
        recordingId: { type: ["string", "null"] },
        payloadHash: { type: "string" },
        rawPayload: { type: "object", additionalProperties: true },
        normalizedEvent: { type: "object", additionalProperties: true },
        signatureHeader: { type: ["string", "null"] },
        receivedAt: { type: "string", format: "date-time" },
        processedAt: { type: ["string", "null"], format: "date-time" },
        status: { type: "string", enum: ["received", "processed", "duplicate", "failed"] },
      },
    },
    MailProviderWebhookReceiveRequest: {
      type: "object",
      additionalProperties: true,
      properties: {
        providerProfileId: { type: ["string", "null"] },
        externalEventId: { type: ["string", "null"] },
        signatureHeader: { type: ["string", "null"] },
        headers: {
          type: "object",
          additionalProperties: { type: "string" },
        },
        rawPayload: { type: "object", additionalProperties: true },
        receivedAt: {
          type: ["string", "null"],
          format: "date-time",
          description:
            "Optional gateway receive timestamp. The Mail runtime records the authoritative receive time when this field is absent.",
        },
      },
      description:
        "Mail provider webhook body. Provider gateways may wrap the provider payload in rawPayload, while direct Volcengine/Tencent callbacks may send provider-native JSON at the top level; the Mail provider plugin normalizes either shape and verifies provider-native signatures.",
    },
    MailProviderWebhookEventListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderWebhookEvent" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderWebhookEventResponse: envelope({
      $ref: "#/components/schemas/MailProviderWebhookEvent",
    }),
    MailProviderQueryJob: {
      type: "object",
      additionalProperties: false,
      required: ["id", "provider", "queryKind", "targetKind", "targetId", "status", "requestedAt"],
      properties: {
        id: { type: "string" },
        tenantId: { type: "string" },
        organizationId: { type: "string" },
        provider: { type: "string" },
        providerProfileId: { type: ["string", "null"] },
        queryKind: {
          type: "string",
          enum: [
            "room_online_users",
            "room_state",
            "media_session_state",
            "recording_artifacts",
            "quality_samples",
          ],
        },
        targetKind: { type: "string", enum: ["room", "media_session", "recording", "quality"] },
        targetId: { type: "string" },
        roomId: { type: ["string", "null"] },
        MailInboxId: { type: ["string", "null"] },
        providerSessionId: { type: ["string", "null"] },
        providerRequestId: { type: ["string", "null"] },
        status: { type: "string", enum: ["requested", "running", "completed", "failed"] },
        requestedAt: { type: "string", format: "date-time" },
        completedAt: { type: ["string", "null"], format: "date-time" },
        resultSnapshot: { type: "object", additionalProperties: true },
      },
    },
    MailProviderQueryJobCreateRequest: {
      type: "object",
      additionalProperties: false,
      required: ["provider", "queryKind"],
      properties: {
        provider: { type: "string" },
        providerProfileId: { type: ["string", "null"] },
        queryKind: {
          type: "string",
          enum: [
            "room_online_users",
            "room_state",
            "media_session_state",
            "recording_artifacts",
            "quality_samples",
          ],
        },
        roomId: { type: ["string", "null"] },
        MailInboxId: { type: ["string", "null"] },
        providerSessionId: { type: ["string", "null"] },
        cursor: { type: ["string", "null"] },
      },
    },
    MailProviderQueryJobListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderQueryJob" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    MailProviderQueryJobResponse: envelope({ $ref: "#/components/schemas/MailProviderQueryJob" }),
    MailProviderQuerySnapshot: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "providerQueryJobId",
        "provider",
        "queryKind",
        "targetKind",
        "targetId",
        "snapshotKind",
        "snapshotPayload",
        "capturedAt",
      ],
      properties: {
        id: { type: "string" },
        providerQueryJobId: { type: "string" },
        provider: { type: "string" },
        queryKind: { type: "string" },
        targetKind: { type: "string" },
        targetId: { type: "string" },
        providerSessionId: { type: ["string", "null"] },
        snapshotKind: { type: "string" },
        snapshotPayload: { type: "object", additionalProperties: true },
        capturedAt: { type: "string", format: "date-time" },
      },
    },
    MailProviderQuerySnapshotListResponse: envelope({
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/MailProviderQuerySnapshot" },
        },
        nextCursor: { type: ["string", "null"] },
      },
    }),
    ProblemDetail: {
      type: "object",
      additionalProperties: true,
      required: ["type", "title", "status"],
      properties: {
        type: { type: "string", format: "uri-reference" },
        title: { type: "string" },
        status: { type: "integer", minimum: 100, maximum: 599 },
        detail: { type: "string" },
        instance: { type: "string" },
        code: { type: "string" },
        traceId: { type: "string" },
        requestId: {
          type: "string",
          format: "uuid",
          description: "Server-owned request correlation id.",
        },
        errors: {
          type: "array",
          items: { $ref: "#/components/schemas/FieldError" },
        },
      },
    },
    FieldError: {
      type: "object",
      additionalProperties: false,
      required: ["field", "message"],
      properties: {
        field: { type: "string" },
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  };
}

function envelope(dataSchema) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["code", "message", "requestId", "data"],
    properties: {
      code: { type: "string" },
      message: { type: "string" },
      requestId: {
        type: "string",
        format: "uuid",
        description: "Server-owned request correlation id.",
      },
      data: dataSchema,
    },
  };
}

function operationRequestSchemaName(route) {
  switch (route.operationId) {
    case "Mail.MailInboxs.create":
      return "MailCreateMailInboxRequest";
    case "Mail.MailInboxs.close":
      return "MailCloseMailInboxRequest";
    case "Mail.providerAccounts.create":
    case "Mail.providerAccounts.update":
      return "MailProviderAccountCommand";
    case "Mail.providerAccounts.disable":
      return "MailProviderAccountDisableRequest";
    case "Mail.providerAccounts.applications.create":
    case "Mail.providerApplications.update":
      return "MailProviderApplicationCommand";
    case "Mail.providerApplications.disable":
      return "MailProviderApplicationDisableRequest";
    case "Mail.providerApplications.credentials.create":
    case "Mail.providerCredentials.update":
      return "MailProviderCredentialCommand";
    case "Mail.providerCredentials.revoke":
      return "MailProviderCredentialRevokeRequest";
    case "Mail.providerProfiles.create":
    case "Mail.providerProfiles.update":
      return "MailProviderProfileCommand";
    case "Mail.providerProfiles.disable":
      return "MailProviderProfileDisableRequest";
    case "Mail.providerProfiles.verify":
      return "MailProviderProfileVerifyRequest";
    case "Mail.providerRoutes.create":
    case "Mail.providerRoutes.update":
      return "MailProviderRouteCommand";
    case "Mail.providerRoutes.disable":
      return "MailProviderRouteDisableRequest";
    case "Mail.providerWebhooks.events.receive":
      return "MailProviderWebhookReceiveRequest";
    case "Mail.providerQueryJobs.create":
      return "MailProviderQueryJobCreateRequest";
    default:
      return usesJsonBody(route.method.toLowerCase()) ? "MailOperationCommand" : null;
  }
}

function operationResponseSchemaName(route) {
  switch (route.operationId) {
    case "Mail.rooms.list":
      return "MailRoomListResponse";
    case "Mail.rooms.retrieve":
      return "MailRoomResponse";
    case "Mail.MailInboxs.list":
      return "MailMailInboxListResponse";
    case "Mail.MailInboxs.create":
    case "Mail.MailInboxs.retrieve":
    case "Mail.MailInboxs.close":
      return "MailMailInboxResponse";
    case "Mail.MailInboxs.completionRecord.retrieve":
      return "MailMailInboxCompletionRecordResponse";
    case "Mail.MailInboxs.participantCredentials.issue":
      return "MailParticipantCredentialResponse";
    case "Mail.MailInboxs.recordingArtifacts.list":
    case "Mail.mediaArtifacts.list":
      return "MailMediaArtifactListResponse";
    case "Mail.mediaArtifacts.retrieve":
      return "MailMediaArtifactResponse";
    case "Mail.providerProfiles.active.list":
      return "MailActiveProviderProfileListResponse";
    case "Mail.providerAccounts.list":
      return "MailProviderAccountListResponse";
    case "Mail.providerAccounts.create":
    case "Mail.providerAccounts.retrieve":
    case "Mail.providerAccounts.update":
    case "Mail.providerAccounts.disable":
      return "MailProviderAccountResponse";
    case "Mail.providerAccounts.applications.list":
      return "MailProviderApplicationListResponse";
    case "Mail.providerAccounts.applications.create":
    case "Mail.providerApplications.retrieve":
    case "Mail.providerApplications.update":
    case "Mail.providerApplications.disable":
      return "MailProviderApplicationResponse";
    case "Mail.providerApplications.credentials.list":
      return "MailProviderCredentialListResponse";
    case "Mail.providerApplications.credentials.create":
    case "Mail.providerCredentials.retrieve":
    case "Mail.providerCredentials.update":
    case "Mail.providerCredentials.revoke":
      return "MailProviderCredentialResponse";
    case "Mail.providerProfiles.list":
      return "MailProviderProfileListResponse";
    case "Mail.providerProfiles.create":
    case "Mail.providerProfiles.retrieve":
    case "Mail.providerProfiles.update":
    case "Mail.providerProfiles.disable":
      return "MailProviderProfileResponse";
    case "Mail.providerProfiles.verify":
      return "MailProviderProfileVerifyResultResponse";
    case "Mail.providerRoutes.list":
      return "MailProviderRouteListResponse";
    case "Mail.providerRoutes.create":
    case "Mail.providerRoutes.retrieve":
    case "Mail.providerRoutes.update":
    case "Mail.providerRoutes.disable":
      return "MailProviderRouteResponse";
    case "Mail.qualitySamples.list":
      return "MailQualitySampleListResponse";
    case "Mail.providerWebhooks.events.list":
      return "MailProviderWebhookEventListResponse";
    case "Mail.providerWebhooks.events.receive":
      return "MailProviderWebhookEventResponse";
    case "Mail.providerQueryJobs.create":
    case "Mail.providerQueryJobs.retrieve":
      return "MailProviderQueryJobResponse";
    case "Mail.providerQueryJobs.snapshots.list":
      return "MailProviderQuerySnapshotListResponse";
    default:
      return "MailApiResult";
  }
}

function jsonResponse(description, schemaRef) {
  return {
    description,
    content: {
      "application/json": {
        schema: { $ref: schemaRef },
      },
    },
  };
}

function problemResponse(description) {
  return {
    description,
    content: {
      "application/problem+json": {
        schema: { $ref: "#/components/schemas/ProblemDetail" },
      },
    },
  };
}

function extractPathParameters(path) {
  const parameters = [];
  for (const match of path.matchAll(/\{([^}]+)\}/g)) {
    parameters.push({
      name: match[1],
      in: "path",
      required: true,
      schema: { type: "string" },
    });
  }
  return parameters;
}

function queryParameter(name, schema) {
  return {
    name,
    in: "query",
    required: false,
    schema,
  };
}

function usesJsonBody(method) {
  return method === "post" || method === "put" || method === "patch";
}

function isListOperation(route) {
  return route.method.toLowerCase() === "get" && route.operationId.endsWith(".list");
}

function compareRoutes(left, right) {
  return left.path.localeCompare(right.path) || left.method.localeCompare(right.method);
}

function toHandlerName(operationId) {
  return operationId.replace(/^Mail\./, "").replaceAll(".", "_");
}

function toTitle(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function relativeForDisplay(filePath) {
  return relative(MailRoot, filePath).replace(/\\/g, "/");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

await main();
