import { ReactNode, CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import IADiagram from "./IADiagram";
import {
  Band, Rule, Head, Lede, Label, K, Blob, Glass, Bezel, Showcase,
  RevealIn, useCursorField, CursorGlow,
  INK, PAPER, MIST, SLATE, LINE, ACCENT, DUSK, CLAY, DEEP, tight,
} from "./kit";
import { RESUME_KEY } from "../../../../../shared/resume";

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
          <span>Healthcare · 2026</span>
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
          className="relative mt-[clamp(32px,4vw,56px)] grid grid-cols-2 lg:grid-cols-3 gap-y-[26px] gap-x-[32px] border-t pt-[26px]"
          style={{ borderColor: "rgba(255,255,255,0.14)", zIndex: 4 }}
        >
          {[
            ["Role", "End-to-end UX / UI"],
            ["Course", "Cognitive Ergonomics"],
            ["Timeline", "Jan to Mar 2026"],
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

/* -------------------------------- context -------------------------------- */
/* Persona photo with its line. The bubble has one squared corner, and that
   corner overlaps the photo, so the line reads as coming from that person. */
function Say({ who, children }: { who: Role; children: ReactNode }) {
  const r = ROLE[who];
  return (
    <div
      style={{
        background: r.fill,
        borderRadius: "20px 20px 20px 2px",
        padding: "11px 16px 12px",
        boxShadow: "0 18px 32px -24px rgba(28,40,66,0.5)",
        width: "max-content",
      }}
    >
      <p className="text-[15px] leading-[1.4]" style={{ color: r.text, whiteSpace: "pre" }}>&ldquo;{children}&rdquo;</p>
    </div>
  );
}

function Persona({ who, q, size = 184 }: { who: Role; q?: string; size?: number | string }) {
  return (
    <div className="flex flex-col items-start gap-[12px] min-w-0">
      <div className="flex items-start">
        <img
          src={`/prescribble/img/p-${who.toLowerCase()}.png`}
          alt={who}
          className="object-cover shrink-0"
          style={{ width: size, height: size, borderRadius: 18 }}
        />
        {q ? (
          <div className="relative shrink-0" style={{ zIndex: 2, marginLeft: -18, marginTop: 20, transform: "translateY(-50%)" }}>
            <Say who={who}>{q}</Say>
          </div>
        ) : null}
      </div>
      <span className="text-[12px] font-bold uppercase" style={{ color: ACCENT, letterSpacing: "0.07em" }}>{who}</span>
    </div>
  );
}

const PERSONAS: [Role, string][] = [
  ["Doctor", "I prefer paper\nover digital"],
  ["Patient", "Forgot the dosage,\ncan't read the prescription"],
  ["Pharmacist", "Patients ask for alternatives,\nbut I'm not the doctor"],
];

function Context() {
  return (
    <Band bg={PAPER}>
      <Blob from="#AFC4E0" to={PAPER} size={900} blur={110} opacity={0.62} style={{ top: -200, right: "-12%" }} />
      <Blob from={CLAY} to={PAPER} size={540} blur={120} opacity={0.4} style={{ bottom: -180, left: "-8%" }} />
      <Rule label="The problem" index="01" />
      <Head>Handwritten prescriptions cause <K>errors and miscommunication</K>, while digital systems <K>don&rsquo;t fit fast-paced workflows</K>.</Head>
      <div className="mt-[clamp(48px,6vw,84px)] grid grid-cols-1 md:grid-cols-3 gap-[clamp(36px,4vw,56px)] [--step:0px] md:[--step:80px]">
        {PERSONAS.map(([who, q], i) => (
          /* stepped down a little per column, so each bubble clears the
             next photo instead of running over it */
          <RevealIn key={who} delay={i * 110} className="pt-[40px]" style={{ marginTop: `calc(${i} * var(--step))` } as CSSProperties}>
            <Persona who={who} q={q} size="clamp(120px, 12vw, 184px)" />
          </RevealIn>
        ))}
      </div>
      <p className="mt-[clamp(32px,4vw,48px)] text-[13px] font-light" style={{ color: SLATE }}>
        7 interviews · 4 doctors, 2 patients, 1 pharmacist
      </p>
    </Band>
  );
}

/* --------------------------- unavailability loop -------------------------- */
const LOOP: [Role, string][] = [
  ["Doctor", "Go buy brand X"],
  ["Patient", "Doc said brand X"],
  ["Pharmacist", "We have Y,\nask your doctor"],
  ["Patient", "Okay :("],
];

function Arrow() {
  return (
    <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden className="shrink-0 hidden md:block" style={{ marginTop: "calc(40px + var(--ls) / 2 - 6px)" }}>
      <path d="M0 6 H30 M25 1 L31 6 L25 11" fill="none" stroke={SLATE} strokeWidth="1.4" />
    </svg>
  );
}

function Loop() {
  return (
    <Band bg={MIST}>
      <Blob from="#A9BFDD" to={MIST} size={980} blur={120} opacity={0.6} style={{ top: -220, left: "-16%" }} />
      <Head>If the prescribed brand isn&rsquo;t available, the patient has to go <K>back to the doctor</K> to verify an alternative, creating an <K>unavailability loop</K>.</Head>
      <div className="mt-[clamp(48px,6vw,84px)] mx-auto max-w-[1040px]" style={{ ["--ls" as string]: "clamp(96px, 9vw, 120px)" } as CSSProperties}>
        <div className="flex flex-col md:flex-row items-start md:justify-between gap-[28px] md:gap-[12px]">
          {LOOP.map(([who, q], i) => (
            <div key={i} className="contents">
              <RevealIn delay={i * 110} className="pt-[40px] md:flex-1 min-w-0">
                <Persona who={who} q={q} size="var(--ls)" />
              </RevealIn>
              {i < LOOP.length - 1 ? <Arrow /> : null}
            </div>
          ))}
        </div>
        {/* the return leg: why it's a loop and not a line */}
        <div className="hidden md:block relative mt-[20px]" style={{ height: 40 }}>
          {/* one continuous dashed path from the last patient back under the
              doctor. Both ends sit under a photo centre: the photos are
              --ls wide, in four equal columns around three 34px arrows and six 12px gaps */}
          <div
            style={{
              position: "absolute", top: 0, height: 40, left: "calc(var(--ls) / 2)",
              right: "calc((100% - 174px) / 4 - var(--ls) / 2)",
              border: `1.5px dashed ${ACCENT}`, borderTop: "none",
              borderRadius: "0 0 14px 14px",
            }}
          />
          <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden style={{ position: "absolute", left: "calc(var(--ls) / 2 - 6.25px)", top: -7 }}>
            <path d="M1 8 L7 1.5 L13 8" fill="none" stroke={ACCENT} strokeWidth="1.5" />
          </svg>
        </div>
        <p className="hidden md:block text-[13px] font-medium text-center mt-[16px]" style={{ color: ACCENT }}>…and round again</p>
      </div>
    </Band>
  );
}

/* -------------------------------- brand bias ------------------------------- */

function BrandBias() {
  return (
    <Band bg={PAPER}>
      <Blob from="#B5C7E2" to={PAPER} size={900} blur={120} opacity={0.5} style={{ top: -160, right: "-14%" }} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(40px,5vw,72px)] items-center">
        <div className="lg:col-span-6">
          <Head size="clamp(30px, min(3.6vw, 6.4vh), 54px)">
            Doctors prescribe brands even when <K>any generic would work</K>, creating <K>brand bias</K>.
          </Head>
          <Lede>
            The same composition can be made with substandard manufacturing, so doctors stick to brands they trust for quality, even though the government asks for generics.
          </Lede>
        </div>
        <div className="lg:col-span-6 flex lg:justify-center pt-[30px]">
          <Persona who="Doctor" q="Paracetamol, brand X" size="clamp(170px, 19vw, 260px)" />
        </div>
      </div>
    </Band>
  );
}

/* --------------------------------- voices -------------------------------- */
/* Rebuilt from the original report infographic (the participant donut and the
   colour-coded quote bubbles), recomposed in this case study's palette.
   Colour carries the attribution; the eyebrow inside each bubble names it. */

const ROLE = {
  /* deep navy, slate grey and slate blue from the case study palette, all
     carrying white text at AA contrast or better */
  Doctor: {
    fill: "#232A3B", sheen: "rgba(255,255,255,0.12)",
    text: "#FFFFFF", sub: "rgba(255,255,255,0.55)",
  },
  Patient: {
    fill: "#686E7B", sheen: "rgba(255,255,255,0.16)",
    text: "#FFFFFF", sub: "rgba(255,255,255,0.6)",
  },
  Pharmacist: {
    fill: "#4C6189", sheen: "rgba(255,255,255,0.16)",
    text: "#FFFFFF", sub: "rgba(255,255,255,0.6)",
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
  { who: "Patient",    side: "l", t: 0.00, q: "Forgot the dosage, can't read the prescription" },
  { who: "Doctor",     side: "r", t: 0.92, q: "Many patients, less time\nso hard to switch to digital" },
  { who: "Pharmacist", side: "l", t: 0.03, q: "Patients ask me for alternatives, I'm not the doctor" },
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
            Who I spoke to
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
        <Rule label="What was picked" index="03" tone="#fff" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(40px,5vw,80px)] items-start">
          <div className="lg:col-span-6 relative pb-[clamp(40px,5vw,72px)]" style={{ zIndex: 2 }}>
            <Head tone="rgba(255,255,255,0.88)" size="clamp(28px, min(3.2vw, 5.6vh), 46px)">
              Doctors write naturally with a stylus, and it <K>converts into structured digital text</K>.
            </Head>
            <ul className="mt-[40px] space-y-[16px] text-[17px] leading-[1.5] font-light" style={{ color: "rgba(255,255,255,0.58)" }}>
              {["Preserves existing workflow", "Minimal learning curve", "Faster adoption", "Still solves legibility problems"].map((b) => (
                <li key={b} className="flex items-baseline gap-[12px]">
                  <span aria-hidden className="h-[5px] w-[5px] rounded-full shrink-0 translate-y-[-3px]" style={{ background: DUSK }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* first sight of the actual product */}
          <Showcase
            className="lg:col-span-6"
            height="clamp(300px, min(34vw, 52vh), 470px)"
            width="196%"
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
/* Annotated callout: the full screen on the left with the relevant area
   outlined, an arrow from that outline to an enlarged cutout, and notes
   pointing at the details. Everything sits in a fixed 2:1 box laid out in
   a 100 x 50 coordinate space, and type is sized in cqw, so the whole
   panel scales as one piece instead of reflowing at odd widths. */
type R4 = { x: number; y: number; w: number; h: number };
type Note = { title: string; body: string; fy: number; fx?: number; side?: "l" | "r"; tradeoff?: boolean };
type Callout = { screen: string; hl: R4; cut: string; rect: R4; cw: number; notes: Note[]; noThumb?: boolean; centre?: boolean };

const SCREEN_AR = 2752 / 2064;

/* Right-angle connector with rounded corners: across, down/up, across. */
function elbow(x1: number, y1: number, x2: number, y2: number, r = 1.2) {
  const mx = (x1 + x2) / 2;
  const dy = y2 - y1;
  if (Math.abs(dy) < 0.3) return `M ${x1} ${y1} H ${x2}`;
  const s = Math.sign(dy), sx = Math.sign(x2 - x1);
  const rr = Math.min(r, Math.abs(dy) / 2, Math.abs(mx - x1));
  return `M ${x1} ${y1} H ${mx - sx * rr} Q ${mx} ${y1} ${mx} ${y1 + s * rr} V ${y2 - s * rr} Q ${mx} ${y2} ${mx + sx * rr} ${y2} H ${x2}`;
}

function CalloutPanel({ screen, hl, cut, rect, notes, cutId, cw: cwMax, noThumb, centre }: Callout & { cutId?: string }) {
  /* note type size, in panel-width units; narrower (9-column) panels get a
     bigger number so the text comes out the same size on screen */
  const F = noThumb ? 2.2 : 3.0;
  /* One unit = 1% of the panel width, on both axes. */
  const cutAR = (rect.w * SCREEN_AR) / rect.h;
  const cw = Math.min(centre ? cwMax : Math.max(48, cwMax), (centre ? 64 : 52) * cutAR);
  const ch = cw / cutAR;
  const H = noThumb ? ch + 2 : Math.min(58, Math.max(ch + 8, 34));
  /* without a thumbnail the component sits top-left and the panel hugs it */
  const cx = noThumb && !centre ? 18 : 50 - cw / 2, cy = noThumb ? 1 : H / 2 - ch / 2;

  // small full-screen thumbnail, top left
  const TX = 2, TY = 2, TW = 15, TH = TW / SCREEN_AR;
  const hx = TX + hl.x * TW, hy = TY + hl.y * TH, hw = hl.w * TW, hh = hl.h * TH;

  // left-aligned panels have spare room on the right, so their arrows run longer
  const leftW = cx - 5.5, rightX = cx + cw + (noThumb && !centre ? 12 : 4);
  /* rough note height: lines at 1.6 units tall x 1.4 leading, ~0.8 units
     per character */
  const noteH = (n: Note, w: number) => {
    const per = Math.max(8, Math.floor(w / (F * 0.5)));
    const lines = Math.ceil(((n.tradeoff ? 11 : 0) + n.body.length) / per);
    return lines * F * 1.4;
  };

  // each note sits level with the spot it points at, pushed apart if two collide
  const placed = notes.map((n, i) => {
    const side = n.side ?? "r";
    return { n, i, side, ty: cy + ch * n.fy, y: 0, h: noteH(n, side === "l" ? leftW - 2 : Math.min(98 - rightX, noThumb ? 26 : 34)) };
  });
  for (const side of ["l", "r"] as const) {
    let next = side === "l" ? TY + TH + 3 : 1.5;
    placed.filter((p) => p.side === side).sort((a, b) => a.ty - b.ty).forEach((p) => {
      p.y = Math.max(p.ty, next);
      next = p.y + p.h + 2.5;
    });
  }
  const Hfit = Math.max(H, ...placed.map((p) => p.y - 1.1 + p.h + 2));
  const u = (v: number) => `${v}cqw`;

  return (
    <div className="relative w-full" style={{ height: 0, paddingBottom: `${Hfit}%`, containerType: "inline-size" } as CSSProperties}>
      {noThumb ? null : <>
      <div className="absolute" style={{ left: u(TX), top: u(TY), width: u(TW) }}>
        <Shot><img src={screen} alt="" className="block w-full" /></Shot>
      </div>
      <div className="absolute rounded-[4px]" style={{ left: u(hx), top: u(hy), width: u(hw), height: u(hh), border: `2px solid ${ACCENT}`, background: "rgba(63,76,107,0.10)" }} />
      </>}

      <div id={cutId} className="absolute" style={{ left: u(cx), top: u(cy), width: u(cw) }}>
        <Shot><Crop src={cut} rect={rect} /></Shot>
      </div>

      <svg viewBox={`0 0 100 ${Hfit}`} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <marker id="cl-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="1" markerHeight="1" markerUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="5" fill={ACCENT} />
          </marker>
        </defs>
        {noThumb ? null : <path d={elbow(hx + hw, hy + hh / 2, cx - 0.8, cy + Math.min(5, ch * 0.2))} fill="none" stroke={ACCENT} strokeOpacity={0.6} strokeWidth="1.5" vectorEffect="non-scaling-stroke" markerEnd="url(#cl-head)" />}
        {placed.map((p) => {
          const left = p.side === "l";
          const sx = left ? leftW + 1 : rightX - 1;
          // fx points inside the component, at a specific element; otherwise the edge
          const tx = p.n.fx !== undefined ? cx + cw * p.n.fx : left ? cx - 0.8 : cx + cw + 0.8;
          return (
            <path key={p.i} d={elbow(sx, p.y, tx, p.ty)} fill="none" stroke={ACCENT} strokeOpacity={0.6} strokeWidth="1.5" vectorEffect="non-scaling-stroke" markerEnd="url(#cl-head)" />
          );
        })}
      </svg>

      {placed.map((p) => {
        const left = p.side === "l";
        return (
          <div
            key={p.i}
            className="absolute"
            style={{
              top: u(p.y - 1.1),
              left: left ? u(2) : u(rightX),
              width: left ? u(leftW - 2) : u(Math.min(98 - rightX, noThumb ? 26 : 34)),
              textAlign: left ? "right" : "left",
              fontSize: u(F),
              lineHeight: 1.4,
            }}
          >
            <p style={{ color: p.n.tradeoff ? ACCENT : INK, fontWeight: 400 }}>{p.n.tradeoff ? "Trade-off: " : ""}{p.n.body}</p>
          </div>
        );
      })}
    </div>
  );
}

/* Below md the panel would be too small to read, so it falls back to the
   cutout with its notes listed underneath. */
function CalloutStack({ cut, rect, notes }: Callout) {
  return (
    <div>
      <Shot><Crop src={cut} rect={rect} /></Shot>
      <ul className="mt-[20px] space-y-[14px]">
        {notes.map((n) => (
          <li key={n.title}>
            <p className="text-[15px]" style={{ color: n.tradeoff ? ACCENT : INK }}>{n.tradeoff ? "Trade-off: " : ""}{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MAIN = "/prescribble/img/main.png";

const SOLUTIONS: { label: string; head: ReactNode; sub?: string; wide?: boolean; c: Callout }[] = [
  {
    label: "01 · Fixes brand bias and the unavailability loop",
    head: <>Generic names lead, with <K>live pharmacy stock beside each brand</K>, so doctors pick what&rsquo;s available.</>,
    c: {
      screen: MAIN, hl: { x: 0.8, y: 0, w: 0.2, h: 0.31 },
      cut: "/prescribble/img/s-search.png", rect: { x: 0.8, y: 0, w: 0.2, h: 0.31 }, cw: 22,
      notes: [
        { title: "Generic name leads", body: "Generic name first, brand as a grey tag", fy: 0.51, fx: 0.94 },
        { side: "l", title: "Live pharmacy stock", body: "Live stock beside each brand", fy: 0.51 },
      ],
    },
  },
  {
    label: "03 · Only the blocks you need",
    wide: true,
    head: <>Starts with symptoms, diagnosis and treatment, <K>add more only when needed</K>.</>,
    c: {
      screen: MAIN, hl: { x: 0.005, y: 0.205, w: 0.125, h: 0.04 },
      cut: ADDSEC, rect: { x: 0.0, y: 0.115, w: 0.166, h: 0.305 }, cw: 16, noThumb: true,
      notes: [
        { title: "Add Section", body: "One tap opens the extra sections", fy: 0.37 },
        { title: "Extras", body: "Tests, advice, follow-up or referral, only if the visit needs it", fy: 0.75 },
      ],
    },
  },
  {
    label: "04 · Dosage, faster",
    wide: true,
    head: <>Dosage is set in <K>as few as three taps</K>, using the same format doctors already write on paper.</>,
    sub: "Trade-off: presets over free text. Faster and unambiguous, but less flexible for unusual cases, and can take up to six taps.",
    c: {
      screen: "/prescribble/img/s-dose.png", hl: { x: 0.296, y: 0.316, w: 0.408, h: 0.368 },
      cut: "/prescribble/img/s-dose.png", rect: { x: 0.296, y: 0.316, w: 0.408, h: 0.368 }, cw: 60, noThumb: true, centre: true,
      notes: [
        { side: "l", title: "Days", body: "Days snap to\u00A03,\u00A05,\u00A07\u00A0or\u00A014", fy: 0.38, fx: 0.05 },
        { side: "l", title: "Other", body: "Other for\u00A0rare\u00A0cases", fy: 0.75, fx: 0.05 },
        { title: "Frequency", body: "Same 1\u20110\u20111 as paper", fy: 0.25, fx: 0.95 },
        { title: "Meal", body: "Meal timing in one tap", fy: 0.5, fx: 0.95 },
      ],
    },
  },
];

function Decisions() {
  return (
    <Band bg={PAPER} style={{ paddingTop: 0 }}>
      <Blob from="#B5C7E2" to={PAPER} size={940} blur={120} opacity={0.5} style={{ top: 180, left: "-18%" }} />
      <div id="sol-head" />
      <Head size="clamp(28px, min(3.4vw, 5.6vh), 48px)" max="880px" className="mb-[clamp(64px,8vw,120px)] mx-auto w-full">
        Generic names lead, with <K>pharmacy stock integration</K>, so doctors may pick what&rsquo;s available.
      </Head>
      {SOLUTIONS.map(({ label, head, sub, wide, c }, i) => wide ? (
        /* wide rows: headline on top, component full width and centred */
        <RevealIn key={label} className="mt-[clamp(56px,7vw,110px)]">
          {/* left-placed components sit 18% in, so the headline lines up with them */}
          <div style={{ marginLeft: c.noThumb && !c.centre ? "18%" : 0 }}>
            <Head size="clamp(26px,2.8vw,40px)">{head}</Head>
            {sub ? <p className="mt-[16px] text-[16px] leading-[1.55] max-w-[60ch]" style={{ color: ACCENT }}>{sub}</p> : null}
          </div>
          <div className="mt-[clamp(32px,4vw,56px)] hidden md:block"><CalloutPanel {...c} cutId={i < 2 ? `sol${i + 1}-cut` : undefined} /></div>
          <div className="mt-[24px] md:hidden"><CalloutStack {...c} /></div>
        </RevealIn>
      ) : (
        <RevealIn key={label} className="mt-[clamp(56px,7vw,110px)] first:mt-0 grid grid-cols-1 lg:grid-cols-12 gap-[clamp(24px,3vw,48px)] items-center">
          {/* the first solution's headline sits above, in the space under the final build */}
          {/* odd rows flip: component left, headline right */}
          <div className={i === 0 ? "hidden" : i % 2 ? "lg:col-span-3 lg:col-start-10 lg:row-start-1" : "lg:col-span-3"}>
            <Head size="clamp(22px,2.2vw,30px)">{head}</Head>
            {sub ? <p className="mt-[20px] text-[15px] leading-[1.55]" style={{ color: ACCENT }}>{sub}</p> : null}
          </div>
          <div className={i % 2 ? "lg:col-span-9 lg:col-start-1 lg:row-start-1" : "lg:col-span-9 lg:col-start-4"}>
            <div className="hidden md:block"><CalloutPanel {...c} cutId={i < 2 ? `sol${i + 1}-cut` : undefined} /></div>
            <div className="md:hidden"><CalloutStack {...c} /></div>
          </div>
        </RevealIn>
      ))}
    </Band>
  );
}

/* ---------------------------------- flow --------------------------------- */
const FLOW_BG = "#ECF3FD";
const FLOW_STEPS = ["Log in", "Write symptoms", "Write the medicine", "Pick from suggestions", "Add dosage", "Export"];

/* Downloads as soon as the page opens (preload="auto"), but only starts
   playing once it scrolls into view, and pauses again when it leaves, so
   the reader always sees it from the start of the flow. */
function FlowVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => { /* autoplay blocked: controls stay hidden, it just won't move */ });
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src="/prescribble/img/flow.mp4" preload="auto" muted loop playsInline className={className} style={style} />;
}

function Flow() {
  return (
    <>
    {/* same colour as the recording's backdrop, so heading and video read as one surface */}
    <Band bg={FLOW_BG} style={{ paddingBottom: 0 }}>
      <Head>
        One prescription, <K>start to finish</K>.
      </Head>
      <ol className="mt-[24px] flex flex-wrap gap-x-[10px] gap-y-[8px] text-[15px]" style={{ color: SLATE }}>
        {FLOW_STEPS.map((t, i) => (
          <li key={t} className="flex items-center gap-[10px]">
            <span style={{ color: INK }}>{t}</span>
            {i < FLOW_STEPS.length - 1 ? <span aria-hidden style={{ color: ACCENT }}>→</span> : null}
          </li>
        ))}
      </ol>
    </Band>
    {/* full bleed, edge to edge. The recording is 16:9 with black bars baked
        in around a 4:3 screen, so a 4:3 box with object-fit: cover trims them. */}
    {/* backdrop stays full bleed; the video itself is capped so the whole iPad fits in one screen */}
    <div className="w-full" style={{ background: FLOW_BG, paddingBottom: "clamp(32px,4vw,56px)" }}>
      <div className="relative mx-auto overflow-hidden" style={{ aspectRatio: "4 / 3", width: "min(100%, calc(100vh * 4 / 3))" }}>
        <FlowVideo className="absolute inset-0 w-full h-full" style={{ objectFit: "cover", transform: "scale(1.18)" }} />
      </div>
    </div>
    </>
  );
}

/* --------------------------------- live ---------------------------------- */
function LiveDemo() {
  return (
    <Band bg={MIST}>
      <Blob from="#A6BEDE" to={MIST} size={1020} blur={130} opacity={0.58} style={{ top: -240, right: "-14%" }} />
      <Rule label="Try it" index="06" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,4vw,56px)] items-center">
        <div className="lg:col-span-4">
          <Head size="clamp(26px, min(3.4vw, 5.6vh), 50px)">
            <K>Try the live build</K>.
          </Head>
          <Lede>
            The real deployed build, running inside this page.
          </Lede>
          {/* the build is behind auth, so say so before the reader hits it and
              assumes the embed is broken */}
          <p className="mt-[18px] text-[13px] leading-[1.6] font-light" style={{ color: SLATE }}>
            Demo account is filled in. Just press Sign In.
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
      <Rule label="Also in the app" index="07" />
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
const REJECTED: [ReactNode, string][] = [
  [<>Fully typed prescriptions <K>assume a 15&#8209;minute consultation</K>, far too slow for a busy OPD.</>, "Highest legibility and lowest error rate given up for speed."],
  [<>Voice-based systems <K>mishear in noisy clinics</K>, and doctors won&rsquo;t say sensitive details aloud.</>, "Hands-free input given up for reliability and privacy."],
];

function NotTaken() {
  return (
    <Band bg={MIST}>
      <Rule label="Rejected ideas" index="02" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {REJECTED.map(([t, trade], i) => (
          <RevealIn key={i} delay={i * 110} className="rounded-[24px] p-[clamp(28px,3.4vw,44px)]" style={{ background: PAPER }}>
            <h3 className="text-[28px] leading-[1.15] mb-[16px]" style={{ ...tight, color: INK, fontWeight: 300, textWrap: "balance" }}>{t}</h3>
            <p className="text-[16px] leading-[1.6] font-light" style={{ color: SLATE }}>{trade}</p>
          </RevealIn>
        ))}
      </div>
    </Band>
  );
}

/* -------------------------------- measure -------------------------------- */
/* One timed task, three ways of writing the same prescription. Prescribble
   should land near pen on speed and near typing on accuracy. */
const CONDITIONS: { name: string; speed: number; accuracy: number; target?: boolean }[] = [
  { name: "Pen on paper", speed: 0.9, accuracy: 0.25 },
  { name: "Prescribble", speed: 0.78, accuracy: 0.82, target: true },
  { name: "Typed on a computer", speed: 0.3, accuracy: 0.92 },
];

function Bar({ label, v, strong }: { label: string; v: number; strong?: boolean }) {
  return (
    <div className="mt-[14px]">
      <div className="flex justify-between text-[13px]" style={{ color: SLATE }}><span>{label}</span></div>
      <div className="mt-[6px] h-[8px] rounded-full" style={{ background: "rgba(22,24,29,0.07)" }}>
        <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: strong ? ACCENT : "rgba(63,76,107,0.35)" }} />
      </div>
    </div>
  );
}

function Measure() {
  return (
    <Band bg={MIST}>
      <Blob from="#B8C8E3" to={MIST} size={820} blur={120} opacity={0.42} style={{ top: -180, right: "-14%" }} />
      <Rule label="Success signals" index="06" />
      <Head>Success means Prescribble stays <K>closer in completion time to handwritten</K>, but closer to the <K>low error rate and high legibility</K> of a fully typed prescription.</Head>
      <Lede className="max-w-[64ch]">
        A simple time-based task: a doctor (or any person if a doctor isn&rsquo;t available for testing) writes
        the same prescription by pen on paper, with Prescribble, and typed on a computer. n = 3 to 5 at least.
      </Lede>
      <div className="mt-[clamp(48px,7vw,90px)] grid grid-cols-1 md:grid-cols-3 gap-[18px]">
        {CONDITIONS.map((c, i) => (
          <RevealIn key={c.name} delay={i * 90} className="rounded-[24px] p-[clamp(24px,3vw,36px)]" style={{ background: PAPER, border: c.target ? `1.5px solid ${ACCENT}` : `1px solid ${LINE}` }}>
            <p className="text-[13px] font-medium" style={{ color: c.target ? ACCENT : SLATE }}>{c.target ? "Target" : "Baseline"}</p>
            <h3 style={{ ...tight, color: INK, fontWeight: 400 }} className="mt-[10px] text-[24px] leading-[1.15]">{c.name}</h3>
            <Bar label="Speed" v={c.speed} strong={c.target} />
            <Bar label="Accuracy and legibility" v={c.accuracy} strong={c.target} />
          </RevealIn>
        ))}
      </div>
      <p className="mt-[24px] text-[14px]" style={{ color: SLATE }}>
        Bars show the expected outcome, not results. The test hasn&rsquo;t been run yet.
      </p>
    </Band>
  );
}

/* --------------------------------- craft --------------------------------- */
const WIREFRAMES: [string, string, string][] = [
  ["/prescribble/img/wf-1.png", "Zoning", "Four regions: menu, patient, canvas, suggestions."],
  ["/prescribble/img/wf-2.png", "Structure", "Real content in every block."],
  ["/prescribble/img/main.png", "Final build", "The live build, ready for doctors to try."],
];

function Craft() {
  return (
    <Band bg={PAPER}>
      <Blob from={CLAY} to={PAPER} size={760} blur={120} opacity={0.45} style={{ top: -160, right: "-10%" }} />
      <Rule label="How I got there" index="04" />
      <Head>After zoning in lo-fi, an LLM was used to <K>create a build to test with stylus and tablet</K>.</Head>
      <Lede>
        No formal testing with doctors yet.
      </Lede>
      <div className="mt-[clamp(48px,7vw,88px)] mx-auto max-w-[880px] grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[36px]">
        {/* two wireframes side by side, the final build under them at the
            same combined width; capped so the build fits on one screen */}
        {WIREFRAMES.map(([src, title, body], i) => (
          <RevealIn key={src} delay={i * 110} className={i === 2 ? "md:col-span-2" : ""}>
            <div id={i === 2 ? "craft-main" : undefined} className="relative">
              <Shot><img src={src} alt={title} className="w-full block" /></Shot>
            </div>
            <p className="mt-[16px] text-[13px] font-medium" style={{ color: ACCENT }}>0{i + 1} · {title}</p>
            <p className="mt-[6px] text-[15px] leading-[1.6] font-light" style={{ color: SLATE }}>{body}</p>
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
        <Rule label="Information architecture" index="07" tone="#fff" />
        <Head tone="rgba(255,255,255,0.88)">
          Everything is <K>one tap from the writing canvas</K>.
        </Head>
        <Lede tone="rgba(255,255,255,0.58)">
          Menu, writing canvas and suggestions, all on one screen.
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
            <Head tone="rgba(255,255,255,0.9)" size="clamp(30px,min(3.6vw,5.6vh),54px)">
              Pharmacist and patient <K>can both read it</K>.
            </Head>
            <Lede tone="rgba(255,255,255,0.58)">
              Composition, dose, frequency and signature, all typed out clearly.
            </Lede>
            <a
              href={LIVE} target="_blank" rel="noreferrer"
              className="mt-[32px] inline-flex items-center gap-[8px] rounded-full px-[26px] py-[14px] text-[15px] font-medium"
              style={{ background: "#fff", color: INK }}
            >
              Try the live build →
            </a>
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
          {/* replaces the top bar: back to the portfolio chat, resuming the conversation */}
          <a
            href="/"
            onClick={() => { try { sessionStorage.setItem(RESUME_KEY, "1"); } catch { /* storage blocked */ } }}
            style={{ color: "#fff" }}
            className="font-medium"
          >
            View more work →
          </a>
        </div>
      </RevealIn>
    </section>
  );
}

/* Joins the final build in "How I got there" to the first solution's
   component below it. The two live in different sections, so their
   positions are measured and the path redrawn whenever the page reflows. */
function BuildConnector() {
  const ref = useRef<SVGSVGElement>(null);
  const [d, setD] = useState<string[]>([]);
  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const measure = () => {
      const a = document.getElementById("craft-main");
      const b = document.getElementById("sol1-cut");
      const c2 = document.getElementById("sol2-cut");
      const host = svg.parentElement;
      if (!a || !b || !host || b.offsetParent === null) return setD([]);
      const out: string[] = [];
      /* offset chains, not bounding rects: the scroll-reveal transforms
         would otherwise shift whatever was mid-animation when measured */
      const pos = (el: HTMLElement) => {
        let x = 0, y = 0, n: HTMLElement | null = el;
        while (n && n !== host) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
      };
      const pa = pos(a), pb = pos(b);
      const x1 = pa.x + pa.w - 24, y1 = pa.y + pa.h + 6;
      /* straight down, then one turn into the component's right side,
         level with its title */
      const x2 = pb.x + pb.w + 12, ty = pb.y + 44, r = 14;
      if (x1 > x2 + r) {
        out.push(`M ${x1} ${y1} V ${ty - r} Q ${x1} ${ty} ${x1 - r} ${ty} H ${x2}`);
      } else {
        const cx = pb.x + pb.w / 2, y2 = pb.y - 12, my = y2 - 48, sx = Math.sign(cx - x1) || 1;
        out.push(`M ${x1} ${y1} V ${my - r} Q ${x1} ${my} ${x1 + sx * r} ${my} H ${cx - sx * r} Q ${cx} ${my} ${cx} ${my + r} V ${y2}`);
      }
      /* second line: out of the build's left side, down the page margin so
         it clears every heading, then right into the Add Section component */
      if (c2 && c2.offsetParent !== null) {
        const pc = pos(c2);
        // stay left of the text column, so the line never crosses a heading
        const hd = document.getElementById("sol-head");
        const colX = hd ? pos(hd).x : pa.x;
        const gx = Math.max(8, Math.min(pa.x, colX) - 28);
        const sy = pa.y + pa.h * 0.3, ty2 = pc.y + pc.h * 0.62, x3 = pc.x - 12;
        out.push(`M ${pa.x - 6} ${sy} H ${gx + r} Q ${gx} ${sy} ${gx} ${sy + r} V ${ty2 - r} Q ${gx} ${ty2} ${gx + r} ${ty2} H ${x3}`);
      }
      setD(out);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return (
    <svg ref={ref} className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 5 }} aria-hidden>
      {d.length ? (
        <>
          <defs>
            <marker id="bc-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="5" fill={ACCENT} />
            </marker>
          </defs>
          {d.map((p) => (
            <path key={p} d={p} fill="none" stroke={ACCENT} strokeOpacity={0.6} strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#bc-head)" />
          ))}
        </>
      ) : null}
    </svg>
  );
}

export default function CaseStudyV3() {
  return (
    <main className="w-full relative" style={{ background: PAPER }}>
      <BuildConnector />
      <Hero />
      <Context />
      <Loop />
      <BrandBias />
      <NotTaken />
      <Reveal />
      <Craft />
      <Decisions />
      <Flow />
      <Measure />
      <Close />
    </main>
  );
}
