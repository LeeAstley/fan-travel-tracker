import { NextRequest, NextResponse } from "next/server";
import { fetchTeamMatches, resolveVenueCoords } from "@/lib/footballData";
import { postcodeToLatLng, haversineRoadMiles } from "@/lib/geo";
import { Match } from "@/lib/types";

export async function GET(req: NextRequest) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "FOOTBALL_DATA_API_KEY not configured" }, { status: 500 });
  }

  const teamId = parseInt(req.nextUrl.searchParams.get("teamId") ?? "0");
  const postcode = req.nextUrl.searchParams.get("postcode") ?? "";
  const season = parseInt(req.nextUrl.searchParams.get("season") ?? String(new Date().getFullYear()));

  if (!teamId || !postcode) {
    return NextResponse.json({ error: "teamId and postcode are required" }, { status: 400 });
  }

  // Resolve user postcode
  let userCoords: { lat: number; lng: number };
  try {
    userCoords = await postcodeToLatLng(postcode);
  } catch {
    return NextResponse.json({ error: `Could not find postcode: ${postcode}` }, { status: 400 });
  }

  // Fetch matches
  let matches: Match[];
  try {
    matches = await fetchTeamMatches(teamId, season, apiKey);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  // Calculate distances
  const matchesWithDistances = matches.map((m) => {
    const coords = resolveVenueCoords(m);
    if (!coords || (coords.lat === 0 && coords.lng === 0)) {
      return { ...m, milesOneWay: 0 };
    }
    const miles = haversineRoadMiles(
      userCoords.lat, userCoords.lng,
      coords.lat, coords.lng
    );
    return {
      ...m,
      venue: { ...m.venue, lat: coords.lat, lng: coords.lng },
      milesOneWay: miles,
    };
  });

  // Sort by date
  matchesWithDistances.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return NextResponse.json({ matches: matchesWithDistances, userCoords });
}
