import { useState } from "react";

/* ---------------------------------------------------------------------------
   A working replica of the product's dosage sheet, rebuilt for the case study
   so the reader can feel the two decisions that matter: duration snapping to
   the numbers doctors actually write, and 0-0-0 frequency notation.

   This is a copy for the page. The deployed app is untouched.
--------------------------------------------------------------------------- */

const DAYS = [1, 2, 3, 5, 7, 10, 14, 21, 28, 30, 60];
const SLOTS = ["Morning", "Afternoon", "Night"] as const;

export default function DosageModal() {
  const [dayIdx, setDayIdx] = useState(4); // 7 days
  const [freq, setFreq] = useState<boolean[]>([true, false, true]);
  const [meal, setMeal] = useState<"before" | "after">("after");
  const [empty, setEmpty] = useState(false);

  const days = DAYS[dayIdx];
  const notation = freq.map((f) => (f ? 1 : 0)).join("-");
  const mealLocked = empty;   // an empty-stomach dose has no meal relation
  const doses = freq.filter(Boolean).length * days;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 30px 70px -30px rgba(20,24,40,0.45)",
        border: "1px solid rgba(22,24,29,0.08)",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* header */}
      <div style={{ padding: "26px 28px 20px" }}>
        <p style={{ fontSize: 20, fontWeight: 600, color: "#0D1B2A", letterSpacing: "-0.01em" }}>
          Clotrimazole 1% Cream
        </p>
        <p style={{ fontSize: 14, color: "#8A8F9C", marginTop: 4 }}>Candid · 1%</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #EEF0F3" }}>
        {/* duration */}
        <div style={{ padding: "26px 28px", borderRight: "1px solid #EEF0F3", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <span
              style={{
                display: "inline-block",
                minWidth: 54,
                padding: "8px 14px",
                borderRadius: 10,
                background: "#1A73E8",
                color: "#fff",
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              {days}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={DAYS.length - 1}
            step={1}
            value={dayIdx}
            onChange={(e) => setDayIdx(+e.target.value)}
            aria-label="Number of days"
            style={{ width: "100%", accentColor: "#1A73E8", cursor: "pointer" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setDayIdx(i)}
                style={{
                  background: "none",
                  border: 0,
                  padding: "2px 1px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "inherit",
                  color: i === dayIdx ? "#1A73E8" : "#AAAFBA",
                  fontWeight: i === dayIdx ? 600 : 400,
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: 15, color: "#0D1B2A", marginTop: 14, fontWeight: 500 }}>
            No. of Days
          </p>
        </div>

        {/* frequency + meal */}
        <div style={{ padding: "26px 28px" }}>
          <p style={{ fontSize: 14, color: "#6D7280", marginBottom: 14 }}>Frequency</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            {SLOTS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "0 0 auto" }}>
                <button
                  onClick={() => setFreq((f) => f.map((v, j) => (j === i ? !v : v)))}
                  aria-pressed={freq[i]}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    background: "none", border: 0, cursor: "pointer", fontFamily: "inherit", padding: 0,
                  }}
                >
                  <span
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      border: `2px solid ${freq[i] ? "#1A73E8" : "#C9CDD6"}`,
                      background: freq[i] ? "#1A73E8" : "transparent",
                      display: "block",
                    }}
                  />
                  <span style={{ fontSize: 12, color: freq[i] ? "#0D1B2A" : "#8A8F9C" }}>{s}</span>
                </button>
                {i < 2 ? <span style={{ flex: 1, height: 1, background: "#DDE1E8", margin: "0 8px", marginBottom: 18 }} /> : null}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: mealLocked ? "#B4B8C2" : "#6D7280", marginBottom: 10 }}>Meal Timing</p>
          <div style={{ display: "inline-flex", background: "#F1F3F6", borderRadius: 999, padding: 4, marginBottom: 18, opacity: mealLocked ? 0.55 : 1 }}>
            {(["before", "after"] as const).map((m) => (
              <button
                key={m}
                onClick={() => !mealLocked && setMeal(m)}
                disabled={mealLocked}
                aria-disabled={mealLocked}
                style={{
                  padding: "8px 18px", borderRadius: 999, border: 0,
                  cursor: mealLocked ? "not-allowed" : "pointer",
                  fontFamily: "inherit", fontSize: 14,
                  background: !mealLocked && meal === m ? "#fff" : "transparent",
                  color: mealLocked ? "#B4B8C2" : meal === m ? "#0D1B2A" : "#8A8F9C",
                  fontWeight: !mealLocked && meal === m ? 600 : 400,
                  boxShadow: !mealLocked && meal === m ? "0 1px 3px rgba(20,24,40,0.14)" : "none",
                  transition: "color .15s, background .15s",
                }}
              >
                {m === "before" ? "Before Meal" : "After Meal"}
              </button>
            ))}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 15, color: "#0D1B2A" }}>
            <input
              type="checkbox"
              checked={empty}
              onChange={(e) => setEmpty(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#1A73E8", cursor: "pointer" }}
            />
            Empty Stomach
          </label>
        </div>
      </div>

      {/* footer: reads back what the doctor just built */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, padding: "14px 28px", borderTop: "1px solid #EEF0F3", background: "#FAFBFC",
          flexWrap: "nowrap", minHeight: 68,
        }}
      >
        <p style={{ fontSize: 13, color: "#6D7280", whiteSpace: "nowrap", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
          <span style={{ fontWeight: 600, color: "#0D1B2A", fontVariantNumeric: "tabular-nums" }}>{notation}</span>
          {" · "}{days} day{days === 1 ? "" : "s"}
          {" · "}{empty ? "empty stomach" : meal === "after" ? "after meal" : "before meal"}
          {" · "}{doses} dose{doses === 1 ? "" : "s"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button style={{ background: "none", border: 0, fontFamily: "inherit", fontSize: 14, color: "#6D7280", cursor: "pointer", padding: "10px 12px" }}>
            Cancel
          </button>
          <button
            disabled={doses === 0}
            style={{
              fontFamily: "inherit", fontSize: 14, fontWeight: 500,
              padding: "11px 20px", borderRadius: 10, border: 0,
              cursor: doses === 0 ? "not-allowed" : "pointer",
              background: doses === 0 ? "#E7EAEF" : "#1A73E8",
              color: doses === 0 ? "#AAAFBA" : "#fff",
            }}
          >
            Add to Treatment
          </button>
        </div>
      </div>
    </div>
  );
}
