# App icons

Drop the PWA icons here before shipping:

- `icon-192.png`         — 192×192
- `icon-512.png`         — 512×512
- `icon-512-maskable.png` — 512×512, full-bleed with safe-zone (maskable purpose)

Until real art lands, generating placeholders from `favicon.svg` works:

```bash
# requires: brew install librsvg
rsvg-convert -w 192 -h 192 ../favicon.svg > icon-192.png
rsvg-convert -w 512 -h 512 ../favicon.svg > icon-512.png
cp icon-512.png icon-512-maskable.png
```

The manifest in `vite.config.ts` references these three files — any rename
needs to be mirrored there.
