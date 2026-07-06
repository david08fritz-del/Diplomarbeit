import { expect, test, type Page } from '@playwright/test'

const BELEGE = '../Workflow/spiel-build/belege'
const PRAEFIX = process.env.BASE_URL ? 'task12-live' : 'task10'

// Render-Gate: liest den WebGL-Canvas nach einem frischen Frame in ein 2D-Canvas
// und zaehlt quantisierte Farben — ein schwarzer/kaputter Frame faellt damit auf,
// auch wenn DOM-Assertions gruen sind (Befund 1, 05-code-critic.md).
async function messeFarbvarianz(page: Page): Promise<{ farben: number; maxHelligkeit: number }> {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          const quelle = document.querySelector('#buehne canvas') as HTMLCanvasElement
          const ziel = document.createElement('canvas')
          ziel.width = 64
          ziel.height = 64
          const ctx = ziel.getContext('2d')!
          ctx.drawImage(quelle, 0, 0, 64, 64)
          const daten = ctx.getImageData(0, 0, 64, 64).data
          const farben = new Set<number>()
          let maxHelligkeit = 0
          for (let i = 0; i < daten.length; i += 4) {
            farben.add(((daten[i] >> 4) << 8) | ((daten[i + 1] >> 4) << 4) | (daten[i + 2] >> 4))
            maxHelligkeit = Math.max(maxHelligkeit, daten[i], daten[i + 1], daten[i + 2])
          }
          resolve({ farben: farben.size, maxHelligkeit })
        })
      }),
  )
}

test.describe('Hochformat (Handy 390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Canvas rendert sichtbar (Farbvarianz), FPS-Anzeige per ?fps, HUD zaehlt Muenzen', async ({ page }) => {
    await page.goto('/Diplomarbeit/spiel/?fps')
    await expect(page.locator('#buehne canvas')).toBeVisible()
    await expect(page.locator('#fps')).toContainText('fps')
    const { farben, maxHelligkeit } = await messeFarbvarianz(page)
    expect(farben, 'Szene muss mehrere Farben zeigen (kein schwarzer Frame)').toBeGreaterThanOrEqual(8)
    expect(maxHelligkeit, 'Szene darf nicht dunkel sein (Himmel ist hell)').toBeGreaterThan(120)
    await page.keyboard.press('ArrowLeft') // Spur 0 — dort liegt Reihe 1 (z=6)
    await expect(page.locator('.muenzen-zahl')).not.toHaveText('0', { timeout: 8000 })
    await page.screenshot({ path: `${BELEGE}/${PRAEFIX}-hochformat.png` })
  })

  test('Swipe links per Pointer sammelt Muenzen, touch-action ist none', async ({ page }) => {
    await page.goto('/Diplomarbeit/spiel/')
    await expect(page.locator('#buehne canvas')).toBeVisible()
    await expect(page.locator('#buehne')).toHaveCSS('touch-action', 'none')
    await page.mouse.move(260, 500)
    await page.mouse.down()
    await page.mouse.move(140, 500, { steps: 5 }) // dx=-120 → Intent 'links'
    await page.mouse.up()
    await expect(page.locator('.muenzen-zahl')).not.toHaveText('0', { timeout: 8000 })
  })
})

test.describe('Desktop (1280x800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('zentrierte Hochformat-Buehne', async ({ page }) => {
    await page.goto('/Diplomarbeit/spiel/')
    const kasten = await page.locator('#buehne').boundingBox()
    expect(kasten).not.toBeNull()
    expect(kasten!.width).toBeLessThan(500) // 800 * 9/16 = 450
    expect(Math.abs(kasten!.x + kasten!.width / 2 - 640)).toBeLessThan(2) // zentriert
    await page.screenshot({ path: `${BELEGE}/${PRAEFIX}-desktop.png` })
  })
})
