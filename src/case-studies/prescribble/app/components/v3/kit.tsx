import { ReactNode, CSSProperties, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   Prescribble case study: v2 kit.
   One typeface (Inter, same as the product). Muted palette, soft gradients,
   organic shapes, glass surfaces. Headlines are light with the load-bearing
   words weighted, never the two-tone light/dark split.
--------------------------------------------------------------------------- */

export const INK = "#16181D";
export const PAPER = "#F7F6F4";
export const MIST = "#E9E9E6";
export const SLATE = "#767B87";
export const LINE = "rgba(22,24,29,0.10)";
export const ACCENT = "#3F4C6B";
export const DUSK = "#93A7C4";
export const CLAY = "#CBB49C";
export const DEEP = "#15181F";

export const tight: CSSProperties = { letterSpacing: "-0.028em" };

/* Deterministic pseudo-random seed from a string, so each Blob/Glass/Bezel
   instance gets its own drift timing without needing to pass extra props or
   use real randomness (which would reshuffle on every render). */
function seed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ---------------------------------------------------------------------------
   Scroll reveal: a section (or a card inside one) fades and rises a touch the
   first time it crosses into view. Fires once, then leaves the element alone.
--------------------------------------------------------------------------- */
function useInView(threshold = 0.16) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function RevealIn({
  children,
  delay = 0,
  className = "",
  style,
  threshold = 0.16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}) {
  const [ref, inView] = useInView(threshold);
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Cursor parallax + glow, for the dark bands. A single rAF loop per section
   eases a current position toward wherever the cursor last was (rather than
   snapping to it every mousemove), so nothing jumps or looks laggy even if
   mousemove events arrive unevenly. Drives three things through refs, no
   re-render: a soft light that tracks the cursor, a very small shift on the
   blob layer underneath it, and a gentle float on the hero device. */
export function useCursorField(floatAmount = 12) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const target = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const EASE = 0.1;

    function loop() {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * EASE;
      c.y += (t.y - c.y) * EASE;

      glowRef.current?.style.setProperty("--mx", `${(c.x * 100).toFixed(2)}%`);
      glowRef.current?.style.setProperty("--my", `${(c.y * 100).toFixed(2)}%`);
      if (parallaxRef.current) {
        const dx = (c.x - 0.5) * 30;
        const dy = (c.y - 0.5) * 22;
        parallaxRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      }
      if (tiltRef.current) {
        const dx = (c.x - 0.5) * floatAmount;
        const dy = (c.y - 0.5) * (floatAmount * 0.7);
        tiltRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      }

      const settled = Math.abs(t.x - c.x) < 0.0006 && Math.abs(t.y - c.y) < 0.0006;
      frame.current = settled ? null : requestAnimationFrame(loop);
    }
    function kick() {
      if (frame.current == null) frame.current = requestAnimationFrame(loop);
    }
    function onMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      kick();
    }
    function onLeave() {
      target.current = { x: 0.5, y: 0.5 };
      kick();
    }
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [floatAmount]);

  return { sectionRef, glowRef, parallaxRef, tiltRef };
}

export function CursorGlow({ glowRef }: { glowRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={glowRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(620px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.075), transparent 58%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* Emphasis inside a light headline. This is the skim layer: only the words
   that carry the argument get weight. */
export function K({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 600, color: "inherit" }}>{children}</span>;
}

export function Head({
  children,
  tone = INK,
  size = "clamp(30px, min(4.6vw, 7.4vh), 68px)",
  className = "",
  max = "20ch",
}: {
  children: ReactNode;
  tone?: string;
  size?: string;
  className?: string;
  max?: string;
}) {
  return (
    <h2
      style={{ ...tight, fontSize: size, lineHeight: 1.04, color: tone, fontWeight: 200, maxWidth: max }}
      className={className}
    >
      {children}
    </h2>
  );
}

export function Label({ children, tone = SLATE }: { children: ReactNode; tone?: string }) {
  return (
    <p style={{ letterSpacing: "0.02em", color: tone, fontWeight: 500 }} className="text-[13px] mb-[20px]">
      {children}
    </p>
  );
}

export function Lede({ children, tone = SLATE, className = "" }: { children: ReactNode; tone?: string; className?: string }) {
  return (
    <p className={`mt-[28px] max-w-[52ch] text-[17px] leading-[1.68] font-light ${className}`} style={{ color: tone }}>
      {children}
    </p>
  );
}

/* Section rule: small label left, index right. No mono. */
export function Rule({ label, index, tone = INK }: { label: string; index: string; tone?: string }) {
  const dim = tone === INK ? SLATE : "rgba(255,255,255,0.45)";
  const labelColor = tone === INK ? ACCENT : DUSK;
  return (
    <div
      className="flex items-baseline justify-between border-t pt-[14px] mb-[52px]"
      style={{ borderColor: tone === INK ? LINE : "rgba(255,255,255,0.14)" }}
    >
      <span
        className="text-[12px] font-bold uppercase"
        style={{ color: labelColor, letterSpacing: "0.07em" }}
      >
        {label}
      </span>
      <span className="text-[12px] font-light tabular-nums" style={{ color: dim }}>{index}</span>
    </div>
  );
}

/* Organic blurred shape. Sits behind content to give bands depth. */
export function Blob({
  from,
  to,
  size = 720,
  blur = 90,
  opacity = 0.5,
  style,
}: {
  from: string;
  to: string;
  size?: number;
  blur?: number;
  opacity?: number;
  style?: CSSProperties;
}) {
  const sd = seed(`${from}|${to}|${size}|${blur}|${opacity}`);
  const bx = 26 + (sd % 20);           // 26-45px
  const by = 18 + ((sd >> 4) % 16);    // 18-33px
  const bdur = 12 + (sd % 10);         // 12-21s
  const bdelay = -((sd >> 8) % bdur);  // desync the starting phase

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none motion-blob"
      style={{
        width: size,
        height: size * 0.82,
        background: `linear-gradient(140deg, ${from}, ${to})`,
        borderRadius: "62% 38% 48% 52% / 55% 46% 54% 45%",
        filter: `blur(${blur}px)`,
        opacity,
        zIndex: -1,
        ["--bx" as string]: `${bx}px`,
        ["--by" as string]: `${-by}px`,
        ["--bdur" as string]: `${bdur}s`,
        ["--bdelay" as string]: `${bdelay}s`,
        ...style,
      } as CSSProperties}
    />
  );
}

/* Glass surface. Light and dark variants. */
let glassCount = 0;

export function Glass({
  children,
  dark = false,
  className = "",
  style,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const idx = glassCount++;
  const sdur = 9 + (idx % 3) * 3;    // 9 / 12 / 15s
  const sdelay = -(idx * 3);
  const shdur = 5.5 + (idx % 3) * 1.5;  // 5.5 / 7 / 8.5s
  const shdelay = -(idx * 2);

  return (
    <div
      className={`${className} motion-sheen motion-shine`}
      style={{
        position: "relative",
        overflow: "hidden",
        background: dark
          ? "linear-gradient(150deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))"
          : "linear-gradient(150deg, rgba(255,255,255,0.86), rgba(255,255,255,0.48))",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.9)"}`,
        borderRadius: 24,
        boxShadow: dark
          ? "0 24px 60px -30px rgba(0,0,0,0.6)"
          : "0 20px 50px -30px rgba(40,52,78,0.30), inset 0 1px 0 rgba(255,255,255,0.9)",
        ["--sdur" as string]: `${sdur}s`,
        ["--sdelay" as string]: `${sdelay}s`,
        ["--shdur" as string]: `${shdur}s`,
        ["--shdelay" as string]: `${shdelay}s`,
        ...style,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* Real 12.9" iPad Pro bezel. The PNG has a transparent cutout measured at
   left 4.179% / top 5.172% / 91.643% x 89.655%, exactly 4:3. */
const CUT = { left: "4.179%", top: "5.172%", width: "91.643%", height: "89.655%" };

let bezelCount = 0;

export function Bezel({
  src,
  alt = "",
  children,
  className = "",
  style,
  glow = true,
}: {
  src?: string;
  alt?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: boolean;
}) {
  const idx = bezelCount++;
  const shdur = 6 + (idx % 3) * 1.5;  // 6 / 7.5 / 9s
  const shdelay = -(idx * 2.5);

  return (
    <div className={`relative ${className}`} style={style}>
      <div
        className="overflow-hidden motion-shine"
        style={{
          ...CUT,
          position: "absolute",
          borderRadius: "1.1%",
          background: "#000",
          ["--shdur" as string]: `${shdur}s`,
          ["--shdelay" as string]: `${shdelay}s`,
        } as CSSProperties}
      >
        {children ?? <img src={src} alt={alt} className="w-full h-full object-cover" />}
      </div>
      <img
        src="/prescribble/img/bezel.png"
        alt=""
        aria-hidden
        className="relative block w-full pointer-events-none select-none"
        style={glow ? { filter: "drop-shadow(0 60px 80px rgba(20,24,40,0.38))" } : undefined}
      />
    </div>
  );
}

export function Band({
  children,
  bg = PAPER,
  pad = "clamp(72px, 9vw, 140px)",
  className = "",
  style,
}: {
  children: ReactNode;
  bg?: string;
  pad?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={`w-full relative overflow-hidden ${className}`}
      style={{ background: bg, paddingTop: pad, paddingBottom: pad, isolation: "isolate", ...style }}
    >
      <RevealIn className="relative mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,120px)]">
        {children}
      </RevealIn>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Showcase: the tilted, bleeding, bottom-dissolving device treatment.
   Works with any child (a <Bezel> composite or a cut-out <img>) because
   bezel.png is transparent on all four sides as well as through the screen.

   `fade` must match the band colour behind it. The scrim is a real gradient
   div, not a CSS mask, since Safari ignores masks on filtered elements.
--------------------------------------------------------------------------- */
export function Showcase({
  children,
  height = "clamp(300px, min(34vw, 50vh), 480px)",
  width = "175%",
  top = "-10%",
  left = "0%",
  rot = -4.5,
  fade = DEEP,
  fadeFrom = 34,
  fadeLen = 300,
  className = "",
}: {
  children: ReactNode;
  height?: string;
  width?: string;
  top?: string;
  left?: string;
  rot?: number;
  fade?: string;
  fadeFrom?: number;
  fadeLen?: number;
  className?: string;
}) {
  const rgb = hexToRgb(fade);
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          transform: `rotate(${rot}deg)`,
          transformOrigin: "top left",
          zIndex: 0,
        }}
      >
        {children}
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-100vw",
          right: "-100vw",
          top: `${fadeFrom}%`,
          bottom: "-640px",
          pointerEvents: "none",
          zIndex: 1,
          transform: "translateZ(0)",
          background: `linear-gradient(to bottom, ${rgb}0) 0px, ${rgb}0.55) ${Math.round(fadeLen * 0.32)}px, ${rgb}0.9) ${Math.round(fadeLen * 0.64)}px, ${fade} ${fadeLen}px)`,
        }}
      />
    </div>
  );
}

/* "#16181D" → "rgba(22,24,29," so gradient stops can append their own alpha */
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},`;
}

/* A melt between two bands, so dark and light never meet on a hard line.
   Two stacked gradients (a long linear ramp plus a soft radial bloom)
   so it reads as glass rather than a flat fade. */
export function Seam({
  from,
  to,
  h = "clamp(90px, 11vw, 180px)",
  glow,
}: {
  from: string;
  to: string;
  h?: string;
  glow?: string;
}) {
  return (
    <div
      aria-hidden
      style={{
        height: h,
        background: [
          glow ? `radial-gradient(120% 140% at 50% 0%, ${glow} 0%, transparent 62%)` : null,
          `linear-gradient(to bottom, ${from} 0%, ${mix(from, to, 0.5)} 52%, ${to} 100%)`,
        ].filter(Boolean).join(", "),
      }}
    />
  );
}

/* midpoint of two hex colours, so the ramp bends instead of running linear */
function mix(a: string, b: string, t: number) {
  const p = (h: string) => {
    const s = h.replace("#", "");
    const n = parseInt(s.length === 3 ? s.split("").map((c) => c + c).join("") : s, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(r1, r2)},${c(g1, g2)},${c(b1, b2)})`;
}
