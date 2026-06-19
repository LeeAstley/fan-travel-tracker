import { VENUE_COORDS, EURO_VENUE_COORDS } from "./venues";
import { Match, Team } from "./types";

const FD_BASE = "https://api.football-data.org/v4";

export const COMPETITIONS = [
  { code: "PL",   name: "Premier League",     tier: 1 },
  { code: "ELC",  name: "Championship",       tier: 2 },
  { code: "FAC",  name: "FA Cup",             tier: 0 },
  { code: "EFL",  name: "EFL Cup",            tier: 0 },
  { code: "UCL",  name: "Champions League",   tier: 0 },
  { code: "UEL",  name: "Europa League",      tier: 0 },
  { code: "UECL", name: "Conference League",  tier: 0 },
];

export async function fdFetch(path: string, apiKey: string) {
  const res = await fetch(`${FD_BASE}${path}`, {
    headers: { "X-Auth-Token": apiKey },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`football-data.org error ${res.status}: ${text}`);
  }
  return res.json();
}

interface TeamRaw {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  runningCompetitions?: { name: string }[];
}

interface MatchRaw {
  id: number;
  utcDate: string;
  status: string;
  competition: { name: string; code: string };
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
  score: { fullTime: { home: number | null; away: number | null } };
  venue?: string;
}

export async function searchTeams(name: string, apiKey: string): Promise<Team[]> {
  try {
    const data = await fdFetch(`/teams?name=${encodeURIComponent(name)}`, apiKey);
    const all: TeamRaw[] = data.teams || [];
    const lower = name.toLowerCase();
    const filtered = all.filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.shortName?.toLowerCase().includes(lower) ||
        t.tla?.toLowerCase().includes(lower)
    );
    return (filtered.length > 0 ? filtered : all).slice(0, 10).map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      tla: t.tla,
      crest: t.crest,
      competition: t.runningCompetitions?.[0]?.name ?? "",
    }));
  } catch {
    return [];
  }
}

export async function fetchTeamMatches(
  teamId: number,
  season: number,
  apiKey: string
): Promise<Match[]> {
  const allMatches: Match[] = [];

  for (const comp of COMPETITIONS) {
    try {
      const data = await fdFetch(
        `/competitions/${comp.code}/matches?season=${season}&status=SCHEDULED,FINISHED,POSTPONED`,
        apiKey
      );
      const relevant = (data.matches as MatchRaw[]).filter(
        (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
      );
      for (const m of relevant) {
        const isHome = m.homeTeam.id === teamId;
        const venueTeamId = m.homeTeam.id;
        const venueData = VENUE_COORDS[venueTeamId];

        allMatches.push({
          id: m.id,
          date: m.utcDate,
          competition: comp.name,
          homeTeam: m.homeTeam.name,
          awayTeam: m.awayTeam.name,
          homeTeamId: m.homeTeam.id,
          awayTeamId: m.awayTeam.id,
          venue: {
            name: venueData?.name ?? m.venue ?? "Unknown Venue",
            city: venueData?.city ?? "",
            lat: venueData?.lat ?? 0,
            lng: venueData?.lng ?? 0,
          },
          status: m.status,
          score: { home: m.score?.fullTime?.home ?? null, away: m.score?.fullTime?.away ?? null },
          isHome,
          milesOneWay: 0,
          attended: true,
        });
      }
    } catch {
      // competition not available — skip
    }
  }

  const seen = new Set<number>();
  return allMatches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export function resolveVenueCoords(
  match: Match
): { lat: number; lng: number } | null {
  if (match.venue.lat !== 0) return { lat: match.venue.lat, lng: match.venue.lng };

  const home = match.homeTeam.toLowerCase();
  for (const [key, coords] of Object.entries(EURO_VENUE_COORDS)) {
    if (home.includes(key) || key.includes(home.split(" ")[0])) {
      return coords;
    }
  }
  return null;
}