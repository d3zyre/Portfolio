import type { ReactNode } from 'react'
import { phone } from '../phones'
import { Stage, At } from '../Stage'
import { Panel } from '../Bits'
import { DeviceShot } from '../Story'

/**
 * Figma pads a PNG export by the node's shadow bleed, so the image rect is not
 * the frame rect — it is the node's render bounds, centred, plus that pad.
 * These rects were measured from each export rather than assumed.
 */
type Placed = { x: number; y: number; w: number; h: number }

const DEVICES = [
  { ...phone('b14-1'), alt: 'The community feed, showing nearby posts with their distance' },
  { ...phone('b14-2'), alt: 'The map, with hospitals, shelters and stations already pinned' },
  { ...phone('b14-3'), alt: 'A route that avoids the roads which flood' },
  { ...phone('b14-4'), alt: 'The medical profile, filled in ahead of time', video: 'profile' },
]

type TourSpec = {
  x: number; y: number; n: string; chip: string
  title: string; titleW: number; bodyY: number; body: string
  lifted: Placed & { src: string }
  captionY: number; captionLabel: string; caption: string
}

const TOURS: TourSpec[] = [
  {
    x: 80, y: 620.57, n: '01', chip: 'FEED',
    title: 'Her street, before it is a disaster', titleW: 560,
    bodyY: 110,
    body: 'Water levels, a power cut. Posted by people within a few kilometres and stamped with how far away they are.',
    lifted: { x: 80, y: 871.58, w: 453, h: 223.86, src: '/resq/lf/pg-lifted-1.webp' },
    captionY: 494.86, captionLabel: 'POST CARD',
    caption: 'Distance sits on every post. Two kilometres away is a different fact than twenty.',
  },
  {
    x: 760, y: 1608.06, n: '02', chip: 'MAP',
    title: 'The places she will need, found early', titleW: 560,
    bodyY: 151,
    body: 'Hospitals, shelters and stations are already pinned and already filtered. She is not searching for one on the day she needs it.',
    lifted: { x: 760, y: 1871.07, w: 249.44, h: 196.88, src: '/resq/lf/pg-lifted-2.webp' },
    captionY: 479.87, captionLabel: 'FACILITY PINS',
    caption: 'Labels stay legible at every zoom, because on the day it matters she is reading them one-handed.',
  },
  {
    x: 560, y: 2640.67, n: '03', chip: 'ROUTES',
    title: 'Routes that know which roads flood', titleW: 620,
    bodyY: 102,
    body: 'Breadcrumbs picked up through routes. If multiple people have successfully reached point A to B, the route is marked safe for use. Detours taken marks a route unsafe for use.',
    lifted: { x: 541.25, y: 2873.24, w: 494.5, h: 242.46, src: '/resq/lf/pg-lifted-3.webp' },
    captionY: 464.65, captionLabel: 'ROUTE SUMMARY',
    caption: 'Time and distance first, then the option to refuse the route the app picked.',
  },
  {
    x: 80, y: 3570.12, n: '04', chip: 'PROFILE',
    title: 'The details she will not be able to recite', titleW: 560,
    bodyY: 151,
    body: 'Blood group, inhaler, allergies, who else lives in the house. Set once on a calm day so nobody has to ask on a bad one.',
    lifted: { x: 108.5, y: 3859.13, w: 453, h: 252.8, src: '/resq/lf/pg-card-4.webp' },
    captionY: 587.75, captionLabel: 'MEDICAL DETAILS',
    caption: 'Filled in before the emergency, because during one she is not going to remember penicillin.',
  },
]

/** Tour 3 drops the title-to-body rhythm the others share, so `bodyY` varies. */
function Tour({ spec }: { spec: TourSpec }) {
  const { x, y } = spec
  const titleY = spec.n === '03' ? 45 : 53
  return (
    <>
      <At x={x} y={y}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-medium tracking-[1.2px] text-red">{spec.n}</span>
          <span className="inline-flex h-[29px] items-center rounded-full border border-line bg-white pr-[15px] pl-[13px] font-mono text-[10px] tracking-[1.1px] text-ink">
            {spec.chip}
          </span>
        </div>
      </At>

      <At x={x} y={y + titleY} w={spec.titleW}>
        <h3 className="font-display text-[32px] leading-[41px] font-medium text-ink">{spec.title}</h3>
      </At>
      <At x={x} y={y + spec.bodyY} w={spec.n === '03' ? 500 : 490}>
        <p className="font-body text-[17px] leading-[29px] text-grey">{spec.body}</p>
      </At>

      <At x={spec.lifted.x} y={spec.lifted.y} w={spec.lifted.w} h={spec.lifted.h}>
        <img src={spec.lifted.src} alt={`${spec.captionLabel.toLowerCase()} — ${spec.caption}`} loading="lazy" decoding="async" className="h-full w-full" />
      </At>

      <At x={x} y={y + spec.captionY}>
        <span className="font-mono text-[10.5px] font-medium tracking-[1.5px] text-mid">{spec.captionLabel}</span>
      </At>
      <At x={x} y={y + spec.captionY + 22} w={spec.n === '03' ? 499 : 480}>
        <p className="font-body text-[15px] leading-[24.75px] text-grey">{spec.caption}</p>
      </At>
    </>
  )
}



function Persona({ children }: { children: ReactNode }) {
  return (
    <At x={900} y={160} w={420} className="rounded-2xl bg-white px-6 py-[22px]" style={{ boxShadow: '0 6px 18px -4px rgba(26,38,69,0.07)' }}>
      {children}
    </At>
  )
}

export function B14Pragya() {
  return (
    <Stage h={4420} id="pragya">
      <At x={80} y={152} w={780}>
        <h2 className="font-display text-[58px] leading-[66px] font-light text-mid">
          On a normal day,<br /><b className="font-medium text-ink">it is just a local app</b>
        </h2>
      </At>

      <Persona>
        <div className="flex items-center gap-3">
          <img src="/resq/lf/pg-avatar.png" alt="" className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="font-display text-[15px] font-medium text-ink">Pragya</p>
            <p className="mt-[3px] font-mono text-[9.5px] tracking-[1px] whitespace-pre text-mid">
              SPEAKS ENGLISH  ·  AMINGAON
            </p>
          </div>
        </div>
        <p className="mt-[14px] font-body text-[15px] leading-[24px] text-grey">
          She may browse updates in the feed or find nearby shelters on the map.
        </p>
      </Persona>

      {/* Panels sit behind the two upright phones. */}
      <Panel x={80} y={1560} />
      <Panel x={720} y={3550} />

      {DEVICES.map((d) => <DeviceShot key={d.src} {...d} />)}

      {TOURS.map((t) => <Tour key={t.n} spec={t} />)}
 
 
    </Stage>
  )
}
