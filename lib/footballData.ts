import { Match } from "./types";

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";

// League IDs for API-Football
export const LEAGUES = [
  { id: 39,  name: "Premier League" },
  { id: 40,  name: "Championship" },
  { id: 45,  name: "FA Cup" },
  { id: 48,  name: "EFL Cup" },
  { id: 2,   name: "Champions League" },
  { id: 3,   name: "Europa League" },
  { id: 848, name: "Conference League" },
];

async function apiFetch(path: string, apiKey: string) {
  const res = await fetch(`${API_FOOTBALL_BASE}${path}`, {
    headers: {
      "x-apisports-key": apiKey,
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`API-Football error ${res.status}`);
  return res.json();
}

export async function fetchTeamMatches(
  teamId: number,
  season: number,
  apiKey: string
): Promise<Match[]> {
  const allMatches: Match[] = [];

  for (const league of LEAGUES) {
    try {
      const data = await apiFetch(
        `/fixtures?team=${teamId}&season=${season}&league=${league.id}`,
        apiKey
      );

      const fixtures = data.response ?? [];

      for (const f of fixtures) {
        const isHome = f.teams.home.id === teamId;
        const venueLat = f.fixture.venue?.lat ?? 0;
        const venueLng = f.fixture.venue?.lon ?? 0;

        allMatches.push({
          id: f.fixture.id,
          date: f.fixture.date,
          competition: league.name,
          homeTeam: f.teams.home.name,
          awayTeam: f.teams.away.name,
          homeTeamId: f.teams.home.id,
          awayTeamId: f.teams.away.id,
          venue: {
            name: f.fixture.venue?.name ?? "Unknown Venue",
            city: f.fixture.venue?.city ?? "",
            lat: venueLat,
            lng: venueLng,
          },
          status: f.fixture.status?.short ?? "NS",
          score: {
            home: f.goals?.home ?? null,
            away: f.goals?.away ?? null,
          },
          isHome,
          milesOneWay: 0,
          attended: true,
        });
      }
    } catch {
      // league not available for this team — skip
    }
  }

  const seen = new Set<number>();
  return allMatches
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function searchTeams(name: string, apiKey: string) {
  try {
    const data = await apiFetch(
      `/teams?search=${encodeURIComponent(name)}`,
      apiKey
    );
    return (data.response ?? []).map((t: any) => ({
      id: t.team.id,
      name: t.team.name,
      shortName: t.team.name,
      tla: t.team.code ?? "",
      crest: t.team.logo ?? "",
      competition: t.venue?.name ?? "",
    }));
  } catch {
    return [];
  }
}

export function resolveVenueCoords(match: Match) {
  if (match.venue.lat !== 0) return { lat: match.venue.lat, lng: match.venue.lng };
  return null;
}
