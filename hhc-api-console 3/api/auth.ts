import { request } from './client';
import type { LoginData, TokenResponse, OtpTokenResponse, RegisterRequest, ResponseHolder } from './types';

// Pure-JS base64url decoder — no Buffer, no atob (unavailable/inconsistent in
// RN). Deliberately independent of mock/jwt.ts: this file decodes whatever a
// real ASP.NET JWT's payload segment would contain too, so it needs no
// changes when api/client.ts is swapped for a live edition.
const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function base64UrlToUtf8(input: string): string {
  const lookup: Record<string, number> = {};
  for (let i = 0; i < B64URL.length; i++) lookup[B64URL[i]] = i;
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of input) {
    if (!(ch in lookup)) continue;
    buffer = (buffer << 6) | lookup[ch];
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const b0 = bytes[i];
    if (b0 < 0x80) {
      out += String.fromCharCode(b0);
      i += 1;
    } else if ((b0 & 0xe0) === 0xc0) {
      out += String.fromCharCode(((b0 & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else {
      out += String.fromCharCode(((b0 & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f));
      i += 3;
    }
  }
  return out;
}

export interface DecodedJwt {
  sub?: string;
  id?: string | number;
  access_role?: 'Admin' | 'User';
  exp?: number;
  [key: string]: unknown;
}

/** Decodes a JWT payload segment client-side, for display only. Does not verify a signature. */
export function decodeJwt(token: string | null | undefined): DecodedJwt | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(base64UrlToUtf8(parts[1]));
  } catch {
    return null;
  }
}

export function checkHealth() {
  return request<string>('GET', 'api/auth/start', undefined, { auth: false });
}

export function loginWithPassword(body: LoginData) {
  return request<TokenResponse>('POST', 'api/auth/generate/token', body, { auth: false });
}

export function requestOtp(email: string) {
  return request<ResponseHolder>('POST', 'api/auth/login/request-otp', { email }, { auth: false });
}

export function verifyOtp(email: string, otp: string) {
  return request<OtpTokenResponse>('POST', 'api/auth/login/verify-otp', { email, otp }, { auth: false });
}

export function register(body: RegisterRequest) {
  return request<TokenResponse>('POST', 'api/auth/register', body, { auth: false });
}
