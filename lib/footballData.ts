import { Match } from "./types";

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";

export const LEAGUES = [
  { id: 39,  name: "Premier League" },
  { id: 40,  name: "Championship" },
  { id: 45,  name: "FA Cup" },
  { id: 48,  name: "EFL Cup" },
  { id: 2,   name: "Champions League" },
  { id: 3,   name: "Europa League" },
  { id: 848, name: "Conference League" },
];

// Neutral venue overrides — for finals and one-off games at specific stadiums
const NEUTRAL_VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  "puskas arena": { lat: 47.5012, lng: 19.0837 },
  "puskas": { lat: 47.5012, lng: 19.0837 },
  "wembley": { lat: 51.5560, lng: -0.2796 },
  "wembley stadium": { lat: 51.5560, lng: -0.2796 },
  "hampden": { lat: 55.8235, lng: -4.2521 },
  "hampden park": { lat: 55.8235, lng: -4.2521 },
  "dublin arena": { lat: 53.3353, lng: -6.2285 },
  "aviva stadium": { lat: 53.3353, lng: -6.2285 },
  "stade de france": { lat: 48.9244, lng: 2.3601 },
  "allianz arena": { lat: 48.2188, lng: 11.6248 },
  "olympic stadium athens": { lat: 37.9697, lng: 23.7122 },
  "luzhniki": { lat: 55.7317, lng: 37.5592 },
  "estadio da luz": { lat: 38.7526, lng: -9.1845 },
  "millennium stadium": { lat: 51.4782, lng: -3.1826 },
  "principality stadium": { lat: 51.4782, lng: -3.1826 },
  "san siro": { lat: 45.4781, lng: 9.1240 },
  "juventus stadium": { lat: 45.1096, lng: 7.6413 },
  "allianz stadium": { lat: 45.1096, lng: 7.6413 },
  "estadio metropolitano": { lat: 40.4361, lng: -3.5996 },
  "wanda metropolitano": { lat: 40.4361, lng: -3.5996 },
  "parc des princes": { lat: 48.8414, lng: 2.2530 },
};

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

        // Check venue name against neutral venue overrides first
        const venueNameLower = (f.fixture.venue?.name ?? "").toLowerCase();
        let venueLat = 0;
        let venueLng = 0;

        for (const [key, coords] of Object.entries(NEUTRAL_VENUE_COORDS)) {
          if (venueNameLower.includes(key)) {
            venueLat = coords.lat;
            venueLng = coords.lng;
            break;
          }
        }

        // If no neutral venue match, use API coordinates
        if (venueLat === 0) {
          venueLat = f.fixture.venue?.lat ?? 0;
          venueLng = f.fixture.venue?.lon ?? 0;
        }

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
