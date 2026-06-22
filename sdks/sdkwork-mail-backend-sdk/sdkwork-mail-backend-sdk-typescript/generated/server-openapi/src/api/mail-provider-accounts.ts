import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CreateMailProviderAccountRequest, CreateMailProviderAccountResponse, MailProviderAccountListResponse, MailProviderPingResponse, MailProviderSyncResponse, SyncMailProviderAccountRequest } from '../types';


export class MailProviderAccountsMailProviderAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(): Promise<MailProviderAccountListResponse> {
    return this.client.get<MailProviderAccountListResponse>(backendApiPath(`/mail/provider_accounts`));
  }

async create(body: CreateMailProviderAccountRequest): Promise<CreateMailProviderAccountResponse> {
    return this.client.post<CreateMailProviderAccountResponse>(backendApiPath(`/mail/provider_accounts`), body, undefined, undefined, 'application/json');
  }

async ping(accountId: string): Promise<MailProviderPingResponse> {
    return this.client.post<MailProviderPingResponse>(backendApiPath(`/mail/provider_accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/ping`));
  }

async sync(accountId: string, body?: SyncMailProviderAccountRequest): Promise<MailProviderSyncResponse> {
    return this.client.post<MailProviderSyncResponse>(backendApiPath(`/mail/provider_accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/sync`), body, undefined, undefined, 'application/json');
  }
}

export class MailProviderAccountsMailApi {
  private client: HttpClient;
  public readonly providerAccounts: MailProviderAccountsMailProviderAccountsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.providerAccounts = new MailProviderAccountsMailProviderAccountsApi(client);
  }

}

export class MailProviderAccountsApi {
  private client: HttpClient;
  public readonly mail: MailProviderAccountsMailApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.mail = new MailProviderAccountsMailApi(client);
  }

}

export function createMailProviderAccountsApi(client: HttpClient): MailProviderAccountsApi {
  return new MailProviderAccountsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
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
