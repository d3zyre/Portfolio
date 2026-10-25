import { useEffect, useRef, useState, type ReactNode } from 'react'

export const STAGE_W = 1400

/**
 * The Figma long-form is authored on a fixed 1400px stage. Each block renders at
 * its exact Figma geometry and the whole stage scales down to fit the window.
 * (CSS can't do this alone — `calc(px * ratio)` needs a unitless ratio, and
 * length/length division isn't reliably supported, so the scale is measured.)
 */
function useStageScale() {
  const ref = useRef<HTMLElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Width only. The stage must fill the window edge to edge at 1400px — the
    // full-bleed artwork (the Assam map) depends on it — so never scale by height.
    const measure = (width: number) => {
      const next = Math.min(1, width / STAGE_W)
      // quantise, so a sub-pixel width change can't retrigger layout forever
      setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
    }

    const ro = new ResizeObserver(([entry]) => measure(entry.contentRect.width))
    ro.observe(el)
    const onResize = () => measure(el.getBoundingClientRect().width)
    window.addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { ref, scale }
}

export function Stage({ h, children, id }: { h: number; children: ReactNode; id?: string }) {
  const { ref, scale } = useStageScale()
  const height = Math.round(h * scale)
  return (
    <section
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden"
      // skip painting blocks that are nowhere near the viewport; without it the
      // browser keeps ~23,000px of scaled artwork live and scrolling stutters
      style={{ contentVisibility: 'auto', containIntrinsicSize: `auto ${height}px` }}
    >
      {/* The scaled stage keeps its own box so it centres above 1400px
          instead of hugging the left edge. */}
      <div className="relative mx-auto" style={{ width: Math.round(STAGE_W * scale), height }}>
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: STAGE_W, height: h, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}

/** Absolute box in Figma frame coordinates. */
export function At({
  x, y, w, h, rotate, className, style, children,
}: {
  x: number; y: number; w?: number; h?: number; rotate?: number
  className?: string; style?: React.CSSProperties; children?: ReactNode
}) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        ...(rotate ? { transform: `rotate(${rotate}deg)`, transformOrigin: 'top left' } : null),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
