import { request } from './client';
import type { Provider } from './types';

export function listProviders() {
  return request<Provider[]>('GET', 'api/provider/list', undefined, { auth: false });
}

export function getProvider(id: number) {
  return request<Provider>('GET', `api/provider/${id}`, undefined, { auth: true });
}

export function addProvider(body: Partial<Provider>) {
  return request<Provider>('POST', 'api/provider/add', body, { auth: true });
}

export function editProvider(id: number, body: Partial<Provider>) {
  return request<Provider>('PUT', `api/provider/${id}/edit`, body, { auth: true });
}

export function deleteProvider(id: number) {
  return request<{ info: string }>('DELETE', `api/provider/${id}/delete`, undefined, { auth: true });
}
