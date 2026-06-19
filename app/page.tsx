"use client";

import { useState, useCallback } from "react";
import TeamSearch from "@/components/TeamSearch";
import SummaryPanel from "@/components/SummaryPanel";
import MatchList from "@/components/MatchList";
import { Team, Match } from "@/lib/types";
import { computeSummary } from "@/lib/summary";

const CURRENT_SEASON = 2025;

export default function Home() {
  const [team, setTeam] = useState<Team | null>(null);
  const [postcode, setPostcode] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [showHome, setShowHome] = useState(true);

  const competitions = ["All", ...Array.from(new Set(matches.map((m) => m.competition)))];

  const handleSearch = useCallback(async () => {
    if (!team || !postcode.trim()) return;
    setLoading(true);
    setError("");
    setMatches([]);
    try {
      const res = await fetch(
        `/api/fixtures?teamId=${team.id}&postcode=${encodeURIComponent(postcode.trim())}&season=${CURRENT_SEASON}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch fixtures");
      setMatches((data.matches as Match[]).map((m) => ({ ...m, attended: true })));
      setFilter("All");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [team, postcode]);

  const toggleAttended = useCallback((id: number) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, attended: !m.attended } : m))
    );
  }, []);

  const markAll = useCallback((attended: boolean) => {
    setMatches((prev) => prev.map((m) => ({ ...m, attended })));
  }, []);

  const summary = computeSummary(matches);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8ec" }}>
      <header style={{
        borderBottom: "1px solid #1a1a2a",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>⚽</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em" }}>Fan Travel Tracker</div>
          <div style={{ fontSize: 12, color: "#50507a" }}>How far did you travel this season?</div>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{
          background: "#11111a", border: "1px solid #1e1e2e",
          borderRadius: 12, padding: "20px", marginBottom: 28,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: "#8080b0",
            textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 14,
          }}>Your details</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#6060a0", marginBottom: 6 }}>Club</label>
              <TeamSearch selected={team} onSelect={setTeam} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#6060a0", marginBottom: 6 }}>Your postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. PO21 1LJ"
                style={{
                  width: "100%", background: "#0f0f17",
                  border: "1px solid #2a2a3a", borderRadius: 8,
                  padding: "12px 16px", color: "#e8e8ec", fontSize: 15, outline: "none",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!team || !postcode.trim() || loading}
            style={{
              background: team && postcode.trim() && !loading ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#1e1e2e",
              color: team && postcode.trim() && !loading ? "#fff" : "#40405a",
              border: "none", borderRadius: 8, padding: "12px 24px",
              fontSize: 14, fontWeight: 700,
              cursor: team && postcode.trim() && !loading ? "pointer" : "not-allowed",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: "inline-block", width: 14, height: 14, borderRadius: "50%",
                  border: "2px solid #4488ff", borderTopColor: "transparent",
                  animation: "spin 0.7s linear infinite",
                }} />
                Loading fixtures…
              </>
            ) : "Calculate my miles →"}
          </button>

          {error && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              background: "#2a1010", border: "1px solid #aa3333",
              borderRadius: 8, fontSize: 13, color: "#ff8888",
            }}>{error}</div>
          )}
        </div>

        {matches.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {competitions.map((c) => (
                    <button key={c} onClick={() => setFilter(c)} style={{
                      background: filter === c ? "#3b82f6" : "#1a1a28",
                      color: filter === c ? "#fff" : "#9090b0",
                      border: `1px solid ${filter === c ? "#3b82f6" : "#2a2a3a"}`,
                      borderRadius: 20, padding: "5px 13px", fontSize: 12,
                      cursor: "pointer", fontWeight: filter === c ? 700 : 400,
                    }}>{c}</button>
                  ))}
                </div>
                <label style={{ fontSize: 12, color: "#9090b0", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                  <input type="checkbox" checked={showHome} onChange={(e) => setShowHome(e.target.checked)} style={{ accentColor: "#3b82f6" }} />
                  Home games
                </label>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => markAll(true)} style={{
                  background: "#10b98118", border: "1px solid #10b98144",
                  color: "#10b981", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                }}>✓ Mark all attended</button>
                <button onClick={() => markAll(false)} style={{
                  background: "#1e1e2e", border: "1px solid #2a2a3a",
                  color: "#6060a0", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                }}>✗ Clear all</button>
              </div>

              <MatchList matches={matches} onToggleAttended={toggleAttended} filter={filter} showHome={showHome} />
            </div>

            <div style={{ position: "sticky", top: 24 }}>
              {team && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  {team.crest && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={team.crest} alt="" width={32} height={32} style={{ objectFit: "contain" }} />
                  )}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: "#6060a0" }}>2025/26 season · from {postcode.toUpperCase()}</div>
                  </div>
                </div>
              )}
              <SummaryPanel summary={summary} />
            </div>
          </div>
        )}

        {!loading && matches.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#40406a" }}>Pick your club and postcode to get started</div>
            <div style={{ fontSize: 13, marginTop: 6, color: "#30305a" }}>
              We&apos;ll calculate every mile you&apos;d travel this season in every competition
            </div>
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
