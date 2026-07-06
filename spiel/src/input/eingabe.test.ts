import { describe, expect, it } from 'vitest'
import { klassifiziereSwipe } from './eingabe'

describe('klassifiziereSwipe', () => {
  it('erkennt horizontale Swipes ab Mindest-Distanz', () => {
    expect(klassifiziereSwipe(-40, 5)).toBe('links')
    expect(klassifiziereSwipe(40, -10)).toBe('rechts')
    expect(klassifiziereSwipe(10, 5)).toBeNull()
  })

  it('Swipe nach oben ist Sprung, nach unten ist nichts', () => {
    expect(klassifiziereSwipe(5, -60)).toBe('sprung')
    expect(klassifiziereSwipe(5, 60)).toBeNull()
  })

  it('dominante Achse entscheidet', () => {
    expect(klassifiziereSwipe(-50, -30)).toBe('links')
    expect(klassifiziereSwipe(20, -50)).toBe('sprung')
  })
})
