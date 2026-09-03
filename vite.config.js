import { defineConfig } from 'vite';

/**
 * The landing page lives in landing/ and is the site root.
 *
 * Case-study routes are served from public/ subdirectories:
 *   /resq        → public/resq/index.html       (+ assets)
 *   /prescribble → public/prescribble/index.html
 *   /chem-ar     → public/chem-ar/index.html
 *   /wordgate    → public/wordgate/index.html
 *
 * In production (Vercel) the clean URLs are handled by vercel.json.
 * In dev the middleware below does the same rewrite.
 */
const CASE_STUDIES = ['resq', 'prescribble', 'chem-ar', 'wordgate'];

export default defineConfig({
  root: 'landing',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'case-study-clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0].replace(/\/$/, '');
          const slug = url.slice(1);
          if (CASE_STUDIES.includes(slug)) {
            req.url = `/${slug}/index.html`;
          }
          next();
        });
      },
    },
  ],
});
