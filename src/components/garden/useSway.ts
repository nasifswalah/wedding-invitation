import { useEffect, useRef } from 'react'
import { registerSway, type SwayOptions } from './wind'

/** Attach wind sway to an SVG/HTML element. */
export function useSway<T extends Element>(opts: SwayOptions) {
  const ref = useRef<T>(null)
  const key = JSON.stringify(opts)
  useEffect(() => {
    if (!ref.current) return
    return registerSway(ref.current, opts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return ref
}
