/**
 * Known venue coordinates for UK football grounds and common European venues.
 * Keyed by team ID from football-data.org.
 * These are used as fallback / primary since the API doesn't always include coords.
 */

export const VENUE_COORDS: Record<number, { name: string; city: string; lat: number; lng: number }> = {
  // Premier League
  57:  { name: "Emirates Stadium",           city: "London",       lat: 51.5549, lng: -0.1084 },
  61:  { name: "Stamford Bridge",            city: "London",       lat: 51.4816, lng: -0.1909 },
  62:  { name: "Turf Moor",                  city: "Burnley",      lat: 53.7889, lng: -2.2300 },
  63:  { name: "Elland Road",                city: "Leeds",        lat: 53.7775, lng: -1.5722 },
  64:  { name: "Selhurst Park",              city: "London",       lat: 51.3983, lng: -0.0855 },
  65:  { name: "Goodison Park",              city: "Liverpool",    lat: 53.4388, lng: -2.9661 },
  66:  { name: "Craven Cottage",             city: "London",       lat: 51.4749, lng: -0.2217 },
  67:  { name: "Anfield",                    city: "Liverpool",    lat: 53.4308, lng: -2.9609 },
  68:  { name: "St James' Park",             city: "Newcastle",    lat: 54.9756, lng: -1.6218 },
  73:  { name: "Tottenham Hotspur Stadium",  city: "London",       lat: 51.6043, lng: -0.0665 },
  74:  { name: "Old Trafford",               city: "Manchester",   lat: 53.4631, lng: -2.2913 },
  75:  { name: "London Stadium",             city: "London",       lat: 51.5386, lng: -0.0164 },
  76:  { name: "Villa Park",                 city: "Birmingham",   lat: 52.5090, lng: -1.8847 },
  338: { name: "Molineux Stadium",           city: "Wolverhampton",lat: 52.5904, lng: -2.1305 },
  340: { name: "Southampton St Mary's",      city: "Southampton",  lat: 50.9058, lng: -1.3914 },
  354: { name: "City Ground",                city: "Nottingham",   lat: 52.9400, lng: -1.1328 },
  356: { name: "Vitality Stadium",           city: "Bournemouth",  lat: 50.7352, lng: -1.8383 },
  397: { name: "Gtech Community Stadium",   city: "London",       lat: 51.4883, lng: -0.2887 },
  402: { name: "Amex Stadium",               city: "Brighton",     lat: 50.8618, lng: -0.0830 },
  563: { name: "Etihad Stadium",             city: "Manchester",   lat: 53.4831, lng: -2.2004 },
  
  // Championship & lower
  328: { name: "Hillsborough Stadium",       city: "Sheffield",    lat: 53.4116, lng: -1.5005 },
  351: { name: "Loftus Road",                city: "London",       lat: 51.5091, lng: -0.2325 },
  384: { name: "Madejski Stadium",           city: "Reading",      lat: 51.4222, lng: -0.9823 },
  394: { name: "DW Stadium",                 city: "Wigan",        lat: 53.5488, lng: -2.6551 },
  380: { name: "King Power Stadium",         city: "Leicester",    lat: 52.6203, lng: -1.1421 },
  383: { name: "Kenilworth Road",            city: "Luton",        lat: 51.8838, lng: -0.4318 },
  387: { name: "Bramall Lane",               city: "Sheffield",    lat: 53.3703, lng: -1.4706 },
  389: { name: "Swansea.com Stadium",        city: "Swansea",      lat: 51.6427, lng: -3.9348 },
  390: { name: "Cardiff City Stadium",       city: "Cardiff",      lat: 51.4730, lng: -3.2024 },
  408: { name: "Portman Road",               city: "Ipswich",      lat: 52.0554, lng: 1.1449 },
  427: { name: "Sunderland Stadium of Light",city: "Sunderland",   lat: 54.9147, lng: -1.3882 },
  714: { name: "Fratton Park",               city: "Portsmouth",   lat: 50.7960, lng: -1.0640 },
  744: { name: "Roots Hall",                 city: "Southend",     lat: 51.5466, lng: 0.7031 },

  // Scottish
  9825: { name: "Celtic Park",               city: "Glasgow",      lat: 55.8497, lng: -4.2050 },
  9826: { name: "Ibrox Stadium",             city: "Glasgow",      lat: 55.8507, lng: -4.3091 },
};

/**
 * Common European venues for CL/EL — keyed by a string slug since IDs vary.
 */
export const EURO_VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  "real madrid":      { lat: 40.4530, lng: -3.6883 },
  "barcelona":        { lat: 41.3809, lng: 2.1228 },
  "atletico madrid":  { lat: 40.4361, lng: -3.5996 },
  "psg":              { lat: 48.8414, lng: 2.2530 },
  "paris":            { lat: 48.8414, lng: 2.2530 },
  "bayern munich":    { lat: 48.2188, lng: 11.6248 },
  "borussia dortmund":{ lat: 51.4926, lng: 7.4517 },
  "bayer leverkusen": { lat: 51.0382, lng: 7.0024 },
  "inter milan":      { lat: 45.4781, lng: 9.1240 },
  "ac milan":         { lat: 45.4781, lng: 9.1240 },
  "juventus":         { lat: 45.1096, lng: 7.6413 },
  "benfica":          { lat: 38.7526, lng: -9.1845 },
  "sporting lisbon":  { lat: 38.7613, lng: -9.1601 },
  "porto":            { lat: 41.1619, lng: -8.5833 },
  "ajax":             { lat: 52.3141, lng: 4.9418 },
  "club brugge":      { lat: 51.1943, lng: 3.1994 },
  "anderlecht":       { lat: 50.8335, lng: 4.2978 },
  "celtic":           { lat: 55.8497, lng: -4.2050 },
  "rangers":          { lat: 55.8507, lng: -4.3091 },
  "slavia prague":    { lat: 50.0673, lng: 14.4748 },
  "sparta prague":    { lat: 50.0986, lng: 14.4004 },
  "athletic bilbao":  { lat: 43.2642, lng: -2.9494 },
  "sevilla":          { lat: 37.3840, lng: -5.9705 },
  "villarreal":       { lat: 39.9446, lng: -0.1036 },
  "olympiacos":       { lat: 37.9667, lng: 23.7330 },
  "olympique marseille": { lat: 43.2699, lng: 5.3957 },
  "olympique lyonnais": { lat: 45.7653, lng: 4.9824 },
  "red bull salzburg":{ lat: 47.8222, lng: 13.0436 },
  "shakhtar donetsk": { lat: 50.4021, lng: 36.3478 },
  "napoli":           { lat: 40.8279, lng: 14.1931 },
  "roma":             { lat: 41.9336, lng: 12.4547 },
  "lazio":            { lat: 41.9336, lng: 12.4547 },
  "feyenoord":        { lat: 51.8933, lng: 4.5232 },
  "psv eindhoven":    { lat: 51.4416, lng: 5.4670 },
};
