/**
 * Haversine formula — straight-line distance between two lat/lng points in miles.
 * We apply a 1.25 road factor to approximate driving distance.
 */
export function haversineRoadMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straight = R * c;
  return Math.round(straight * 1.25); // road factor
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * Look up a UK postcode via postcodes.io (free, no key required).
 * Returns { lat, lng } or throws on failure.
 */
export async function postcodeToLatLng(postcode: string): Promise<{ lat: number; lng: number }> {
  const clean = postcode.replace(/\s+/g, "").toUpperCase();
  const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
  if (!res.ok) throw new Error(`Postcode not found: ${postcode}`);
  const json = await res.json();
  if (json.status !== 200) throw new Error(`Postcode not found: ${postcode}`);
  return { lat: json.result.latitude, lng: json.result.longitude };
}
