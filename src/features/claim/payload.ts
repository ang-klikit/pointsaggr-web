/**
 * Claim payload codec.
 *
 * The QR printed by a merchant encodes a compact JSON object describing a
 * single transaction, base64url-encoded into the path: `/c/:payload`.
 *
 * Compact keys (so the QR stays small and scannable at low resolutions):
 *   i -> orderId        (int)
 *   a -> amountCents    (int, e.g. 1500 = 15.00)
 *   c -> currency       (string, ISO 4217, e.g. "MYR")
 *   b -> brand          (string, optional)
 *   t -> createdAt      (int, unix seconds)
 */

export type ClaimPayload = {
  orderId: number;
  amountCents: number;
  currency: string;
  brand?: string;
  createdAt: number;
};

type CompactShape = {
  i: number;
  a: number;
  c: string;
  b?: string;
  t: number;
};

export class PayloadDecodeError extends Error {
  constructor(
    public readonly kind: 'malformed' | 'invalid_shape',
    message: string,
  ) {
    super(message);
    this.name = 'PayloadDecodeError';
  }
}

function b64urlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(input: string): Uint8Array {
  const padLen = (4 - (input.length % 4)) % 4;
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export function encodeClaimPayload(p: ClaimPayload): string {
  const compact: CompactShape = {
    i: p.orderId,
    a: p.amountCents,
    c: p.currency,
    t: p.createdAt,
    ...(p.brand ? { b: p.brand } : {}),
  };
  const json = JSON.stringify(compact);
  return b64urlEncode(new TextEncoder().encode(json));
}

export function decodeClaimPayload(raw: string): ClaimPayload {
  let json: string;
  try {
    json = new TextDecoder().decode(b64urlDecode(raw));
  } catch {
    throw new PayloadDecodeError('malformed', 'Payload is not valid base64url.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new PayloadDecodeError('malformed', 'Payload is not valid JSON.');
  }

  if (!isCompactShape(parsed)) {
    throw new PayloadDecodeError('invalid_shape', 'Payload is missing required fields.');
  }

  return {
    orderId: parsed.i,
    amountCents: parsed.a,
    currency: parsed.c,
    brand: parsed.b,
    createdAt: parsed.t,
  };
}

function isCompactShape(v: unknown): v is CompactShape {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  const idOk = typeof o.i === 'number' && Number.isFinite(o.i) && o.i > 0;
  const amountOk = typeof o.a === 'number' && Number.isFinite(o.a) && o.a >= 0;
  const currencyOk = typeof o.c === 'string' && o.c.length > 0 && o.c.length <= 8;
  const brandOk = o.b === undefined || (typeof o.b === 'string' && o.b.length <= 120);
  const createdAtOk = typeof o.t === 'number' && Number.isFinite(o.t) && o.t > 0;
  return idOk && amountOk && currencyOk && brandOk && createdAtOk;
}
