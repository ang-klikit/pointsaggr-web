# mypoints

Customer-facing web app for klikit point claims.

A merchant (running the PLG light app, **klikstart**) prints a QR on the
receipt. The QR encodes a base64url payload with the order details. Scanning
it opens this app at `/c/:payload`, where the customer can claim points for
that transaction. Balance + history are kept entirely in **local cache** —
no backend, no auth. A real claim service + signed tokens come later.

Production domain: `https://points.klikit.io`

## Stack

- Vite 5 + React 19 + TypeScript (strict)
- React Router v6
- Zustand (persisted to `localStorage`)
- Tailwind 3 + Radix UI (Toast, Dialog)
- react-i18next (EN / ID / MS)
- vite-plugin-pwa (install-to-home-screen)
- Vitest + Testing Library for unit tests

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview
npm run test       # vitest run (watch: npm run test:watch)
npm run lint
```

## URL shape

```
https://points.klikit.io/c/<base64url-payload>
```

Decoded payload (compact keys to keep the QR small):

| Key | Type   | Meaning             |
| --- | ------ | ------------------- |
| `i` | int    | Order ID            |
| `a` | int    | Amount (cents)      |
| `c` | string | Currency (ISO 4217) |
| `b` | string | Brand (optional)    |
| `t` | int    | Created at (unix s) |

Encode/decode helpers live in `src/features/claim/payload.ts`.

## Points rule

1 point per unit of currency (e.g. MYR 15.00 → 15 pts). Clamped to
`[minPointsPerClaim, maxPointsPerClaim]`. Change in
`src/features/claim/rules.ts`.

## Cache

Zustand store persisted to `localStorage` under key `mypoints:v1`. Schema:

```ts
{
  totalPoints: number;
  claims: Array<{
    orderHash: string;      // unique – the raw payload string
    orderId: number;
    points: number;
    amountCents: number;
    currency: string;
    brand?: string;
    claimedAt: string;      // ISO8601
  }>;
}
```

Same `orderHash` can't be claimed twice — second scan shows the "already
claimed" state with the original points + date.

## Routes

| Path            | Purpose                               |
| --------------- | ------------------------------------- |
| `/`             | Balance + recent claims               |
| `/c/:payload`   | Claim funnel (public)                 |
| `/me/history`   | Full claim history                    |
| `/me/profile`   | Language + reset data                 |
| `/404`, `*`     | Not found                             |

## Rolling out with klikstart

The Flutter app currently prints a QR pointing at
`https://me.klikit.io/claims/{orderId}`. To enable this app, klikstart
needs to switch the base URL to `https://points.klikit.io/c` and build the
base64url payload client-side before rendering the QR. See
`lib/core/printer/docket_generator.dart` + `lib/modules/receipt/ui/receipt_screen.dart`.
