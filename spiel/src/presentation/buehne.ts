export const RENDER_BUDGET_PIXEL = 2_800_000

export function berechneBuehne(
  fensterBreite: number,
  fensterHoehe: number,
): { breite: number; hoehe: number } {
  if (fensterBreite < fensterHoehe) return { breite: fensterBreite, hoehe: fensterHoehe }
  return { breite: Math.round((fensterHoehe * 9) / 16), hoehe: fensterHoehe }
}

export function berechnePixelRatio(
  geraetePixelRatio: number,
  breite: number,
  hoehe: number,
): number {
  const budget = Math.sqrt(RENDER_BUDGET_PIXEL / (breite * hoehe))
  return Math.max(1, Math.min(geraetePixelRatio, 2, budget))
}
