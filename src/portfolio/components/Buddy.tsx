import { useEffect, useRef, useState } from 'react'

/** Lines she says when clicked, after the hover "hi!". */
const LINES = ["I'm d3zyre!", 'ask me anything!', 'psst, try Prescribble', 'boop!', 'type a question below']

/**
 * d3zyre, the little purple buddy in the corner. She blinks, looks toward the cursor,
 * takes short strolls in the empty space beside the chat, says hello on hover, and
 * hops on click, which also opens and focuses the chat box.
 */
export function Buddy({ onClick }: { onClick: () => void }) {
  const root = useRef<HTMLButtonElement | null>(null)
  const eyes = useRef<SVGGElement[]>([])
  // The text stays put while the bubble fades out, so it never shrinks to an empty pill.
  const [line, setLine] = useState('')
  const [showing, setShowing] = useState(false)
  const [hop, setHop] = useState(0)
  const [walking, setWalking] = useState(false)
  const hovered = useRef(false)
  const quietUntil = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const say = (text: string, ms = 1800) => {
    setLine(text)
    setShowing(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setShowing(false), ms)
  }

  // Eyes drift toward the cursor, a little more the farther away it is.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = root.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.5
      const a = Math.atan2(e.clientY - cy, e.clientX - cx)
      const d = Math.min(1, Math.hypot(e.clientX - cx, e.clientY - cy) / 240)
      const t = `translate(${(Math.cos(a) * 2.2 * d).toFixed(2)} ${(Math.sin(a) * 2.2 * d).toFixed(2)})`
      eyes.current.forEach((g) => g.setAttribute('transform', t))
    }
    window.addEventListener('pointermove', move, { passive: true })
    // Once the chat is open there's nothing to click for, so she just says hello.
    const hello = window.setTimeout(() => say(document.body.classList.contains('chat-open') ? "hi, I'm d3zyre!" : 'hi! click me to chat', 2600), 1200)
    return () => {
      window.removeEventListener('pointermove', move)
      window.clearTimeout(hello)
      window.clearTimeout(timer.current)
    }
  }, [])

  // She lives on one of two levels: the top edge of the chat box, or the floor along the bottom
  // of the screen. Either way she stays clear of the sidebar. x is her left edge in px.
  const level = useRef<'top' | 'base'>('base')
  const x = useRef(-1)
  const lane = (lv = level.current) => {
    const el = root.current
    const box = document.querySelector('.composer')?.getBoundingClientRect()
    if (!el || !box) return null
    const w = el.offsetWidth
    const side = document.querySelector('.sidebar')?.getBoundingClientRect()
    const sideRight = side && side.width > 0 && side.left < 10 ? side.right : 0
    if (lv === 'top') return { ground: window.innerHeight - box.top, lo: box.left + 16, hi: box.right - w - 16 }
    return { ground: 10, lo: sideRight + 16, hi: window.innerWidth - w - 24 }
  }
  const settle = (ms?: number) => {
    const el = root.current, l = lane(); if (!el || !l) return
    // Start from where she actually is on screen, so a blocked spot nudges her to the nearest safe edge
    const now = el.getBoundingClientRect().left
    if (x.current < 0) x.current = el.style.getPropertyValue('--x') ? now : l.hi
    else if (Math.abs(now - x.current) > 2 && !el.classList.contains('is-dragging')) x.current = now
    x.current = Math.min(l.hi, Math.max(l.lo, x.current))
    if (ms !== undefined) el.style.setProperty('--walk', `${ms}ms`)
    el.style.setProperty('--ground', `${Math.round(l.ground)}px`)
    el.style.setProperty('--x', `${Math.round(x.current)}px`)
  }

  // Keep her on her level as the chat box grows or the window resizes.
  useEffect(() => {
    const box = document.querySelector('.composer'); if (!box) return
    settle(0)
    const ro = new ResizeObserver(() => settle())
    ro.observe(box)
    // The sidebar opening or closing changes where the floor starts; step out of its way.
    const side = document.querySelector('.sidebar')
    if (side) ro.observe(side)
    const onSideAnim = () => settle(400)
    side?.addEventListener('transitionend', onSideAnim)
    // Opening or closing the sidebar toggles a class on <body>; re-check her spot right after.
    const mo = new MutationObserver(() => { settle(400); window.setTimeout(() => settle(400), 450) })
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    const onResize = () => settle(0)
    window.addEventListener('resize', onResize)
    return () => { ro.disconnect(); window.removeEventListener('resize', onResize); side?.removeEventListener('transitionend', onSideAnim); mo.disconnect() }
  }, [])

  // Now and then she takes a short, unhurried walk along her level. Skipped on phones (she sits
  // in the top bar), for reduced motion, while hovered, and while being carried.
  const dragging = useRef(false)
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const phone = window.matchMedia('(max-width: 640px)')
    let next: number | undefined
    let stop: number | undefined
    const walk = () => {
      const l = lane()
      if (l && !still.matches && !phone.matches && !hovered.current && !dragging.current && l.hi > l.lo) {
        const step = 40 + Math.random() * 120
        const from = x.current
        x.current = Math.min(l.hi, Math.max(l.lo, from + (Math.random() < 0.5 ? -step : step)))
        const ms = Math.max(900, (Math.abs(x.current - from) / 32) * 1000) // about 32px a second
        settle(ms)
        setWalking(true)
        window.clearTimeout(stop)
        stop = window.setTimeout(() => setWalking(false), ms)
      }
      next = window.setTimeout(walk, 7000 + Math.random() * 8000)
    }
    next = window.setTimeout(walk, 4000)
    return () => { window.clearTimeout(next); window.clearTimeout(stop) }
  }, [])

  // Drag and drop: pick her up and drop her on the chat box or the floor.
  const start = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(max-width: 640px)').matches) return
    start.current = { x: e.clientX, y: e.clientY }
    moved.current = false
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* not a capturable pointer */ }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = root.current
    if (!start.current || !el) return
    if (!dragging.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) < 6) return
    if (!dragging.current) { dragging.current = true; moved.current = true; el.classList.add('is-dragging'); setWalking(false) }
    const base = lane('base')
    const w = el.offsetWidth, h = el.offsetHeight
    const left = Math.min(window.innerWidth - w - 8, Math.max((base?.lo ?? 16) - 8, e.clientX - w / 2))
    el.style.setProperty('--x', `${Math.round(left)}px`)
    el.style.setProperty('--ground', `${Math.round(Math.max(0, window.innerHeight - e.clientY - h / 2))}px`)
  }
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = root.current
    start.current = null
    if (!dragging.current || !el) return
    dragging.current = false
    el.classList.remove('is-dragging')
    const box = document.querySelector('.composer')?.getBoundingClientRect()
    const overBox = box && e.clientY < box.top + box.height / 2 && e.clientX > box.left && e.clientX < box.right
    level.current = overBox ? 'top' : 'base'
    x.current = e.clientX - el.offsetWidth / 2
    settle(500)
    setHop((n) => n + 1)
    quietUntil.current = Date.now() + 2500
    say(overBox ? 'up here!' : 'wheee!')
  }

  const eye = (i: number) => (el: SVGGElement | null) => { if (el) eyes.current[i] = el }

  return (
    <button
      ref={root}
      className={'buddy' + (hop ? ' is-hop' : '') + (walking ? ' is-walking' : '')}
      aria-label="d3zyre, the site buddy. Click to ask a question"
      onMouseEnter={() => { hovered.current = true; if (Date.now() > quietUntil.current) say('hi!') }}
      onMouseLeave={() => { hovered.current = false }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={() => {
        // A drag ends with a click event too; that one isn't a tap.
        if (moved.current) { moved.current = false; return }
        setHop((h) => h + 1)
        // Her hop re-triggers hover; don't let "hi!" replace what she just said.
        quietUntil.current = Date.now() + 2500
        say(LINES[Math.floor(Math.random() * LINES.length)])
        onClick()
      }}
    >
      <span className={'buddy__bubble' + (showing ? ' is-on' : '')} aria-live="polite">{line}</span>
      <svg viewBox="0 0 74 84" aria-hidden="true">
        <ellipse className="buddy__shadow" cx="37" cy="81" rx="22" ry="3.5" />
        <g className="buddy__body" key={hop}>
          <path d="M37 13c18 0 31 13 31 32v19c0 9-6 16-15 16H21C12 80 6 73 6 64V45C6 26 19 13 37 13z" fill="#D77FB4" />
          <g transform="translate(12.6 5.4) rotate(28 37 13)">
            <path d="M37 13c-6 0-9-4-6-6 2-1 5 0 6 2 1-2 4-3 6-2 3 2 0 6-6 6z" fill="#E8558F" />
          </g>
          <g ref={eye(0)}>
            <circle cx="27" cy="43" r="7.6" fill="#37333D" /><circle cx="29.6" cy="40" r="2.7" fill="#fff" /><circle cx="24.5" cy="46.6" r="1.3" fill="#fff" />
          </g>
          <g ref={eye(1)}>
            <circle cx="47" cy="43" r="7.6" fill="#37333D" /><circle cx="49.6" cy="40" r="2.7" fill="#fff" /><circle cx="44.5" cy="46.6" r="1.3" fill="#fff" />
          </g>
          <path d="M21.1 38.9Q17.9 37.9 17.5 36.3 M52.9 38.9Q56.1 37.9 56.5 36.3" stroke="#37333D" strokeWidth="1.9" fill="none" strokeLinecap="round" />
          <rect className="buddy__lid" x="18.5" y="34.5" width="17" height="17" rx="8.5" fill="#D77FB4" />
          <rect className="buddy__lid" x="38.5" y="34.5" width="17" height="17" rx="8.5" fill="#D77FB4" />
          <ellipse cx="17" cy="55" rx="5" ry="3" fill="#F7A9C8" opacity=".9" />
          <ellipse cx="57" cy="55" rx="5" ry="3" fill="#F7A9C8" opacity=".9" />
        </g>
      </svg>
    </button>
  )
}
