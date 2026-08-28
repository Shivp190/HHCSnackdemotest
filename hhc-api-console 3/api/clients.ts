import { request } from './client';
import type { Client } from './types';

export function listClients() {
  return request<Client[]>('GET', 'api/client/list', undefined, { auth: false });
}

export function getClient(id: number) {
  return request<Client>('GET', `api/client/${id}`, undefined, { auth: true });
}

export function editClient(id: number, body: Partial<Client>) {
  return request<Client>('PUT', `api/client/${id}/edit`, body, { auth: true });
}

export function deleteClient(id: number) {
  return request<{ info: string }>('DELETE', `api/client/${id}/delete`, undefined, { auth: true });
}
