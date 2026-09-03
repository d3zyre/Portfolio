# Pixels of Akankshaa — portfolio

Akanksha Gupta's design portfolio: an interactive newspaper lying on a desk.

The landing page is real HTML and CSS — the type is selectable text, the links
are ordinary `<a>` elements, and the desk artwork is inlined as `<svg>` nodes
rather than loaded as images. Nothing on the page is a picture of text.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built site
```

## Layout of the repo

| Path | What it holds |
|---|---|
| `landing/` | The landing page. `index.html` is the markup, `styles.css` the layout, `main.js` the desk artwork and parallax. Vite's root. |
| `landing/scenery/` | The desk, background and foreground artwork, fetched and inlined at runtime. Generated — see below. |
| `landing/fonts/` | Self-hosted Instrument Serif and Roboto Serif. Generated — see below. |
| `public/` | Served as-is at the site root: the four case-study pages, the résumé PDF and the portrait. |
| `design-source/` | The Figma exports the scenery is generated from. Not served. |
| `scripts/` | The two generators described below. |

## Design coordinates

`landing/styles.css` is written in the coordinate system of the original Figma
artboard. `--u` is one design pixel, so a rule like

```css
font-size: calc(40 * var(--u));
```

means "40px at the artboard's scale" and can be read straight off the design.
Container queries rescale `--u`, so the whole newspaper scales as one piece and
the two breakpoints each keep their own artboard:

| | Frame | Newspaper |
|---|---|---|
| Desktop | 1400 × 1000 | 1280 × 835 |
| Mobile (≤ 768px) | 375 × 1391 | 326 × 1310 |

Two things are worth knowing before editing the type:

- **Roboto Serif is optically sized.** The artboard sits at the wide end of the
  `opsz` axis, so `body` pins it with `font-optical-sizing: none` and
  `font-variation-settings: "opsz" 100`. Without that pin every line runs about
  6% wide and the layout falls apart.
- **The paper sheet uses `z-index: -1`.** In the stacked layout the content is
  in normal flow, which would otherwise paint underneath a positioned sibling.

## Regenerating assets

Both scripts are one-off; their output is committed, so you only need them if
the source artwork or the font choice changes.

```bash
node scripts/optimize-scenery.mjs   # design-source/*.svg → landing/scenery/
node scripts/fetch-fonts.mjs        # Google Fonts → landing/fonts/
```

`optimize-scenery.mjs` rounds the coordinates in the Figma exports and prefixes
their internal ids so several of them can be inlined in one document without
their `<defs>` colliding.

## Deploying

`vercel.json` runs `npm run build` and serves `dist/`. The four case-study
routes (`/resq`, `/prescribble`, `/chem-ar`, `/wordgate`) are redirected to
their trailing-slash form; `vite.config.js` does the same in dev.
