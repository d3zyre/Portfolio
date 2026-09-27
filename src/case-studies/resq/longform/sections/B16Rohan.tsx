import { phone } from '../phones'
import { Stage } from '../Stage'
import { Panel } from '../Bits'
import { StoryHeader, PersonaCard, StoryStep, Spine, DeviceShot, type StepSpec } from '../Story'

/**
 * Rohan's block mirrors Aastha's: same three-step spine, phones on the opposite
 * side. Rects measured from each export's render bounds plus its shadow pad.
 */
const DEVICES = [
  { ...phone('b16-1'), alt: 'Five nearby requests, ordered by what he can help with' },
  { ...phone('b16-2'), alt: "Aastha's request, with her location and own words" },
  { ...phone('b16-3'), alt: 'The walking route to her, four hundred metres away' },
]

const STEPS: StepSpec[] = [
  {
    x: 80, y: 483.47, n: '01', state: 'SAFE · WANTS TO HELP',
    title: 'He gets what he can actually do',
    body: "Five requests within three kilometres, ordered by what he told the app he is able to help with. Not a broadcast to everyone — a list built around one person's reach.",
    lifted: { x: 80, y: 734, w: 453, h: 419, src: '/resq/lf/rh-lifted-1.webp' },
    captionY: 689.05, captionLabel: 'REQUEST CARD',
    caption: 'Severity, distance and how long it has been waiting sit on the card itself. He never has to open one to rule it out.',
  },
  {
    x: 760, y: 1599.36, n: '02', state: 'DECIDING · NOT YET COMMITTED',
    title: 'He reads her words, not a category',
    body: 'The request Aastha spoke arrives the way she said it — a location and her own words.',
    lifted: { x: 760, y: 1850, w: 453, h: 189, src: '/resq/lf/rh-lifted-2.webp' },
    captionY: 457.28, captionLabel: 'THEIR WORDS',
    caption: 'Low-friction reporting methods such as one-tap actions, voice note and image uploads.',
  },
  {
    x: 80, y: 2593.16, n: '03', state: 'COMMITTED · ACCOUNTABLE',
    title: 'One request, held by one person',
    body: "He can hold a single request at a time. Taking hers takes it off everyone else's list, so nobody walks to a door that has already been answered.",
    lifted: { x: 80, y: 2844, w: 453, h: 199, src: '/resq/lf/rh-lifted-3.webp' },
    captionY: 469.68, captionLabel: 'ROUTE CARD',
    caption: 'Four hundred metres on foot. Close enough that the answer is a walk, not a dispatch.',
  },
]

export function B16Rohan() {
  return (
    <Stage h={3420} id="rohan">
      <StoryHeader
        label="The other side"
        number="09"
        headline={<>The request <b className="font-medium text-ink">never leaves</b><br />the neighbourhood</>}
      />
      <PersonaCard
        x={940}
        avatar="/resq/lf/rh-avatar.png"
        name="Rohan"
        meta="SPEAKS ASSAMESE  ·  JALUKBARI"
        body="He marked himself safe four minutes ago and asked what he could do."
      />

      <Panel x={720} y={540} />
      <Panel x={80} y={1540} />
      <Panel x={720} y={2540} />

      {DEVICES.map((d) => <DeviceShot key={d.src} {...d} />)}
      {STEPS.map((s) => <StoryStep key={s.n} spec={s} />)}

      <Spine label="WILLING   →   CHOOSING" pillX={599} pillY={1374} pillW={202}
             aY={1300} aH={66} bY={1416} bH={56} tipY={1471} />
      <Spine label="CHOOSING   →   ON THE WAY" pillX={587.5} pillY={2374} pillW={225}
             aY={2300} aH={66} bY={2416} bH={56} tipY={2471} />
 
 
 
    </Stage>
  )
}
