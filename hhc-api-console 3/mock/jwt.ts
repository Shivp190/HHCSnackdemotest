// Pure-JS base64url codec — no Buffer, no atob/btoa. Those are unavailable or
// inconsistent across RN's iOS/Android/web (Hermes) runtimes, so token
// encoding/decoding is hand-rolled here over plain byte arrays.

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function utf8Encode(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return bytes;
}

function utf8Decode(bytes: number[]): string {
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

function base64UrlEncodeBytes(bytes: number[]): string {
  let result = '';
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    result += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63];
  }
  const remaining = bytes.length - i;
  if (remaining === 1) {
    const n = bytes[i] << 16;
    result += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
  } else if (remaining === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    result += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63];
  }
  return result.replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecodeToBytes(input: string): number[] {
  const clean = input.replace(/-/g, '+').replace(/_/g, '/');
  const lookup: Record<string, number> = {};
  for (let i = 0; i < B64.length; i++) lookup[B64[i]] = i;
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of clean) {
    if (!(ch in lookup)) continue;
    buffer = (buffer << 6) | lookup[ch];
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  return bytes;
}

export function base64UrlEncode(str: string): string {
  return base64UrlEncodeBytes(utf8Encode(str));
}

export function base64UrlDecode(b64: string): string {
  return utf8Decode(base64UrlDecodeToBytes(b64));
}

export interface TokenPayload {
  sub: string;
  id: string | number;
  access_role: 'Admin' | 'User';
  exp: number; // unix seconds
}

const HEADER = { alg: 'none', typ: 'MOCK' };

/** Mints an unsigned JWT-shaped string: header.payload.mock */
export function makeToken(id: string | number, role: 'Admin' | 'User', ttlMinutes = 120): string {
  const payload: TokenPayload = {
    sub: String(id),
    id,
    access_role: role,
    exp: Math.floor(Date.now() / 1000) + ttlMinutes * 60,
  };
  const headerPart = base64UrlEncode(JSON.stringify(HEADER));
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  return `${headerPart}.${payloadPart}.mock`;
}

export function parseToken(token: string | null | undefined): TokenPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = base64UrlDecode(parts[1]);
    const payload = JSON.parse(json) as TokenPayload;
    if (typeof payload.exp !== 'number') return null;
    return payload;
  } catch {
    return null;
  }
}

export function isExpired(payload: TokenPayload | null): boolean {
  if (!payload) return true;
  return Math.floor(Date.now() / 1000) >= payload.exp;
}
