import { phone } from '../phones'
import { Stage } from '../Stage'
import { Panel } from '../Bits'
import { StoryHeader, StoryStep, Spine, DeviceShot, type StepSpec } from '../Story'

/** Rects measured from each export's render bounds plus its shadow pad. */
const DEVICES = [
  { ...phone('b19-1'), alt: 'The team queue, sorted by severity and synced over mesh' },
  { ...phone('b19-2'), alt: 'A case in progress, with a photo attached on the way in' },
  { ...phone('b19-3'), alt: 'Escalating a case back up to the coordinator' },
]

const STEPS: StepSpec[] = [
  {
    x: 80, y: 636.05, n: '01', state: 'ASSIGNED · SIX WAITING',
    title: 'A queue that survives the network',
    body: 'Sorted by severity and synced twelve seconds ago over mesh. The list keeps working when the tower does not.',
    lifted: { x: 108.5, y: 879.58, w: 453, h: 149.1, src: '/resq/lf/ft-card-1.webp' },
    captionY: 439.05, captionLabel: 'CASE CARD',
    caption: 'Severity, how long they have been waiting, and one line in their own words — enough to triage without opening it.',
  },
  {
    x: 760, y: 1712.57, n: '02', state: 'EN ROUTE',
    title: 'Evidence attaches to the case, not to a report',
    bodyY: 151,
    body: 'Assigned, en route, on scene, resolved. A photo or a voice note saves straight onto the case, so nothing gets written up twice.',
    lifted: { x: 788.5, y: 1997.08, w: 453, h: 115, src: '/resq/lf/ft-card-2.webp' },
    captionY: 446.02, captionLabel: 'CAPTURE',
    caption: 'Taken on the way in, attached where the next person will go looking for it.',
  },
  {
    x: 80, y: 2595, n: '03', state: 'BEYOND THIS TEAM',
    title: 'Handing it up without dropping it',
    body: 'Four honest reasons, including that it is not safe for them to go in. The case goes to the coordinator and stays on their queue until she picks it up.',
    lifted: { x: 52, y: 2829.58, w: 566, h: 631, src: '/resq/lf/ft-card-3.webp' },
    captionY: 841.15, captionLabel: 'ESCALATE',
    caption: 'Nobody can abandon a case into a void. It stays assigned to them until someone above accepts it.',
  },
]

export function B19FieldTeam() {
  return (
    <Stage h={3638} id="field-team">
      <StoryHeader
        label="The field team"
        number="12"
        headline={<>The team on the ground<br />is on the <b className="font-medium text-ink">same mesh</b></>}
        headlineW={760}
        headlineSize={54}
        headlineLeading={62.64}
        lede="Team Alpha, working Uzanbazar. Their queue syncs phone to phone, their evidence attaches to the case, and a job beyond them can be handed back up without being dropped."
      />

      <Panel x={720} y={540} />
      <Panel x={80} y={1620} />
      <Panel x={720} y={2700} />

      {DEVICES.map((d) => <DeviceShot key={d.src} {...d} />)}
      {STEPS.map((s) => <StoryStep key={s.n} spec={s} />)}

      <Spine label="ASSIGNED   →   EN ROUTE" pillX={595} pillY={1418.58} pillW={210}
             aY={1321.16} aH={89.42} bY={1460.58} bH={79.42} tipY={1539} />
      <Spine label="EN ROUTE   →   BEYOND US" pillX={591} pillY={2471.08} pillW={218}
             aY={2401.16} aH={61.92} bY={2513.08} bH={51.92} tipY={2564} />
 
 
 
    </Stage>
  )
}
