import { Stage, At } from '../Stage'
import { Display, Lede, Card, Mono, Slider, WASH_WIDE } from '../Bits'

/** 76% of towers at inundation risk — number left, track right. */
function TowerCard() {
  return (
    <At x={80} y={390} w={810} h={350} className="rounded-[26px]" style={{ background: WASH_WIDE }}>
      <At x={52} y={64}><span className="font-display text-[22px] text-grey">%</span></At>
      <At x={74} y={52}><span className="font-display text-[76px] font-light leading-[97px] text-ink">76</span></At>
      <At x={52} y={166} w={248}>
        <p className="font-body text-[19px] leading-[30px] text-ink">
          of telecom towers in Assam face flood inundation risk
        </p>
      </At>

      <Slider x={400} y={150} w={360} pct={76} />
      <At x={400} y={172}><span className="font-body text-[13px] text-grey">0%</span></At>
      <At x={564} y={172}><span className="font-body text-[13px] text-grey">50%</span></At>
      <At x={728} y={172}><span className="font-body text-[13px] text-grey">100%</span></At>

      <At x={52} y={290}><Mono>TOWER INUNDATION</Mono></At>
      <At x={660} y={290}><Mono>DoT / CRML</Mono></At>
    </At>
  )
}

/** ~6 hrs of battery — the marker sits at 6 of 24 hours, not at 76%. */
function BatteryCard() {
  return (
    <Card x={920} y={390} w={400} h={350}>
      <At x={44} y={54}><span className="font-display text-[60px] font-light leading-[77px] text-ink">6 hrs</span></At>
      <At x={44} y={152} w={300}>
        <p className="font-body text-[17px] leading-[27px] text-ink">
          avg. battery life of a smartphone
        </p>
      </At>

      <Slider x={44} y={258} w={300} pct={25} />
      <At x={44} y={280}><span className="font-body text-[13px] text-grey">0h</span></At>
      <At x={178} y={280}><span className="font-body text-[13px] text-grey">12h</span></At>
      <At x={312} y={280}><span className="font-body text-[13px] text-grey">24h</span></At>

      <At x={44} y={306}><Mono>AFTER THE TOWER GOES</Mono></At>
    </Card>
  )
}

export function B5Network() {
  return (
    <Stage h={820} id="network-down">
      <Display y={80} w={592}>
        Then, <b>the network </b>goes down
      </Display>
      <Lede y={92}>
        When disaster strikes, communication is the first casualty. First, there is a communication burst, followed by a communication void.
      </Lede>
      <TowerCard />
      <BatteryCard />
    </Stage>
  )
}
