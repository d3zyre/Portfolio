import type { ReactNode } from 'react'
import { phone } from '../phones'
import { Stage, At } from '../Stage'
import { DeviceShot } from '../Story'
import { Panel } from '../Bits'

const PHONE_1 = phone('b13-1')
const PHONE_2 = phone('b13-2')

const PILL_SHADOW = '0 2px 6px 0 rgba(26,38,69,0.05)'

/** One of the three questions across the top strip. 02 is the unanswered one. */
function Question({ x, n, label, muted }: { x: number; n: string; label: string; muted?: boolean }) {
  return (
    <>
      <At x={x} y={0} w={400} h={1} className={muted ? 'bg-line' : 'bg-ink/35'} />
      <At x={x} y={19}>
        <span className={`font-mono text-[12px] font-medium tracking-[1.2px] ${muted ? 'text-mid' : 'text-red'}`}>
          {n}
        </span>
      </At>
      <At x={x} y={47} w={400}>
        <p className={`font-display text-[19px] leading-[26px] font-medium ${muted ? 'text-mid' : 'text-ink'}`}>
          {label}
        </p>
      </At>
    </>
  )
}

/**
 * A step: chip, title, body, the lifted grid pulled out of the screen, and a
 * caption. `liftedH` differs per step, so the caption block sits under it.
 */
function Step({
  x, y, chip, title, body, lifted, liftedW, liftedH, captionLabel, caption,
}: {
  x: number; y: number; chip: string; title: string; body: string
  lifted: string; liftedW: number; liftedH: number
  captionLabel: string; caption: ReactNode
}) {
  const captionY = 247 + liftedH + 20
  return (
    <>
      <At x={x} y={y}>
        <div className="inline-flex h-[29px] items-center rounded-full border border-line bg-white pr-4 pl-[14px]">
          <span className="font-mono text-[10px] tracking-[1.1px] whitespace-pre text-ink">{chip}</span>
        </div>
      </At>
      <At x={x} y={y + 53} w={560}>
        <h3 className="font-display text-[32px] leading-[41px] font-medium text-ink">{title}</h3>
      </At>
      <At x={x} y={y + 110} w={475}>
        <p className="font-body text-[17px] leading-[29px] text-grey">{body}</p>
      </At>

      <At x={x} y={y + 247} w={liftedW} h={liftedH}>
        <img src={lifted} alt={captionLabel.toLowerCase()} loading="lazy" decoding="async" className="h-full w-full" />
      </At>

      <At x={x} y={y + captionY}>
        <span className="font-mono text-[10.5px] font-medium tracking-[1.5px] text-mid">{captionLabel}</span>
      </At>
      <At x={x} y={y + captionY + 22} w={475}>
        <p className="font-body text-[15px] leading-[24.75px] text-grey">{caption}</p>
      </At>
    </>
  )
}



export function B13Onboarding() {
  return (
    <Stage h={2425} id="onboarding">
      <At x={80} y={56}>
        <div
          className="flex h-[45px] items-center gap-2.5 rounded-full bg-white py-[13px] pr-[22px] pl-[18px]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <span className="h-[7px] w-[7px] rounded-[1.5px] bg-red" />
          <span className="font-display text-[15px] font-medium text-ink">Before the crisis</span>
        </div>
      </At>
      <At x={1264} y={56} w={56} h={56} className="flex items-center justify-center rounded-full border border-line">
        <span className="font-mono text-[14px] tracking-[0.5px] text-mid">07</span>
      </At>

      <At x={80} y={152} w={840}>
        <h2 className="font-display text-[58px] leading-[66px] font-light text-mid">
          Three short questions,<br />
          <b className="font-medium text-ink">asked while nothing is wrong</b>
        </h2>
      </At>

      <At x={80} y={336} w={1240} h={99}>
        <Question x={0}   n="01" label="Which language works for you?" />
        <Question x={420} n="02" label="What brings you here?" muted />
        <Question x={840} n="03" label="Anyone in your household need extra care?" />
      </At>

      {/* Step 1 — language */}
      <Panel x={80} y={620} />
      <DeviceShot {...PHONE_1} video="onboarding-language" alt="Picking a language: five languages in their own scripts" /> 

      <Step
        x={760} y={553.3}
        chip="01 OF 03  ·  LANGUAGE"
        title="Assamese first, not English first"
        body="Five languages in their own script, with Bodo and Bengali on the same footing as Hindi. Assam does not have one language, so the app does not assume one."
        lifted="/resq/lf/ob-lifted-1.webp" liftedW={415} liftedH={405.29}
        captionLabel="LANGUAGE GRID"
        caption={<>অসমীয়া and हिन्दी are set in their own script. Recognising your language should not depend on reading English first.</>}
      />

      {/* Step 2 — household */}
      <Panel x={720} y={1570} />
      <DeviceShot {...PHONE_2} video="onboarding-household" alt="Marking who else lives in the house" /> 

      <Step
        x={80} y={1496.68}
        chip="03 OF 03  ·  HOUSEHOLD"
        title="Who else is in the house"
        body="Young children, elderly or mobility needs, pets, a medical condition, living alone."
        lifted="/resq/lf/ob-lifted-2.webp" liftedW={415} liftedH={417.4}
        captionLabel="HOUSEHOLD GRID"
        caption="The screen says it out loud: this stays private until you actually request help. Nothing here is shared before she asks."
      />
    </Stage>
  )
}
