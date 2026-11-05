# Wedding Invitation — Ayisha & Fahad (mock data)

A mobile-first animated invitation: Arabic calligraphy intro → living garden hero → dates (Gregorian + Hijri) and countdown → Nikah and Walima events → venue directions and map → invitation message → closing scene at dusk.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (add ?skip to bypass the intro)
npm run build      # static site in dist/ — deploy to Vercel / Netlify / any static host
```

## Change the content

All the text lives in **`src/config/wedding.ts`**: names, parents, family houses, event dates and times (IST), venues, directions, Google Maps links, the invitation message and the share text.

- **Hijri date**: calculated automatically (Umm al-Qura). To use the family's local moon-sighting date instead, set `hijriOverride`.
- **Music**: put an audio file at `public/audio/nasheed.mp3`. The music button only appears when the file loads. Set `music: null` to turn music off.
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
