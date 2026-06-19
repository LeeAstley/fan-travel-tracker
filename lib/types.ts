export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  competition: string;
}

export interface Venue {
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export interface Match {
  id: number;
  date: string;       // ISO string
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number;
  awayTeamId: number;
  venue: Venue;
  status: string;     // "SCHEDULED" | "FINISHED" | "POSTPONED" | "CANCELLED"
  score?: { home: number | null; away: number | null };
  isHome: boolean;    // relative to the tracked team
  milesOneWay: number;
  attended?: boolean; // user-set
}

export interface TravelSummary {
  totalMiles: number;
  attendedMiles: number;
  byCompetition: Record<string, { total: number; attended: number; games: number }>;
  furthestTrip: Match | null;
  totalGames: number;
  attendedGames: number;
}
