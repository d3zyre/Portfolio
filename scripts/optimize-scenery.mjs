/**
 * Rounds coordinates and namespaces internal ids in the decorative Figma SVG
 * exports so they can be inlined side-by-side in one document.
 *
 * Usage: node scripts/optimize-scenery.mjs
 * Reads  design-source/<name>.svg
 * Writes landing/scenery/<name>.svg  (fragment: viewBox only, no width/height)
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'design-source';
const OUT = 'landing/scenery';

const LAYERS = [
  ['table', 'tbl'],
  ['Background', 'bgd'],
  ['Foreground', 'fgd'],
  ['table_mobile', 'tblm'],
  ['Background_mobile', 'bgdm'],
  ['Foreground_mobile', 'fgdm'],
];

/** Round every decimal number in the source to `digits` places. */
function roundNumbers(svg, digits = 2) {
  return svg.replace(/-?\d+\.\d+(e-?\d+)?/g, (m) => {
    const n = Number(m);
    return Number.isFinite(n) ? String(Number(n.toFixed(digits))) : m;
  });
}

/** Prefix every id so multiple inlined SVGs never collide. */
function namespaceIds(svg, prefix) {
  const ids = new Set();
  for (const m of svg.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);

  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    svg = svg
      .replace(new RegExp(`\\sid="${esc}"`, 'g'), ` id="${prefix}-${id}"`)
      .replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${prefix}-${id})`)
      .replace(new RegExp(`href="#${esc}"`, 'g'), `href="#${prefix}-${id}"`);
  }
  return svg;
}

fs.mkdirSync(OUT, { recursive: true });

let before = 0;
let after = 0;

for (const [name, prefix] of LAYERS) {
  const raw = fs.readFileSync(path.join(SRC, `${name}.svg`), 'utf8');
  before += raw.length;

  let svg = roundNumbers(raw);
  svg = namespaceIds(svg, prefix);

  // Drop the fixed width/height so CSS controls the size; keep the viewBox.
  svg = svg.replace(/<svg\b[^>]*>/, (tag) => {
    const viewBox = /viewBox="([^"]+)"/.exec(tag)?.[1] ?? '';
    return `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">`;
  });

  // Collapse the whitespace Figma leaves between elements.
  svg = svg.replace(/>\s+</g, '><').trim();

  after += svg.length;
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
  console.log(`${name.padEnd(20)} ${raw.length} -> ${svg.length}`);
}

console.log(`TOTAL ${before} -> ${after} (${((1 - after / before) * 100).toFixed(1)}% smaller)`);
