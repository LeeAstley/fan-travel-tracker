"use client";

import { useState, useEffect, useRef } from "react";
import { Team } from "@/lib/types";

interface Props {
  onSelect: (team: Team) => void;
  selected: Team | null;
}

export default function TeamSearch({ onSelect, selected }: Props) {
  const [query, setQuery] = useState(selected?.name ?? "");
  const [results, setResults] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setQuery(selected.name);
  }, [selected]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.length < 2 || selected?.name === query) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/teams?name=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.teams ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query, selected?.name]);

  // Close on outside click
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
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selected) onSelect(null as unknown as Team);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="e.g. Arsenal, Leeds United…"
          style={{
            width: "100%",
            background: "#11111a",
            border: "1px solid #2a2a3a",
            borderRadius: 8,
            padding: "12px 16px",
            color: "#e8e8ec",
            fontSize: 15,
            outline: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4040a0")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a3a")}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#6060c0")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a3a")}
        />
        {loading && (
          <div style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            width: 16, height: 16, borderRadius: "50%",
            border: "2px solid #4040a0", borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }} />
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#16161f", border: "1px solid #2a2a3a", borderRadius: 8,
          zIndex: 50, overflow: "hidden", boxShadow: "0 8px 32px #00000088",
        }}>
          {results.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelect(t);
                setQuery(t.name);
                setOpen(false);
              }}
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
              {t.crest && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.crest} alt="" width={22} height={22} style={{ objectFit: "contain" }} />
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                {t.competition && (
                  <div style={{ fontSize: 11, color: "#6060a0" }}>{t.competition}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
