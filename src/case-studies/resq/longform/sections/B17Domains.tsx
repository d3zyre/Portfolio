import { Stage, At } from '../Stage'

const PILL_SHADOW = '0 2px 6px 0 rgba(26,38,69,0.05)'
const CARD_SHADOW = '0 6px 16px -4px rgba(26,38,69,0.07)'
const ROW_SHADOW = '0 3px 10px -3px rgba(26,38,69,0.05)'

/** One row per domain: the domain chip, its coordinator, and who it dispatches. */
const DOMAINS = [
  { y: 392.5, dot: 'bg-red',   name: 'Medical',            coordinator: 'Medical coordinator',         teams: 'Doctors · Nurses · Ambulances' },
  { y: 532.5, dot: 'bg-ink',   name: 'Search & Rescue',    coordinator: 'Search & rescue coordinator', teams: 'NDRF · Fire services' },
  { y: 672.5, dot: 'bg-green', name: 'Resource & Shelter', coordinator: 'Resource coordinator',        teams: 'Volunteers · Shelter staff' },
]

/** Short hairline between a domain chip, its coordinator and its teams. */
function Link({ x, y, w }: { x: number; y: number; w: number }) {
  return <At x={x} y={y} w={w} h={1.1} className="bg-[#C9C8C3]" />
}

export function B17Domains() {
  return (
    <Stage h={810} id="domains">
      <At x={80} y={56}>
        <div
          className="flex h-[45px] items-center gap-2.5 rounded-full bg-white py-[13px] pr-[22px] pl-[18px]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <span className="h-[7px] w-[7px] rounded-[1.5px] bg-red" />
          <span className="font-display text-[15px] font-medium text-ink">The command side</span>
        </div>
      </At>
      <At x={1264} y={56} w={56} h={56} className="flex items-center justify-center rounded-full border border-line">
        <span className="font-mono text-[14px] tracking-[0.5px] text-mid">10</span>
      </At>

      <At x={80} y={150} w={700}>
        <h2 className="font-display text-[52px] leading-[60px] font-light text-mid">
          Every request lands in<br />one of <b className="font-medium text-ink">three domains</b>
        </h2>
      </At>
      <At x={900} y={158} w={420}>
        <p className="font-body text-[16.5px] leading-[28px] text-grey">
          Rather than exposing every emergency report to every responder, ResQ separates responsibilities into dedicated authority layers. Each coordinator oversees only their domain, while field teams receive information relevant only to the cases assigned to them.
        </p>
      </At>

      {/* Where an escalated request comes from. */}
      <At
        x={80} y={502.5} w={250} h={115}
        className="rounded-[14px] border border-line bg-white"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <At x={22} y={20}>
          <div className="flex items-center gap-[9px]">
            <span className="h-[7px] w-[7px] rounded-[1.5px] bg-red" />
            <span className="font-mono text-[10px] font-medium tracking-[1.5px] text-red">THE REQUEST</span>
          </div>
        </At>
        <At x={22} y={43} w={204}>
          <p className="font-body text-[15px] leading-[23.7px] text-ink">
            No volunteer nearby was able to take it
          </p>
        </At>
      </At>

      {/* The fan splitting one request into three chains. */}
      <At x={330} y={420} w={90} h={281}>
        <svg width="90" height="281" viewBox="0 0 90 281" fill="none" aria-hidden>
          <path
            d="M33 140H0H90M33 140C41 140 45 136 45 128V12C45 4 49 0 57 0H90M33 140C41 140 45 144 45 152V268C45 276 49 280 57 280H90"
            stroke="#C9C8C3" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </At>
      <At x={327} y={557} w={6} h={6} className="rounded-full bg-red" />

      {DOMAINS.map((d) => (
        <div key={d.name}>
          <At
            x={420} y={d.y} w={258} h={55}
            className="flex items-center gap-3 rounded-xl border border-line bg-white pl-[18px]"
            style={{ boxShadow: ROW_SHADOW }}
          >
            <span className={`h-[7px] w-[7px] rounded-[1.5px] ${d.dot}`} />
            <span className="font-display text-[18px] font-medium text-ink">{d.name}</span>
          </At>

          <Link x={678} y={d.y + 27} w={76} />

          <At x={754} y={d.y + 5} w={248} h={45} className="flex items-center rounded-[10px] bg-panel px-[18px]">
            <span className="font-body text-[14.5px] text-ink">{d.coordinator}</span>
          </At>

          <Link x={1002} y={d.y + 27} w={48} />

          <At x={1058} y={d.y + 16.5} w={280}>
            <p className="font-body text-[14.5px] leading-[21.75px] text-grey">{d.teams}</p>
          </At>
        </div>
      ))}

    </Stage>
  )
}
