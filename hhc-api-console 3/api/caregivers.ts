import { request } from './client';
import type { Caregiver } from './types';

export function listCaregivers() {
  return request<Caregiver[]>('GET', 'api/caregiver/list', undefined, { auth: false });
}

export function getCaregiver(id: number) {
  return request<Caregiver>('GET', `api/caregiver/${id}`, undefined, { auth: true });
}

export function addCaregiver(body: Partial<Caregiver>) {
  return request<Caregiver>('POST', 'api/caregiver/add', body, { auth: true });
}

export function editCaregiver(id: number, body: Partial<Caregiver>) {
  return request<Caregiver>('PUT', `api/caregiver/${id}/edit`, body, { auth: true });
}

export function deleteCaregiver(id: number) {
  return request<{ info: string }>('DELETE', `api/caregiver/${id}/delete`, undefined, { auth: true });
}
