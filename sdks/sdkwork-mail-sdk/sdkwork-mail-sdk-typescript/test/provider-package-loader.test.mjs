import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const packageRoot = path.resolve('.');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

async function loadSdk() {
  return import('../dist/index.js');
}

function createPackageImporter() {
  return async (_packageIdentity, packageEntry) => {
    const manifestPath = path.join(packageRoot, packageEntry.manifestPath);
    const manifest = readJson(manifestPath);
    const entrypointPath = path.join(path.dirname(manifestPath), manifest.exports['.'].import);
    return import(pathToFileURL(entrypointPath).href);
  };
}

function getProviderEntrypointPaths() {
  const providersRoot = path.join(packageRoot, 'providers');

  return readdirSync(providersRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(providersRoot, entry.name, 'index.js'));
}

test('provider package entrypoints avoid top-level await for browser production bundlers', () => {
  const entrypointPaths = getProviderEntrypointPaths();
  assert.ok(entrypointPaths.length > 0, 'expected provider package entrypoints');

  for (const entrypointPath of entrypointPaths) {
    const source = readFileSync(entrypointPath, 'utf8');
    assert.doesNotMatch(
      source,
      /\bconst\s+MailSdk\s*=\s*await\b/u,
      `${path.relative(packageRoot, entrypointPath)} must not assign an awaited Mail SDK module at top level`,
    );
    assert.doesNotMatch(
      source,
      /\bawait\s+importMailSdk\s*\(/u,
      `${path.relative(packageRoot, entrypointPath)} must not use top-level await to import @sdkwork/Mail-sdk`,
    );
    assert.match(
      source,
      /from '@sdkwork\/Mail-sdk';/u,
      `${path.relative(packageRoot, entrypointPath)} must statically import @sdkwork/Mail-sdk`,
    );
  }
});

test('loadMailProviderModule resolves provider packages by providerKey and packageIdentity', async () => {
  const {
    createMailProviderPackageLoader,
    loadMailProviderModule,
    getMailProviderPackageByProviderKey,
    getMailProviderPackageByPackageIdentity,
  } = await loadSdk();

  const agoraPackage = getMailProviderPackageByProviderKey('agora');
  assert.ok(agoraPackage);

  const loader = createMailProviderPackageLoader(createPackageImporter());
  const byProviderKey = await loadMailProviderModule({ providerKey: 'agora' }, loader);
  const byPackageIdentity = await loadMailProviderModule(
    { packageIdentity: agoraPackage.packageIdentity },
    loader,
  );

  assert.equal(byProviderKey.packageName, '@sdkwork/Mail-sdk-provider-agora');
  assert.equal(byProviderKey.metadata.providerKey, 'agora');
  assert.equal(byPackageIdentity.packageName, '@sdkwork/Mail-sdk-provider-agora');
  assert.equal(byPackageIdentity.metadata.providerKey, 'agora');
  assert.deepEqual(
    getMailProviderPackageByPackageIdentity(agoraPackage.packageIdentity),
    agoraPackage,
  );
});

test('loadMailProviderModule rejects loader drift between requested package and returned module', async () => {
  const {
    MailSdkException,
    loadMailProviderModule,
    getMailProviderPackageByProviderKey,
  } = await loadSdk();

  const tencentPackage = getMailProviderPackageByProviderKey('tencent');
  assert.ok(tencentPackage);

  await assert.rejects(
    async () =>
      loadMailProviderModule(
        {
          providerKey: 'agora',
        },
        async (_target) => {
          const tencentManifestPath = path.join(packageRoot, tencentPackage.manifestPath);
          const tencentManifest = readJson(tencentManifestPath);
          const tencentEntrypointPath = path.join(
            path.dirname(tencentManifestPath),
            tencentManifest.exports['.'].import,
          );
          const tencentNamespace = await import(pathToFileURL(tencentEntrypointPath).href);

          return {
            AGORA_mail_PROVIDER_MODULE: tencentNamespace[tencentPackage.moduleSymbol],
          };
        },
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_module_contract_mismatch' &&
      error.providerKey === 'agora' &&
      error.details?.expectedProviderKey === 'agora' &&
      error.details?.receivedProviderKey === 'tencent',
  );
});

test('installMailProviderPackage installs a package-boundary provider through the standard loader SPI', async () => {
  const {
    MailDriverManager,
    createMailProviderPackageLoader,
    installMailProviderPackage,
  } = await loadSdk();

  const nativeClient = { sdk: 'agora-web-native' };
  const manager = await installMailProviderPackage(
    new MailDriverManager(),
    {
      providerKey: 'agora',
      options: {
        nativeFactory: async () => nativeClient,
      },
    },
    createMailProviderPackageLoader(createPackageImporter()),
  );

  const client = await manager.connect({ providerKey: 'agora' });
  assert.equal(client.unwrap(), nativeClient);
  assert.deepEqual(manager.describeProviderSupport('agora'), {
    providerKey: 'agora',
    status: 'builtin_registered',
    builtin: true,
    official: true,
    registered: true,
  });
});

test('installMailProviderPackages keeps registration atomic after loading all provider packages', async () => {
  const {
    MailDriverManager,
    MailSdkException,
    createMailProviderPackageLoader,
    installMailProviderPackages,
  } = await loadSdk();

  const manager = new MailDriverManager();
  const loader = createMailProviderPackageLoader(createPackageImporter());

  await assert.rejects(
    async () =>
      installMailProviderPackages(
        manager,
        [
          {
            providerKey: 'agora',
            options: {
              nativeFactory: async () => ({ sdk: 'agora-web-native' }),
            },
          },
          {
            providerKey: 'agora',
            options: {
              nativeFactory: async () => ({ sdk: 'agora-web-native-2' }),
            },
          },
        ],
        loader,
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'driver_already_registered' &&
      error.providerKey === 'agora',
  );

  assert.deepEqual(manager.describeProviderSupport('agora'), {
    providerKey: 'agora',
    status: 'official_unregistered',
    builtin: true,
    official: true,
    registered: false,
  });
});

test('loadMailProviderModule exposes stable package-loading failures', async () => {
  const {
    MailSdkException,
    createMailProviderPackageLoader,
    loadMailProviderModule,
  } = await loadSdk();

  await assert.rejects(
    async () =>
      loadMailProviderModule(
        {
          providerKey: 'vendor-x',
        },
        createMailProviderPackageLoader(createPackageImporter()),
      ),
    (error) => error instanceof MailSdkException && error.code === 'provider_package_not_found',
  );

  await assert.rejects(
    async () =>
      loadMailProviderModule(
        {
          providerKey: 'agora',
          packageIdentity: '@sdkwork/Mail-sdk-provider-twilio',
        },
        createMailProviderPackageLoader(createPackageImporter()),
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_package_identity_mismatch',
  );

  await assert.rejects(
    async () =>
      loadMailProviderModule(
        {
          providerKey: 'agora',
        },
        createMailProviderPackageLoader(async () => {
          throw new Error('simulated loader failure');
        }),
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_package_load_failed',
  );

  await assert.rejects(
    async () =>
      loadMailProviderModule(
        {
          providerKey: 'agora',
        },
        async () => ({}),
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_module_export_missing',
  );
});
