import { wedding } from '../config/wedding'

const TZ = 'Asia/Kolkata'

export function gregorianParts(iso: string) {
  const d = new Date(iso)
  const get = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(d)
  return {
    weekday: get({ weekday: 'long' }),
    day: get({ day: 'numeric' }),
    month: get({ month: 'long' }),
    year: get({ year: 'numeric' }),
    time: new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(d),
  }
}

const AR_MONTHS = [
  'مُحَرَّم', 'صَفَر', 'رَبِيع الأَوَّل', 'رَبِيع الآخِر', 'جُمَادَى الأُولَى', 'جُمَادَى الآخِرَة',
  'رَجَب', 'شَعْبَان', 'رَمَضَان', 'شَوَّال', 'ذُو القَعْدَة', 'ذُو الحِجَّة',
]
const EN_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
]

export const toArabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, (c) => '٠١٢٣٤٥٦٧٨٩'[Number(c)])

export function hijriParts(iso: string) {
  const o = wedding.hijriOverride
  if (o) {
    return { day: o.day, year: o.year, monthEn: o.monthEn, monthAr: o.monthAr,
      dayAr: toArabicDigits(o.day), yearAr: toArabicDigits(o.year) }
  }
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
    timeZone: TZ, day: 'numeric', month: 'numeric', year: 'numeric',
  }).formatToParts(new Date(iso))
  const num = (t: string) => Number(parts.find((p) => p.type === t)?.value.replace(/\D/g, ''))
  const day = num('day'), month = num('month'), year = num('year')
  return {
    day, year,
    monthEn: EN_MONTHS[month - 1], monthAr: AR_MONTHS[month - 1],
    dayAr: toArabicDigits(day), yearAr: toArabicDigits(year),
  }
}

export const arabicWeekday = (iso: string) =>
  new Intl.DateTimeFormat('ar', { timeZone: TZ, weekday: 'long' }).format(new Date(iso))
