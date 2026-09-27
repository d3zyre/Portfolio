/**
 * Every phone mockup on the page, as exported from the Long Form without its drop
 * shadow (so the image is exactly the device — no bleed to pad or key out).
 *
 * Boxes are each device's bounding box in its block's Figma coordinates. The page
 * renders every phone at one body height rather than at its Figma size: the Figma
 * devices ranged from 803px to a 1029px close-up, which on a laptop meant some fit
 * the screen and others were cut top and bottom. Each is scaled about its own centre.
 */
export const PHONE_HEIGHT = 736.6

type Box = { x: number; y: number; w: number; h: number; phoneH: number }

const BOXES: Record<string, Box> = {
  'b13-1': { x: 183.54, y: 570.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b13-2': { x: 823.54, y: 1520.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b14-1': { x: 966.28, y: 410.23, w: 573.66, h: 1061.22, phoneH: 1028.63 },
  'b14-2': { x: 183.12, y: 1509.25, w: 393.77, h: 805.03, phoneH: 805.03 },
  'b14-3': { x: -123.72, y: 2400.23, w: 573.66, h: 1061.22, phoneH: 1028.63 },
  'b14-4': { x: 823.12, y: 3499.25, w: 393.77, h: 805.03, phoneH: 805.03 },
  'b15-1': { x: 183.54, y: 490.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b15-2': { x: 823.54, y: 1490.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b15-3': { x: 183.54, y: 2490.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b16-1': { x: 823.54, y: 490.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b16-2': { x: 183.54, y: 1490.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b16-3': { x: 823.54, y: 2490.12, w: 392.91, h: 803.28, phoneH: 803.28 },
  'b18-1': { x: 183.57, y: 490, w: 392.85, h: 803.16, phoneH: 803.16 },
  'b18-2': { x: 823.57, y: 1570, w: 392.85, h: 803.16, phoneH: 803.16 },
  'b18-3': { x: 183.57, y: 2650, w: 392.85, h: 803.16, phoneH: 803.16 },
  'b19-1': { x: 823.57, y: 490, w: 392.85, h: 803.16, phoneH: 803.16 },
  'b19-2': { x: 183.57, y: 1570, w: 392.85, h: 803.16, phoneH: 803.16 },
  'b19-3': { x: 823.57, y: 2650, w: 392.85, h: 803.16, phoneH: 803.16 },
}

/** The rect to draw a phone image in, at the shared height, centred where Figma had it. */
export function phone(key: keyof typeof BOXES | string) {
  const b = BOXES[key]
  if (!b) throw new Error(`unknown phone ${key}`)
  const k = PHONE_HEIGHT / b.phoneH
  const w = b.w * k
  const h = b.h * k
  return { x: b.x + (b.w - w) / 2, y: b.y + (b.h - h) / 2, w, h, src: `/resq/lf/dev/${key}.webp` }
}
