import { Stage, At } from '../Stage'
import { StoryHeader } from '../Story'
import { FlowVideo } from '../FlowVideo'

/** The closing shot: the app still listening, held above the water. */
const VIDEO = { x: 80, y: 330, w: 1240, h: 773 }

export function B20Outro() {
  return (
    <Stage h={1330} id="outro">
      <StoryHeader
        label="ResQ"
        number="13"
        headline={<>Help is <b className="font-medium text-ink">closer</b><br />than you think</>}
      />

      <At x={VIDEO.x} y={VIDEO.y} w={VIDEO.w} h={VIDEO.h} className="overflow-hidden rounded-[32px] bg-panel">
        <FlowVideo
          name="outro"
          width={1600}
          height={998}
          label="A hand holds the phone above floodwater, ResQ open and listening"
          className="h-full w-full object-cover"
        />
      </At>

      <At x={80} y={VIDEO.y + VIDEO.h + 48} w={1240} h={1} className="bg-line" />
      <At x={80} y={VIDEO.y + VIDEO.h + 76}>
        <p className="font-mono text-[11px] font-medium tracking-[1.5px] text-mid">
          RESQ  ·  DISASTER COMMUNICATION FOR ASSAM  ·  A UX CASE STUDY BY AKANKSHA GUPTA
        </p>
      </At>
      <At x={1120} y={VIDEO.y + VIDEO.h + 68} w={200}>
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="block text-right font-display text-[15px] font-medium text-ink underline-offset-4 hover:underline"
        >
          Back to the top ↑
        </a>
      </At>
    </Stage>
  )
}
