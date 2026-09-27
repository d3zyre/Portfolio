import { Stage, At } from '../Stage'
import { Display, Lede, Card } from '../Bits'

const EVENTS = [
  { x: 80,  year: '1950', title: 'Assam–Tibet Earthquake', note: 'M 8.6 · Triggered massive landslides that raised riverbeds, creating Assam’s chronic flood vulnerability.' },
  { x: 352, year: '2004', title: 'Indian Ocean Tsunami Impact', note: 'Catalyzed systemic shifts, forcing the creation of modern inland emergency coordination networks.' },
  { x: 624, year: '2022', title: 'Assam Floods & Landslides', note: 'Impacted 5.5M+ people, landslides severed regional communication and infrastructure.' },
  { x: 896, year: '2024', title: 'Severe Flooding', note: 'Affected 28 districts, displacing 2.5M+ people, 137 wild animals in Kaziranga were killed.', now: true },
]

export function B4Repeating() {
  return (
    <Stage h={830} id="repeating">
      <Display y={80} w={622}>
        Not one event,<br /><b>a pattern that repeats</b>
      </Display>
      <Lede y={92}>
        Repeated floods, earthquakes and landslides regularly disrupt infrastructure and communication.
      </Lede>

      <Card x={80} y={360} w={1240} h={390}>
        <At x={80} y={200} w={1080} h={1} className="bg-line" />

        {EVENTS.map((e) => (
          <div key={e.year}>
            <At x={e.x} y={128}>
              <span className={`font-display text-[40px] font-light leading-[51px] ${e.now ? 'text-red' : 'text-ink'}`}>
                {e.year}
              </span>
            </At>
            <At
              x={e.x}
              y={e.now ? 194 : 195.5}
              w={e.now ? 12 : 9}
              h={e.now ? 12 : 9}
              className={`rounded-full ${e.now ? 'bg-red' : 'bg-ink'}`}
            />
            <At x={e.x} y={234} w={230}>
              <p className="font-body text-[16px] leading-[24px] font-medium text-ink">{e.title}</p>
            </At>
            <At x={e.x} y={266} w={230}>
              <p className="font-body text-[14px] leading-[22px] text-grey">{e.note}</p>
            </At>
          </div>
        ))}
      </Card>
    </Stage>
  )
}
