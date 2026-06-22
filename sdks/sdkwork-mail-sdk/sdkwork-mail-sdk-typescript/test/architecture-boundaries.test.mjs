import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(testDir, '..');
const srcRoot = path.join(packageRoot, 'src');
const providersRoot = path.join(srcRoot, 'providers');
const providerPackagesRoot = path.join(packageRoot, 'providers');
const tsconfigBuildPath = path.join(packageRoot, 'tsconfig.build.json');

function readSource(relativePath) {
  return readFileSync(path.join(srcRoot, relativePath), 'utf8');
}

test('provider-neutral core files do not depend on provider implementation modules', () => {
  const providerNeutralFiles = [
    'errors.ts',
    'types.ts',
    'capabilities.ts',
    'client.ts',
    'driver.ts',
    'driver-manager.ts',
    'data-source.ts',
    'provider-module.ts',
    'provider-catalog.ts',
  ];

  for (const relativePath of providerNeutralFiles) {
    const source = readSource(relativePath);
    assert.doesNotMatch(
      source,
      /from\s+['"]\.\/providers\//,
      `expected ${relativePath} to stay outside provider implementation boundaries`,
    );
    assert.doesNotMatch(
      source,
      /from\s+['"]@sdkwork\/Mail-sdk-provider-|import\(['"]@sdkwork\/Mail-sdk-provider-/,
      `expected ${relativePath} to avoid static provider package imports`,
    );
  }
});

test('root package manifest keeps provider packages out of dependencies', () => {
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  const dependencyScopes = [
    manifest.dependencies ?? {},
    manifest.peerDependencies ?? {},
    manifest.optionalDependencies ?? {},
    manifest.devDependencies ?? {},
  ];

  for (const dependencies of dependencyScopes) {
    for (const dependencyName of Object.keys(dependencies)) {
      assert.doesNotMatch(
        dependencyName,
        /^@sdkwork\/Mail-sdk-provider-/,
        'root Mail SDK must not declare provider packages as direct dependencies',
      );
    }
  }
});

test('root package does not keep concrete provider implementation source files', () => {
  if (!existsSync(providersRoot)) {
    return;
  }

  assert.deepEqual(
    readdirSync(providersRoot),
    [],
    'src/providers is a retired root-public provider implementation boundary',
  );
});

test('root TypeScript build config has no retired provider implementation boundary globs', () => {
  const tsconfigBuild = JSON.parse(readFileSync(tsconfigBuildPath, 'utf8'));
  const serializedConfig = JSON.stringify(tsconfigBuild);

  assert.doesNotMatch(serializedConfig, /src\/providers/);
  assert.doesNotMatch(serializedConfig, /builtin-driver-manager/);
});

test('provider plugin entrypoints depend on the root public SDK boundary only', () => {
  const providerPackageDirs = readdirSync(providerPackagesRoot)
    .filter((entry) => entry.startsWith('mail-sdk-provider-'))
    .sort();

  assert.deepEqual(providerPackageDirs, [
    'mail-sdk-provider-imap',
    'mail-sdk-provider-smtp',
  ]);

  for (const providerPackageDir of providerPackageDirs) {
    const source = readFileSync(path.join(providerPackagesRoot, providerPackageDir, 'index.js'), 'utf8');
    assert.doesNotMatch(
      source,
      /dist\/providers|src\/providers/,
      `expected ${providerPackageDir} to avoid retired root provider implementation imports`,
    );
    assert.doesNotMatch(
      source,
      /import\('@sdkwork\/Mail-sdk'\)/,
      `expected ${providerPackageDir} to avoid browser-incompatible dynamic root SDK imports`,
    );
    assert.match(
      source,
      /from '@sdkwork\/Mail-sdk';/,
      `expected ${providerPackageDir} to statically load through the root public SDK package`,
    );
  }
});
