import { Stage, At } from '../Stage'

/** B12 sits on its own type scale — Light/Medium display, softer shadows, 18px cards. */
const CARD_SHADOW = '0 12px 30px -8px rgba(26,38,69,0.09), 0 2px 6px -1px rgba(26,38,69,0.05)'
const PILL_SHADOW = '0 2px 6px 0 rgba(26,38,69,0.05)'

const ROLES = [
  {
    tag: 'VICTIM',
    colour: 'text-red',
    dot: 'bg-red',
    verb: 'Asks',
    body: 'Users who need help can request assistance. When a request is created on one phone, it hops across nearby devices until it reaches someone who can help.',
  },
  {
    tag: 'VOLUNTEER',
    colour: 'text-green',
    dot: 'bg-green',
    verb: 'Answers',
    body: 'Anyone who marks themselves as safe can switch to volunteer mode and start helping others nearby.',
  },
  {
    tag: 'COORDINATOR',
    colour: 'text-ink',
    dot: 'bg-ink',
    verb: 'Escalates',
    body: 'Each coordinator oversees only their domain, while field teams receive information relevant only to the cases assigned to them.',
  },
]

export function B12Intro() {
  return (
    <Stage h={805} id="introducing">
      <At x={80} y={80}>
        <div
          className="flex h-[45px] items-center gap-2.5 rounded-full bg-white py-[13px] pr-[22px] pl-[18px]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <span className="h-[7px] w-[7px] rounded-[1.5px] bg-red" />
          <span className="font-display text-[15px] font-medium text-ink">Introducing ResQ</span>
        </div>
      </At>

      <At x={1264} y={80} w={56} h={56} className="flex items-center justify-center rounded-full border border-line">
        <span className="font-mono text-[14px] tracking-[0.5px] text-mid">06</span>
      </At>

      <At x={80} y={176} w={740}>
        <h2 className="font-display text-[58px] leading-[66px] font-light text-mid">
          Help travels <b className="font-medium text-ink">sideways</b>,<br />not down
        </h2>
      </At>

      <At x={900} y={186} w={420}>
        <p className="font-body text-[17px] leading-[29px] text-grey">
          According to the constraints, the system cannot depend on internet, towers or technical literacy. So the foundation has to be something that survives all three failures.
        </p>
      </At>

      {ROLES.map((role, i) => (
        <At
          key={role.tag}
          x={80 + i * 420}
          y={466}
          w={400}
          h={259}
          className="rounded-[18px] bg-white"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <At x={32} y={32}>
            <div className="flex items-center gap-[9px]">
              <span className={`h-[7px] w-[7px] rounded-[1.5px] ${role.dot}`} />
              <span className={`font-mono text-[10.5px] font-medium tracking-[1.6px] ${role.colour}`}>
                {role.tag}
              </span>
            </div>
          </At>
          <At x={32} y={66}>
            <span className="font-display text-[34px] leading-[41px] font-medium text-ink">{role.verb}</span>
          </At>
          <At x={32} y={121} w={336}>
            <p className="font-body text-[15.5px] leading-[26px] text-grey">{role.body}</p>
          </At>
        </At>
      ))}
    </Stage>
  )
}
