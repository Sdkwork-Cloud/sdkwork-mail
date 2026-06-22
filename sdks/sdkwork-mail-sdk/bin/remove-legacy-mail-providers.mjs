import { readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KEEP_PROVIDER_KEYS = new Set(['smtp', 'imap']);
const LEGACY_PROVIDER_KEYS = [
  'volcengine',
  'aliyun',
  'tencent',
  'agora',
  'zego',
  'livekit',
  'twilio',
  'jitsi',
  'janus',
  'mediasoup',
];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(scriptDir, '..');

const providerRoots = [
  path.join(sdkRoot, 'sdkwork-mail-sdk-typescript', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-flutter', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-rust', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-java', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-python', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-go', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-kotlin', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-csharp', 'providers'),
  path.join(sdkRoot, 'sdkwork-mail-sdk-swift', 'providers'),
];

function providerKeyFromDirName(name) {
  const normalized = name.toLowerCase();
  if (
    normalized.includes('providersmtp') ||
    normalized.endsWith('.smtp') ||
    normalized.endsWith('_smtp') ||
    normalized.endsWith('-smtp') ||
    normalized.includes('provider_smtp') ||
    normalized.includes('provider-smtp')
  ) {
    return 'smtp';
  }
  if (
    normalized.includes('providerimap') ||
    normalized.endsWith('.imap') ||
    normalized.endsWith('_imap') ||
    normalized.endsWith('-imap') ||
    normalized.includes('provider_imap') ||
    normalized.includes('provider-imap')
  ) {
    return 'imap';
  }
  for (const legacyKey of LEGACY_PROVIDER_KEYS) {
    if (normalized.includes(legacyKey)) {
      return legacyKey;
    }
  }
  return normalized;
}

let removed = 0;
for (const providersRoot of providerRoots) {
  let entries = [];
  try {
    entries = readdirSync(providersRoot);
  } catch {
    continue;
  }

  for (const entry of entries) {
    const entryPath = path.join(providersRoot, entry);
    if (!statSync(entryPath).isDirectory()) {
      continue;
    }
    const providerKey = providerKeyFromDirName(entry);
    if (KEEP_PROVIDER_KEYS.has(providerKey)) {
      continue;
    }
    rmSync(entryPath, { recursive: true, force: true });
    removed += 1;
    console.log(`[remove-legacy-mail-providers] removed ${entryPath}`);
  }
}

console.log(`[remove-legacy-mail-providers] removed ${removed} legacy provider directories`);
