import { phone } from '../phones'
import { Stage } from '../Stage'
import { Panel } from '../Bits'
import { StoryHeader, PersonaCard, StoryStep, Spine, DeviceShot, type StepSpec } from '../Story'

/** Image rects measured from each export's render bounds plus its shadow pad. */
const DEVICES = [
  { ...phone('b15-1'), alt: 'Disaster mode, opened by an official alert' },
  { ...phone('b15-2'), alt: 'The app listening, building her request as she speaks', video: 'voice-request' },
  { ...phone('b15-3'), alt: 'A volunteer on the way, with name, face and distance' },
]

const STEPS: StepSpec[] = [
  {
    x: 760, y: 652.66, n: '01', state: "SHAKING · CAN'T THINK",
    title: 'Disaster mode opens itself',
    body: 'When an official government alert is received, the interface automatically switches to disaster mode.',
    lifted: { x: 759.72, y: 903.5, w: 452, h: 80, src: '/resq/lf/as-lifted-1.webp' },
    captionY: 350.68, captionLabel: 'ALERT BANNER',
    caption: 'Magnitude, location, distance. Nothing she has to act on while the room is still moving.',
  },
  {
    x: 80, y: 1522.26, n: '02', state: "PANICKED · CAN'T TYPE",
    title: 'It is already listening',
    body: 'The microphone stays on in disaster mode only. When a request is created on one phone, it hops across nearby devices until it reaches someone who can help.',
    lifted: { x: 52, y: 1761, w: 566, h: 449, src: '/resq/lf/as-card-2.webp' },
    captionY: 663.48, captionLabel: 'VOICE CAPTURE',
    caption: 'She never has to start it. The mic goes live the moment disaster mode does.',
  },
  {
    x: 760, y: 2655, n: '03', state: 'SCARED · NO LONGER ALONE',
    title: 'She can see who is coming',
    body: 'Not a ticket number and not an estimated queue position. A name, a face, a distance, and how long until he reaches her.',
    lifted: { x: 745.75, y: 2860.7, w: 477, h: 132, src: '/resq/lf/as-lifted-3.webp' },
    captionY: 346, captionLabel: 'ARRIVAL CARD',
    caption: 'Every volunteer answers with identity first. This is what a stranger looks like when he is already on the way.',
  },
]

export function B15Aastha() {
  return (
    <Stage h={3420} id="aastha">
      <StoryHeader
        label="During the crisis"
        number="08"
        headline={<>The app <b className="font-medium text-ink">opens itself</b>,<br />she only has to <b className="font-medium text-ink">speak</b></>}
      />
      <PersonaCard
        x={900}
        avatar="/resq/lf/as-avatar.png"
        name="Aastha"
        meta="SPEAKS HINDI  ·  GUWAHATI"
        body={"\u201Cphone haath mein tha, but itna panic tha ki kya likhu wohi samajh nahi aa raha tha\u201D"}
      />

      <Panel x={80} y={540} />
      <Panel x={720} y={1540} />
      <Panel x={80} y={2540} />

      {DEVICES.map((d) => <DeviceShot key={d.src} {...d} />)}
      {STEPS.map((s) => <StoryStep key={s.n} spec={s} />)}

      <Spine label="FROZEN   →   SPEAKING" pillX={602.5} pillY={1374} pillW={195}
             aY={1300} aH={66} bY={1416} bH={56} tipY={1471} />
      <Spine label="SPEAKING   →   SEEN" pillX={610.5} pillY={2407} pillW={179}
             aY={2352} aH={47} bY={2449} bH={37} tipY={2485} />
 
 
 
    </Stage>
  )
}
