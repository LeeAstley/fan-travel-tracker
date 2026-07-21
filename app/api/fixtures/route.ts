import { NextRequest, NextResponse } from "next/server";
import { fetchTeamMatches } from "@/lib/footballData";
import { postcodeToLatLng, haversineRoadMiles } from "@/lib/geo";
import { VENUE_NAME_FALLBACK } from "@/lib/venues";

// Known finals and neutral venue overrides by fixture ID or date+competition
const KNOWN_FINALS: Record<string, { lat: number; lng: number; name: string; city: string }> = {
  // UCL Final 2025/26 - Puskas Arena, Budapest
  "2025-05-30-ucl": { lat: 47.5012, lng: 19.0837, name: "Puskas Arena", city: "Budapest" },
  // UCL Final 2024/25 - Allianz Arena, Munich  
  "2024-05-31-ucl": { lat: 48.2188, lng: 11.6248, name: "Allianz Arena", city: "Munich" },
  // UCL Final 2023/24 - Wembley
  "2023-06-01-ucl": { lat: 51.5560, lng: -0.2796, name: "Wembley Stadium", city: "London" },
  // EFL Cup Final - always Wembley
};

export async function GET(req: NextRequest) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY not configured" }, { status: 500 });
  }

  const teamId = parseInt(req.nextUrl.searchParams.get("teamId") ?? "0");
  const postcode = req.nextUrl.searchParams.get("postcode") ?? "";
  const season = parseInt(req.nextUrl.searchParams.get("season") ?? "2025");

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
    let venueName = m.venue.name;
    let venueCity = m.venue.city;

    // Check for known finals by date
    const matchDate = m.date.substring(0, 10);
    const compShort = m.competition === "Champions League" ? "ucl" :
                      m.competition === "Europa League" ? "uel" :
                      m.competition === "Conference League" ? "uecl" : "";

    if (compShort) {
      // Check May/June dates for UCL/UEL finals
      const month = parseInt(matchDate.substring(5, 7));
      const year = parseInt(matchDate.substring(0, 4));
      if (month >= 5 && month <= 6) {
        const finalKey = `${year}-${month === 5 ? "05" : "06"}-${matchDate.substring(8, 10)}-${compShort}`;
        const knownFinal = KNOWN_FINALS[finalKey];
        if (knownFinal) {
          venueLat = knownFinal.lat;
          venueLng = knownFinal.lng;
          venueName = knownFinal.name;
          venueCity = knownFinal.city;
        }
      }
    }

    // If API returned valid coordinates, use them
    if (venueLat && venueLng && venueLat !== 0 && venueLng !== 0) {
      const miles = haversineRoadMiles(userCoords.lat, userCoords.lng, venueLat, venueLng);
      return { ...m, venue: { ...m.venue, name: venueName, city: venueCity }, milesOneWay: miles };
    }

    // Try matching by venue name
    const venueNameLower = venueName.toLowerCase();
    for (const [key, venue] of Object.entries(VENUE_NAME_FALLBACK)) {
      if (venueNameLower.includes(key) || key.includes(venueNameLower.split(" ")[0])) {
        venueLat = venue.lat;
        venueLng = venue.lng;
        break;
      }
    }

    // Try matching by home team name
    if (!venueLat || venueLat === 0) {
      const homeName = m.homeTeam.toLowerCase();
      for (const [key, venue] of Object.entries(VENUE_NAME_FALLBACK)) {
        if (homeName.includes(key) || key.includes(homeName.split(" ")[0])) {
          venueLat = venue.lat;
          venueLng = venue.lng;
          break;
        }
      }
    }

    if (!venueLat || venueLat === 0) {
      return { ...m, milesOneWay: 0 };
    }

    const miles = haversineRoadMiles(
      userCoords.lat, userCoords.lng,
      venueLat, venueLng
    );

    return {
      ...m,
      venue: { ...m.venue, lat: venueLat, lng: venueLng, name: venueName, city: venueCity },
      milesOneWay: miles,
    };
  });

  return NextResponse.json({ matches: matchesWithDistances, userCoords });
}
