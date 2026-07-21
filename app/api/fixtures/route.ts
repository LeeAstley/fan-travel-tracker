import { NextRequest, NextResponse } from "next/server";
import { fetchTeamMatches } from "@/lib/footballData";
import { postcodeToLatLng, haversineRoadMiles } from "@/lib/geo";
import { VENUE_NAME_FALLBACK } from "@/lib/venues";

export async function GET(req: NextRequest) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY not configured" }, { status: 500 });
  }

  const teamId = parseInt(req.nextUrl.searchParams.get("teamId") ?? "0");
  const postcode = req.nextUrl.searchParams.get("postcode") ?? "";
  const season = parseInt(req.nextUrl.searchParams.get("season") ?? "2024");

  if (!teamId || !postcode) {
    return NextResponse.json({ error: "teamId and postcode are required" }, { status: 400 });
  }

  let userCoords: { lat: number; lng: number };
  try {
    userCoords = await postcodeToLatLng(postcode);
  } catch {
    return NextResponse.json({ error: `Could not find postcode: ${postcode}` }, { status: 400 });
  }

  let matches;
  try {
    matches = await fetchTeamMatches(teamId, season, apiKey);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  const matchesWithDistances = matches.map((m) => {
    let venueLat = m.venue.lat;
    let venueLng = m.venue.lng;

    // If API didn't return coordinates, use name fallback
    if (!venueLat || !venueLng || venueLat === 0) {
      const homeName = m.homeTeam.toLowerCase();
      for (const [key, venue] of Object.entries(VENUE_NAME_FALLBACK)) {
        if (homeName.includes(key) || key.includes(homeName.split(" ")[0])) {
          venueLat = venue.lat;
          venueLng = venue.lng;
          break;
        }
      }
    }

    if (!venueLat || !venueLng || venueLat === 0) {
      return { ...m, milesOneWay: 0 };
    }

    const miles = haversineRoadMiles(
      userCoords.lat, userCoords.lng,
      venueLat, venueLng
    );

    return {
      ...m,
      venue: { ...m.venue, lat: venueLat, lng: venueLng },
      milesOneWay: miles,
    };
  });

  return NextResponse.json({ matches: matchesWithDistances, userCoords });
}
