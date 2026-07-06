import { expect, test } from '@playwright/test'

const BELEGE = '../Workflow/spiel-build/belege'
const PRAEFIX = process.env.BASE_URL ? 'task12-live' : 'task10'

test.describe('Hochformat (Handy 390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Canvas rendert, FPS-Anzeige per ?fps, HUD zaehlt Muenzen', async ({ page }) => {
    await page.goto('/Diplomarbeit/spiel/?fps')
    await expect(page.locator('#buehne canvas')).toBeVisible()
    await expect(page.locator('#fps')).toContainText('fps')
    await page.keyboard.press('ArrowLeft') // Spur 0 — dort liegt Reihe 1 (z=6)
    await expect(page.locator('.muenzen-zahl')).not.toHaveText('0', { timeout: 8000 })
    await page.screenshot({ path: `${BELEGE}/${PRAEFIX}-hochformat.png` })
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
