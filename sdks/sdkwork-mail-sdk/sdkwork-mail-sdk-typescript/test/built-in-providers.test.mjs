import assert from 'node:assert/strict';
import test from 'node:test';
import { createManagerWithProviderPackages } from './provider-test-helpers.mjs';

async function loadSdk() {
  return import('../dist/index.js');
}

test('built-in provider metadata exports the stable provider key set', async () => {
  const { BUILTIN_mail_PROVIDER_KEYS, getBuiltinMailProviderMetadata } = await loadSdk();

  assert.deepEqual(BUILTIN_mail_PROVIDER_KEYS, [
    'volcengine',
    'aliyun',
    'tencent',
    'agora',
    'livekit',
  ]);

  const metadata = getBuiltinMailProviderMetadata();
  assert.deepEqual(
    metadata.map((entry) => entry.providerKey),
    BUILTIN_mail_PROVIDER_KEYS,
  );
});

test('built-in provider metadata keeps volcengine as the only default-selected provider', async () => {
  const { getBuiltinMailProviderMetadata } = await loadSdk();

  const metadata = getBuiltinMailProviderMetadata();
  const defaultSelected = metadata.filter((entry) => entry.defaultSelected);

  assert.equal(defaultSelected.length, 1);
  assert.equal(defaultSelected[0].providerKey, 'volcengine');
});

test('built-in providers advertise the required capability baseline', async () => {
  const { getBuiltinMailProviderMetadata, REQUIRED_mail_CAPABILITIES } = await loadSdk();

  for (const metadata of getBuiltinMailProviderMetadata()) {
    assert.deepEqual(metadata.requiredCapabilities, REQUIRED_mail_CAPABILITIES);
    assert.ok(metadata.optionalCapabilities.includes('screen-share'));
    assert.ok(metadata.optionalCapabilities.includes('recording'));
  }
});

test('built-in provider clients unwrap the exact native client instance', async () => {
  const nativeClient = { sdk: 'tencent-web-native' };
  const { manager } = await createManagerWithProviderPackages(['tencent'], {
    tencent: {
      nativeFactory: async () => nativeClient,
    },
  });

  const client = await manager.connect({ providerKey: 'tencent' });
  assert.equal(client.unwrap(), nativeClient);
});
