import { backendApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { CreateMailProviderAccountRequest, CreateMailProviderAccountResponse, MailProviderAccount, MailProviderPingResponse, MailProviderSyncResponse, SyncMailProviderAccountRequest } from '../types';


export class MailProviderAccountsMailProviderAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(requestOptions?: ApiRequestOptions): Promise<{ items: MailProviderAccount[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    return this.client.request<{ items: MailProviderAccount[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(backendApiPath(`/mail/provider_accounts`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

async create(body: CreateMailProviderAccountRequest, requestOptions?: ApiRequestOptions): Promise<CreateMailProviderAccountResponse> {
    return this.client.request<CreateMailProviderAccountResponse>(backendApiPath(`/mail/provider_accounts`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

async ping(accountId: string, requestOptions?: ApiRequestOptions): Promise<MailProviderPingResponse> {
    return this.client.request<MailProviderPingResponse>(backendApiPath(`/mail/provider_accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/ping`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, sdkworkUnwrapKind: 'item' });
  }

async sync(accountId: string, body?: SyncMailProviderAccountRequest, requestOptions?: ApiRequestOptions): Promise<MailProviderSyncResponse> {
    return this.client.request<MailProviderSyncResponse>(backendApiPath(`/mail/provider_accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/sync`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, ...(body !== undefined ? { body, contentType: 'application/json' } : {}), sdkworkUnwrapKind: 'item' });
  }
}

export class MailProviderAccountsMailApi {
  public readonly providerAccounts: MailProviderAccountsMailProviderAccountsApi;

  constructor(client: HttpClient) {
    this.providerAccounts = new MailProviderAccountsMailProviderAccountsApi(client);
  }

}

export class MailProviderAccountsApi {
  public readonly mail: MailProviderAccountsMailApi;

  constructor(client: HttpClient) {
    this.mail = new MailProviderAccountsMailApi(client);
  }

}

export function createMailProviderAccountsApi(client: HttpClient): MailProviderAccountsApi {
  return new MailProviderAccountsApi(client);
}



interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
