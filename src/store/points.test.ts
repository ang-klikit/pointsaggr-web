import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY, usePointsStore } from './points';

const baseRecord = {
  orderHash: 'abc',
  orderId: 1,
  points: 10,
  amountCents: 1000,
  currency: 'MYR',
  claimedAt: new Date('2026-04-20T10:00:00Z').toISOString(),
};

describe('points store', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    usePointsStore.getState().reset();
  });

  it('starts at zero', () => {
    expect(usePointsStore.getState().totalPoints).toBe(0);
    expect(usePointsStore.getState().claims).toHaveLength(0);
  });

  it('adds points and records a claim', () => {
    const res = usePointsStore.getState().claim(baseRecord);
    expect(res.ok).toBe(true);
    expect(usePointsStore.getState().totalPoints).toBe(10);
    expect(usePointsStore.getState().claims).toHaveLength(1);
  });

  it('rejects duplicate orderHash and does not change the balance', () => {
    usePointsStore.getState().claim(baseRecord);
    const res = usePointsStore.getState().claim(baseRecord);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe('already_claimed');
      expect(res.existing.orderHash).toBe('abc');
    }
    expect(usePointsStore.getState().totalPoints).toBe(10);
    expect(usePointsStore.getState().claims).toHaveLength(1);
  });

  it('prepends new claims so latest is first', () => {
    usePointsStore.getState().claim(baseRecord);
    usePointsStore.getState().claim({ ...baseRecord, orderHash: 'def', points: 5 });
    expect(usePointsStore.getState().claims[0]?.orderHash).toBe('def');
    expect(usePointsStore.getState().totalPoints).toBe(15);
  });

  it('reset() wipes balance and history', () => {
    usePointsStore.getState().claim(baseRecord);
    usePointsStore.getState().reset();
    expect(usePointsStore.getState().totalPoints).toBe(0);
    expect(usePointsStore.getState().claims).toHaveLength(0);
  });
});
