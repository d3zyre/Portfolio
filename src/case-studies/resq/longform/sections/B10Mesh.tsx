import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Stage, At } from '../Stage'
import { SectionPill, SectionNumber, Display, Lede } from '../Bits'
import {
  OPACITY, COVERAGE_SCALE, COVERAGE_OPACITY, COVERAGE_CENTRES,
  PHONE_LIVE, PHONE_RED_STOPS, STEPS, STAGGER,
} from '../meshKeyframes'
import meshSvg from '../mesh-diagram.svg?raw'

/** Timing of the loop, in ms — a Figma prototype with after-delay transitions. */
const HOLD = 1100
const TRANS = 1400
const FINAL_HOLD = 2400
/** Wrapping back to the start plays as a slow recovery rather than a cut. */
const WRAP = 1600

const LAST = STEPS.length - 1
const CYCLE = LAST * (HOLD + TRANS) + FINAL_HOLD + WRAP

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t)

/**
 * Interpolate a keyframe array at `p` (0…LAST), easing within each segment the
 * way Figma eases a Smart Animate transition. `delay` shifts this layer later
 * inside its segment so grouped layers cascade instead of snapping together.
 */
function sample(values: number[], p: number, delay = 0) {
  const i = Math.min(Math.floor(p), values.length - 2)
  const local = clamp01((p - i - delay) / (1 - delay))
  return values[i] + (values[i + 1] - values[i]) * easeInOut(local)
}

/** Map elapsed time within one cycle to a keyframe position. */
function progressAt(t: number) {
  let cursor = 0
  for (let i = 0; i < LAST; i++) {
    if (t < cursor + HOLD) return i
    cursor += HOLD
    if (t < cursor + TRANS) return i + easeInOut((t - cursor) / TRANS)
    cursor += TRANS
  }
  if (t < cursor + FINAL_HOLD) return LAST
  cursor += FINAL_HOLD
  return LAST * (1 - easeInOut((t - cursor) / WRAP))
}

/**
 * Runs the loop only while the diagram is on screen.
 *
 * The frame callback writes straight to the DOM rather than going through React
 * state — a setState per animation frame re-rendered this whole 900px block
 * sixty times a second, which is what made scrolling stutter.
 */
function useLoop(apply: (progress: number) => void) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(LAST)
      return
    }

    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      apply(progressAt((now - start) % CYCLE))
      frame = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !frame) {
          frame = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && frame) {
          cancelAnimationFrame(frame)
          frame = 0
          start = 0
        }
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [apply])

  return ref
}

const phoneLiveIds = (svg: SVGSVGElement) =>
  [...svg.querySelectorAll('[id^="PhoneLive "]')].map((el) => el.id)

/**
 * Figma swaps each phone's gradient from slate to red between frames 3 and 4.
 * SVG can't tween gradient stops, so each phone is cloned, its gradient cloned
 * and recoloured, and the red copy cross-faded over the slate original.
 */
function buildRedPhones(svg: SVGSVGElement) {
  if (svg.querySelector('[id^="PhoneLive "]')) return
  const defs = svg.querySelector('defs')
  if (!defs) return

  for (const phone of [...svg.querySelectorAll('[id^="Phone "]')]) {
    const copy = phone.cloneNode(true) as SVGElement
    copy.id = phone.id.replace('Phone', 'PhoneLive')

    for (const shape of [copy, ...copy.querySelectorAll('*')]) {
      const fill = shape.getAttribute('fill')
      const ref = fill?.match(/^url\(#(.+)\)$/)?.[1]
      if (!ref) continue
      const source = svg.querySelector(`#${CSS.escape(ref)}`)
      if (!source) continue

      const grad = source.cloneNode(true) as SVGElement
      grad.id = `${ref}-red`
      grad.querySelectorAll('stop').forEach((stop, i) => {
        const [color, alpha] = PHONE_RED_STOPS[Math.min(i, PHONE_RED_STOPS.length - 1)]
        stop.setAttribute('stop-color', color)
        stop.setAttribute('stop-opacity', String(alpha))
      })
      defs.appendChild(grad)
      shape.setAttribute('fill', `url(#${grad.id})`)
    }

    copy.setAttribute('style', 'opacity:0')
    phone.parentNode?.insertBefore(copy, phone.nextSibling)
  }
}

/** The diagram is inlined so its Figma layer ids can be driven directly. */
export function B10Mesh() {
  const host = useRef<HTMLDivElement | null>(null)
  const stepEl = useRef<HTMLSpanElement | null>(null)
  const labelEls = useRef<HTMLSpanElement[]>([])
  const layers = useRef<Array<[SVGElement, number[], number]>>([])
  const rings = useRef<SVGElement[]>([])
  const shownStep = useRef(-1)

  useLayoutEffect(() => {
    const root = host.current
    const svg = root?.querySelector('svg')
    if (!root || !svg) return
    buildRedPhones(svg)

    const found: Array<[SVGElement, number[], number]> = []
    const collect = (id: string, values: number[]) => {
      const el = root.querySelector<SVGElement>(`[id="${id}"]`)
      if (!el) return
      const idx = Number(id.slice(id.lastIndexOf(' ') + 1)) || 0
      found.push([el, values, Math.min(idx * STAGGER, 0.5)])
    }
    for (const id of Object.keys(OPACITY)) collect(id, OPACITY[id])
    for (const id of phoneLiveIds(svg)) collect(id, PHONE_LIVE)
    layers.current = found
    rings.current = COVERAGE_CENTRES
      .map((_, i) => root.querySelector<SVGElement>(`[id="Coverage ${i}"]`))
      .filter(Boolean) as SVGElement[]
  }, [])

  /** Written on every animation frame, so it touches the DOM and nothing else. */
  const apply = useCallback((progress: number) => {
    for (const [el, values, delay] of layers.current) {
      el.style.opacity = String(sample(values, progress, delay))
    }
    const k = sample(COVERAGE_SCALE, progress)
    const coverage = String(sample(COVERAGE_OPACITY, progress))
    rings.current.forEach((el, i) => {
      const [cx, cy] = COVERAGE_CENTRES[i]
      el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`)
      el.style.opacity = coverage
    })

    const step = Math.min(Math.round(progress), LAST)
    if (step !== shownStep.current) {
      shownStep.current = step
      if (stepEl.current) stepEl.current.textContent = STEPS[step]
    }
    const labels = String(sample(OPACITY['Mesh 0'], progress))
    for (const el of labelEls.current) if (el) el.style.opacity = labels
  }, [])

  const loopRef = useLoop(apply)

  return (
    <Stage h={900} id="mesh">
      <SectionPill label="Mesh Network" y={64} />
      <SectionNumber n="04" y={64} />

      <Display y={150} w={578}>
        When the towers go,<br /><b>the phones stay</b>
      </Display>
      <Lede y={162} w={420}>
        The Char Islands may be cut off from the mainland, but if 200 phones exist on the island, 200 nodes of a rescue network exist too.
      </Lede>

      <At x={80} y={360} w={1240} h={480}>
        <div
          ref={loopRef}
          className="h-full w-full"
          role="img"
          aria-label="Animated mesh network map in five steps: towers carry everything; the water rises; the network is gone; phones find each other; two islands, still connected."
        >
          <div
            ref={host}
            className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: meshSvg }}
          />
        </div>
      </At>

      {/* Text is live rather than the exported paths, so the step label can change. */}
      <At x={116} y={392}>
        <span ref={stepEl} className="whitespace-pre font-mono text-[11px] font-medium tracking-[0.1em] text-ink">
          {STEPS[0]}
        </span>
      </At>
      <At x={255} y={780}>
        <span
          ref={(el) => { if (el) labelEls.current[0] = el }}
          className="font-mono text-[9px] font-medium tracking-[0.1em] text-red"
          style={{ opacity: 0 }}
        >
          GUWAHATI
        </span>
      </At>
      <At x={980} y={760}>
        <span
          ref={(el) => { if (el) labelEls.current[1] = el }}
          className="font-mono text-[9px] font-medium tracking-[0.1em] text-red"
          style={{ opacity: 0 }}
        >
          CHAR ISLAND
        </span>
      </At>
    </Stage>
  )
}
