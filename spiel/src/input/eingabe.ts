import type { Intent } from '../sim/sim'

export const SWIPE_MIN_DISTANZ = 24

export function klassifiziereSwipe(
  dx: number,
  dy: number,
  minDistanz = SWIPE_MIN_DISTANZ,
): Intent | null {
  if (Math.abs(dx) < minDistanz && Math.abs(dy) < minDistanz) return null
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'links' : 'rechts'
  return dy < 0 ? 'sprung' : null
}

export function verbindeEingabe(ziel: HTMLElement, anIntent: (intent: Intent) => void): void {
  let start: { x: number; y: number; pointerId: number } | null = null

  ziel.addEventListener('pointerdown', (e) => {
    start = { x: e.clientX, y: e.clientY, pointerId: e.pointerId }
    ziel.setPointerCapture(e.pointerId)
  })

  ziel.addEventListener('pointerup', (e) => {
    if (!start || e.pointerId !== start.pointerId) return
    const intent = klassifiziereSwipe(e.clientX - start.x, e.clientY - start.y)
    start = null
    if (intent) anIntent(intent)
  })

  ziel.addEventListener('pointercancel', () => {
    start = null
  })

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    const intent: Intent | null =
      e.key === 'ArrowLeft'
        ? 'links'
        : e.key === 'ArrowRight'
          ? 'rechts'
          : e.key === ' ' || e.key === 'ArrowUp'
            ? 'sprung'
            : null
    if (intent) {
      e.preventDefault()
      anIntent(intent)
    }
  })
}
