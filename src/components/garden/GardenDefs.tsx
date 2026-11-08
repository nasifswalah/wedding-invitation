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
          <stop offset="0" stopColor="#6f8579" />
          <stop offset="1" stopColor="#a9bbb1" />
        </linearGradient>
        <linearGradient id="g-leaf-light" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8fa39a" />
          <stop offset="1" stopColor="#cbd8d0" />
        </linearGradient>
        <linearGradient id="g-leaf-dark" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4f6359" />
          <stop offset="1" stopColor="#7f9488" />
        </linearGradient>
        <radialGradient id="g-euca" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#c6d3cc" />
          <stop offset="1" stopColor="#8aa096" />
        </radialGradient>

        {/* roses */}
        <radialGradient id="g-mauve-petal" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#a8697a" />
          <stop offset="0.55" stopColor="#cf98a5" />
          <stop offset="1" stopColor="#f3dde1" />
        </radialGradient>
        <radialGradient id="g-mauve-core" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#8e5465" />
          <stop offset="0.6" stopColor="#c08593" />
          <stop offset="1" stopColor="#e7c3cb" />
        </radialGradient>
        <radialGradient id="g-peach-petal" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#d99a7f" />
          <stop offset="0.55" stopColor="#f0c3ab" />
          <stop offset="1" stopColor="#fbe7da" />
        </radialGradient>
        <radialGradient id="g-peach-core" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#c67f62" />
          <stop offset="1" stopColor="#f2cdb9" />
        </radialGradient>
        <radialGradient id="g-ivory-petal" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#e2d6c2" />
          <stop offset="1" stopColor="#fffdf8" />
        </radialGradient>
        <radialGradient id="g-ivory-core" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#d8c6a8" />
          <stop offset="1" stopColor="#fbf5ea" />
        </radialGradient>

        {/* hydrangea florets */}
        <radialGradient id="g-hydra-blue" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#e9f0f5" />
          <stop offset="1" stopColor="#9fb7c9" />
        </radialGradient>
        <radialGradient id="g-hydra-lilac" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#f2e6ec" />
          <stop offset="1" stopColor="#c3a3b6" />
        </radialGradient>

        <radialGradient id="g-jasmine" cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#efe6d6" />
          <stop offset="1" stopColor="#ffffff" />
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
          <stop offset="0" stopColor="#cfdad6" />
          <stop offset="1" stopColor="#ece9de" />
        </linearGradient>
        <linearGradient id="g-hill-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b3c4bc" />
          <stop offset="1" stopColor="#dde2d8" />
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
