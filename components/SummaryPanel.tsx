"use client";

import { TravelSummary } from "@/lib/types";
import { Globe, MapPin, CheckCircle, XCircle, Trophy } from "lucide-react";

const COMP_COLORS: Record<string, string> = {
  "Premier League":   "#ef4444",
  "Championship":     "#f97316",
  "FA Cup":           "#10b981",
  "EFL Cup":          "#f59e0b",
  "Champions League": "#3b82f6",
  "Europa League":    "#f97316",
  "Conference League":"#8b5cf6",
};

function compColor(name: string) {
  return COMP_COLORS[name] ?? "#6060a0";
}

export default function SummaryPanel({ summary }: { summary: TravelSummary }) {
  const { totalMiles, attendedMiles, byCompetition, furthestTrip, totalGames, attendedGames } = summary;
  const missedMiles = totalMiles - attendedMiles;
  const missedGames = totalGames - attendedGames;

  return (
    <div>
      {/* Hero total */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid #2a2a4a",
        borderRadius: 12,
        padding: "24px",
        marginBottom: 16,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 12, color: "#6060a0", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          Total season miles (all games)
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.03em", color: "#e8e8ec" }}>
          {totalMiles.toLocaleString()}
        </div>
        <div style={{ fontSize: 13, color: "#8080a8" }}>miles across {totalGames} games</div>
      </div>

      {/* Attended vs missed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Stat icon={<CheckCircle size={16} color="#10b981" />} label="Attended" value={`${attendedMiles.toLocaleString()} mi`} sub={`${attendedGames} games`} accent="#10b981" />
        <Stat icon={<XCircle size={16} color="#6060a0" />} label="Missed" value={`${missedMiles.toLocaleString()} mi`} sub={`${missedGames} games`} accent="#6060a0" />
        {furthestTrip && (
          <div style={{ gridColumn: "1 / -1" }}>
            <Stat
              icon={<Globe size={16} color="#3b82f6" />}
              label="Furthest trip"
              value={`${(furthestTrip.milesOneWay * 2).toLocaleString()} mi RT`}
              sub={`${furthestTrip.awayTeam} vs ${furthestTrip.homeTeam} · ${furthestTrip.venue.city}`}
              accent="#3b82f6"
            />
          </div>
        )}
      </div>

      {/* By competition */}
      <div style={{ fontSize: 11, color: "#5050a0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        By competition
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Object.entries(byCompetition).map(([comp, data]) => {
          const color = compColor(comp);
          const pct = totalMiles > 0 ? (data.total / totalMiles) * 100 : 0;
          const attendPct = data.total > 0 ? (data.attended / data.total) * 100 : 0;
          return (
            <div key={comp} style={{
              background: "#11111a",
              border: `1px solid ${color}22`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 8,
              padding: "12px 14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0ec" }}>{comp}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color }}>
                  {data.total.toLocaleString()} mi
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#50507a", marginBottom: 6 }}>
                {data.games} games · {Math.round(pct)}% of total · {Math.round(attendPct)}% attended
              </div>
              {/* Bar */}
              <div style={{ background: "#1e1e2e", borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${attendPct}%`,
                  height: "100%",
                  background: color,
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub: string; accent: string;
}) {
  return (
    <div style={{
      background: "#11111a",
      border: `1px solid ${accent}22`,
      borderRadius: 8,
      padding: "12px 14px",
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
    }}>
      <div style={{ marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#6060a0", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: accent }}>{value}</div>
        <div style={{ fontSize: 11, color: "#50507a" }}>{sub}</div>
      </div>
    </div>
  );
}
