import { defineConfig } from '@playwright/test'

const liveBaseUrl = process.env.BASE_URL

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: liveBaseUrl ?? 'http://localhost:4173',
  },
  webServer: liveBaseUrl
    ? undefined
    : {
        command: 'npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173/Diplomarbeit/spiel/',
        reuseExistingServer: true,
      },
})
