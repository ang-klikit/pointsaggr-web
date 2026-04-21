import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const ACCOUNT_STORAGE_KEY = 'mypoints:account:v1';

export type Account = {
  fullName: string;
  phone: string;
  /** ISO8601 UTC of first save. Preserved across edits. */
  createdAt: string;
};

type AccountState = {
  account: Account | null;
  save: (input: { fullName: string; phone: string }) => Account;
  reset: () => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      account: null,
      save: ({ fullName, phone }) => {
        const prev = get().account;
        const next: Account = {
          fullName: fullName.trim(),
          phone: phone.trim(),
          createdAt: prev?.createdAt ?? new Date().toISOString(),
        };
        set({ account: next });
        return next;
      },
      reset: () => set({ account: null }),
    }),
    {
      name: ACCOUNT_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ account: state.account }),
    },
  ),
);
