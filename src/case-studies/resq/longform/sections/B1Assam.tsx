import { Stage, At } from '../Stage'
import { SectionPill, SectionNumber, Display } from '../Bits'

const BANDS = ['#E57480', '#DF5160', '#D72638', '#AC1E2D', '#8A1824']
const TICKS = ['1.3', '1.6', '2.0', '2.5', '3.0', '4.0']

function Legend() {
  return (
    <At x={1058} y={635} w={262}>
      <div className="flex flex-col gap-2 rounded-xl border border-line bg-white px-[18px] py-4">
        <span className="font-body text-[11px] font-medium tracking-[0.08em] text-mid">Seismic hazard</span>

        <div className="flex h-2.5 w-[224px] overflow-hidden rounded-[2px]">
          {BANDS.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
        </div>

        <div className="flex w-[224px] justify-between font-body text-[10px] text-mid">
          {TICKS.map((t) => <span key={t}>{t}</span>)}
        </div>

        <span className="font-body text-[11px] text-ink">Peak ground acceleration, m/s²</span>

        <span className="h-px w-[224px] bg-line" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-[3px] w-3.5 rounded-[2px] bg-[#9DC3FF]" />
            <span className="font-body text-[13px] text-ink">Brahmaputra river</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-3.5 rounded-[2px] border border-[#9DC3FF] bg-[#F2F6FF]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #9DC3FF 0 1px, transparent 1px 4px)',
              }}
            />
            <span className="font-body text-[13px] text-ink">Flood-prone areas</span>
          </div>
        </div>

        <span className="h-px w-[224px] bg-line" />

        <span className="font-body text-[10px] text-mid">Base map: Milenioscuro, CC BY-SA 4.0, via Wikimedia Commons</span>
      </div>
    </At>
  )
}

export function B1Assam() {
  return (
    <Stage h={916} id="assam">
      <img
        src="/resq/lf/assam-map.svg"
        alt="Seismic hazard map of Assam, with the Brahmaputra and its flood-prone belt"
        className="pointer-events-none absolute top-0 left-0 h-[900px] w-[1400px] select-none"
      />
      <SectionPill label="The Problem" />
      <SectionNumber n="01" />
      <Display y={176} w={582}>
        This is <i>Assam</i>,<br />where I currently live
      </Display>
      <Legend />
    </Stage>
  )
}
