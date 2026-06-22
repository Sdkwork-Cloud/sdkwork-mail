import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const resolverDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(resolverDir, '..');
const rootSdkUrl = pathToFileURL(path.join(packageRoot, 'dist/index.js')).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@sdkwork/Mail-sdk') {
    return {
      url: rootSdkUrl,
      shortCircuit: true,
    };
  }

  return nextResolve(specifier, context);
}
