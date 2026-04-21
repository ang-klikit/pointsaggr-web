import { useEffect, useState } from 'react';
import { usePointsStore } from '@/store/points';

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

/**
 * Ticks every second and returns the gap between *now* and `target`.
 * Returns `isPast: true` once the target is behind us — callers should
 * render a "draw complete" state in that case.
 */
export function useCountdown(target: Date): Countdown {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    isPast: diff === 0,
  };
}

/** Monday 00:00 local — ISO week boundary. */
function startOfWeek(d: Date): Date {
  const day = d.getDay();
  const offset = day === 0 ? 6 : day - 1;
  const start = new Date(d);
  start.setDate(d.getDate() - offset);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Raffle entries are derived from claim history: one claim = one entry.
 * Cache-only for now; the backend version will authoritatively assign
 * entries per claim (and may also support bonus entries from promos).
 */
export function useRaffleEntries(): { total: number; thisWeek: number } {
  const claims = usePointsStore((s) => s.claims);
  const weekStart = startOfWeek(new Date()).getTime();
  const thisWeek = claims.reduce(
    (n, c) => (new Date(c.claimedAt).getTime() >= weekStart ? n + 1 : n),
    0,
  );
  return { total: claims.length, thisWeek };
}
