import type { ReactNode } from 'react'
import { At } from './Stage'

/** White pill with a red square — the section marker, top-left of a block. */
export function SectionPill({ label, y = 80 }: { label: string; y?: number }) {
  return (
    <At x={80} y={y}>
      <div className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-[22px]">
        <span className="h-[9px] w-[9px] rounded-[2px] bg-red" />
        <span className="font-body text-[15px] font-medium text-ink">{label}</span>
      </div>
    </At>
  )
}

/** Hairline circle with the block number, top-right. */
export function SectionNumber({ n, y = 80 }: { n: string; y?: number }) {
  return (
    <At x={1272} y={y}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line">
        <span className="font-body text-[15px] text-mid">{n}</span>
      </div>
    </At>
  )
}

/**
 * 58/74 Space Grotesk display line. Words are muted by default; `<b>` marks the
 * ink-coloured emphasis and `<i>` the red one, matching the mixed runs in Figma.
 */
export function Display({ x = 80, y, w, children }: { x?: number; y: number; w?: number; children: ReactNode }) {
  return (
    <At x={x} y={y} w={w}>
      <h2 className="font-display text-[58px] leading-[74px] font-normal text-mid [&_b]:font-normal [&_b]:text-ink [&_i]:font-normal [&_i]:not-italic [&_i]:text-red/95">
        {children}
      </h2>
    </At>
  )
}

/** The 11px uppercase mono micro-label used on every card footer. */
export function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[11px] font-medium tracking-[0.1em] text-grey ${className}`}>
      {children}
    </span>
  )
}

/** White card: 26px radius, hairline border. */
export function Card({
  x, y, w, h, rotate, shadow, className = '', children,
}: {
  x: number; y: number; w: number; h: number; rotate?: number; shadow?: boolean
  className?: string; children: ReactNode
}) {
  return (
    <At
      x={x}
      y={y}
      w={w}
      h={h}
      rotate={rotate}
      className={`rounded-[26px] border border-line bg-white ${className}`}
      style={shadow ? { boxShadow: '0 16px 40px -10px rgba(26,31,46,0.14)' } : undefined}
    >
      {children}
    </At>
  )
}

/** The 430-wide supporting paragraph that sits opposite a display headline. */
export function Lede({ x = 880, y, w = 430, children }: { x?: number; y: number; w?: number; children: ReactNode }) {
  return (
    <At x={x} y={y} w={w}>
      <p className="font-body text-[17px] leading-[28px] text-grey">{children}</p>
    </At>
  )
}

/** The rounded triangle that marks a value on a stat track. */
export function Marker() {
  return (
    <svg width="18" height="14" viewBox="0 0 15 13" fill="none" aria-hidden>
      <path
        d="M5.65749 0.918514C6.44476 -0.306133 8.23493 -0.306133 9.0222 0.918514L14.3589 9.22C15.2145 10.551 14.2588 12.3015 12.6765 12.3015H2.00317C0.420843 12.3015 -0.53484 10.551 0.320818 9.22L5.65749 0.918514Z"
        fill="#992311"
      />
    </svg>
  )
}

/**
 * Track + filled portion + marker. `pct` is the marker position along the track,
 * which is not always the headline number (the battery card reads 6h of 24h).
 */
export function Slider({ x, y, w, pct }: { x: number; y: number; w: number; pct: number }) {
  const filled = (w * pct) / 100
  return (
    <>
      <At x={x} y={y} w={w} h={6} className="rounded-[3px] bg-[#E8E7E3]" />
      <At x={x} y={y} w={filled} h={6} className="rounded-[3px] bg-red/55" />
      <At x={x + filled - 9} y={y - 2} w={18} h={14}><Marker /></At>
    </>
  )
}

/** The red lightning bolt used in the research chips. */
export function Bolt() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden>
      <path d="M8 0L0 10H6L5 18L14 7H8V0Z" fill="#D4351C" />
    </svg>
  )
}

/** Bolt + count + label, in a hairline rounded rectangle. */
export function Chip({ x, y, w, count, label }: { x: number; y: number; w: number; count: string; label: string }) {
  return (
    <At x={x} y={y} w={w} h={60}>
      <div className="flex h-full items-center gap-3 rounded-2xl border border-line bg-white pr-7 pl-6">
        <Bolt />
        <span className="whitespace-nowrap font-body text-[17px]">
          <span className="text-ink">{count}</span>
          <span className="ml-2 text-grey">{label}</span>
        </span>
      </div>
    </At>
  )
}

/** The tinted red→blue wash behind the emphasis cards. */
export const WASH_WIDE = 'linear-gradient(98.6deg, rgba(212,53,28,0.14), rgba(91,143,214,0.12))'
export const WASH_FLAT = 'linear-gradient(93deg, rgba(212,53,28,0.12), rgba(91,143,214,0.10))'

/**
 * Hairline elbow linking a step's anchor across to its phone. The path comes
 * straight from Figma, so the viewBox matches the frame it was drawn in.
 */
export function Connector({ x, y, w, h, d }: { x: number; y: number; w: number; h: number; d: string }) {
  return (
    <At x={x} y={y} w={w} h={h}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
        <path d={d} stroke="#C9C8C3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </At>
  )
}

/** Ringed red dot at the step end of a connector. */
export function Anchor({ x, y }: { x: number; y: number }) {
  return (
    <At
      x={x} y={y} w={14} h={14}
      className="rounded-full bg-white"
      style={{ boxShadow: '0 1px 4px 0 rgba(26,38,69,0.14)' }}
    >
      <At x={3.5} y={3.5} w={7} h={7} className="rounded-full bg-red" />
    </At>
  )
}

/** Plain grey dot at the phone end of a connector. */
export function AnchorEnd({ x, y }: { x: number; y: number }) {
  return <At x={x} y={y} w={5} h={5} className="rounded-full bg-mid" />
}

/** Soft grey slab the upright phones stand on. */
export function Panel({ x, y }: { x: number; y: number }) {
  return <At x={x} y={y} w={600} h={700} className="rounded-[32px] bg-panel" />
}
