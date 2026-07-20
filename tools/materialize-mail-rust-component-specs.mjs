#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");

const canonicalSpecs = [
  ["README.md", "SDKWork root standards entrypoint."],
  ["COMPONENT_SPEC.md", "Local component specs directory and manifest rules."],
  ["CODE_STYLE_SPEC.md", "Authored code organization and testing rules."],
  ["NAMING_SPEC.md", "Canonical SDKWork naming."],
  ["RUST_CODE_SPEC.md", "Rust crate shape and verification rules."],
  ["TEST_SPEC.md", "Contract and verification rules."],
  ["API_SPEC.md", "HTTP API contract rules."],
  ["WEB_FRAMEWORK_SPEC.md", "Mandatory web framework integration rules."],
  ["WEB_BACKEND_SPEC.md", "Web backend layering rules."],
  ["DATABASE_SPEC.md", "Database contract rules."],
];

function specPaths() {
  return canonicalSpecs.map(([file, purpose]) => ({
    file,
    path: `../../../../sdkwork-specs/${file}`,
    purpose,
  }));
}

const components = [
  {
    crateDir: "crates/sdkwork-communication-mail-service",
    name: "sdkwork-communication-mail-service",
    displayName: "SDKWork Communication Mail Service",
    type: "rust-crate",
    capability: "mail",
    publicExports: [
      "MailPersistencePort",
      "MailAccount",
      "MailMessage",
      "MAIL_APP_API_AUTHORITY",
      "MAIL_BACKEND_API_AUTHORITY",
    ],
    verify: "cargo test -p sdkwork-communication-mail-service",
    routeManifest: null,
    runtimeEntrypoints: ["Cargo.toml"],
  },
  {
    crateDir: "crates/sdkwork-communication-mail-repository-sqlx",
    name: "sdkwork-communication-mail-repository-sqlx",
    displayName: "SDKWork Communication Mail Repository SQLx",
    type: "rust-crate",
    capability: "mail",
    publicExports: [
      "connect_mail_persistence_bootstrap_from_env",
      "MailPostgresPersistencePort",
      "MAIL_TABLES",
    ],
    verify: "cargo test -p sdkwork-communication-mail-repository-sqlx",
    routeManifest: null,
    runtimeEntrypoints: ["Cargo.toml"],
    databasePrefixRegistries: ["specs/database-prefix-registry.json"],
    databaseTableRegistries: ["specs/database-table-registry.json"],
  },
  {
    crateDir: "crates/sdkwork-routes-mail-app-api",
    name: "sdkwork-routes-mail-app-api",
    displayName: "SDKWork Router Mail App API",
    type: "rust-crate",
    capability: "mail",
    surface: "app",
    publicExports: [
      "build_sdkwork_mail_app_api_router",
      "wrap_router_with_web_framework_from_env",
    ],
    verify: "cargo test -p sdkwork-routes-mail-app-api",
    routeManifest:
      "sdks/_route-manifests/app-api/sdkwork-routes-mail-app-api.route-manifest.json",
    runtimeEntrypoints: ["Cargo.toml"],
  },
  {
    crateDir: "crates/sdkwork-routes-mail-backend-api",
    name: "sdkwork-routes-mail-backend-api",
    displayName: "SDKWork Router Mail Backend API",
    type: "rust-crate",
    capability: "mail",
    surface: "backend-admin",
    publicExports: [
      "build_sdkwork_mail_backend_api_router",
      "wrap_router_with_web_framework_from_env",
    ],
    verify: "cargo test -p sdkwork-routes-mail-backend-api",
    routeManifest:
      "sdks/_route-manifests/backend-api/sdkwork-routes-mail-backend-api.route-manifest.json",
    runtimeEntrypoints: ["Cargo.toml"],
  },
  {
    crateDir: "crates/sdkwork-mail-service-host",
    name: "sdkwork-mail-service-host",
    displayName: "SDKWork Mail Service Host",
    type: "rust-crate",
    capability: "mail",
    publicExports: ["MailProductService"],
    verify: "cargo test -p sdkwork-mail-service-host",
    routeManifest: null,
    runtimeEntrypoints: ["Cargo.toml"],
  },
  {
    crateDir: "crates/sdkwork-api-mail-standalone-gateway",
    name: "sdkwork-api-mail-standalone-gateway",
    displayName: "SDKWork Mail API Server",
    type: "rust-crate",
    capability: "mail",
    publicExports: [],
    verify: "cargo test -p sdkwork-api-mail-standalone-gateway",
    routeManifest: null,
    runtimeEntrypoints: ["src/main.rs"],
  },
  {
    crateDir: "crates/sdkwork-mail-app-context",
    name: "sdkwork-mail-app-context",
    displayName: "SDKWork Mail App Context",
    type: "rust-crate",
    capability: "mail",
    publicExports: [
      "AppContext",
      "app_context_from_web_request",
      "app_context_from_web_principal",
    ],
    verify: "cargo test -p sdkwork-mail-app-context",
    routeManifest: null,
    runtimeEntrypoints: ["Cargo.toml"],
  },
  {
    crateDir: "crates/sdkwork-mail-openapi",
    name: "sdkwork-mail-openapi",
    displayName: "SDKWork Mail OpenAPI Helpers",
    type: "rust-crate",
    capability: "mail",
    publicExports: [
      "build_openapi_document",
      "extract_routes_from_function",
      "render_docs_html",
    ],
    verify: "cargo test -p sdkwork-mail-openapi",
    routeManifest: null,
    runtimeEntrypoints: ["Cargo.toml"],
  },
  {
    crateDir: "crates/sdkwork-mail-api-registry",
    name: "sdkwork-mail-api-registry",
    displayName: "SDKWork Mail API Registry",
    type: "rust-crate",
    capability: "mail",
    publicExports: ["HttpMethod"],
    verify: "cargo test -p sdkwork-mail-api-registry",
    routeManifest: null,
    runtimeEntrypoints: ["Cargo.toml"],
  },
];

function buildReadme(component) {
  return `# ${component.displayName} Specs

## Purpose

Local component contract for \`${component.name}\`.

## Owner

sdkwork-mail.

## Verification

\`\`\`powershell
${component.verify}
\`\`\`
`;
}

function buildManifest(component) {
  return {
    schemaVersion: 1,
    kind: "sdkwork.component.spec",
    component: {
      name: component.name,
      displayName: component.displayName,
      version: "0.1.0",
      type: component.type,
      root: `sdkwork-mail/${component.crateDir.replaceAll("\\", "/")}`,
      domain: "communication",
      declaredDomain: null,
      capability: component.capability,
      ...(component.surface ? { surface: component.surface } : {}),
      status: "standardizing",
      languages: ["rust"],
      generated: false,
      private: false,
      manifests: ["Cargo.toml"],
    },
    canonicalSpecs: specPaths(),
    contracts: {
      publicExports: component.publicExports,
      runtimeEntrypoints: component.runtimeEntrypoints,
      routeManifest: component.routeManifest,
      sdkClients: [],
      sdkDependencies: [],
      dependencyApiExports: [],
      dependencyApiSurfaces: [],
      events: [],
      configKeys: [],
      ...(component.databasePrefixRegistries
        ? { databasePrefixRegistries: component.databasePrefixRegistries }
        : {}),
      ...(component.databaseTableRegistries
        ? { databaseTableRegistries: component.databaseTableRegistries }
        : {}),
    },
    integration: {
      authority:
        "Root SDKWork specs remain authoritative. Local specs may extend but must not contradict them.",
      dependencyPolicy:
        "Consumers integrate through public crate exports, route manifests, and generated SDK clients only.",
      sdkPolicy:
        "Generated SDK clients are the HTTP transport boundary; route crates must not be consumed as app SDKs.",
      languagePolicy:
        "Rust crates follow Cargo workspace dependency rules and SDKWork naming.",
    },
    verification: {
      commands: [component.verify],
    },
    metadata: {
      managedBy: "sdkwork-mail",
      standardVersion: "2026-06-18",
    },
  };
}

function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

let driftDetected = false;

for (const component of components) {
  const specsDir = path.join(root, component.crateDir, "specs");
  const readmePath = path.join(specsDir, "README.md");
  const manifestPath = path.join(specsDir, "component.spec.json");
  const readme = buildReadme(component);
  const manifest = serializeManifest(buildManifest(component));

  if (checkOnly) {
    assert.ok(fs.existsSync(readmePath), `${readmePath} must exist`);
    assert.ok(fs.existsSync(manifestPath), `${manifestPath} must exist`);
    const currentReadme = fs.readFileSync(readmePath, "utf8");
    const currentManifest = fs.readFileSync(manifestPath, "utf8");
    if (currentReadme !== readme) {
      console.error(`[Mail-rust-component-specs] drift: ${readmePath}`);
      driftDetected = true;
    }
    if (currentManifest !== manifest) {
      console.error(`[Mail-rust-component-specs] drift: ${manifestPath}`);
      driftDetected = true;
    }
    continue;
  }

  fs.mkdirSync(specsDir, { recursive: true });
  fs.writeFileSync(readmePath, readme);
  fs.writeFileSync(manifestPath, manifest);
}

if (checkOnly) {
  if (driftDetected) {
    console.error(
      "[Mail-rust-component-specs] check failed; run node tools/materialize-Mail-rust-component-specs.mjs",
    );
    process.exit(1);
  }
  console.log(`[Mail-rust-component-specs] check passed (${components.length} components)`);
} else {
  console.log(`[Mail-rust-component-specs] wrote ${components.length} component specs`);
}
