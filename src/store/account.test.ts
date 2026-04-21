import { beforeEach, describe, expect, it } from 'vitest';
import { ACCOUNT_STORAGE_KEY, useAccountStore } from './account';

describe('account store', () => {
  beforeEach(() => {
    localStorage.removeItem(ACCOUNT_STORAGE_KEY);
    useAccountStore.getState().reset();
  });

  it('starts without an account', () => {
    expect(useAccountStore.getState().account).toBeNull();
  });

  it('saves trimmed fields and stamps createdAt', () => {
    const saved = useAccountStore
      .getState()
      .save({ fullName: '  Ada Lovelace ', phone: ' +60123456789 ' });
    expect(saved.fullName).toBe('Ada Lovelace');
    expect(saved.phone).toBe('+60123456789');
    expect(saved.createdAt).toBeTruthy();
    expect(useAccountStore.getState().account?.fullName).toBe('Ada Lovelace');
  });

  it('preserves createdAt across subsequent saves (edit flow)', () => {
    const first = useAccountStore.getState().save({ fullName: 'Ada', phone: '+601' });
    const second = useAccountStore.getState().save({ fullName: 'Grace Hopper', phone: '+602' });
    expect(second.createdAt).toBe(first.createdAt);
    expect(second.fullName).toBe('Grace Hopper');
    expect(second.phone).toBe('+602');
  });

  it('reset() clears the account', () => {
    useAccountStore.getState().save({ fullName: 'Ada', phone: '+601' });
    useAccountStore.getState().reset();
    expect(useAccountStore.getState().account).toBeNull();
  });
});
