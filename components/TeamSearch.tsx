"use client";

import { useState, useEffect, useRef } from "react";
import { Team } from "@/lib/types";

const UK_TEAMS: Team[] = [
  // Premier League
  { id: 57,   name: "Arsenal FC",                  shortName: "Arsenal",        tla: "ARS", crest: "https://crests.football-data.org/57.png",   competition: "Premier League" },
  { id: 61,   name: "Chelsea FC",                  shortName: "Chelsea",        tla: "CHE", crest: "https://crests.football-data.org/61.png",   competition: "Premier League" },
  { id: 62,   name: "Everton FC",                  shortName: "Everton",        tla: "EVE", crest: "https://crests.football-data.org/62.png",   competition: "Premier League" },
  { id: 63,   name: "Fulham FC",                   shortName: "Fulham",         tla: "FUL", crest: "https://crests.football-data.org/63.png",   competition: "Premier League" },
  { id: 64,   name: "Liverpool FC",                shortName: "Liverpool",      tla: "LIV", crest: "https://crests.football-data.org/64.png",   competition: "Premier League" },
  { id: 65,   name: "Manchester City FC",          shortName: "Man City",       tla: "MCI", crest: "https://crests.football-data.org/65.png",   competition: "Premier League" },
  { id: 66,   name: "Manchester United FC",        shortName: "Man United",     tla: "MUN", crest: "https://crests.football-data.org/66.png",   competition: "Premier League" },
  { id: 67,   name: "Newcastle United FC",         shortName: "Newcastle",      tla: "NEW", crest: "https://crests.football-data.org/67.png",   competition: "Premier League" },
  { id: 73,   name: "Tottenham Hotspur FC",        shortName: "Spurs",          tla: "TOT", crest: "https://crests.football-data.org/73.png",   competition: "Premier League" },
  { id: 75,   name: "West Ham United FC",          shortName: "West Ham",       tla: "WHU", crest: "https://crests.football-data.org/75.png",   competition: "Premier League" },
  { id: 76,   name: "Wolverhampton Wanderers FC",  shortName: "Wolves",         tla: "WOL", crest: "https://crests.football-data.org/76.png",   competition: "Premier League" },
  { id: 328,  name: "Burnley FC",                  shortName: "Burnley",        tla: "BUR", crest: "https://crests.football-data.org/328.png",  competition: "Premier League" },
  { id: 338,  name: "Leicester City FC",           shortName: "Leicester",      tla: "LEI", crest: "https://crests.football-data.org/338.png",  competition: "Premier League" },
  { id: 340,  name: "Southampton FC",              shortName: "Southampton",    tla: "SOU", crest: "https://crests.football-data.org/340.png",  competition: "Premier League" },
  { id: 354,  name: "Crystal Palace FC",           shortName: "Crystal Palace", tla: "CRY", crest: "https://crests.football-data.org/354.png",  competition: "Premier League" },
  { id: 397,  name: "Brentford FC",                shortName: "Brentford",      tla: "BRE", crest: "https://crests.football-data.org/397.png",  competition: "Premier League" },
  { id: 402,  name: "Brighton and Hove Albion FC", shortName: "Brighton",       tla: "BHA", crest: "https://crests.football-data.org/402.png",  competition: "Premier League" },
  { id: 408,  name: "Ipswich Town FC",             shortName: "Ipswich",        tla: "IPS", crest: "https://crests.football-data.org/408.png",  competition: "Premier League" },
  { id: 563,  name: "Aston Villa FC",              shortName: "Aston Villa",    tla: "AVL", crest: "https://crests.football-data.org/563.png",  competition: "Premier League" },
  // Championship
  { id: 59,   name: "Blackburn Rovers FC",         shortName: "Blackburn",      tla: "BLB", crest: "https://crests.football-data.org/59.png",   competition: "Championship" },
  { id: 68,   name: "Norwich City FC",             shortName: "Norwich",        tla: "NOR", crest: "https://crests.football-data.org/68.png",   competition: "Championship" },
  { id: 69,   name: "Queens Park Rangers FC",      shortName: "QPR",            tla: "QPR", crest: "https://crests.football-data.org/69.png",   competition: "Championship" },
  { id: 70,   name: "Stoke City FC",               shortName: "Stoke",          tla: "STK", crest: "https://crests.football-data.org/70.png",   competition: "Championship" },
  { id: 72,   name: "Swansea City AFC",            shortName: "Swansea",        tla: "SWA", crest: "https://crests.football-data.org/72.png",   competition: "Championship" },
  { id: 74,   name: "West Bromwich Albion FC",     shortName: "West Brom",      tla: "WBA", crest: "https://crests.football-data.org/74.png",   competition: "Championship" },
  { id: 322,  name: "Hull City AFC",               shortName: "Hull",           tla: "HUL", crest: "https://crests.football-data.org/322.png",  competition: "Championship" },
  { id: 325,  name: