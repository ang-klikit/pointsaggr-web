import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ClaimRecord = {
  /** Opaque hash = the raw `/c/:payload` string. Unique per order. */
  orderHash: string;
  orderId: number;
  points: number;
  amountCents: number;
  currency: string;
  brand?: string;
  /** ISO8601 UTC. */
  claimedAt: string;
};

type ClaimResult = { ok: true } | { ok: false; reason: 'already_claimed'; existing: ClaimRecord };

type PointsState = {
  totalPoints: number;
  claims: ClaimRecord[];
  findClaim: (orderHash: string) => ClaimRecord | undefined;
  claim: (record: ClaimRecord) => ClaimResult;
  reset: () => void;
};

export const STORAGE_KEY = 'mypoints:v1';

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      claims: [],
      findClaim: (orderHash) => get().claims.find((c) => c.orderHash === orderHash),
      claim: (record) => {
        const existing = get().claims.find((c) => c.orderHash === record.orderHash);
        if (existing) {
          return { ok: false, reason: 'already_claimed', existing };
        }
        set((state) => ({
          totalPoints: state.totalPoints + record.points,
          claims: [record, ...state.claims],
        }));
        return { ok: true };
      },
      reset: () => set({ totalPoints: 0, claims: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ totalPoints: state.totalPoints, claims: state.claims }),
    },
  ),
);
