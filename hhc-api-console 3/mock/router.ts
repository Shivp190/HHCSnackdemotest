import { ENDPOINTS, Endpoint, Method } from '../api/endpoints';
import type { Caregiver, Provider } from '../api/types';
import { store } from './store';
import { makeToken, parseToken, isExpired } from './jwt';
import type { SeedUser } from './seed';

export interface MockResponse {
  status: number;
  data: unknown;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

function randomLatency() {
  return 80 + Math.floor(Math.random() * 171); // 80–250ms
}

function matchPath(pattern: string, actual: string): Record<string, string> | null {
  const p = pattern.split('/');
  const a = actual.split('/');
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    const seg = p[i];
    if (seg.startsWith('{') && seg.endsWith('}')) {
      params[seg.slice(1, -1)] = a[i];
    } else if (seg !== a[i]) {
      return null;
    }
  }
  return params;
}

function findEndpoint(method: Method, path: string): { endpoint: Endpoint; params: Record<string, string> } | null {
  for (const endpoint of ENDPOINTS) {
    if (endpoint.method !== method) continue;
    const params = matchPath(endpoint.path, path);
    if (params) return { endpoint, params };
  }
  return null;
}

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function requireFields(body: Record<string, unknown> | undefined, fields: string[]): string | null {
  for (const f of fields) {
    const v = body ? body[f] : undefined;
    if (v == null || String(v).trim() === '') return `${f} is required.`;
  }
  return null;
}

function checkAuth(endpoint: Endpoint, token: string | null | undefined): boolean {
  if (!endpoint.auth) return true;
  const payload = parseToken(token);
  return !!payload && !isExpired(payload);
}

function findUserByEmail(email: string): SeedUser | undefined {
  return store.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Answers a request the way AIS.WebApi would: same status, same info body. */
export async function dispatch(
  method: Method,
  path: string,
  rawBody: string | undefined,
  token: string | null | undefined
): Promise<MockResponse> {
  await sleep(randomLatency());

  const match = findEndpoint(method, path);
  if (!match) {
    return { status: 404, data: { info: 'Not found' } };
  }
  const { endpoint, params } = match;

  let body: Record<string, unknown> | undefined;
  if (rawBody !== undefined && rawBody !== '') {
    try {
      body = JSON.parse(rawBody);
    } catch {
      return { status: 400, data: { info: 'Body is not valid JSON.' } };
    }
  }

  if (!checkAuth(endpoint, token)) {
    return { status: 401, data: { info: 'Unauthorized' } };
  }

  const key = `${method} ${endpoint.path}`;

  switch (key) {
    case 'GET api/auth/start':
      return { status: 200, data: 'HHC API Console mock is online.' };

    case 'POST api/auth/generate/token': {
      const username = String(body?.username ?? '');
      const password = String(body?.password ?? '');
      const user = username ? findUserByEmail(username) : undefined;
      if (!user || !user.password || user.password !== password) {
        return { status: 401, data: { info: 'You are not a valid user so token generation failed.' } };
      }
      return { status: 200, data: { access_token: makeToken(user.id, 'Admin'), help_info: 'Welcome back.' } };
    }

    case 'POST api/auth/login/request-otp': {
      const email = String(body?.email ?? '');
      if (!email || !isEmailValid(email)) {
        return { status: 400, data: { info: 'A valid email is required.' } };
      }
      let user = findUserByEmail(email);
      if (!user) {
        user = { id: `otp-${Date.now()}`, email, password: null, first_name: '', last_name: '' };
        store.data.users.push(user);
      }
      store.data.otps = store.data.otps.filter((o) => o.email.toLowerCase() !== email.toLowerCase());
      store.data.otps.push({ email, code: '123456', expiresAt: Date.now() + 10 * 60 * 1000 });
      return { status: 200, data: { info: 'OTP sent' } };
    }

    case 'POST api/auth/login/verify-otp': {
      const email = String(body?.email ?? '');
      const otp = String(body?.otp ?? '');
      const record = store.data.otps.find((o) => o.email.toLowerCase() === email.toLowerCase());
      const user = findUserByEmail(email);
      if (!record || !user || record.code !== otp || Date.now() > record.expiresAt) {
        return { status: 401, data: { info: 'Invalid or expired OTP.' } };
      }
      store.data.otps = store.data.otps.filter((o) => o.email.toLowerCase() !== email.toLowerCase());
      return { status: 200, data: { accessToken: makeToken(user.id, 'User'), info: 'OTP verified successfully.' } };
    }

    case 'POST api/auth/register': {
      const missing = requireFields(body, ['first_name', 'last_name', 'email', 'password']);
      if (missing) return { status: 400, data: { info: missing } };
      const email = String(body!.email);
      const password = String(body!.password);
      if (!isEmailValid(email)) return { status: 400, data: { info: 'A valid email is required.' } };
      if (password.length < 8) return { status: 400, data: { info: 'Password must be at least 8 characters.' } };

      let user = findUserByEmail(email);
      if (user && user.password) {
        return { status: 409, data: { info: 'An account with this email already exists. Sign in instead.' } };
      }
      if (user && !user.password) {
        user.password = password;
        user.first_name = String(body!.first_name);
        user.last_name = String(body!.last_name);
      } else {
        user = { id: `user-${Date.now()}`, email, password, first_name: String(body!.first_name), last_name: String(body!.last_name) };
        store.data.users.push(user);
      }
      return { status: 201, data: { access_token: makeToken(user.id, 'User'), help_info: 'Account created.' } };
    }

    case 'POST api/auth/login/volunteer': {
      const missing = requireFields(body, ['name', 'email', 'phone', 'areaOfInterest']);
      if (missing) return { status: 400, data: { info: missing } };
      const email = String(body!.email);
      const dup = store.data.volunteers.find((v) => v.email.toLowerCase() === email.toLowerCase());
      if (dup) return { status: 409, data: { info: 'A volunteer application with this email already exists.' } };
      store.data.volunteers.push({ id: store.nextVolunteerId(), ...(body as any) } as any);
      return { status: 200, data: { info: 'Thank you for volunteering with Health and Hope Clinic. Our team will reach out soon.' } };
    }

    case 'POST api/auth/login/patients': {
      const missing = requireFields(body, ['firstName', 'lastName', 'dateOfBirth', 'contactNumber']);
      if (missing) return { status: 400, data: { info: missing } };
      store.data.patient_requests.push({ id: store.nextPatientRequestId(), ...(body as any) } as any);
      return { status: 200, data: { info: 'Thank you. A member of our care team will contact you shortly.' } };
    }

    case 'POST api/auth/login/BHSurvey': {
      const missing = requireFields(body, ['respondentName', 'phone']);
      if (missing) return { status: 400, data: { info: missing } };
      store.data.surveys.push({ id: store.nextSurveyId(), ...(body as any) } as any);
      return { status: 200, data: { info: 'Thank you for completing the survey.' } };
    }

    case 'GET api/auth/test/patient-table':
      return { status: 200, data: { info: 'Database connection successful', recordCount: store.data.patient_requests.length } };

    case 'GET api/client/list':
      return { status: 200, data: store.data.clients };

    case 'GET api/client/{id}': {
      const id = Number(params.id);
      const row = store.data.clients.find((c) => c.id === id);
      if (!row) return { status: 404, data: { info: 'Not found' } };
      return { status: 200, data: row };
    }

    case 'PUT api/client/{id}/edit': {
      const id = Number(params.id);
      const idx = store.data.clients.findIndex((c) => c.id === id);
      if (idx === -1) return { status: 404, data: { info: 'Not found' } };
      store.data.clients[idx] = { ...store.data.clients[idx], ...(body as any), id };
      return { status: 200, data: store.data.clients[idx] };
    }

    case 'DELETE api/client/{id}/delete': {
      const id = Number(params.id);
      const idx = store.data.clients.findIndex((c) => c.id === id);
      if (idx === -1) return { status: 404, data: { info: 'Not found' } };
      store.data.clients.splice(idx, 1);
      return { status: 200, data: { info: 'Deleted' } };
    }

    case 'GET api/caregiver/list':
      return { status: 200, data: store.data.caregivers };

    case 'GET api/caregiver/{id}': {
      const id = Number(params.id);
      const row = store.data.caregivers.find((c) => c.caregiver_id === id);
      if (!row) return { status: 404, data: { info: 'Not found' } };
      return { status: 200, data: row };
    }

    case 'POST api/caregiver/add': {
      const id = store.nextCaregiverId();
      const row: Caregiver = {
        can_view_phi: false, can_edit_data: false, can_act_on_behalf: false, is_active: true,
        ...(body as any),
        caregiver_id: id,
        created_at: new Date().toISOString(),
      };
      store.data.caregivers.push(row);
      return { status: 200, data: row };
    }

    case 'PUT api/caregiver/{id}/edit': {
      const id = Number(params.id);
      const idx = store.data.caregivers.findIndex((c) => c.caregiver_id === id);
      if (idx === -1) return { status: 404, data: { info: 'Not found' } };
      store.data.caregivers[idx] = {
        ...store.data.caregivers[idx], ...(body as any), caregiver_id: id, updated_at: new Date().toISOString(),
      };
      return { status: 200, data: store.data.caregivers[idx] };
    }

    case 'DELETE api/caregiver/{id}/delete': {
      const id = Number(params.id);
      const idx = store.data.caregivers.findIndex((c) => c.caregiver_id === id);
      if (idx === -1) return { status: 404, data: { info: 'Not found' } };
      store.data.caregivers.splice(idx, 1);
      return { status: 200, data: { info: 'Deleted' } };
    }

    case 'GET api/provider/list':
      return { status: 200, data: store.data.providers };

    case 'GET api/provider/{id}': {
      const id = Number(params.id);
      const row = store.data.providers.find((p) => p.provider_id === id);
      if (!row) return { status: 404, data: { info: 'Not found' } };
      return { status: 200, data: row };
    }

    case 'POST api/provider/add': {
      const id = store.nextProviderId();
      const row: Provider = {
        is_active: true, country: 'US',
        ...(body as any),
        provider_id: id,
        created_at: new Date().toISOString(),
      };
      store.data.providers.push(row);
      return { status: 200, data: row };
    }

    case 'PUT api/provider/{id}/edit': {
      const id = Number(params.id);
      const idx = store.data.providers.findIndex((p) => p.provider_id === id);
      if (idx === -1) return { status: 404, data: { info: 'Not found' } };
      store.data.providers[idx] = {
        ...store.data.providers[idx], ...(body as any), provider_id: id, updated_at: new Date().toISOString(),
      };
      return { status: 200, data: store.data.providers[idx] };
    }

    case 'DELETE api/provider/{id}/delete': {
      const id = Number(params.id);
      const idx = store.data.providers.findIndex((p) => p.provider_id === id);
      if (idx === -1) return { status: 404, data: { info: 'Not found' } };
      store.data.providers.splice(idx, 1);
      return { status: 200, data: { info: 'Deleted' } };
    }

    default:
      return { status: 404, data: { info: 'Not found' } };
  }
}
