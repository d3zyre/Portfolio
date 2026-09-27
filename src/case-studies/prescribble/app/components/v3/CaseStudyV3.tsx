import { ReactNode, CSSProperties, useLayoutEffect, useRef, useState } from "react";
import IADiagram from "./IADiagram";
import DosageModal from "./DosageModal";
import {
  Band, Rule, Head, Lede, Label, K, Blob, Glass, Bezel, Showcase,
  RevealIn, useCursorField, CursorGlow,
  INK, PAPER, MIST, SLATE, LINE, ACCENT, DUSK, CLAY, DEEP, tight,
} from "./kit";

const CONSULT = "/prescribble/img/app-consult.png";
const SEARCH = "/prescribble/img/app-search.png";
const ADDSEC = "/prescribble/img/app-addsection.png";
const PREVIEW = "/prescribble/img/app-preview.png";
const HOME = "/prescribble/img/device-cutout.webp";
const NAT = { w: 2732, h: 2048 };
const LIVE = "https://prescribble.vercel.app";

/* Same small string-hash used in kit.tsx, kept local so each quote bubble
   gets its own shine timing without threading a prop through. */
function seedFrom(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Normalised crop. Rect values are 0..1 of the source image. Aspect is
   derived from the crop so nothing stretches. */
function Crop({
  src, rect, className = "", style,
}: {
  src: string;
  rect: { x: number; y: number; w: number; h: number };
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        aspectRatio: `${(rect.w * NAT.w) / (rect.h * NAT.h)}`,
        backgroundImage: `url(${src})`,
        backgroundSize: `${100 / rect.w}% ${100 / rect.h}%`,
        backgroundPosition: `${(rect.x / (1 - rect.w)) * 100}% ${(rect.y / (1 - rect.h)) * 100}%`,
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}

function Shot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(22,24,29,0.08)", boxShadow: "0 40px 80px -40px rgba(22,24,29,0.45)" }}
    >
      {children}
    </div>
  );
}

/* The app is laid out for a 1366x1024 iPad Pro 12.9". Render it at exactly that
   size and scale the whole frame into whatever width the bezel gets (measured,
   because scale() needs a unitless number and CSS can't derive one from cqw. */
function LiveFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setS(w / 1366);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Until a width is measured, fall back to a plain fluid iframe. It looks
     zoomed, but it is visible, which beats a frame scaled to nothing. */
  const scaled = s !== null;
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0B0B0F" }}>
      <iframe
        src={LIVE}
        title="Prescribble live prototype"
        style={
          scaled
            ? {
                width: 1366,
                height: 1024,
                border: 0,
                display: "block",
                transformOrigin: "top left",
                transform: `scale(${s})`,
              }
            : { width: "100%", height: "100%", border: 0, display: "block" }
        }
      />
    </div>
  );
}

/* ---------------------------------- hero --------------------------------- */
function Hero() {
  const { sectionRef, glowRef, parallaxRef, tiltRef } = useCursorField();
  return (
    <section
      ref={sectionRef as any}
      className="w-full relative overflow-hidden flex flex-col"
      style={{ background: DEEP, isolation: "isolate", minHeight: "100svh" }}
    >
      <div ref={parallaxRef} className="absolute inset-0" style={{ zIndex: -1, pointerEvents: "none" }}>
        <Blob from="#38507E" to="#1B2233" size={1100} blur={120} opacity={0.72} style={{ top: -260, left: "6%" }} />
        {/* warm ochre bloom sitting behind the device, so the iPad glows off it */}
        <Blob from="#D9A85F" to="#6B5A3A" size={980} blur={150} opacity={0.42} style={{ top: 40, right: "-14%" }} />
        <Blob from={CLAY} to="#5A5348" size={620} blur={140} opacity={0.34} style={{ top: 320, right: "6%" }} />
        <Blob from="#2E4460" to="#171B24" size={860} blur={110} opacity={0.55} style={{ top: 520, left: "-12%" }} />
      </div>
      <CursorGlow glowRef={glowRef} />

      <RevealIn
        className="relative mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,120px)] pt-[40px] pb-[clamp(40px,5vw,72px)] flex-1 flex flex-col"
        style={{ zIndex: 4 } as CSSProperties}
      >
        <div className="flex items-baseline justify-between text-[12px] font-bold uppercase" style={{ color: DUSK, letterSpacing: "0.07em" }}>
          <span>UX case study</span>
          <span>Healthcare · 2025</span>
        </div>

        <div className="mt-[clamp(36px,6vh,80px)] flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[clamp(28px,3vw,48px)] items-center">
          <div className="lg:col-span-6 relative" style={{ zIndex: 4 }}>
            <h1 style={{ ...tight, fontSize: "clamp(44px, min(8vw, 14vh), 118px)", lineHeight: 0.9, color: "#fff", fontWeight: 200 }}>
              Prescribble
            </h1>
            <p
              className="mt-[26px] text-[clamp(17px,min(1.7vw,2.6vh),23px)] leading-[1.4] max-w-[26ch] font-light"
              style={{ color: "rgba(255,255,255,0.72)", ...tight }}
            >
              Doctors won&rsquo;t give up <span style={{ color: "#fff", fontWeight: 500 }}>speed</span> to write{" "}
              <span style={{ color: "#fff", fontWeight: 500 }}>clearer</span>. So I stopped asking them to.
            </p>
          </div>

          {/* only the icon on a home screen: the product itself stays hidden
              until the reveal in 03. Floats a few px toward the cursor. */}
          <div ref={tiltRef} className="lg:col-span-6 motion-tilt">
            <Showcase
              height="clamp(250px, min(29vw, 44vh), 410px)"
              width="205%"
              top="-18%"
              left="-6%"
              rot={-5}
              fade={DEEP}
              fadeFrom={34}
            >
              <img src={HOME} alt="Prescribble installed on an iPad home screen" style={{ width: "100%", display: "block" }} />
            </Showcase>
          </div>
        </div>

        <div
          className="relative mt-[clamp(32px,4vw,56px)] grid grid-cols-2 lg:grid-cols-4 gap-y-[26px] gap-x-[32px] border-t pt-[26px]"
          style={{ borderColor: "rgba(255,255,255,0.14)", zIndex: 4 }}
        >
          {[
            ["Role", "End-to-end UX / UI"],
            ["Scope", "Research → shipped MVP"],
            ["Built for", "iPad Pro 12.9″ · Apple Pencil"],
            ["Status", "Live, deployed"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[12px] mb-[8px] font-bold uppercase" style={{ color: DUSK, letterSpacing: "0.07em" }}>{k}</p>
              <p className="text-[15px] font-medium" style={{ color: "#fff" }}>{v}</p>
            </div>
          ))}
        </div>
      </RevealIn>

      {/* final guarantee: nothing survives the bottom of this band */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "clamp(140px, 18vw, 260px)",
          zIndex: 3,
          pointerEvents: "none",
          transform: "translateZ(0)",
          background: `linear-gradient(to bottom, rgba(21,24,31,0) 0%, rgba(21,24,31,0.72) 46%, ${DEEP} 88%)`,
        }}
      />
    </section>
  );
}

/* -------------------------------- problem -------------------------------- */
function Problem() {
  return (
    <Band bg={PAPER}>
      <Blob from="#AFC4E0" to={PAPER} size={900} blur={110} opacity={0.62} style={{ top: -200, right: "-12%" }} />
      <Blob from={CLAY} to={PAPER} size={540} blur={120} opacity={0.4} style={{ bottom: -180, left: "-8%" }} />
      <Rule label="The problem" index="01" />
      <Head>
        Handwriting is the <K>fastest input</K> a doctor has. It&rsquo;s also the only one{" "}
        <K>nobody else can read</K>.
      </Head>
      <Lede>
        Every prescription is handed onward to a pharmacist who has to dispense it, a patient who has
        to follow it, and a record that has to survive it. All three need it clear. It never is.
      </Lede>
    </Band>
  );
}

/* --------------------------------- voices -------------------------------- */
/* Rebuilt from the original report infographic (the participant donut and the
   colour-coded quote bubbles), recomposed in this case study's palette.
   Colour carries the attribution; the eyebrow inside each bubble names it. */

const ROLE = {
  Doctor: {
    fill: "#3D4A68", sheen: "rgba(255,255,255,0.17)",
    text: "#FFFFFF", sub: "rgba(255,255,255,0.50)",
  },
  Patient: {
    fill: "#8CA3C3", sheen: "rgba(255,255,255,0.30)",
    text: "#141A26", sub: "rgba(20,26,38,0.56)",
  },
  Pharmacist: {
    fill: "#B4C6DF", sheen: "rgba(255,255,255,0.44)",
    text: "#151A23", sub: "rgba(21,26,35,0.52)",
  },
} as const;

type Role = keyof typeof ROLE;
/* Free placement, not columns: every bubble carries which corner the tail
   hangs off and t, where it sits along the space actually available to it.
   t is a fraction of (field width - its own width), realised as two flex
   spacers, so 0 is flush left, 1 flush right and 0.5 centred whatever the
   bubble measures. Plain percentage insets do not survive here: the field
   gets WIDER as the viewport narrows while the text clamps SMALLER, so the
   same percentages fling the bubbles apart.

   The vertical rhythm is not in the data. The stack is space-between inside a
   box as tall as the stats rail, over a uniform -40px base margin, so every
   gap works out to the same (negative) number and the last bubble still lands
   on the methodology line. Consecutive bubbles are placed at least 50px clear
   of each other horizontally, which is what lets them ride up and interlock
   instead of stepping down like a staircase. */
type Q = { q: string; who: Role; side: "l" | "r"; t: number };

/* Line breaks match the wrapping in the original infographic, so every bubble
   lands as a tidy two-liner rather than a ragged paragraph.
   The order is a colouring problem, not a shuffle: no two bubbles of the same
   role may sit next to each other, so the roles alternate D-Ph-Pt-D-Ph. */
const QUOTES: Q[] = [
  { who: "Doctor",     side: "l", t: 0.22, q: "Prefer paper over\ndigital systems" },
  { who: "Pharmacist", side: "r", t: 0.93, q: "Cannot read handwriting of\ndoctors from other hospitals" },
  { who: "Patient",    side: "l", t: 0.00, q: "Doctor explained dosage but\nI forgot, can't read prescription" },
  { who: "Doctor",     side: "r", t: 0.92, q: "Many patients, less time\nso hard to switch to digital" },
  { who: "Pharmacist", side: "l", t: 0.03, q: "Patients ask me for alternatives,\nbut I'm not the doctor" },
];

function Bubble({ q, who, side, t, first, active, onHover }: Q & {
  first: boolean;
  active: Role | null;
  onHover: (r: Role | null) => void;
}) {
  const left = side === "l";
  const r = ROLE[who];
  const sd = seedFrom(q);
  const shdur = 6 + (sd % 4);   // 6-9s
  const shdelay = -(sd % shdur);
  const dim = active !== null && active !== who;
  const lit = active === who;
  return (
    /* The base overlap only makes sense from lg up, where the stats rail sits
       BESIDE the quotes and leaves the column surplus height for
       justify-between to hand back — an equal share to every gap, so they all
       come out identical. Below lg the two stack, there is no surplus, and the
       raw -80 would pile the bubbles on top of each other: there they get a
       plain positive gap and read as a normal thread. */
    <div className={`flex w-full ${first ? "" : "mt-[16px] lg:mt-[-80px]"}`}>
      {t > 0 ? <div aria-hidden style={{ flexGrow: t, flexBasis: 0, minWidth: 0 }} /> : null}
      <div
        className="relative"
        onMouseEnter={() => onHover(who)}
        onMouseLeave={() => onHover(null)}
        style={{
          flex: "0 1 auto",
          minWidth: 0,
          opacity: dim ? 0.32 : 1,
          transform: lit ? "translateY(-3px)" : "translateY(0)",
          transition: "opacity 260ms ease, transform 260ms ease",
          cursor: "default",
        }}
      >
        <div
          className="motion-shine"
          style={{
            position: "relative",
            zIndex: 1,
            /* sheen over the flat fill: reads as depth without a backdrop-filter,
               which does nothing visible over a smooth gradient band */
            background: `linear-gradient(158deg, ${r.sheen}, rgba(255,255,255,0) 60%), ${r.fill}`,
            borderRadius: left ? "26px 26px 26px 2px" : "26px 26px 2px 26px",
            padding: "clamp(15px,1.5vw,20px) clamp(20px,1.9vw,27px) clamp(16px,1.6vw,21px)",
            boxShadow: lit ? "0 22px 40px -22px rgba(28,40,66,0.65)" : "0 18px 32px -24px rgba(28,40,66,0.5)",
            transition: "box-shadow 260ms ease",
            ["--shdur" as string]: `${shdur}s`,
            ["--shdelay" as string]: `${shdelay}s`,
          } as CSSProperties}
        >
          <p
            className="text-[10.5px] mb-[9px]"
            style={{ color: r.sub, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            {who}
          </p>
          <p
            className="text-[clamp(16px,1.2vw,17px)] leading-[1.45]"
            style={{ color: r.text, fontWeight: 400, whiteSpace: "pre-line" }}
          >
            &ldquo;{q}&rdquo;
          </p>
        </div>
        {/* fin drawn along the bottom edge beside the squared corner: a detached
            wedge always leaves a gap against a rounded one */}
        <svg
          width="14" height="22" viewBox="0 0 14 22" aria-hidden
          style={{ position: "absolute", bottom: 0, [left ? "left" : "right"]: -13, transform: left ? "scaleX(-1)" : "none" }}
        >
            <path d="M0,0 C0,11 4,18 14,22 C6,22 0,22 0,22 Z" fill={r.fill} />
          </svg>
      </div>
      {t < 1 ? <div aria-hidden style={{ flexGrow: 1 - t, flexBasis: 0, minWidth: 0 }} /> : null}
    </div>
  );
}

const SPLIT: { who: Role; n: number; pct: number }[] = [
  { who: "Doctor", n: 4, pct: 57 },
  { who: "Patient", n: 2, pct: 29 },
  { who: "Pharmacist", n: 1, pct: 14 },
];

function Donut({ active, onHover }: { active: Role | null; onHover: (r: Role | null) => void }) {
  const SIZE = 204, R = 74, W = 26, GAP = 9; // GAP is circumference, not degrees
  const C = 2 * Math.PI * R;
  let acc = 0;
  const activeSplit = active ? SPLIT.find((s) => s.who === active) : null;
  return (
    <div style={{ maxWidth: 268 }}>
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ transform: "rotate(-90deg)" }}>
          {SPLIT.map((s) => {
            const len = (s.pct / 100) * C - GAP;
            const isActive = active === s.who;
            const el = (
              <circle
                key={s.who}
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke={ROLE[s.who].fill}
                strokeWidth={isActive ? W + 6 : W}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-acc}
                onMouseEnter={() => onHover(s.who)}
                onMouseLeave={() => onHover(null)}
                style={{
                  cursor: "pointer",
                  opacity: active && !isActive ? 0.32 : 1,
                  transition: "opacity 220ms ease, stroke-width 220ms ease",
                }}
              />
            );
            acc += len + GAP;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center" style={{ pointerEvents: "none" }}>
          <div className="text-center" style={{ transition: "opacity 200ms ease" }}>
            <p style={{ ...tight, color: INK, fontWeight: 200 }} className="text-[46px] leading-none">
              {activeSplit ? activeSplit.n : 7}
            </p>
            <p className="text-[10px] mt-[6px]" style={{ color: SLATE, letterSpacing: "0.16em", fontWeight: 500 }}>
              {activeSplit ? `${activeSplit.who.toUpperCase()}${activeSplit.n > 1 ? "S" : ""}` : "INTERVIEWS"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(26px,2.6vw,34px)] w-full" style={{ borderBottom: `1px solid ${LINE}` }}>
        {SPLIT.map((s) => {
          const isActive = active === s.who;
          return (
            <div
              key={s.who}
              className="flex items-center gap-[11px] py-[10px] border-t text-[14px] rounded-[8px] px-[8px] -mx-[8px]"
              onMouseEnter={() => onHover(s.who)}
              onMouseLeave={() => onHover(null)}
              style={{
                borderColor: LINE,
                color: INK,
                cursor: "pointer",
                background: isActive ? "rgba(63,76,107,0.08)" : "transparent",
                opacity: active && !isActive ? 0.55 : 1,
                transition: "opacity 220ms ease, background 220ms ease",
              }}
            >
              <span className="h-[9px] w-[9px] rounded-full shrink-0" style={{ background: ROLE[s.who].fill, boxShadow: `0 0 0 1px ${LINE}` }} />
              <span className="tabular-nums" style={{ fontWeight: 500 }}>{s.n}</span>
              <span className="font-light">{s.who}{s.n > 1 ? "s" : ""}</span>
              <span className="ml-auto tabular-nums font-light" style={{ color: SLATE }}>{s.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Voices() {
  const [active, setActive] = useState<Role | null>(null);
  return (
    <Band bg={MIST}>
      <Blob from="#A9BFDD" to={MIST} size={980} blur={120} opacity={0.6} style={{ top: -220, left: "-16%" }} />
      <Blob from={CLAY} to={MIST} size={640} blur={120} opacity={0.5} style={{ bottom: -160, right: "-8%" }} />

      <Rule label="Primary research" index="02" />
      <Head>Seven interviews. The same problem, seen from <K>three sides</K>.</Head>
      <Lede>
        Doctors, patients and pharmacists, interviewed separately. Nobody described the problem the
        same way, but it turned out to be the same breakdown each time, just seen from a different side.
      </Lede>

      <div className="mt-[clamp(44px,5.5vw,76px)] grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,4vw,64px)]">
        {/* left rail: who, then how */}
        <div className="lg:col-span-4">
          <p className="text-[12px] font-semibold mb-[clamp(20px,2.2vw,28px)]" style={{ color: ACCENT, letterSpacing: "0.04em" }}>
            Who we spoke to
          </p>
          <Donut active={active} onHover={setActive} />
          <p className="mt-[clamp(26px,2.6vw,34px)] text-[12px] font-semibold" style={{ color: ACCENT, letterSpacing: "0.04em" }}>
            Methodology
          </p>
          <p className="mt-[9px] text-[14px] leading-[1.62] font-light" style={{ color: SLATE, maxWidth: "32ch" }}>
            Semi-structured online interviews, roughly 20 minutes each, conducted remotely.
          </p>
        </div>

        {/* right: the quotes, placed rather than gridded. A 2x3 grid reads as
            a table and a single flush stack reads as a chat log. */}
        <div className="lg:col-span-8 flex flex-col">
          <p className="text-[12px] font-semibold mb-[clamp(18px,2vw,26px)]" style={{ color: ACCENT, letterSpacing: "0.04em" }}>
            Key insights
          </p>
          <div className="flex flex-col flex-1 justify-between" style={{ maxWidth: 640 }}>
            {QUOTES.map((x, i) => (
              <Bubble key={x.q} {...x} first={i === 0} active={active} onHover={setActive} />
            ))}
          </div>
        </div>
      </div>
    </Band>
  );
}

/* --------------------------------- reveal -------------------------------- */
function Reveal() {
  const { sectionRef, glowRef, parallaxRef } = useCursorField();
  return (
    <section
      ref={sectionRef as any}
      className="w-full relative overflow-hidden"
      style={{ background: DEEP, paddingTop: "clamp(72px,9vw,140px)", paddingBottom: "clamp(20px,3vw,48px)", isolation: "isolate" }}
    >
      <div ref={parallaxRef} className="absolute inset-0" style={{ zIndex: -1, pointerEvents: "none" }}>
        <Blob from="#3A5480" to="#1A2130" size={1000} blur={130} opacity={0.65} style={{ top: -180, right: "-8%" }} />
        <Blob from="#2C3F5C" to="#15181F" size={760} blur={120} opacity={0.55} style={{ bottom: -180, left: "-10%" }} />
      </div>
      <CursorGlow glowRef={glowRef} />
      <RevealIn className="relative mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,120px)]">
        <Rule label="The answer" index="03" tone="#fff" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(28px,3vw,52px)] items-center">
          <div className="lg:col-span-5 relative" style={{ zIndex: 2 }}>
            <Head tone="rgba(255,255,255,0.88)" size="clamp(26px, min(3.4vw, 5.6vh), 50px)" max="17ch">
              The fix kept the pen. <K>Everything else</K> got rebuilt{" "}
              <K>around it</K>.
            </Head>
            <Lede tone="rgba(255,255,255,0.58)">
              Prescribble takes the handwriting as it is, then handles making it readable, looking up
              the drug and keeping the record afterward. The doctor&rsquo;s hand never has to slow down.
            </Lede>
          </div>

          {/* first sight of the actual product */}
          <Showcase
            className="lg:col-span-7"
            height="clamp(300px, min(34vw, 52vh), 470px)"
            width="168%"
            top="-8%"
            rot={-4}
            fade={DEEP}
            fadeFrom={40}
          >
            <Bezel src={CONSULT} alt="The Prescribble consultation screen" glow={false} />
          </Showcase>
        </div>
      </RevealIn>
    </section>
  );
}

/* ------------------------------- decisions ------------------------------- */
function Decisions() {
  return (
    <Band bg={PAPER}>
      <Blob from="#B5C7E2" to={PAPER} size={940} blur={120} opacity={0.5} style={{ top: 180, left: "-18%" }} />
      <Blob from={CLAY} to={PAPER} size={600} blur={130} opacity={0.36} style={{ top: "52%", right: "-12%" }} />
      <Rule label="Three decisions" index="04" />
      <Head>Three decisions carry <K>the whole design</K>.</Head>

      {/* 01 */}
      <RevealIn className="mt-[clamp(70px,10vw,140px)] grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,4vw,64px)] items-center">
        <div className="lg:col-span-5">
          <Label tone={ACCENT}>01 · Suggestion order</Label>
          <Head size="clamp(26px,3vw,44px)" max="16ch"><K>Salt first.</K> Brand second, and smaller.</Head>
          <Lede>
            The Supreme Court ruled in May 2023 that doctors should prescribe generics. Listing by salt
            makes doing that the fast option too. Brands stay, just smaller and greyed out.
          </Lede>
          <p className="mt-[26px] text-[15px] font-light" style={{ color: SLATE }}>
            Writing <span style={{ color: INK, fontWeight: 600 }}>&ldquo;Clotrim&rdquo;</span> in the treatment
            block narrows <span style={{ color: INK, fontWeight: 600 }}>42 options to 3</span>: the three
            brands of that one molecule, with live stock beside each.
          </p>
        </div>
        <div className="lg:col-span-7">
          <Shot className="max-w-[460px] ml-auto">
            <Crop src={SEARCH} rect={{ x: 0.793, y: 0.0, w: 0.207, h: 0.33 }} />
          </Shot>
        </div>
      </RevealIn>

      {/* 02 */}
      <RevealIn className="mt-[clamp(80px,11vw,168px)] grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,4vw,64px)] items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <DosageModal />
          <p className="mt-[16px] text-[13px] font-light" style={{ color: SLATE }}>
            Live. Drag the slider, toggle the slots. What you see below is exactly what a pharmacist reads.
          </p>
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2">
          <Label tone={ACCENT}>02 · Dosage entry</Label>
          <Head size="clamp(26px,3vw,44px)" max="16ch"><K>Three taps</K>, not three text fields.</Head>
          <Lede>
            Duration snaps to the numbers doctors actually write (3, 5, 7), then goes up a week at a
            time. Frequency uses the same 0-0-0 pattern already on every paper pad. Nothing new to learn.
          </Lede>
          <Lede>
            Dosage is where free text causes the most damage. Limit what people can type and the
            confusion goes away, without slowing anyone down.
          </Lede>
        </div>
      </RevealIn>

      {/* 03 */}
      <RevealIn className="mt-[clamp(80px,11vw,168px)] grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,4vw,64px)] items-center">
        <div className="lg:col-span-5">
          <Label tone={ACCENT}>03 · Document model</Label>
          <Head size="clamp(26px,3vw,44px)" max="16ch"><K>Blocks</K>, not a form.</Head>
          <Lede>
            Symptoms, diagnosis and treatment are there by default. Tests, advice, follow-up and referral
            get added only when that consultation needs them. The page stays as short as the visit.
          </Lede>
        </div>
        <div className="lg:col-span-7">
          <div className="mx-auto" style={{ maxWidth: 270 }}><Shot><Crop src={ADDSEC} rect={{ x: 0.0, y: 0.115, w: 0.166, h: 0.305 }} /></Shot></div>
        </div>
      </RevealIn>
    </Band>
  );
}

/* --------------------------------- live ---------------------------------- */
function LiveDemo() {
  return (
    <Band bg={MIST}>
      <Blob from="#A6BEDE" to={MIST} size={1020} blur={130} opacity={0.58} style={{ top: -240, right: "-14%" }} />
      <Rule label="Try it" index="05" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,4vw,56px)] items-center">
        <div className="lg:col-span-4">
          <Head size="clamp(26px, min(3.4vw, 5.6vh), 50px)" max="15ch">
            It isn&rsquo;t a mockup. <K>Go&nbsp;use&nbsp;it.</K>
          </Head>
          <Lede>
            The real deployed build, running live inside this page. Write a salt name in the treatment
            block, watch the list narrow, open a dosage sheet.
          </Lede>
          {/* the build is behind auth, so say so before the reader hits it and
              assumes the embed is broken */}
          <p className="mt-[18px] text-[13px] leading-[1.6] font-light" style={{ color: SLATE }}>
            It opens on a sign-in screen with the demo account already filled in. Just press Sign In.
          </p>
          <a
            href={LIVE} target="_blank" rel="noreferrer"
            className="mt-[28px] inline-flex items-center gap-[8px] rounded-full px-[24px] py-[13px] text-[14px] font-medium"
            style={{ background: INK, color: "#fff" }}
          >
            Open full screen →
          </a>
        </div>
        <div className="lg:col-span-8">
          <Bezel><LiveFrame /></Bezel>
          <p className="mt-[18px] text-[13px] font-light" style={{ color: SLATE }}>
            Live build · prescribble.vercel.app
          </p>
        </div>
      </div>
    </Band>
  );
}

/* --------------------------------- extras --------------------------------- */
const EXTRAS: [string, string][] = [
  ["Schedules", "The day's queue at a glance, so nothing gets missed between consultations."],
  ["Digital signature", "Captured once with the Pencil, legally valid, and attached to every prescription it signs."],
  ["Export & share", "Send a prescription out as a PDF, print it, or share it straight to the patient's phone."],
  ["Patient history", "Past visits and prescriptions come up the moment a returning patient is opened."],
];

function Extras() {
  return (
    <Band bg={PAPER}>
      <Blob from="#C9D6EA" to={PAPER} size={760} blur={120} opacity={0.4} style={{ top: -160, right: "-14%" }} />
      <Rule label="Also in the app" index="06" />
      <Head>The rest of a doctor&rsquo;s day, <K>handled too</K>.</Head>
      <Lede>
        Beyond the core functions, these are add-ons, thoughtfully built in to make a doctor&rsquo;s
        day a little easier.
      </Lede>
      <div
        className="mt-[clamp(44px,6vw,80px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]"
        style={{ background: LINE }}
      >
        {EXTRAS.map(([title, body], i) => (
          <RevealIn key={title} delay={i * 90} className="p-[clamp(24px,2.6vw,32px)]" style={{ background: PAPER }}>
            <h3 style={{ ...tight, color: INK, fontWeight: 500 }} className="text-[17px] mb-[10px]">{title}</h3>
            <p className="text-[14px] leading-[1.6] font-light" style={{ color: SLATE }}>{body}</p>
          </RevealIn>
        ))}
      </div>
    </Band>
  );
}

/* ------------------------------- not taken ------------------------------- */
const REJECTED = [
  ["Fully typed prescriptions", "Assumes doctors get a 15-minute consultation window. Interviews said the opposite: doctors care about speed above everything, and typing always loses to a pen."],
  ["Voice-assisted dictation", "Noisy clinics, trouble recognising different accents, and doctors who didn't want to say sensitive findings out loud with a queue of patients right outside."],
];

function NotTaken() {
  return (
    <Band bg={MIST}>
      <Blob from="#B8C8E3" to={MIST} size={820} blur={120} opacity={0.42} style={{ top: -180, left: "-14%" }} />
      <Rule label="Paths not taken" index="07" />
      <Head>The obvious answers were <K>typing</K> and <K>talking</K>. Doctors rejected both.</Head>
      <div className="mt-[clamp(48px,7vw,90px)] grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {REJECTED.map(([t, why], i) => (
          <RevealIn key={t} delay={i * 110} className="relative overflow-hidden rounded-[24px] p-[clamp(28px,3.4vw,44px)]" style={{ background: PAPER }}>
            <Blob from="#B9C9E4" to={PAPER} size={420} blur={80} opacity={0.7} style={{ top: -130, right: -90 }} />
            <div className="relative">
              <p className="text-[13px] font-medium mb-[20px]" style={{ color: SLATE }}>Rejected 0{i + 1}</p>
              <h3 style={{ ...tight, color: INK, fontWeight: 300 }} className="text-[28px] leading-[1.12] mb-[20px]">{t}</h3>
              <p className="text-[16px] leading-[1.65] font-light" style={{ color: SLATE }}>{why}</p>
            </div>
          </RevealIn>
        ))}
      </div>
    </Band>
  );
}

/* --------------------------------- craft --------------------------------- */
const WIREFRAMES: [string, string, string][] = [
  ["/prescribble/img/wf-1.png", "Zoning", "Four regions settled before anything else: submenu, patient header, writing canvas, suggestions."],
  ["/prescribble/img/wf-4.png", "Structure", "Grey version: just the layout of the blocks and the Add Section menu, with no colour to hide behind."],
  ["/prescribble/img/wf-2.png", "Mid-fidelity", "Real content in place. Fake drug rows fill the panel all the way up, to see what it looks like at full."],
];

function Craft() {
  return (
    <Band bg={PAPER}>
      <Blob from={CLAY} to={PAPER} size={760} blur={120} opacity={0.45} style={{ top: -160, right: "-10%" }} />
      <Rule label="Getting there" index="08" />
      <Head>Rough sketches first. <K>Work out the idea before it looks finished.</K></Head>
      <div className="mt-[clamp(48px,7vw,88px)] grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {WIREFRAMES.map(([src, title, body], i) => (
          <RevealIn key={src} delay={i * 110}>
            <Shot><img src={src} alt={title} className="w-full block" /></Shot>
            <p className="mt-[20px] text-[13px] font-medium" style={{ color: ACCENT }}>0{i + 1} · {title}</p>
            <p className="mt-[8px] text-[15px] leading-[1.6] font-light" style={{ color: SLATE }}>{body}</p>
          </RevealIn>
        ))}
      </div>
    </Band>
  );
}

/* ----------------------------------- IA ---------------------------------- */
function Architecture() {
  const { sectionRef, glowRef, parallaxRef } = useCursorField();
  return (
    <section
      ref={sectionRef as any}
      className="w-full relative overflow-hidden"
      style={{ background: DEEP, paddingTop: "clamp(72px,9vw,140px)", paddingBottom: "clamp(72px,9vw,140px)", isolation: "isolate" }}
    >
      <div ref={parallaxRef} className="absolute inset-0" style={{ zIndex: -1, pointerEvents: "none" }}>
        <Blob from="#33496F" to="#171C27" size={1000} blur={130} opacity={0.6} style={{ top: -160, left: "-10%" }} />
      </div>
      <CursorGlow glowRef={glowRef} />
      <RevealIn className="relative mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,120px)]">
        <Rule label="Information architecture" index="09" tone="#fff" />
        <Head tone="rgba(255,255,255,0.88)">
          One way in, <K>three clear paths</K>.
        </Head>
        <Lede tone="rgba(255,255,255,0.58)">
          Menu, prescription workspace, and the drug/test suggestions panel. Everything a consultation
          needs is reachable without leaving the writing canvas.
        </Lede>
        <div className="mt-[clamp(56px,8vw,96px)] mx-auto w-full" style={{ maxWidth: "min(1120px, 96vh)" }}>
          <IADiagram />
        </div>
      </RevealIn>
    </section>
  );
}

/* ------------------------------ style guide ------------------------------ */
const SWATCHES: [string, string][] = [
  ["#0D1B2A", "Ink"],
  ["#1A73E8", "Primary"],
  ["#2BC48A", "In stock"],
  ["#FF8D28", "Attention"],
  ["#666666", "Body"],
  ["#AAAAAA", "Muted"],
  ["#E6E9EC", "Surface"],
];

const RAMP: [string, string, number][] = [
  ["Heading", "Semibold", 17],
  ["Body", "Regular", 17],
  ["Subheading", "Medium", 15],
  ["Footnote", "Regular", 13],
];

function StyleGuide() {
  return (
    <Band bg={PAPER}>
      <Blob from="#B4C6E2" to={PAPER} size={860} blur={120} opacity={0.45} style={{ top: -180, right: "-14%" }} />
      <Rule label="Style guide" index="10" />
      <Head>A <K>calm, clinical system</K> built on Apple&rsquo;s native scale.</Head>
      <Lede>
        Designed to match SF Pro on the iPad Pro 12.9″, so the app would feel like part of the iPad
        instead of some outside brand. The shipped build uses Inter instead, since it&rsquo;s free to use.
      </Lede>

      <div className="mt-[clamp(48px,7vw,88px)] grid grid-cols-1 lg:grid-cols-12 gap-[18px]">
        {/* type ramp */}
        <Glass className="lg:col-span-5 p-[clamp(28px,3vw,40px)]">
          <p className="text-[13px] font-medium mb-[28px]" style={{ color: SLATE }}>Type scale · 17 / 17 / 15 / 13</p>
          <div className="flex items-center gap-[24px] mb-[32px]">
            <span style={{ ...tight, color: INK, fontWeight: 300, fontSize: 84, lineHeight: 1 }}>Aa</span>
            <div>
              {RAMP.map(([n, w, s]) => (
                <div key={n} className="flex items-baseline gap-[14px] mb-[7px]">
                  <span style={{ fontSize: s, color: INK, fontWeight: n === "Heading" ? 600 : n === "Subheading" ? 500 : 400 }}>{n}</span>
                  <span className="text-[11px]" style={{ color: SLATE }}>{s}px · {w}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-[4px] h-[70px] rounded-[10px] overflow-hidden" style={{ border: "1px solid rgba(22,24,29,0.07)", padding: 6 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-[3px]" style={{ background: "rgba(26,115,232,0.10)" }} />
            ))}
          </div>
          <p className="mt-[16px] text-[13px] font-light" style={{ color: SLATE }}>12-column layout on an 8px baseline grid.</p>
        </Glass>

        {/* palette */}
        <Glass className="lg:col-span-4 p-[clamp(28px,3vw,40px)]">
          <p className="text-[13px] font-medium mb-[28px]" style={{ color: SLATE }}>Palette</p>
          <div className="space-y-[12px]">
            {SWATCHES.map(([hex, role]) => (
              <div key={hex} className="flex items-center gap-[14px]">
                <span className="h-[30px] w-[30px] rounded-[9px] shrink-0" style={{ background: hex, border: "1px solid rgba(22,24,29,0.10)" }} />
                <span className="text-[14px] font-medium tabular-nums" style={{ color: INK }}>{hex}</span>
                <span className="text-[13px] font-light ml-auto" style={{ color: SLATE }}>{role}</span>
              </div>
            ))}
          </div>
        </Glass>

        {/* mark */}
        <div className="lg:col-span-3 rounded-[24px] p-[clamp(28px,3vw,40px)] flex flex-col" style={{ background: "#0D1B2A" }}>
          <p className="text-[13px] font-medium mb-[28px]" style={{ color: "rgba(255,255,255,0.45)" }}>The mark</p>
          <div className="flex-1 grid place-items-center py-[20px]">
            <img src="/prescribble/img/logo-light.svg" alt="Prescribble logo" style={{ width: 132, height: 132 }} />
          </div>
          <p className="text-[14px] leading-[1.6] font-light" style={{ color: "rgba(255,255,255,0.66)" }}>
            The Rx prescription symbol, with the stylus forming its cross-stroke at 90°: the medical
            cross, drawn by the pen that replaces it.
          </p>
        </div>
      </div>
    </Band>
  );
}

/* --------------------------------- close --------------------------------- */
function Close() {
  const { sectionRef, glowRef, parallaxRef } = useCursorField();
  return (
    <section
      ref={sectionRef as any}
      className="w-full relative overflow-hidden"
      style={{ background: DEEP, paddingTop: "clamp(72px,8vw,120px)", paddingBottom: 72, isolation: "isolate" }}
    >
      <div ref={parallaxRef} className="absolute inset-0" style={{ zIndex: -1, pointerEvents: "none" }}>
        <Blob from="#3A5580" to="#171C27" size={1150} blur={140} opacity={0.72} style={{ top: -180, left: "-6%" }} />
        <Blob from={CLAY} to="#4E4840" size={620} blur={140} opacity={0.3} style={{ top: "34%", right: "-8%" }} />
        <Blob from="#2B6FD6" to="#15181F" size={760} blur={150} opacity={0.34} style={{ bottom: -200, left: "38%" }} />
      </div>
      <CursorGlow glowRef={glowRef} />

      <RevealIn className="relative mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] items-center">
          <div className="lg:col-span-5 relative" style={{ zIndex: 2 }}>
            <p className="text-[13px] font-medium mb-[22px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              The output
            </p>
            <Head tone="rgba(255,255,255,0.9)" size="clamp(30px,min(3.6vw,5.6vh),54px)" max="15ch">
              The same consultation, now <K>readable&nbsp;by&nbsp;everyone</K> who has to read it.
            </Head>
            <Lede tone="rgba(255,255,255,0.58)">
              Salt and brand, dose, frequency, duration and a digital signature: set down once, in
              the doctor&rsquo;s own hand, and readable by the pharmacist and the patient.
            </Lede>
          </div>

          <Showcase
            className="lg:col-span-7"
            height="clamp(280px, min(32vw, 48vh), 450px)"
            width="170%"
            top="-9%"
            rot={-4.5}
            fade={DEEP}
            fadeFrom={38}
          >
            <Bezel src={PREVIEW} alt="The finished, signed prescription" glow={false} />
          </Showcase>
        </div>
      </RevealIn>

      <RevealIn
        delay={120}
        className="relative mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,120px)] mt-[clamp(90px,11vw,170px)]"
        style={{ zIndex: 2 } as CSSProperties}
      >
        <h2 style={{ ...tight, fontSize: "clamp(44px, min(9.5vw, 16vh), 146px)", lineHeight: 0.9, color: "#fff", fontWeight: 200 }}>
          Prescribble
        </h2>
        <p className="mt-[30px] text-[19px] max-w-[34ch] font-light" style={{ color: "rgba(255,255,255,0.68)" }}>
          Helping doctors go digital without giving up the speed of pen and paper.
        </p>
        <div
          className="mt-[clamp(56px,8vw,90px)] flex items-baseline justify-between border-t pt-[24px] flex-wrap gap-[14px] text-[13px]"
          style={{ borderColor: "rgba(255,255,255,0.14)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Akanksha Gupta</span>
          <a href={LIVE} target="_blank" rel="noreferrer" style={{ color: "#fff" }} className="font-medium">
            prescribble.vercel.app ↗
          </a>
        </div>
      </RevealIn>
    </section>
  );
}

export default function CaseStudyV3() {
  return (
    <main className="w-full" style={{ background: PAPER }}>
      <Hero />
      <Problem />
      <Voices />
      <Reveal />
      <Decisions />
      <LiveDemo />
      <Extras />
      <NotTaken />
      <Craft />
      <Architecture />
      <StyleGuide />
      <Close />
    </main>
  );
}
