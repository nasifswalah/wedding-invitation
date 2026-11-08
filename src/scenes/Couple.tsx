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

/**
 * Line-art couple (faceless, storybook style): groom in an ivory sherwani with a
 * powder-blue stole, bride in a powder-blue gown with a rose-mauve dupatta,
 * holding a small bouquet. Drawn in a 300×420 box; strokes use `.sk` so they draw in.
 */
export function Couple() {
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx={160} cy={404} rx={120} ry={8} fill="#6b7a8c" opacity={0.12} />

      {/* ── groom ── */}
      <g className="groom">
        <path className="wash" d="M80 108 C 88 98 122 98 130 108 L 136 270 L 74 270 Z" fill="#efe2cf" />
        <path className="wash" d="M86 270 L 90 392 L101 392 L104 290 L109 392 L120 392 L124 270 Z" fill="#f6efe3" />
        <path className="wash" d="M120 100 C 132 150 128 210 126 262 L 134 262 C 138 210 140 150 127 100 Z" fill="#a9bfcf" />
        <ellipse className="wash" cx={105} cy={70} rx={15} ry={17} fill="#efd6c4" />
        <path className="wash" d="M90 66 C 88 46 122 44 121 66 C 116 57 96 57 90 66 Z" fill="#3d4b5c" />
        <path className="wash" d="M91 74 C 94 93 116 93 119 74 C 112 84 98 84 91 74 Z" fill="#3d4b5c" opacity={0.75} />

        <ellipse className="sk sk-ink" cx={105} cy={70} rx={15} ry={17} />
        <path className="sk sk-ink" d="M90 66 C 88 46 122 44 121 66" />
        <path className="sk" d="M99 86 L99 94 M111 86 L111 94 M96 98 L114 98 L113 92 L97 92 Z" />
        <path className="sk sk-ink" d="M80 108 C 88 98 122 98 130 108 L 136 270 L 74 270 Z" />
        <path className="sk sk-light" d="M105 98 L105 270 M76 255 C 90 261 120 261 134 255 M80 240 C 92 244 118 244 132 240" />
        <path className="sk" style={{ stroke: '#6f8aa1' }} d="M120 100 C 132 150 128 210 126 262 L 134 262 C 138 210 140 150 127 100" />
        <path className="sk" d="M81 112 C 72 160 74 210 78 240" />
        <path className="sk" d="M129 112 C 140 150 146 180 160 196" />
        <path className="sk" d="M86 270 L 90 392 M101 392 L104 290 M109 392 L104 290 M120 392 L124 270" />
        <path className="sk sk-ink" d="M84 392 C 82 402 100 403 102 394 M108 394 C 108 403 126 402 124 392" />
        {[116, 134, 152, 170, 188].map((y) => <circle key={y} cx={105} cy={y} r={1.5} fill="#cdb497" />)}
      </g>

      {/* ── bride ── */}
      <g className="bride">
        {/* dupatta flowing behind */}
        <path className="wash" d="M210 88 C 236 130 248 220 254 300 C 258 350 252 382 246 408 L 228 408 C 234 360 232 300 224 240 C 218 190 212 140 204 110 Z" fill="#c98e9c" opacity={0.7} />
        <path className="wash" d="M178 188 C 160 260 138 340 124 405 C 160 414 226 414 262 405 C 248 340 224 260 206 188 Z" fill="#a9bfcf" />
        <path className="wash" d="M176 122 C 182 116 202 116 208 122 L 206 188 L 178 188 Z" fill="#9fb7c9" />
        <path className="wash" d="M172 84 C 166 46 218 42 213 84 C 216 104 208 116 192 120 C 176 116 168 104 172 84 Z" fill="#ead2d6" />
        <ellipse className="wash" cx={192} cy={82} rx={10.5} ry={12.5} fill="#efd6c4" />

        <path className="sk" style={{ stroke: '#9c6473' }} d="M210 88 C 236 130 248 220 254 300 C 258 350 252 382 246 408 L 228 408 C 234 360 232 300 224 240 C 218 190 212 140 204 110" />
        <path className="sk sk-ink" d="M172 84 C 166 46 218 42 213 84 C 216 104 208 116 192 120 C 176 116 168 104 172 84 Z" />
        <ellipse className="sk" cx={192} cy={82} rx={10.5} ry={12.5} />
        <path className="sk" style={{ stroke: '#9c6473' }} d="M173 92 C 160 120 158 150 166 176" />
        <path className="sk sk-ink" d="M176 122 C 182 116 202 116 208 122 L 206 188 L 178 188 Z" />
        <path className="sk sk-ink" d="M178 188 C 160 260 138 340 124 405 C 160 414 226 414 262 405 C 248 340 224 260 206 188" />
        <path className="sk sk-light" d="M192 196 L192 408 M184 200 C 172 280 162 340 154 408 M200 200 C 212 280 224 340 232 408 M132 380 C 170 390 216 390 256 380" />
        <path className="sk" d="M178 126 C 170 150 172 170 186 180" />
        <path className="sk" d="M206 126 C 214 150 210 170 198 180" />
        {/* embroidery, like the gown's sequin flowers */}
        {[[176, 260], [206, 250], [166, 320], [192, 300], [220, 330], [150, 372], [184, 360], [236, 380], [208, 395], [160, 398]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} opacity={0.85}>
            <circle r={3.2} fill="none" stroke="#e3cfb4" strokeWidth={1} />
            <circle r={1.2} fill={i % 2 ? '#efc1a8' : '#c98e9c'} />
          </g>
        ))}
        {[190, 194, 198, 186, 182].map((x, i) => <circle key={i} cx={x} cy={188} r={1.2} fill="#cdb497" />)}
      </g>

      {/* ── bouquet (fills as petals land) ── */}
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
  )
}
