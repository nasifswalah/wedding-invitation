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
    name: 'Ayisha Rahman',
    relation: 'Daughter of',
    father: 'Mr. Abdul Rahman K.',
    mother: 'Mrs. Safiya Rahman',
    family: 'Kunnummal House, Kozhikode',
  } satisfies Person,

  groom: {
    name: 'Muhammed Fahad',
    relation: 'Son of',
    father: 'Mr. Ibrahim Kutty P.',
    mother: 'Mrs. Ramla Ibrahim',
    family: 'Puthanveettil House, Malappuram',
  } satisfies Person,

  /** Short names used in the hero monogram and share text */
  shortNames: { bride: 'Ayisha', groom: 'Fahad' },

  /** The wedding event (one session). */
  event: {
    id: 'nikah',
    title: 'Nikah',
    arabicTitle: 'عقد النكاح',
    start: '2027-01-17T11:00:00+05:30',
    end: '2027-01-17T13:00:00+05:30',
    note: 'Followed by lunch',
    venue: {
      name: 'Masjid Al-Noor Auditorium',
      address: 'Mavoor Road, Kozhikode, Kerala 673004',
      directions: [
        'From Kozhikode KSRTC bus stand, head east on Mavoor Road for about 2 km.',
        'Pass the Arayidathupalam junction and keep straight.',
        'The auditorium is on the left, right after Masjid Al-Noor — look for the green arch.',
        'Parking is available behind the auditorium.',
      ],
      mapsUrl: 'https://maps.google.com/?q=Mavoor+Road+Kozhikode',
      embedQuery: 'Mavoor Road, Kozhikode, Kerala',
    },
  } satisfies WeddingEvent,

  /** Photos of the couple — leave null to use the hand-drawn sketch. */
  couplePhoto: null as string | null,

  /**
   * The Hijri date is calculated automatically (Umm al-Qura).
   * Kerala sometimes follows a local moon sighting — if the family
   * gives a specific Hijri date, put it here and it will be used instead.
   */
  hijriOverride: null as null | { day: number; monthEn: string; monthAr: string; year: number },

  invitation: {
    opening: 'With the blessings of Allah, the Most Gracious, the Most Merciful',
    lines: [
      'We joyfully request the honour of your presence',
      'and the pleasure of your company',
      'as two hearts, two families and two homes',
      'come together in the sacred bond of Nikah.',
      'Your presence and prayers will make our day complete.',
    ],
    quoteAr: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    quoteEn:
      '“And among His signs is that He created for you spouses from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy.”',
    quoteRef: 'Surah Ar-Rum · 30:21',
    signature: 'With love & duas, from both families',
  },

  /** Put the audio file in /public/audio. Set to null to hide the music button. */
  music: '/audio/nasheed.mp3' as string | null,

  /** Used by the WhatsApp share button. Defaults to the current page URL. */
  shareText: 'You are warmly invited to the wedding of Ayisha & Fahad 💍🌸',
}

export type Wedding = typeof wedding
