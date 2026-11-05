/** Shared gradients for every garden SVG. Rendered once at the app root. */
export function GardenDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      <defs>
        <linearGradient id="g-leaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4f6a4c" />
          <stop offset="0.6" stopColor="#7f9a72" />
          <stop offset="1" stopColor="#a9bf98" />
        </linearGradient>
        <linearGradient id="g-leaf-light" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7c9670" />
          <stop offset="1" stopColor="#c5d5b3" />
        </linearGradient>
        <linearGradient id="g-leaf-dark" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2f4433" />
          <stop offset="1" stopColor="#5f7d5a" />
        </linearGradient>
        <radialGradient id="g-rose" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#b9675a" />
          <stop offset="0.45" stopColor="#d99a8c" />
          <stop offset="1" stopColor="#f4d3c8" />
        </radialGradient>
        <radialGradient id="g-rose-petal" cx="0.5" cy="0.9" r="0.9">
          <stop offset="0" stopColor="#d48f80" />
          <stop offset="0.7" stopColor="#efc2b5" />
          <stop offset="1" stopColor="#fbe6de" />
        </radialGradient>
        <radialGradient id="g-ivory-petal" cx="0.5" cy="0.9" r="0.9">
          <stop offset="0" stopColor="#e9dcc0" />
          <stop offset="1" stopColor="#fffdf7" />
        </radialGradient>
        <radialGradient id="g-jasmine" cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#efe6cf" />
          <stop offset="1" stopColor="#ffffff" />
        </radialGradient>
        <radialGradient id="g-center" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e3c36f" />
          <stop offset="1" stopColor="#b8924a" />
        </radialGradient>
        <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6a2f" />
          <stop offset="0.45" stopColor="#e6cd8f" />
          <stop offset="1" stopColor="#a7823f" />
        </linearGradient>
        <linearGradient id="g-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d3b6" />
          <stop offset="1" stopColor="#e7e5cf" />
        </linearGradient>
        <linearGradient id="g-hill-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9b994" />
          <stop offset="1" stopColor="#d8dcc2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
