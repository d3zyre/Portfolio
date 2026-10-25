import { CASE_STUDIES } from './content'

/**
 * Warms the browser cache for a case study's first screen, so it appears fast when
 * opened: on hover, focus or touch of a project link, and for Glance (the project
 * most visitors open) once the home page has loaded and gone idle. Videos are
 * never fetched here; the case studies load those themselves as they scroll in.
 */

/**
 * Files a page needs above the fold that its HTML doesn't list directly. Glance's
 * hero is an iframe whose images are in hero.html's CSS and script, so they are
 * named here. Keep in sync with public/glance/hero.html.
 */
const FIRST_SCREEN: Partial<Record<string, string[]>> = {
  [CASE_STUDIES.glance]: [
    '/glance/hero.html',
    '/glance/assets/posters/s1.png',
    '/glance/assets/home.jpg',
    '/glance/assets/bezel.png',
    '/glance/assets/room.jpg',
    '/glance/assets/glance-mascot.svg',
    '/glance/assets/dance-poster.webp',
  ],
}

/** How many eager images (and video posters) to take from the top of a page's HTML, for pages not listed above. */
const TOP_IMAGES = 4

const PAGES = new Set<string>(Object.values(CASE_STUDIES))
const warmed = new Set<string>()

/** Skip it all for visitors who asked to save data or are on a very slow connection. */
function saveData(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ''))
}

/** A low-priority GET; the response lands in the HTTP cache. Failures don't matter. */
function get(url: string): Promise<Response | null> {
  return fetch(url, { priority: 'low' } as RequestInit).catch(() => null)
}

/** The page itself, its scripts and stylesheets, and the first few images it shows. */
async function warm(page: string) {
  if (warmed.has(page) || saveData()) return
  warmed.add(page)
  const listed = FIRST_SCREEN[page]
  listed?.forEach(get)

  const res = await get(page)
  if (!res?.ok) return
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html')
  const base = new URL(page, location.origin)
  const urls = [
    ...[...doc.querySelectorAll<HTMLScriptElement>('script[src]')].map((s) => s.getAttribute('src')),
    ...[...doc.querySelectorAll('link[rel="stylesheet"], link[rel="modulepreload"]')].map((l) => l.getAttribute('href')),
    ...[...new Set([...doc.querySelectorAll('img:not([loading="lazy"]), video[poster]')]
      .map((el) => el.getAttribute(el.tagName === 'VIDEO' ? 'poster' : 'src')))]
      .slice(0, listed ? 0 : TOP_IMAGES),
  ]
  for (const u of urls) {
    if (!u) continue
    const url = new URL(u, base)
    // Same-origin only: fonts and other CDNs handle their own caching.
    if (url.origin === location.origin) get(url.href)
  }
}

/** The case study a link points at, if it points at one. */
function pageOf(target: EventTarget | null): string | null {
  const a = (target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!a) return null
  const url = new URL(a.href, location.href)
  return url.origin === location.origin && PAGES.has(url.pathname) ? url.pathname : null
}

export function startPrefetch() {
  const onIntent = (e: Event) => {
    const page = pageOf(e.target)
    if (page) warm(page)
  }
  for (const type of ['pointerover', 'focusin', 'touchstart'] as const) {
    document.addEventListener(type, onIntent, { passive: true })
  }

  // Glance in the background, once the home page itself is done.
  const idle = () => {
    const later = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000))
    later(() => warm(CASE_STUDIES.glance))
  }
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}
