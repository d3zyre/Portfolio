import { Stage, At } from '../Stage'
import { SectionPill, SectionNumber, Display, Lede, Card } from '../Bits'

const CONSTRAINTS = [
  ['01', 'Zero Cognitive Bandwidth', 'In crisis, people can’t read, think or type normally. Every interaction should work even if someone’s hands are shaking.'],
  ['02', 'Infrastructure Failure',   'Internet can be unreliable. Towers fail, batteries die, calls don’t go through when people need them most.'],
  ['03', 'Good Intent',              'Most people want to help, but don’t know how. The system should make supporting someone as simple as asking for help.'],
  ['04', 'Any Age, any Language',    'Kids, elderly, tourists or non-native speakers should all understand the interface, without depending on text.'],
  ['05', 'Information Overload',     'People need nearby, relevant information instead of flooding them with everything happening around them.'],
]

const COL_X = 52
const COL_STEP = 232

export function B11Constraints() {
  return (
    <Stage h={846} id="constraints">
      <SectionPill label="Design Constraints" />
      <SectionNumber n="05" />

      <Display y={166} w={559}>
        Designing for <b>panic</b>,<br />not <b>proficiency</b>
      </Display>

      <Card x={80} y={486} w={1240} h={280}>
        {CONSTRAINTS.map(([n, title, note], i) => {
          const x = COL_X + i * COL_STEP
          return (
            <div key={n}>
              {/* hairline between columns, not before the first */}
              {i > 0 && <At x={x - 32} y={40} w={1} h={196} className="bg-line" />}
              <At x={x} y={40}>
                <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-red">{n}</span>
              </At>
              <At x={x} y={66} w={196}>
                <p className="font-display text-[21px] leading-[28px] text-ink">{title}</p>
              </At>
              <At x={x} y={132} w={196}>
                <p className="font-body text-[13.5px] leading-[21px] text-grey">{note}</p>
              </At>
            </div>
          )
        })}
      </Card>
    </Stage>
  )
}
