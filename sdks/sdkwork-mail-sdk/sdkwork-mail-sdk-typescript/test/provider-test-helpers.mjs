import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
export const packageRoot = path.resolve(testDir, '..');

let resolverRegistered = false;

function ensureTestMailSdkResolver() {
  if (resolverRegistered) {
    return;
  }

  register(pathToFileURL(path.join(testDir, 'test-mail-sdk-resolver.mjs')).href, import.meta.url);
  resolverRegistered = true;
}

ensureTestMailSdkResolver();

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export async function loadSdk() {
  return import('../dist/index.js');
}

export function createProviderPackageImporter() {
  return async (_packageIdentity, packageEntry) => {
    const manifestPath = path.join(packageRoot, packageEntry.manifestPath);
    const manifest = readJson(manifestPath);
    const entrypointPath = path.join(path.dirname(manifestPath), manifest.exports['.'].import);
    return import(pathToFileURL(entrypointPath).href);
  };
}

export async function loadProviderPackage(providerKey) {
  const sdk = await loadSdk();
  const packageEntry = sdk.getMailProviderPackageByProviderKey(providerKey);

  if (!packageEntry) {
    throw new Error(`Unknown Mail provider package: ${providerKey}`);
  }

  const namespace = await createProviderPackageImporter()(
    packageEntry.packageIdentity,
    packageEntry,
  );

  return {
    sdk,
    packageEntry,
    namespace,
    providerModule: namespace[packageEntry.moduleSymbol],
  };
}

export async function createManagerWithProviderPackages(providerKeys, optionsByProviderKey = {}) {
  const sdk = await loadSdk();
  const loader = sdk.createMailProviderPackageLoader(createProviderPackageImporter());
  const manager = await sdk.installMailProviderPackages(
    new sdk.MailDriverManager(),
    providerKeys.map((providerKey) => ({
      providerKey,
      options: optionsByProviderKey[providerKey] ?? {},
    })),
    loader,
  );

  return {
    sdk,
    manager,
  };
}
