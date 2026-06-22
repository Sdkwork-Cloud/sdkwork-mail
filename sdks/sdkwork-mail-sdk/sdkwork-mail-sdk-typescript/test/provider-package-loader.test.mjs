import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import './provider-test-helpers.mjs';

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
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('mail-sdk-provider-'))
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

  const smtpPackage = getMailProviderPackageByProviderKey('smtp');
  assert.ok(smtpPackage);

  const loader = createMailProviderPackageLoader(createPackageImporter());
  const byProviderKey = await loadMailProviderModule({ providerKey: 'smtp' }, loader);
  const byPackageIdentity = await loadMailProviderModule(
    { packageIdentity: smtpPackage.packageIdentity },
    loader,
  );

  assert.equal(byProviderKey.packageName, '@sdkwork/Mail-sdk-provider-smtp');
  assert.equal(byProviderKey.metadata.providerKey, 'smtp');
  assert.equal(byPackageIdentity.packageName, '@sdkwork/Mail-sdk-provider-smtp');
  assert.equal(byPackageIdentity.metadata.providerKey, 'smtp');
  assert.deepEqual(
    getMailProviderPackageByPackageIdentity(smtpPackage.packageIdentity),
    smtpPackage,
  );
});

test('loadMailProviderModule rejects loader drift between requested package and returned module', async () => {
  const {
    MailSdkException,
    loadMailProviderModule,
    getMailProviderPackageByProviderKey,
  } = await loadSdk();

  const imapPackage = getMailProviderPackageByProviderKey('imap');
  assert.ok(imapPackage);

  await assert.rejects(
    async () =>
      loadMailProviderModule(
        {
          providerKey: 'smtp',
        },
        async (_target) => {
          const imapManifestPath = path.join(packageRoot, imapPackage.manifestPath);
          const imapManifest = readJson(imapManifestPath);
          const imapEntrypointPath = path.join(
            path.dirname(imapManifestPath),
            imapManifest.exports['.'].import,
          );
          const imapNamespace = await import(pathToFileURL(imapEntrypointPath).href);

          return {
            SMTP_mail_PROVIDER_MODULE: imapNamespace[imapPackage.moduleSymbol],
          };
        },
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_module_contract_mismatch' &&
      error.providerKey === 'smtp' &&
      error.details?.expectedProviderKey === 'smtp' &&
      error.details?.receivedProviderKey === 'imap',
  );
});

test('installMailProviderPackage installs a package-boundary provider through the standard loader SPI', async () => {
  const {
    MailDriverManager,
    createMailProviderPackageLoader,
    installMailProviderPackage,
  } = await loadSdk();

  const nativeClient = { sdk: 'smtp-transport-native' };
  const manager = await installMailProviderPackage(
    new MailDriverManager(),
    {
      providerKey: 'smtp',
      options: {
        nativeFactory: async () => nativeClient,
      },
    },
    createMailProviderPackageLoader(createPackageImporter()),
  );

  const client = await manager.connect({ providerKey: 'smtp' });
  assert.equal(client.unwrap(), nativeClient);
  assert.deepEqual(manager.describeProviderSupport('smtp'), {
    providerKey: 'smtp',
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
            providerKey: 'smtp',
            options: {
              nativeFactory: async () => ({ sdk: 'smtp-transport-native' }),
            },
          },
          {
            providerKey: 'smtp',
            options: {
              nativeFactory: async () => ({ sdk: 'smtp-transport-native-2' }),
            },
          },
        ],
        loader,
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'driver_already_registered' &&
      error.providerKey === 'smtp',
  );

  assert.deepEqual(manager.describeProviderSupport('smtp'), {
    providerKey: 'smtp',
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
          providerKey: 'smtp',
          packageIdentity: '@sdkwork/Mail-sdk-provider-imap',
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
          providerKey: 'smtp',
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
          providerKey: 'smtp',
        },
        async () => ({}),
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_module_export_missing',
  );
});
