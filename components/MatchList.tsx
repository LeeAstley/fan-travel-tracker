"use client";

import { Match } from "@/lib/types";

const COMP_COLORS: Record<string, string> = {
  "Premier League":   "#ef4444",
  "Championship":     "#f97316",
  "FA Cup":           "#10b981",
  "EFL Cup":          "#f59e0b",
  "Champions League": "#3b82f6",
  "Europa League":    "#f97316",
  "Conference League":"#8b5cf6",
};

const COMP_ICONS: Record<string, string> = {
  "Premier League":   "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Championship":     "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "FA Cup":           "🎩",
  "EFL Cup":          "🏆",
  "Champions League": "⭐",
  "Europa League":    "🟠",
  "Conference League":"🟣",
};

function compColor(c: string) { return COMP_COLORS[c] ?? "#6060a0"; }
function compIcon(c: string)  { return COMP_ICONS[c] ?? "⚽"; }

interface Props {
  matches: Match[];
  onToggleAttended: (id: number) => void;
  filter: string;
  showHome: boolean;
}

export default function MatchList({ matches, onToggleAttended, filter, showHome }: Props) {
  const filtered = matches.filter((m) => {
    if (filter !== "All" && m.competition !== filter) return false;
    if (!showHome && m.isHome) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#50507a", fontSize: 14 }}>
        No matches found for this filter.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {filtered.map((m) => {
        const color = compColor(m.competition);
        const date = new Date(m.date);
        const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        const isFinished = m.status === "FINISHED";
        const rt = m.milesOneWay * 2;
        const opponent = m.isHome ? m.awayTeam : m.homeTeam;

        return (
          <div
            key={m.id}
            style={{
              background: m.attended ? "#0f0f18" : "#0a0a10",
              border: `1px solid ${m.attended ? "#252535" : "#1a1a22"}`,
              borderLeft: `3px solid ${m.attended ? color : "#2a2a3a"}`,
              borderRadius: 8,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: m.attended ? 1 : 0.55,
              transition: "opacity 0.2s, border-color 0.2s, background 0.2s",
            }}
          >
            {/* Date */}
            <div style={{ minWidth: 36, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e0e0ec" }}>
                {date.getDate()}
              </div>
              <div style={{ fontSize: 10, color: "#50507a", textTransform: "uppercase" }}>
                {date.toLocaleDateString("en-GB", { month: "short" })}
              </div>
            </div>

            {/* Main info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                <span style={{
                  background: color + "22", color, border: `1px solid ${color}44`,
                  borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.03em", whiteSpace: "nowrap",
                }}>
                  {compIcon(m.competition)} {m.competition}
                </span>
                <span style={{ fontSize: 11, color: "#6060a0" }}>
                  {m.isHome ? "HOME" : "AWAY"}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e8ec", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.isHome ? "vs" : "@"} {opponent}
              </div>
              <div style={{ fontSize: 11, color: "#40405a", marginTop: 1 }}>
                {m.venue.name}{m.venue.city ? ` · ${m.venue.city}` : ""}
                {isFinished && m.score && (
                  <span style={{ marginLeft: 8, color: "#6060a0", fontWeight: 700 }}>
                    {m.isHome ? `${m.score.home}–${m.score.away}` : `${m.score.away}–${m.score.home}`}
                  </span>
                )}
              </div>
            </div>

            {/* Miles */}
            <div style={{ textAlign: "right", minWidth: 60 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: m.attended ? "#e8e8ec" : "#404050" }}>
                {rt > 0 ? `${rt.toLocaleString()} mi` : "—"}
              </div>
              {rt > 0 && (
                <div style={{ fontSize: 10, color: "#40405a" }}>round trip</div>
              )}
            </div>

            {/* Attended toggle */}
            <button
              onClick={() => onToggleAttended(m.id)}
              title={m.attended ? "Mark as not attended" : "Mark as attended"}
              style={{
                background: m.attended ? "#10b98122" : "#1e1e2e",
                border: `1px solid ${m.attended ? "#10b98166" : "#2a2a3a"}`,
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                color: m.attended ? "#10b981" : "#404060",
                fontSize: 11,
                fontWeight: 700,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = m.attended ? "#10b981" : "#6060a0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = m.attended ? "#10b98166" : "#2a2a3a";
              }}
            >
              {m.attended ? "✓ Went" : "✗ Missed"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
