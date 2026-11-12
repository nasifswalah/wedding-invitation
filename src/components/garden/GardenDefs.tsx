/**
 * Shared SVG definitions (gradients + pencil filters) for every drawing on the page.
 * Rendered once at the app root. Colours follow the bride's outfit.
 */
export function GardenDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      <defs>
        {/* greenery — muted, eucalyptus-like */}
        <linearGradient id="g-leaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4f5a36" />
          <stop offset="1" stopColor="#8a9468" />
        </linearGradient>
        <linearGradient id="g-leaf-light" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6f7a52" />
          <stop offset="1" stopColor="#5d6440" />
        </linearGradient>
        <linearGradient id="g-leaf-dark" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3a4428" />
          <stop offset="1" stopColor="#5f6b42" />
        </linearGradient>
        <radialGradient id="g-euca" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#a7ad84" />
          <stop offset="1" stopColor="#5f6b42" />
        </radialGradient>

        {/* roses */}
        <radialGradient id="g-mauve-petal" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#5a1a26" />
          <stop offset="0.55" stopColor="#8e3344" />
          <stop offset="1" stopColor="#d99aa0" />
        </radialGradient>
        <radialGradient id="g-mauve-core" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#4a1018" />
          <stop offset="0.6" stopColor="#7a2a38" />
          <stop offset="1" stopColor="#c48a90" />
        </radialGradient>
        <radialGradient id="g-peach-petal" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#b56a6a" />
          <stop offset="0.55" stopColor="#d9a3a8" />
          <stop offset="1" stopColor="#f1d6cf" />
        </radialGradient>
        <radialGradient id="g-peach-core" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#9a4a52" />
          <stop offset="1" stopColor="#e3b5b2" />
        </radialGradient>
        <radialGradient id="g-ivory-petal" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#c9a98c" />
          <stop offset="1" stopColor="#f6e7d6" />
        </radialGradient>
        <radialGradient id="g-ivory-core" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#b8957a" />
          <stop offset="1" stopColor="#efdcc5" />
        </radialGradient>

        {/* hydrangea florets */}
        <radialGradient id="g-hydra-blue" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#f1dcc8" />
          <stop offset="1" stopColor="#c49a8a" />
        </radialGradient>
        <radialGradient id="g-hydra-lilac" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#e6c3c0" />
          <stop offset="1" stopColor="#9a5560" />
        </radialGradient>

        <radialGradient id="g-jasmine" cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#e9d6bf" />
          <stop offset="1" stopColor="#fbf0e2" />
        </radialGradient>
        <radialGradient id="g-center" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3dcc6" />
          <stop offset="1" stopColor="#d9a98d" />
        </radialGradient>
        <linearGradient id="g-champagne" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cdb497" />
          <stop offset="0.5" stopColor="#efe2cf" />
          <stop offset="1" stopColor="#c9ab8c" />
        </linearGradient>

        {/* distant lawn, cool and soft */}
        <linearGradient id="g-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a1a22" />
          <stop offset="1" stopColor="#3a0f19" />
        </linearGradient>
        <linearGradient id="g-hill-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1a1c" />
          <stop offset="1" stopColor="#30101a" />
        </linearGradient>

        {/* pencil wobble for sketched lines */}
        <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* soft watercolour edges for washes */}
        <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="8" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.8" />
        </filter>
      </defs>
    </svg>
  )
}
