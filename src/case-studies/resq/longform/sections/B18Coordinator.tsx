import { phone } from '../phones'
import { Stage } from '../Stage'
import { Panel } from '../Bits'
import { StoryHeader, StoryStep, Spine, DeviceShot, type StepSpec } from '../Story'

/** Rects measured from each export's render bounds plus its shadow pad. */
const DEVICES = [
  { ...phone('b18-1'), alt: 'Areas ranked by open critical cases and longest wait' },
  { ...phone('b18-2'), alt: 'One area narrowed down, with its counts and an access note' },
  { ...phone('b18-3'), alt: 'A deployment confirmation naming what it leaves uncovered' },
]

const STEPS: StepSpec[] = [
  {
    x: 760, y: 573.82, n: '01', state: 'MONITORING · SIX AREAS',
    title: 'The map is a queue of places',
    body: "Areas ranked by open critical cases and by how long the longest one has waited. Nobody's name appears on this screen.",
    lifted: { x: 760, y: 820.58, w: 453, h: 247, src: '/resq/lf/cd-lifted-1.webp' },
    captionY: 511.52, captionLabel: 'STAFFING ANALYSIS',
    caption: 'The system flags the understaffed area and says why it thinks so. It does not send anyone.',
  },
  {
    x: 80, y: 1728.9, n: '02', state: 'NARROWED TO ONE AREA',
    title: 'Numbers she can argue with',
    body: 'Four critical, six urgent, twenty-two minutes on the longest wait, nobody on site — next to a note from a team already out there.',
    lifted: { x: 80, y: 1975.58, w: 453, h: 95, src: '/resq/lf/cd-lifted-2.webp' },
    captionY: 361.36, captionLabel: 'ACCESS NOTE',
    caption: 'The ferry ghat road is under water. Written by a field team, read by the person choosing the route.',
  },
  {
    x: 760, y: 2602.11, n: '03', state: 'COMMITTING A TEAM',
    title: 'What the decision costs, before she makes it',
    bodyY: 151,
    body: 'Sending Delta to Jalukbari leaves Fancy Bazaar with nobody and Echo as the only free team. The confirmation says that out loud.',
    lifted: { x: 760, y: 2890.08, w: 400, h: 469, src: '/resq/lf/cd-lifted-3.webp' },
    captionY: 774.95, captionLabel: 'DEPLOY CONFIRM',
    caption: 'Every deployment names what it leaves uncovered. She is choosing between areas, not between patients.',
  },
]

export function B18Coordinator() {
  return (
    <Stage h={3631} id="coordinator">
      <StoryHeader
        label="The coordinator"
        number="11"
        headline={<>She moves teams,<br /><b className="font-medium text-ink">not people</b></>}
        headlineW={700}
        lede="A medical coordinator covering the Guwahati zone. She ranks areas, commits teams and answers escalations."
      />

      <Panel x={80} y={540} />
      <Panel x={720} y={1620} />
      <Panel x={80} y={2700} />

      {DEVICES.map((d) => <DeviceShot key={d.src} {...d} />)}
      {STEPS.map((s) => <StoryStep key={s.n} spec={s} />)}

      <Spine label="WATCHING   →   NARROWING" pillX={591} pillY={1418.58} pillW={218}
             aY={1321.16} aH={89.42} bY={1460.58} bH={79.42} tipY={1539} />
      <Spine label="NARROWING   →   COMMITTED" pillX={587.5} pillY={2474.63} pillW={225}
             aY={2401.16} aH={65.47} bY={2516.63} bH={55.47} tipY={2571.11} />
 
 
 
    </Stage>
  )
}
