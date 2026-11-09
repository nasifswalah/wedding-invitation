/**
 * ─────────────────────────────────────────────────────────────
 *  ALL INVITATION CONTENT LIVES HERE.
 *  Replace the mock values below with the real details —
 *  no component needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export type Person = {
  name: string
  /** Shown under the name, e.g. "Daughter of" */
  relation: string
  father: string
  mother: string
  /** Family house name / place — common on Kerala invitations */
  family?: string
}

export type Venue = {
  name: string
  address: string
  /** Landmark-based, step-by-step directions */
  directions: string[]
  /** Link opened by "Open in Google Maps" */
  mapsUrl: string
  /** (not shown any more — kept for an optional map later) */
  embedQuery?: string
}

export type WeddingEvent = {
  id: string
  title: string
  arabicTitle: string
  /** ISO-8601 with timezone offset (IST = +05:30) */
  start: string
  end: string
  venue: Venue
  note?: string
}

export const wedding = {
  bride: {
    name: 'Athika Rabeea',
    relation: 'Daughter of',
    father: 'Zakeer Hussain M',
    mother: 'Soudath',
  } satisfies Person,

  groom: {
    name: 'Muhammed Shamil',
    relation: 'Son of',
    father: 'Kinanath K',
    mother: 'Suhara',
  } satisfies Person,

  /** Short names used in the monogram and share text */
  shortNames: { bride: 'Athika', groom: 'Shamil' },

  /** The wedding event (one session). */
  event: {
    id: 'nikah',
    title: 'Nikah',
    arabicTitle: 'عقد النكاح',
    // TODO: time is a placeholder — update when confirmed (date: Wednesday 9 December 2026)
    start: '2026-12-09T11:00:00+05:30',
    end: '2026-12-09T13:00:00+05:30',
    venue: {
      name: 'City Plaza Auditorium',
      address: 'Tirur, Malappuram, Kerala',
      directions: [],
      mapsUrl: 'https://maps.app.goo.gl/nJpbRSq1MwsRzYdi6',
    },
  } as WeddingEvent,

  /** Cut-out image of the couple (transparent background) — null uses the hand-drawn version. */
  couplePhoto: '/images/couple-walk.webp' as string | null,

  /**
   * Two-part couple animation (transparent PNG/WebP, same illustration style):
   *  walk   — seen from behind, walking away hand in hand
   *  facing — the two of them turned towards each other
   * When both are set they replace `couplePhoto` in the invitation scene.
   */
  coupleWalk: null as string | null,
  coupleFacing: null as string | null,

  /**
   * The Hijri date is calculated automatically (Umm al-Qura).
   * Kerala sometimes follows a local moon sighting — if the family
   * gives a specific Hijri date, put it here and it will be used instead.
   */
  hijriOverride: null as null | { day: number; monthEn: string; monthAr: string; year: number },

  invitation: {
    opening: 'With the blessings of Allah, the Most Merciful',
    lines: [
      'We joyfully invite you and your family',
      'to celebrate our Nikah with us.',
      'Your presence and duas will make',
      'our day truly complete.',
    ],
    quoteAr: 'وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    quoteEn: '“And He placed between you affection and mercy.”',
    quoteRef: 'Surah Ar-Rum · 30:21',
    signature: 'With love & duas, Athika & Shamil',
  },

  /** Put the audio file in /public/audio. Set to null to hide the music button. */
  music: '/audio/nasheed.mp3' as string | null,

  /** Message sent by the "Share on WhatsApp" button; the invitation link is added after it. */
  shareText: "We're getting married! 💍 With the blessings of Allah, Athika & Shamil joyfully invite you to celebrate our Nikah. Open our invitation for all the details 💌",
}

export type Wedding = typeof wedding
