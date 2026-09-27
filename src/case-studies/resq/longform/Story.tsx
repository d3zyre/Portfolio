import { FlowVideo } from './FlowVideo'
import type { ReactNode } from 'react'
import { At } from './Stage'

/**
 * B15 and B16 tell one person's story as three steps down a vertical spine.
 * The pieces are shared because the two blocks are the same layout mirrored —
 * only the copy, the side each phone sits on, and the measured image rects differ.
 */

const CARD_SHADOW = '0 6px 18px -4px rgba(26,38,69,0.07)'
const PILL_SHADOW = '0 2px 6px 0 rgba(26,38,69,0.05)'

export type Rect = { x: number; y: number; w: number; h: number }

export type StepSpec = {
  x: number; y: number
  n: string
  /** How this person feels at this step, not what the feature is called. */
  state: string
  title: string
  body: string
  /** Body offset under the title: 110 for a one-line title, 151 when it wraps to two. */
  bodyY?: number
  lifted: Rect & { src: string }
  captionY: number
  captionLabel: string
  caption: string
}

export function StoryHeader({
  label, number, headline, headlineW = 840, headlineSize = 58, headlineLeading = 66,
  lede, ledeX = 920,
}: {
  label: string; number: string; headline: ReactNode
  headlineW?: number
  /** B19 sets its display a step smaller than the other story blocks. */
  headlineSize?: number; headlineLeading?: number
  /** Some blocks open with a plain paragraph instead of a PersonaCard. */
  lede?: string; ledeX?: number
}) {
  return (
    <>
      <At x={80} y={56}>
        <div
          className="flex h-[45px] items-center gap-2.5 rounded-full bg-white py-[13px] pr-[22px] pl-[18px]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <span className="h-[7px] w-[7px] rounded-[1.5px] bg-red" />
          <span className="font-display text-[15px] font-medium text-ink">{label}</span>
        </div>
      </At>
      <At x={1264} y={56} w={56} h={56} className="flex items-center justify-center rounded-full border border-line">
        <span className="font-mono text-[14px] tracking-[0.5px] text-mid">{number}</span>
      </At>
      <At x={80} y={152} w={headlineW}>
        <h2
          className="font-display font-light text-mid"
          style={{ fontSize: headlineSize, lineHeight: `${headlineLeading}px` }}
        >
          {headline}
        </h2>
      </At>
      {lede && (
        <At x={ledeX} y={162} w={400}>
          <p className="font-body text-[17px] leading-[29px] text-grey">{lede}</p>
        </At>
      )}
    </>
  )
}

/** Who this is, in their own words where there is a quote. */
export function PersonaCard({ x, avatar, name, meta, body }: {
  x: number; avatar: string; name: string; meta: string; body: string
}) {
  return (
    <At x={x} y={160} w={420} className="rounded-2xl bg-white px-6 py-[22px]" style={{ boxShadow: CARD_SHADOW }}>
      <div className="flex items-center gap-3">
        <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="font-display text-[15px] font-medium text-ink">{name}</p>
          <p className="mt-[3px] font-mono text-[9.5px] tracking-[1px] whitespace-pre text-mid">{meta}</p>
        </div>
      </div>
      <p className="mt-[14px] font-body text-[15px] leading-[24px] text-grey">{body}</p>
    </At>
  )
}

export function StoryStep({ spec }: { spec: StepSpec }) {
  const { x, y } = spec
  return (
    <>
      <At x={x} y={y}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-medium tracking-[1.2px] text-red">{spec.n}</span>
          <span className="inline-flex h-[29px] items-center gap-2 rounded-full border border-line bg-white pr-[15px] pl-[13px]">
            <span className="h-[5px] w-[5px] rounded-full bg-red" />
            <span className="font-mono text-[10px] tracking-[1.1px] text-ink">{spec.state}</span>
          </span>
        </div>
      </At>

      <At x={x} y={y + 53} w={560}>
        <h3 className="font-display text-[32px] leading-[41px] font-medium text-ink">{spec.title}</h3>
      </At>
      <At x={x} y={y + (spec.bodyY ?? 110)} w={475}>
        <p className="font-body text-[17px] leading-[29px] text-grey">{spec.body}</p>
      </At>

      <At x={spec.lifted.x} y={spec.lifted.y} w={spec.lifted.w} h={spec.lifted.h}>
        <img src={spec.lifted.src} alt={`${spec.captionLabel.toLowerCase()} — ${spec.caption}`} loading="lazy" decoding="async" className="h-full w-full" />
      </At>

      <At x={x} y={y + spec.captionY}>
        <span className="font-mono text-[10.5px] font-medium tracking-[1.5px] text-mid">{spec.captionLabel}</span>
      </At>
      <At x={x} y={y + spec.captionY + 22} w={475}>
        <p className="font-body text-[15px] leading-[24.75px] text-grey">{spec.caption}</p>
      </At>
    </>
  )
}

/**
 * Vertical rule between steps, broken by a pill naming the shift in state and
 * ending in a chevron. This is what makes three steps read as one escalation.
 */
export function Spine({ label, pillX, pillY, pillW, aY, aH, bY, bH, tipY }: {
  label: string; pillX: number; pillY: number; pillW: number
  aY: number; aH: number; bY: number; bH: number; tipY: number
}) {
  return (
    <>
      <At x={699.4} y={aY} w={1.25} h={aH} className="bg-hair" />
      <At
        x={pillX} y={pillY} w={pillW} h={34}
        className="flex items-center justify-center rounded-full border border-line bg-white"
      >
        <span className="font-mono text-[10.5px] font-medium tracking-[1.4px] whitespace-pre text-ink">{label}</span>
      </At>
      <At x={699.4} y={bY} w={1.25} h={bH} className="bg-hair" />
      <At x={691} y={tipY} w={18} h={12}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
          <path d="M0 0L9 11L18 0" stroke="#C9C8C3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </At>
    </>
  )
}

/**
 * The phone shot, placed at the rect measured from its export.
 *
 * The export is larger than the Figma device frame (it carries the shadow
 * bleed). Do NOT clip it back to that frame: the clip chops the soft shadow
 * into a hard rectangle, and on the rotated close-ups it slices through the
 * screen itself.
 */
/** Where the screen and Dynamic Island sit inside an upright device, in its Figma units. */
const UPRIGHT = { w: 392.91, glass: { x: 20.96, y: 20.08, w: 351, h: 763.12, r: 48.02 }, island: { x: 142, y: 33, w: 108.4, h: 30 } }

/**
 * A phone mockup. With `video`, the screen plays a FlowVideo instead of the still
 * (upright devices only); the island is redrawn on top so the clip sits behind it.
 */
export function DeviceShot({ x, y, w, h, src, alt, video }: Rect & { src: string; alt: string; video?: string }) {
  const k = w / UPRIGHT.w
  const g = UPRIGHT.glass, i = UPRIGHT.island
  return (
    <At x={x} y={y} w={w} h={h}>
      <img src={src} alt={video ? '' : alt} loading="lazy" decoding="async" className="h-full w-full" />
      {video && (
        <>
          <div
            className="absolute overflow-hidden bg-white"
            style={{ left: g.x * k, top: g.y * k, width: g.w * k, height: g.h * k, borderRadius: g.r * k }}
          >
            <FlowVideo name={video} width={390} height={844} label={alt} className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute rounded-full bg-black"
            style={{ left: i.x * k, top: i.y * k, width: i.w * k, height: i.h * k }}
          />
        </>
      )}
    </At>
  )
}
