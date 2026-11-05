import type { WeddingEvent } from '../config/wedding'
import { wedding } from '../config/wedding'

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const titleFor = (e: WeddingEvent) =>
  `${e.title} · ${wedding.shortNames.bride} & ${wedding.shortNames.groom}`

export function googleCalendarUrl(e: WeddingEvent) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: titleFor(e),
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: `${e.note ?? ''}\nDirections: ${e.venue.mapsUrl}`,
    location: `${e.venue.name}, ${e.venue.address}`,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

export function downloadIcs(e: WeddingEvent) {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.id}-${stamp(e.start)}@wedding-invite`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.start)}`, `DTEND:${stamp(e.end)}`,
    `SUMMARY:${esc(titleFor(e))}`,
    `LOCATION:${esc(`${e.venue.name}, ${e.venue.address}`)}`,
    `DESCRIPTION:${esc(`${e.note ?? ''}\nDirections: ${e.venue.mapsUrl}`)}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Wedding tomorrow', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${e.id}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function whatsappShareUrl() {
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''
  return `https://wa.me/?text=${encodeURIComponent(`${wedding.shareText}\n${url}`)}`
}
