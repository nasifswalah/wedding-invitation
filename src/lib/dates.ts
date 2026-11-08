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

/* ── month grids for the calendar board ───────────────────── */

export type MonthGrid = { title: string; year: number; firstWeekday: number; days: number; highlight: number }

const DAY = 864e5
const istDay = (d: Date) => new Date(new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d) + 'T12:00:00Z')

export function gregorianMonthGrid(iso: string): MonthGrid {
  const d = istDay(new Date(iso))
  const y = d.getUTCFullYear(), m = d.getUTCMonth()
  return {
    title: new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' }).format(d),
    year: y,
    firstWeekday: new Date(Date.UTC(y, m, 1)).getUTCDay(),
    days: new Date(Date.UTC(y, m + 1, 0)).getUTCDate(),
    highlight: d.getUTCDate(),
  }
}

const hijriNumParts = (d: Date) => {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
    timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric',
  }).formatToParts(d)
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value.replace(/\D/g, ''))
  return { day: n('day'), month: n('month'), year: n('year') }
}

/** The Hijri month containing the wedding day (honours `hijriOverride`). */
export function hijriMonthGrid(iso: string): MonthGrid & { titleAr: string } {
  const d = istDay(new Date(iso))
  const h = hijriParts(iso)
  const calc = hijriNumParts(d)
  const start = new Date(d.getTime() - (h.day - 1) * DAY)
  // month length: count forward from the calculated month start until the month changes
  const calcStart = new Date(d.getTime() - (calc.day - 1) * DAY)
  let days = 29
  if (hijriNumParts(new Date(calcStart.getTime() + 29 * DAY)).month === calc.month) days = 30
  return {
    title: h.monthEn,
    titleAr: h.monthAr,
    year: h.year,
    firstWeekday: start.getUTCDay(),
    days,
    highlight: h.day,
  }
}
