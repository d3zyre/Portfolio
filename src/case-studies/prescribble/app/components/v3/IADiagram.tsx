import { CSSProperties } from "react";

/* ---------------------------------------------------------------------------
   Information architecture, drawn natively so it sits in the same visual
   language as the rest of the page: Inter, muted palette, glass surfaces.

   Laid out on a 1280 x 1190 grid and scaled by the container, so it stays
   crisp at any width. Type scales with container query units.
--------------------------------------------------------------------------- */

const W = 1280;
const H = 1190;

const pc = (v: number, total: number) => `${(v / total) * 100}%`;
const fs = (px: number) => `${((px / W) * 100).toFixed(3)}cqw`;

/* Polyline → path with rounded elbows. */
function rounded(pts: [number, number][], r = 14) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const sx = cx - ((cx - px) / d1) * rr;
    const sy = cy - ((cy - py) / d1) * rr;
    const ex = cx + ((nx - cx) / d2) * rr;
    const ey = cy + ((ny - cy) / d2) * rr;
    d += ` L${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}

/* Closed diamond with softened points. */
function diamond(cx: number, cy: number, hw: number, hh: number, r = 20) {
  const pts: [number, number][] = [
    [cx - hw, cy], [cx, cy - hh], [cx + hw, cy], [cx, cy + hh],
  ];
  let d = "";
  for (let i = 0; i < 4; i++) {
    const prev = pts[(i + 3) % 4];
    const cur = pts[i];
    const next = pts[(i + 1) % 4];
    const d1 = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    const d2 = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const sx = cur[0] - ((cur[0] - prev[0]) / d1) * rr;
    const sy = cur[1] - ((cur[1] - prev[1]) / d1) * rr;
    const ex = cur[0] + ((next[0] - cur[0]) / d2) * rr;
    const ey = cur[1] + ((next[1] - cur[1]) / d2) * rr;
    d += `${i === 0 ? `M${sx},${sy}` : ` L${sx},${sy}`} Q${cur[0]},${cur[1]} ${ex},${ey}`;
  }
  return `${d} Z`;
}

const D1 = { cx: 880, cy: 500, hw: 72, hh: 62 };
const D2 = { cx: 880, cy: 900, hw: 80, hh: 64 };

type Node = {
  x: number; y: number; w: number; h: number;
  label: string;
  items?: string[];
  kind?: "pill" | "box" | "card" | "diamond";
  accent?: boolean;
};

const NODES: Node[] = [
  { x: 70,  y: 20,  w: 180, h: 44,  label: "Login Page", kind: "pill", accent: true },

  { x: 60,  y: 130, w: 190, h: 44,  label: "Menu" },
  { x: 330, y: 130, w: 250, h: 44,  label: "Prescription Workspace" },
  { x: 650, y: 130, w: 300, h: 44,  label: "Drug / test Search Suggestions Panel" },

  { x: 104, y: 250, w: 202, h: 44,  label: "My Profile" },
  { x: 104, y: 326, w: 202, h: 44,  label: "Schedule" },
  { x: 104, y: 402, w: 202, h: 48,  label: "Patient Queue / Dashboard" },
  { x: 104, y: 480, w: 202, h: 44,  label: "Add Section" },
  { x: 104, y: 556, w: 202, h: 44,  label: "Settings" },
  { x: 104, y: 632, w: 202, h: 44,  label: "Logout" },

  { x: 104, y: 712, w: 202, h: 44,  label: "Tests" },
  { x: 104, y: 782, w: 202, h: 44,  label: "Advice" },
  { x: 104, y: 852, w: 202, h: 44,  label: "Follow Up" },
  { x: 104, y: 922, w: 202, h: 44,  label: "Referral" },

  { x: 380, y: 250, w: 250, h: 130, label: "Patient Header", kind: "card",
    items: ["Name", "DOB → Age", "Gender", "Previous prescriptions"] },
  { x: 380, y: 430, w: 250, h: 140, label: "Writing Canvas", kind: "card",
    items: ["Symptoms", "Diagnosis", "Prescription", "Menu (Add Section)"] },

  { x: 726, y: 250, w: 258, h: 44,  label: "Start Typing on Workspace" },
  { x: 726, y: 326, w: 258, h: 44,  label: "Search for Medicine" },

  { x: D1.cx - D1.hw, y: D1.cy - D1.hh, w: D1.hw * 2, h: D1.hh * 2, label: "Medicine\nselected?", kind: "diamond" },
  { x: 1040, y: 478, w: 190, h: 44, label: "Continue Typing" },
  { x: 766, y: 726, w: 228, h: 68,  label: "Dosage Popup", items: ["Dose / Frequency / Duration"] },
  { x: D2.cx - D2.hw, y: D2.cy - D2.hh, w: D2.hw * 2, h: D2.hh * 2, label: "Prescription\ncomplete?", kind: "diamond" },
  { x: 762, y: 1010, w: 236, h: 44, label: "Prescription Preview" },
  { x: 760, y: 1100, w: 240, h: 52, label: "Export Options", items: ["PDF / Print"], kind: "pill", accent: true },
];

/* `a: false` = trunk or bus segment, which gets no arrowhead. */
const EDGES: { p: [number, number][]; a?: boolean }[] = [
  { p: [[160, 64], [160, 100]], a: false },
  { p: [[155, 100], [800, 100]], a: false },
  { p: [[155, 100], [155, 130]] },
  { p: [[455, 100], [455, 130]] },
  { p: [[800, 100], [800, 130]] },

  { p: [[155, 174], [155, 190], [78, 190], [78, 654]], a: false },
  { p: [[78, 272], [104, 272]] }, { p: [[78, 348], [104, 348]] }, { p: [[78, 426], [104, 426]] },
  { p: [[78, 502], [104, 502]] }, { p: [[78, 578], [104, 578]] }, { p: [[78, 654], [104, 654]] },

  { p: [[306, 502], [344, 502], [344, 944]], a: false },
  { p: [[344, 734], [306, 734]] }, { p: [[344, 804], [306, 804]] },
  { p: [[344, 874], [306, 874]] }, { p: [[344, 944], [306, 944]] },

  { p: [[455, 174], [455, 210], [344, 210], [344, 470]], a: false },
  { p: [[344, 315], [380, 315]] }, { p: [[344, 470], [380, 470]] },

  { p: [[306, 426], [370, 426], [370, 545], [380, 545]] },

  { p: [[800, 174], [800, 210], [700, 210], [700, 348]], a: false },
  { p: [[700, 272], [726, 272]] }, { p: [[700, 348], [726, 348]] },

  { p: [[984, 348], [1040, 348], [1040, 400]], a: false },
  { p: [[984, 272], [1040, 272], [1040, 400], [880, 400], [880, D1.cy - D1.hh]] },

  { p: [[630, 500], [D1.cx - D1.hw, 500]] },

  { p: [[D1.cx + D1.hw, 500], [1040, 500]] },
  { p: [[1230, 500], [1256, 500], [1256, 400], [1040, 400]] },

  { p: [[880, D1.cy + D1.hh], [880, 726]] },

  { p: [[880, 794], [880, D2.cy - D2.hh]] },
  { p: [[D2.cx - D2.hw, 900], [700, 900], [700, 555], [630, 555]] },
  { p: [[880, D2.cy + D2.hh], [880, 1010]] },
  { p: [[880, 1054], [880, 1100]] },
];

const LABELS: { x: number; y: number; t: string }[] = [
  { x: 988, y: 490, t: "NO" },
  { x: 893, y: 654, t: "YES" },
  { x: 706, y: 892, t: "NO" },
  { x: 893, y: 994, t: "YES" },
];

function NodeBox({ n }: { n: Node }) {
  const base: CSSProperties = {
    position: "absolute",
    left: pc(n.x, W),
    top: pc(n.y, H),
    width: pc(n.w, W),
    height: pc(n.h, H),
    boxSizing: "border-box",
  };

  /* the diamond outline is drawn in the SVG layer: this is only its label */
  if (n.kind === "diamond") {
    return (
      <div style={{ ...base, display: "grid", placeItems: "center" }}>
        <span
          style={{
            fontSize: fs(14),
            lineHeight: 1.3,
            color: "rgba(255,255,255,0.88)",
            textAlign: "center",
            fontWeight: 400,
            whiteSpace: "pre-line",
            maxWidth: "84%",
          }}
        >
          {n.label}
        </span>
      </div>
    );
  }

  const accent = n.accent === true;
  return (
    <div
      style={{
        ...base,
        borderRadius: n.kind === "pill" ? 999 : 10,
        background: accent
          ? "linear-gradient(140deg, rgba(147,167,196,0.34), rgba(147,167,196,0.18))"
          : "rgba(255,255,255,0.07)",
        border: `1px solid ${accent ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.14)"}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: n.items && n.kind === "card" ? "flex-start" : "center",
        textAlign: n.items && n.kind === "card" ? "left" : "center",
        padding: n.kind === "card" ? "3% 6%" : "0 3%",
        gap: "3%",
      }}
    >
      <span
        style={{
          fontSize: fs(14),
          lineHeight: 1.25,
          color: "#fff",
          fontWeight: n.kind === "card" ? 500 : 400,
          whiteSpace: "nowrap",
        }}
      >
        {n.label}
      </span>
      {n.items ? (
        <span style={{ fontSize: fs(12), lineHeight: 1.5, color: "rgba(255,255,255,0.58)", fontWeight: 300 }}>
          {n.items.map((it) => (
            <span key={it} style={{ display: "block" }}>
              {n.kind === "card" ? "· " : ""}
              {it}
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}

export default function IADiagram() {
  return (
    <div
      style={{
        containerType: "inline-size",
        position: "relative",
        width: "100%",
        aspectRatio: `${W} / ${H}`,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        aria-hidden
      >
        <defs>
          <marker id="ia-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,1.5 L8.5,5 L0,8.5 z" fill="rgba(255,255,255,0.45)" />
          </marker>
        </defs>

        {[D1, D2].map((d, i) => (
          <path
            key={`d${i}`}
            d={diamond(d.cx, d.cy, d.hw, d.hh)}
            fill="rgba(147,167,196,0.15)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
        ))}

        {EDGES.map((e, i) => (
          <path
            key={i}
            d={rounded(e.p)}
            fill="none"
            stroke="rgba(255,255,255,0.30)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={e.a === false ? undefined : "url(#ia-arrow)"}
          />
        ))}

        {LABELS.map((l) => (
          <text
            key={`${l.t}-${l.x}-${l.y}`}
            x={l.x}
            y={l.y}
            fill="rgba(255,255,255,0.5)"
            fontSize={13}
            fontFamily="Inter, sans-serif"
            fontWeight={500}
          >
            {l.t}
          </text>
        ))}
      </svg>

      {NODES.map((n) => (
        <NodeBox key={`${n.label}-${n.x}-${n.y}`} n={n} />
      ))}
    </div>
  );
}
