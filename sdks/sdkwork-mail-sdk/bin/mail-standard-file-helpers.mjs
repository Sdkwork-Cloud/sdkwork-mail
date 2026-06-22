import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function readUtf8File(filePath) {
  return readFileSync(filePath, 'utf8');
}

export function writeUtf8File(filePath, content) {
  writeFileSync(filePath, content, 'utf8');
}

export function readJsonFile(filePath) {
  return JSON.parse(readUtf8File(filePath));
}

export function writePrettyJsonFile(filePath, value) {
  writeUtf8File(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function resolveMailSdkWorkspaceRoot(importMetaUrl) {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), '..');
}

export function resolveMailSdkSdksRootFromWorkspaceRoot(workspaceRoot) {
  return path.resolve(workspaceRoot, '..');
}

export function resolveMailSdkSdksRoot(importMetaUrl) {
  return resolveMailSdkSdksRootFromWorkspaceRoot(resolveMailSdkWorkspaceRoot(importMetaUrl));
}

export function resolveMailSdkAppRootFromWorkspaceRoot(workspaceRoot) {
  return path.resolve(workspaceRoot, '..', '..');
}

export function resolveMailSdkAppRoot(importMetaUrl) {
  return resolveMailSdkAppRootFromWorkspaceRoot(resolveMailSdkWorkspaceRoot(importMetaUrl));
}

export function resolveMailSdkSdksReadmePathFromWorkspaceRoot(workspaceRoot) {
  return path.join(resolveMailSdkSdksRootFromWorkspaceRoot(workspaceRoot), 'README.md');
}

export function resolveMailSdkSdksReadmePath(importMetaUrl) {
  return resolveMailSdkSdksReadmePathFromWorkspaceRoot(resolveMailSdkWorkspaceRoot(importMetaUrl));
}
