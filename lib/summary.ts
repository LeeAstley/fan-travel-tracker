import { Match, TravelSummary } from "@/lib/types";

export function computeSummary(matches: Match[]): TravelSummary {
  let totalMiles = 0;
  let attendedMiles = 0;
  const byCompetition: Record<string, { total: number; attended: number; games: number }> = {};
  let furthestTrip: Match | null = null;

  for (const m of matches) {
    const rt = m.milesOneWay * 2;
    totalMiles += rt;
    if (m.attended) attendedMiles += rt;

    if (!byCompetition[m.competition]) {
      byCompetition[m.competition] = { total: 0, attended: 0, games: 0 };
    }
    byCompetition[m.competition].total += rt;
    byCompetition[m.competition].games += 1;
    if (m.attended) byCompetition[m.competition].attended += rt;

    if (!m.isHome && (!furthestTrip || m.milesOneWay > furthestTrip.milesOneWay)) {
      furthestTrip = m;
    }
  }

  return {
    totalMiles,
    attendedMiles,
    byCompetition,
    furthestTrip,
    totalGames: matches.length,
    attendedGames: matches.filter((m) => m.attended).length,
  };
}
