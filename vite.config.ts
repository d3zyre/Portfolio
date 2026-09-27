import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * One site, four pages. Each page is its own HTML entry with its own CSS bundle,
 * so the case studies keep their global styles (Tailwind preflight, body colours,
 * :root tokens) without leaking into the portfolio or into each other.
 *
 *   /              index.html              portfolio
 *   /resq/         resq/index.html         ResQ case study
 *   /prescribble/  prescribble/index.html  Prescribble case study
 *   /chem-ar/      chem-ar/index.html      ChemAR case study
 */
const page = (path: string) => resolve(__dirname, path)

export default defineConfig({
  // Multi-page: an unknown URL is a 404, not a silent fallback to the portfolio.
  appType: 'mpa',
  plugins: [react(), tailwindcss()],
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        portfolio: page('index.html'),
        resq: page('resq/index.html'),
        prescribble: page('prescribble/index.html'),
        'chem-ar': page('chem-ar/index.html'),
      },
    },
  },
})
