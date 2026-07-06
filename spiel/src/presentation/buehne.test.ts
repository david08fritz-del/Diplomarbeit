import { describe, expect, it } from 'vitest'
import { berechneBuehne, berechnePixelRatio, RENDER_BUDGET_PIXEL } from './buehne'

describe('berechneBuehne', () => {
  it('Hochformat-Fenster fuellt die Buehne komplett', () => {
    expect(berechneBuehne(390, 844)).toEqual({ breite: 390, hoehe: 844 })
  })

  it('Querformat bekommt eine zentrierte 9:16-Buehne', () => {
    expect(berechneBuehne(1920, 1080)).toEqual({ breite: 608, hoehe: 1080 })
  })
})

describe('berechnePixelRatio', () => {
  it('Handy klemmt beim DPR-Cap 2', () => {
    expect(berechnePixelRatio(3, 390, 844)).toBe(2)
  })

  it('iPad bleibt unterm Render-Budget', () => {
    const pr = berechnePixelRatio(2, 834, 1194)
    expect(pr).toBeLessThan(2)
    expect(834 * pr * (1194 * pr)).toBeLessThanOrEqual(RENDER_BUDGET_PIXEL * 1.001)
  })

  it('faellt nie unter 1 und nie ueber den Geraete-DPR', () => {
    expect(berechnePixelRatio(2, 2000, 3000)).toBe(1)
    expect(berechnePixelRatio(1, 390, 844)).toBe(1)
  })
})
