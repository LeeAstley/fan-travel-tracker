"use client";

import { useState, useEffect, useRef } from "react";
import { Team } from "@/lib/types";

const UK_TEAMS: Team[] = [
  { id: 57,  name: "Arsenal FC",                 shortName: "Arsenal",       tla: "ARS", crest: "https://crests.football-data.org/57.png",  competition: "Premier League" },
  { id: 61,  name: "Chelsea FC",                 shortName: "Chelsea",       tla: "CHE", crest: "https://crests.football-data.org/61.png",  competition: "Premier League" },
  { id: 62,  name: "Everton FC",                 shortName: "Everton",       tla: "EVE", crest: "https://crests.football-data.org/62.png",  competition: "Premier League" },
  { id: 63,  name: "Fulham FC",                  shortName: "Fulham",        tla: "FUL", crest: "https://crests.football-data.org/63.png",  competition: "Premier League" },
  { id: 64,  name: "Liverpool FC",               shortName: "Liverpool",     tla: "LIV", crest: "https://crests.football-data.org/64.png",  competition: "Premier League" },
  { id: 65,  name: "Manchester City FC",         shortName: "Man City",      tla: "MCI", crest: "https://crests.football-data.org/65.png",  competition: "Premier League" },
  { id: 66,  name: "Manchester United FC",       shortName: "Man United",    tla: "MUN", crest: "https://crests.football-data.org/66.png",  competition: "Premier League" },
  { id: 67,  name: "Newcastle United FC",        shortName: "Newcastle",     tla: "NEW", crest: "https://crests.football-data.org/67.png",  competition: "Premier League" },
  { id: 68,  name: "Nottingham Forest FC",       shortName: "Nott Forest",   tla: "NOT", crest: "https://crests.football-data.org/68.png",  competition: "Premier League" },
  { id: 73,  name: "Tottenham Hotspur FC",       shortName: "Spurs",         tla: "TOT", crest: "https://crests.football-data.org/73.png",  competition: "Premier League" },
  { id: 74,  name: "West Ham United FC",         shortName: "West Ham",      tla: "WHU", crest: "https://crests.football-data.org/74.png",  competition: "Premier League" },
  { id: 76,  name: "Wolverhampton Wanderers FC", shortName: "Wolves",        tla: "WOL", crest: "https://crests.football-data.org/76.png",  competition: "Premier League" },
  { id: 328, name: "Burnley FC",                 shortName: "Burnley",       tla: "BUR", crest: "https://crests.football-data.org/328.png", competition: "Premier League" },
  { id: 338, name: "Leicester City FC",          shortName: "Leicester",     tla: "LEI", crest: "https://crests.football-data.org/338.png", competition: "Premier League" },
  { id: 340, name: "Southampton FC",             shortName: "Southampton",   tla: "SOU", crest: "https://crests.football-data.org/340.png", competition: "Premier League" },
  { id: 354, name: "Crystal Palace FC",          shortName: "Crystal Palace",tla: "CRY", crest: "https://crests.football-data.org/354.png", competition: "Premier League" },
  { id: 356, name: "AFC Bournemouth",            shortName: "Bournemouth",   tla: "BOU", crest: "https://crests.football-data.org/356.png", competition: "Premier League" },
  { id: 397, name: "Brentford FC",               shortName: "Brentford",     tla: "BRE", crest: "https://crests.football-data.org/397.png", competition: "Premier League" },
  { id: 402, name: "Brighton and Hove Albion FC",shortName: "Brighton",      tla: "BHA", crest: "https://crests.football-data.org/402.png", competition: "Premier League" },
  { id: 563, name: "Aston Villa FC",             shortName: "Aston Villa",   tla: "AVL", crest: "https://crests.football-data.org/563.png", competition: "Premier League" },
  { id: 387, name: "Leeds United FC",            shortName: "Leeds",         tla: "LEE", crest: "https://crests.football-data.org/387.png", competition: "Championship" },
  { id: 383, name: "Luton Town FC",              shortName: "Luton",         tla: "LUT", crest: "https://crests.football-data.org/383.png", competition: "Championship" },
  { id: 384, name: "Middlesbrough FC",           shortName: "Middlesbrough", tla: "MID", crest: "https://crests.football-data.org/384.png", competition: "Championship" },
  { id: 389, name: "Swansea City AFC",           shortName: "Swansea",       tla: "SWA", crest: "https://crests.football-data.org/389.png", competition: "Championship" },
  { id: 390, name: "Cardiff City FC",            shortName: "Cardiff",       tla: "CAR", crest: "https://crests.football-data.org/390.png", competition: "Championship" },
  { id: 394, name: "Queens Park Rangers FC",     shortName: "QPR",           tla: "QPR", crest: "https://crests.football-data.org/394.png", competition: "Championship" },
  { id: 408, name: "Ipswich Town FC",            shortName: "Ipswich",       tla: "IPS", crest: "https://crests.football-data.org/408.png", competition: "Championship" },
  { id: 427, name: "Sunderland AFC",             shortName: "Sunderland",    tla: "SUN", crest: "https://crests.football-data.org/427.png", competition: "Championship" },
  { id: 715, name: "Stoke City FC",              shortName: "Stoke",         tla: "STK", crest: "https://crests.football-data.org/715.png", competition: "Championship" },
  { id: 750, name: "Sheffield United FC",        shortName: "Sheffield Utd", tla: "SHU", crest: "https://crests.football-data.org/750.png", competition: "Championship" },
  { id: 351, name: "Coventry City FC",           shortName: "Coventry",      tla: "COV", crest: "https://crests.football-data.org/351.png", competition: "Championship" },
  { id: 714, name: "Portsmouth FC",              shortName: "Portsmouth",    tla: "POR", crest: "https://crests.football-data.org/714.png", competition: "Championship" },
  { id: 380, name: "Derby County FC",            shortName: "Derby",         tla: "DER", crest: "https://crests.football-data.org/380.png", competition: "Championship" },
  { id: 9825, name: "Celtic FC",                 shortName: "Celtic",        tla: "CEL", crest: "https://crests.football-data.org/9825.png",competition: "Scottish Premiership" },
  { id: 9826, name: "Rangers FC",                shortName: "Rangers",       tla: "RAN", crest: "https://crests.football-data.org/9826.png",competition: "Scottish Premiership" },
];

interface Props {
  onSelect: (team: Team) => void;
  selected: Team | null;
}

export default function TeamSearch({ onSelect, selected }: Props) {
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setQuery(selected.name);
  }, [selected]);

  const results = query.length < 2 ? [] : UK_TEAMS.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.shortName.toLowerCase().includes(query.toLowerCase()) ||
    t.tla.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (selected) onSelect(null as unknown as Team);
        }}
        onFocus={() => setOpen(true)}
        placeholder="e.g. Arsenal, Leeds United"
        style={{
          width: "100%", background: "#11111a",
          border: "1px solid #2a2a3a", borderRadius: 8,
          padding: "12px 16px", color: "#e8e8ec", fontSize: 15, outline: "none",
        }}
      />

      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#16161f", border: "1px solid #2a2a3a", borderRadius: 8,
          zIndex: 50, overflow: "hidden", boxShadow: "0 8px 32px #00000088",
          maxHeight: 320, overflowY: "auto",
        }}>
          {results.map((t) => (
            <button
              key={t.id}
              onClick={() => { onSelect(t); setQuery(t.name); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 14px",
                background: "transparent", border: "none",
                color: "#e8e8ec", cursor: "pointer", textAlign: "left",
                borderBottom: "1px solid #1e1e2a",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1e1e2e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <img src={t.crest} alt="" width={22} height={22} style={{ objectFit: "contain" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#6060a0" }}>{t.competition}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}