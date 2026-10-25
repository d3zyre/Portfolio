import { Stage, At } from '../Stage'
import { Display, Lede, Card } from '../Bits'

/**
 * Two 520×200 diagrams exported from Figma: a top-down broadcast tree that the
 * dashed red line cuts through, and a peer-to-peer mesh.
 */
function FlowCard({
  x, title, src, alt, caption, children,
}: {
  x: number; title: string; src: string; alt: string; caption: string; children?: React.ReactNode
}) {
  return (
    <Card x={x} y={350} w={600} h={390}>
      <At x={40} y={34}>
        <span className="font-display text-[24px] leading-[31px] text-ink">{title}</span>
      </At>
      <At x={40} y={90} w={520} h={200}>
        <img src={src} alt={alt} className="h-full w-full" />
      </At>
      {children}
      <At x={40} y={312} w={480}>
        <p className="font-body text-[16px] leading-[26px] text-ink">{caption}</p>
      </At>
    </Card>
  )
}

export function B9Direction() {
  return (
    <Stage h={820} id="direction">
      <Display y={80} w={527}>
        All of them point<br /><b>the same direction</b>
      </Display>
      <Lede y={92}>
        Existing systems are designed around hazards, not people. Through top-down approaches, they broadcast warnings, forecasts and information from institutions to citizens.
      </Lede>

      <FlowCard
        x={80}
        title="What we have"
        src="/resq/lf/flow-have.svg"
        alt="A broadcast tree from one institution down to citizens, cut by a dashed line"
        caption="Institution to citizen. One direction, and it runs on the towers."
      >
        <At x={40} y={184}>
          <span className="font-mono text-[9px] font-medium tracking-[0.1em] text-red/80">
            NETWORK BREAKS HERE
          </span>
        </At>
      </FlowCard>

      <FlowCard
        x={720}
        title="What we need"
        src="/resq/lf/flow-need.svg"
        alt="A mesh of peers linked to each other, with one node highlighted in red"
        caption="Person to person. Not everyone is in range — but whoever is stays connected."
      />
    </Stage>
  )
}
