import { dispatch } from '../mock/router';
import type { Method } from './endpoints';

// Display-only: nothing is ever actually fetched from this host in the mock
// edition. Kept so the on-screen path matches the real console.
export const BASE_URL = 'https://hhcapi.premiumasp.net';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export interface RequestResult<T = unknown> {
  status: number;
  ms: number;
  data: T;
  raw: string; // compact JSON, as it would arrive over the wire
}

export interface RequestOptions {
  auth?: boolean;
}

let getTokenFn: () => string | null | undefined = () => null;
let onUnauthorizedFn: () => void = () => {};

export function configureClient(opts: {
  getToken: () => string | null | undefined;
  onUnauthorized: () => void;
}) {
  getTokenFn = opts.getToken;
  onUnauthorizedFn = opts.onUnauthorized;
}

export async function request<T = unknown>(
  method: Method,
  path: string,
  body?: string | unknown,
  options: RequestOptions = {}
): Promise<RequestResult<T>> {
  const started = Date.now();
  const token = options.auth === false ? undefined : getTokenFn();
  const rawBody = typeof body === 'string' ? body : body !== undefined ? JSON.stringify(body) : undefined;

  const result = await dispatch(method, path, rawBody, token);
  const ms = Date.now() - started;
  const raw = JSON.stringify(result.data);

  // Only an authenticated route's own 401 should sign the demo user out —
  // a bad-credentials 401 from a public login endpoint must not.
  if (result.status === 401 && options.auth) {
    onUnauthorizedFn();
  }

  if (result.status >= 400) {
    const info = (result.data as { info?: string } | null)?.info ?? `HTTP ${result.status}`;
    throw new ApiError(result.status, info, result.data);
  }

  return { status: result.status, ms, data: result.data as T, raw };
}
