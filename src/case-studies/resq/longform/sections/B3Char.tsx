import { Stage, At } from '../Stage'
import { Display, Card } from '../Bits'

const SHADOW = '0 16px 40px -10px rgba(26,31,46,0.16)'

/** 25 dots, 100,000 people each — 13 on the first row, 12 on the second. */
function DotGrid() {
  const rows = [13, 12]
  return (
    <>
      {rows.map((count, r) =>
        Array.from({ length: count }, (_, i) => (
          <At
            key={`${r}-${i}`}
            x={40 + i * 22}
            y={212 + r * 20}
            w={13}
            h={13}
            className="rounded-full bg-ink/80"
          />
        ))
      )}
    </>
  )
}

export function B3Char() {
  return (
    <Stage h={853} id="char-islands">
      <Display y={80} w={485}>
        Some places lose<br /><b>the land itself</b>
      </Display>

      <At x={880} y={92} w={430}>
        <p className="font-body text-[17px] leading-[28px] text-grey">
          Majuli and Dhubri&rsquo;s shifting sandbars face severe riverbank erosion and complete
          physical isolation during floods.
        </p>
      </At>

      <At
        x={503} y={328} w={660} h={420} rotate={-2.2}
        className="overflow-hidden rounded-[24px]"
        style={{ boxShadow: SHADOW }}
      >
        <img
          src="/resq/lf/char-island.jpg"
          alt="Satellite view of Ramsing Chapori, a char island in the Brahmaputra near Guwahati"
          className="h-full w-full object-cover"
        />
      </At>

      <At x={886} y={717} h={33} rotate={-2.2} style={{ boxShadow: SHADOW }}
          className="w-max rounded-full bg-white">
        <span className="flex h-full items-center whitespace-nowrap px-4 font-mono text-[10px] font-medium tracking-[0.1em] text-ink">
          RAMSING CHAPORI &nbsp;·&nbsp; BRAHMAPUTRA
        </span>
      </At>

      <Card x={144.4} y={393.42} w={470} h={300} rotate={2.65} shadow>
        <At x={40} y={38}>
          <span className="font-display text-[64px] font-light leading-[82px] text-red/95">2.5M+</span>
        </At>
        <At x={40} y={130} w={330}>
          <p className="font-body text-[18px] leading-[28px] text-ink">
            people live on char islands across the Brahmaputra basin
          </p>
        </At>
        <DotGrid />
        <At x={40} y={258}>
          <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-grey">
            EACH DOT = 100,000 PEOPLE
          </span>
        </At>
      </Card>
    </Stage>
  )
}
