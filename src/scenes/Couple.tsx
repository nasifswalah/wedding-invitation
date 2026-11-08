import { Hydrangea, Leaf, RoseHead, Spray } from '../components/garden/botanical'

/** Bouquet slots, filled one by one as petals land in the bride's hands. */
export const BOUQUET_SLOTS: { x: number; y: number; k: 'rose' | 'peach' | 'ivory' | 'hyd' | 'spray' }[] = [
  { x: 0, y: -6, k: 'rose' },
  { x: -8, y: -2, k: 'hyd' },
  { x: 8, y: -2, k: 'peach' },
  { x: -4, y: -13, k: 'ivory' },
  { x: 6, y: -12, k: 'hyd' },
  { x: -13, y: -9, k: 'rose' },
  { x: 13, y: -8, k: 'spray' },
  { x: 0, y: -19, k: 'peach' },
  { x: -11, y: 4, k: 'spray' },
  { x: 11, y: 4, k: 'rose' },
  { x: -16, y: -2, k: 'ivory' },
  { x: 16, y: -1, k: 'hyd' },
]

function SlotFlower({ k, i }: { k: (typeof BOUQUET_SLOTS)[number]['k']; i: number }) {
  if (k === 'hyd') return <Hydrangea r={5.5} seed={i} tone={i % 2 ? 'lilac' : 'blue'} />
  if (k === 'spray') return <Spray r={5} dir={1} />
  return <RoseHead r={4.6} tone={k === 'rose' ? 'mauve' : k} seed={i + 3} />
}

const GROOM_SKIN = '#c8987a'
const BRIDE_SKIN = '#d1a385'
const HAIR = '#2f3640'

/**
 * Storybook illustration of the couple, drawn from their photos:
 *  - groom: tall and slim, voluminous swept-back wavy hair, full trimmed beard, big smile;
 *    ivory sherwani with a powder-blue stole, his arm around her shoulder
 *  - bride: round face, soft smile, hijab; powder-blue gown with sequin flowers and a
 *    rose-mauve dupatta, holding a small bouquet
 * Drawn in a 300×420 box. Lines use `.sk` (they draw in), fills use `.wash` (they bleed in after).
 */
export function Couple() {
  return (
    <g>
      <ellipse cx={158} cy={404} rx={120} ry={8} fill="#6b7a8c" opacity={0.12} />

      {/* ── groom ── */}
      <g className="groom">
        {/* fills */}
        <path className="wash" d="M86 262 L 90 392 L101 392 L104 290 L109 392 L120 392 L130 262 Z" fill="#f6efe3" />
        <path className="wash" d="M84 92 C 92 84 124 84 132 92 L 138 262 L 78 262 Z" fill="#efe2cf" />
        <path className="wash" d="M122 86 C 134 140 130 210 128 258 L 136 258 C 140 210 140 140 130 88 Z" fill="#a9bfcf" />
        <path className="wash" d="M102 70 L102 82 L114 82 L114 70 Z" fill={GROOM_SKIN} />
        <ellipse className="wash" cx={94} cy={56} rx={2.6} ry={4.2} fill={GROOM_SKIN} />
        <ellipse className="wash" cx={122} cy={56} rx={2.6} ry={4.2} fill={GROOM_SKIN} />
        <ellipse className="wash" cx={108} cy={54} rx={14} ry={17} fill={GROOM_SKIN} />
        <path className="wash" d="M94 50 C 90 40 92 31 97 27 C 99 20 107 17 112 21 C 118 16 127 21 127 29 C 131 34 129 42 124 48 C 122 42 117 38 111 38 C 103 37 98 41 96 49 Z" fill={HAIR} />
        <path className="wash" d="M95 58 C 95 74 102 80 108 80 C 114 80 121 74 121 58 C 118 64 116 68 108 69 C 100 68 98 64 95 58 Z" fill={HAIR} opacity={0.92} />
        <path className="wash" d="M101 64 C 104 62 112 62 115 64 C 112 65.6 104 65.6 101 64 Z" fill={HAIR} />
        <path className="wash" d="M103 67.4 C 106 70.2 110 70.2 113 67.4 Z" fill="#ffffff" />
        <ellipse className="wash" cx={83} cy={238} rx={5} ry={6} fill={GROOM_SKIN} />

        {/* lines */}
        <path className="sk sk-ink" d="M94 48 C 94 66 100 72 108 72 C 116 72 122 66 122 48" />
        <path className="sk sk-ink" d="M94 50 C 90 40 92 31 97 27 C 99 20 107 17 112 21 C 118 16 127 21 127 29 C 131 34 129 42 124 48" />
        <path className="sk sk-light" style={{ stroke: '#8a93a0' }} d="M99 30 C 104 25 110 25 114 29 M108 24 C 114 22 120 24 123 30 M98 36 C 103 32 110 32 116 35" />
        <path className="sk sk-ink" style={{ strokeWidth: 1.6 }} d="M99 48.5 Q 103 46.4 107 48 M109 48 Q 113 46.4 117 48.5" />
        <path className="sk sk-ink" d="M100 53.4 Q 103 51.2 106 53.4 M110 53.4 Q 113 51.2 116 53.4" />
        <path className="sk sk-light" d="M108 54 Q 107 59 106 60 Q 108 61 110 60" />
        <path className="sk" d="M98 84 L118 84 L117 78 L99 78 Z" />
        <path className="sk sk-ink" d="M84 92 C 92 84 124 84 132 92 L 138 262 L 78 262 Z" />
        <path className="sk sk-light" d="M108 84 L108 262 M80 248 C 94 254 122 254 136 248 M82 234 C 96 238 120 238 134 234" />
        <path className="sk" style={{ stroke: '#6f8aa1' }} d="M122 86 C 134 140 130 210 128 258 L 136 258 C 140 210 140 140 130 88" />
        <path className="sk" d="M85 96 C 76 148 78 200 82 232" />
        <path className="sk" d="M131 96 C 146 98 160 106 172 116" />
        <path className="sk" d="M86 262 L 90 392 M101 392 L104 290 M109 392 L104 290 M120 392 L130 262" />
        <path className="sk sk-ink" d="M84 392 C 82 402 100 403 102 394 M108 394 C 108 403 126 402 124 392" />
        {[100, 118, 136, 154, 172, 190].map((y) => <circle key={y} cx={108} cy={y} r={1.5} fill="#cdb497" />)}
      </g>

      {/* ── bride (a little shorter: her head reaches his chin) ── */}
      <g className="bride" transform="translate(5.8 10) scale(0.97)">
        <path className="wash" d="M210 88 C 236 130 248 220 254 300 C 258 350 252 382 246 408 L 228 408 C 234 360 232 300 224 240 C 218 190 212 140 204 110 Z" fill="#c98e9c" opacity={0.7} />
        <path className="wash" d="M178 188 C 160 260 138 340 124 405 C 160 414 226 414 262 405 C 248 340 224 260 206 188 Z" fill="#a9bfcf" />
        <path className="wash" d="M176 122 C 182 116 202 116 208 122 L 206 188 L 178 188 Z" fill="#9fb7c9" />
        <path className="wash" d="M172 84 C 166 46 218 42 213 84 C 216 104 208 116 192 120 C 176 116 168 104 172 84 Z" fill="#ead2d6" />
        <ellipse className="wash" cx={192} cy={83} rx={11} ry={12.8} fill={BRIDE_SKIN} />
        <circle className="wash" cx={185.8} cy={88} r={2.2} fill="#e9a3a3" opacity={0.35} />
        <circle className="wash" cx={198.2} cy={88} r={2.2} fill="#e9a3a3" opacity={0.35} />
        <path className="wash" d="M188.6 89.6 Q 192 92 195.4 89.6 Q 192 90.6 188.6 89.6 Z" fill="#a8656f" />
        <ellipse className="wash" cx={188} cy={82} rx={1.15} ry={1.5} fill="#2f3640" />
        <ellipse className="wash" cx={196} cy={82} rx={1.15} ry={1.5} fill="#2f3640" />

        <path className="sk" style={{ stroke: '#9c6473' }} d="M210 88 C 236 130 248 220 254 300 C 258 350 252 382 246 408 L 228 408 C 234 360 232 300 224 240 C 218 190 212 140 204 110" />
        <path className="sk sk-ink" d="M172 84 C 166 46 218 42 213 84 C 216 104 208 116 192 120 C 176 116 168 104 172 84 Z" />
        <ellipse className="sk sk-light" style={{ stroke: '#9c6473' }} cx={192} cy={83} rx={13} ry={15} />
        <ellipse className="sk" cx={192} cy={83} rx={11} ry={12.8} />
        <path className="sk sk-ink" style={{ strokeWidth: 1 }} d="M185.6 78 Q 188 76.8 190.4 77.8 M193.6 77.8 Q 196 76.8 198.4 78" />
        <path className="sk sk-light" d="M192 82.6 Q 191.4 85.6 191 86.4 Q 192 87 193 86.6" />
        <path className="sk" style={{ stroke: '#9c6473' }} d="M173 92 C 160 120 158 150 166 176" />
        <path className="sk sk-ink" d="M176 122 C 182 116 202 116 208 122 L 206 188 L 178 188 Z" />
        <path className="sk sk-ink" d="M178 188 C 160 260 138 340 124 405 C 160 414 226 414 262 405 C 248 340 224 260 206 188" />
        <path className="sk sk-light" d="M192 196 L192 408 M184 200 C 172 280 162 340 154 408 M200 200 C 212 280 224 340 232 408 M132 380 C 170 390 216 390 256 380" />
        <path className="sk" d="M178 126 C 170 150 172 170 186 180" />
        <path className="sk" d="M206 126 C 214 150 210 170 198 180" />
        {[[176, 260], [206, 250], [166, 320], [192, 300], [220, 330], [150, 372], [184, 360], [236, 380], [208, 395], [160, 398], [194, 140], [186, 160], [200, 168]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} opacity={0.85}>
            <circle r={i > 9 ? 2.2 : 3.2} fill="none" stroke="#e3cfb4" strokeWidth={1} />
            <circle r={i > 9 ? 0.9 : 1.2} fill={i % 2 ? '#efc1a8' : '#c98e9c'} />
          </g>
        ))}
        {[190, 194, 198, 186, 182].map((x, i) => <circle key={i} cx={x} cy={188} r={1.2} fill="#cdb497" />)}

        {/* bouquet (fills as petals land) */}
        <g transform="translate(192 172) scale(1.4)">
          <path className="sk" style={{ stroke: '#6f8579' }} d="M-4 2 L-2 28 M0 2 L0 30 M4 2 L3 28" />
          <path d="M-6 14 C -12 10 -12 20 -4 16 M6 14 C 12 10 12 20 4 16" stroke="#9c6473" strokeWidth={1.2} fill="none" />
          <g transform="rotate(-140)"><Leaf w={4} l={14} /></g>
          <g transform="rotate(140)"><Leaf w={4} l={14} /></g>
          {BOUQUET_SLOTS.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <g className="bq-slot"><SlotFlower k={s.k} i={i} /></g>
            </g>
          ))}
          <circle className="bouquet-target" cx={0} cy={-8} r={2} fill="none" />
        </g>
      </g>

      {/* his hand resting on her shoulder (drawn last so it sits on top) */}
      <ellipse className="wash" cx={175} cy={118} rx={5} ry={3.6} fill={GROOM_SKIN} transform="rotate(20 175 118)" />
    </g>
  )
}
