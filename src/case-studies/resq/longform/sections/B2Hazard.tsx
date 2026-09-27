import { Stage, At } from '../Stage'
import { Display, Mono, Card, Slider } from '../Bits'

/** 39.58% of Assam's land is flood prone — value on a 0–100 track. */
function FloodCard() {
  const pct = 39.58
  const TRACK = 514
  return (
    <Card x={80} y={340} w={610} h={400}>
      <At x={48} y={62}><span className="font-display text-[22px] text-grey">%</span></At>
      <At x={70} y={50}><span className="font-display text-[72px] font-light leading-[92px] text-ink">39.58</span></At>
      <At x={48} y={158} w={340}>
        <p className="font-body text-[19px] leading-[30px] text-ink">of Assam&rsquo;s land area is flood prone</p>
      </At>

      <Slider x={48} y={250} w={TRACK} pct={pct} />

      <At x={48} y={272}><span className="font-body text-[13px] text-grey">0%</span></At>
      <At x={289} y={272}><span className="font-body text-[13px] text-grey">50%</span></At>
      <At x={528} y={272}><span className="font-body text-[13px] text-grey">100%</span></At>

      <At x={48} y={320}><Mono>FLOOD-PRONE LAND</Mono></At>
    </Card>
  )
}

/** Nested seismic zone rings — bottom-aligned, Assam in the innermost. */
const RINGS = [
  { d: 208, o: 0.05 },
  { d: 172, o: 0.10 },
  { d: 136, o: 0.19 },
  { d: 100, o: 0.38 },
  { d: 64,  o: 0.88 },
]

function ZoneCard() {
  const CX = 440
  const BOTTOM = 330
  return (
    <Card x={720} y={340} w={600} h={400}>
      {RINGS.map((r) => (
        <At
          key={r.d}
          x={CX - r.d / 2}
          y={BOTTOM - r.d}
          w={r.d}
          h={r.d}
          className="rounded-full"
          style={{ background: `rgba(212,53,28,${r.o})` }}
        />
      ))}

      <At x={48} y={50}><span className="font-display text-[72px] font-light leading-[92px] text-ink">Zone V</span></At>
      <At x={48} y={170} w={213}>
        <p className="font-body text-[19px] leading-[30px] text-ink">Assam sits within one of the world&rsquo;s most active seismic belts.</p>
      </At>

      <At x={418} y={98}><span className="font-mono text-[10px] font-medium tracking-[0.1em] text-grey">ZONE I</span></At>
      <At x={419} y={288}><span className="font-body text-[12px] font-semibold tracking-[0.04em] text-white">ASSAM</span></At>
      <At x={419} y={305}><span className="font-mono text-[9px] font-medium tracking-[0.1em] text-white">ZONE V</span></At>

      {/* same baseline as the flood card's footer, not 20px off the card edge */}
      <At x={48} y={320}><Mono>INDIA'S HIGHEST SEISMIC RISK CATEGORY</Mono></At>
    </Card>
  )
}

export function B2Hazard() {
  return (
    <Stage h={820} id="hazard">
      <Display y={80} w={692}>
        The <b>ground</b> and the <b>river</b>
        <br />both move <b>every year</b>
      </Display>
      <FloodCard />
      <ZoneCard />
    </Stage>
  )
}
