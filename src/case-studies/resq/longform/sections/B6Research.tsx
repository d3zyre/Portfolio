import { Stage, At } from '../Stage'
import { SectionPill, SectionNumber, Display, Lede, Chip, WASH_FLAT } from '../Bits'

export function B6Research() {
  return (
    <Stage h={926} id="research">
      <SectionPill label="User Interviews & Insights" />
      <SectionNumber n="02" />

      <Display y={176} w={572}>
        Understanding what<br /><b>people did first</b>
      </Display>
      <Lede y={188}>
        Understanding how people communicate, seek help and access information during disasters.
      </Lede>

      <Chip x={80}  y={486} w={244} count="19" label="survey responses" />
      <Chip x={390} y={486} w={307} count="4"  label="semi-structured discussions" />
      <Chip x={780} y={486} w={238} count="3"  label="languages spoken" />

      <At x={80} y={626} w={1240} h={220} className="rounded-[26px]" style={{ background: WASH_FLAT }}>
        <At x={56} y={58} w={801}>
          <p className="font-display text-[34px] leading-[48px] text-ink">
            Communication is the first instinct during a disaster, not evacuation.
          </p>
        </At>
      </At>
    </Stage>
  )
}
