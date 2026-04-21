import { describe, expect, it } from 'vitest';
import {
  decodeClaimPayload,
  encodeClaimPayload,
  PayloadDecodeError,
  type ClaimPayload,
} from './payload';

const fixture: ClaimPayload = {
  orderId: 1234,
  amountCents: 1599,
  currency: 'MYR',
  brand: 'Warung X',
  createdAt: 1_745_000_000,
};

describe('claim payload codec', () => {
  it('round-trips a full payload', () => {
    const encoded = encodeClaimPayload(fixture);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/); // base64url alphabet, no padding
    const decoded = decodeClaimPayload(encoded);
    expect(decoded).toEqual(fixture);
  });

  it('round-trips without the optional brand field', () => {
    const { brand: _ignored, ...rest } = fixture;
    const decoded = decodeClaimPayload(encodeClaimPayload(rest));
    expect(decoded.brand).toBeUndefined();
    expect(decoded.orderId).toBe(rest.orderId);
  });

  it('throws malformed for non-base64url input', () => {
    expect(() => decodeClaimPayload('not*valid*b64url')).toThrow(PayloadDecodeError);
  });

  it('throws malformed for non-JSON after decode', () => {
    const raw = btoa('definitely not json').replace(/=+$/, '');
    expect(() => decodeClaimPayload(raw)).toThrow(PayloadDecodeError);
  });

  it('throws invalid_shape when required keys are missing', () => {
    const bad = btoa(JSON.stringify({ i: 1, c: 'MYR', t: 1 })).replace(/=+$/, '');
    try {
      decodeClaimPayload(bad);
      throw new Error('expected decode to fail');
    } catch (e) {
      expect(e).toBeInstanceOf(PayloadDecodeError);
      expect((e as PayloadDecodeError).kind).toBe('invalid_shape');
    }
  });

  it('rejects negative amounts and non-positive ids', () => {
    const bad1 = btoa(JSON.stringify({ i: 0, a: 100, c: 'MYR', t: 1 })).replace(/=+$/, '');
    const bad2 = btoa(JSON.stringify({ i: 1, a: -1, c: 'MYR', t: 1 })).replace(/=+$/, '');
    expect(() => decodeClaimPayload(bad1)).toThrow(PayloadDecodeError);
    expect(() => decodeClaimPayload(bad2)).toThrow(PayloadDecodeError);
  });
});
