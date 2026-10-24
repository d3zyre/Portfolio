import { Stage, At } from '../Stage'
import { SectionPill, SectionNumber, Display, Card, Mono } from '../Bits'

/** The mono red "LIMITATION" label with the sentence under it. */
function Limitation({ x, y, w, children }: { x: number; y: number; w: number; children: string }) {
  return (
    <>
      <At x={x} y={y}>
        <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-red">LIMITATION</span>
      </At>
      <At x={x} y={y + 22} w={w}>
        <p className="font-body text-[15px] leading-[24px] text-ink">{children}</p>
      </At>
    </>
  )
}

/** Smart Axom: phone mockup on the left, copy and limitation on the right. */
function SmartAxomCard() {
  return (
    <>
      <Card x={80} y={420} w={621} h={380}>
        <At x={262} y={48} w={330}>
          <Mono className="!text-grey">GOVT. OF ASSAM</Mono>
          <p className="mt-[9px] font-display text-[30px] leading-[38px] text-ink">Smart Axom</p>
          <p className="mt-[12px] font-body text-[15px] leading-[25px] text-grey">
            Warnings, hazard maps, emergency locators and Assamese-language support, all in one app.
          </p>
        </At>
        <At x={262} y={225} w={330} h={1} className="bg-line" />
        <Limitation x={262} y={247} w={252}>
          Needs internet and digital literacy. Char communities are underserved.
        </Limitation>
      </Card>

      {/* The phone overhangs the card's top edge, so it sits outside it. */}
      <At x={122} y={371} w={176} h={382}>
        <img
          src="/resq/lf/smart-axom.png"
          alt="The Smart Axom app running on a phone"
          className="h-full w-full object-contain"
        />
      </At>
    </>
  )
}

/** SACHET / FLEWS: copy left, hairline rule, limitation right. */
function SystemCard({ y, tag, title, body, limitation }: {
  y: number; tag: string; title: string; body: string; limitation: string
}) {
  return (
    <Card x={720} y={y} w={600} h={180}>
      <At x={36} y={34}><Mono>{tag}</Mono></At>
      <At x={36} y={56} w={360}>
        <p className="font-display text-[26px] leading-[34px] text-ink">{title}</p>
      </At>
      <At x={36} y={100} w={300}>
        <p className="font-body text-[14px] leading-[23px] text-grey">{body}</p>
      </At>
      <At x={380} y={42} w={1} h={96} className="bg-line" />
      <Limitation x={412} y={52} w={160}>{limitation}</Limitation>
    </Card>
  )
}

export function B8Existing() {
  return (
    <Stage h={900} id="existing">
      <SectionPill label="Existing Systems" y={64} />
      <SectionNumber n="03" y={64} />

      <Display y={150} w={794}>
        The <b>tools</b> that exist,<br />and what each one <b>assumes</b>
      </Display>

      <SmartAxomCard />

      <SystemCard
        y={420} tag="SACHET" title="Cell Broadcasting"
        body="Geo-targeted alerts reach 4G/5G phones in local languages, and sound even on silent."
        limitation="Depends on tower power and coverage."
      />
      <SystemCard
        y={620} tag="FLEWS" title="Flood Early Warning"
        body="Generates 12–72 hour flood forecasts from weather and hydrological models."
        limitation="Weak at turning risk into hyper-local action."
      />
    </Stage>
  )
}
