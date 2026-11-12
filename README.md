# Wedding Invitation — Shamil & Athika

A mobile-first animated storybook invitation. It opens like a trailer (du'a → names → date → time → venue → invitation), then becomes a scroll page.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (add ?skip to bypass the intro)
npm run build      # static site in dist/ — deploy to Vercel / Netlify / any static host
```

## Change the content

All the text lives in **`src/config/wedding.ts`**: names, parents, family houses, event dates and times (IST), venues, directions, Google Maps links, the invitation message and the share text.

- **Hijri date**: calculated automatically (Umm al-Qura). To use the family's local moon-sighting date instead, set `hijriOverride`.
- **Music**: the song is `public/audio/mera-chaand.mp3`. It starts on the first tap (browsers block sound before that); the button bottom-left mutes it. Set `music: null` to turn music off.
- **Maps link**: in Google Maps, open the venue → Share → copy the link → paste it into `mapsUrl`.

## Where things are

| Piece | File |
|---|---|
| Wind system (drives every sway, plus the petals) | `src/components/garden/wind.ts` |
| Flowers, leaves, jasmine garlands | `src/components/garden/botanical.tsx` |
| Hero garden layers | `src/components/garden/GardenScene.tsx`, `Cluster.tsx`, `Garlands.tsx` |
| Intro (tap the seal → Bismillah → du'a) | `src/components/intro/IntroCalligraphy.tsx` |
| Section transitions | `transitions/VineTransition.tsx`, the doors in `sections/Events.tsx`, the petal trail in `sections/Location.tsx` |

Reduced-motion users get static flowers and simple fades.
