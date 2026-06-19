# ⚽ Fan Travel Tracker

Calculate how many miles you travelled following your football club across all competitions this season. Works for any UK club in the Premier League, Championship, and European competitions.

## Features

- 🔍 Search any UK football club
- 📍 Enter your postcode — distances calculated automatically (no API key needed for this)
- 🏆 Covers Premier League, Championship, FA Cup, EFL Cup, Champions League, Europa League, Conference League
- ✅ Toggle each game to mark whether you attended or missed it
- 📊 Live summary showing total miles, attended miles, breakdown by competition

## Setup

### 1. Get a free football-data.org API key

Sign up at **https://www.football-data.org/client/register** — it's free and instant. The free tier covers PL, Championship, FA Cup, EFL Cup, and European competitions.

### 2. Add your API key

Copy `.env.local` and add your key:

```bash
cp .env.local .env.local
```

Edit `.env.local`:
```
FOOTBALL_DATA_API_KEY=your_key_here
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel (free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add your `FOOTBALL_DATA_API_KEY` as an Environment Variable in the Vercel dashboard
4. Deploy — done!

## How distances work

- UK postcodes are resolved via [postcodes.io](https://postcodes.io) (free, no key needed)
- Distances use the Haversine formula with a 1.25× road factor to approximate driving distance
- European venue coordinates are built-in for all common Champions League / Europa League grounds
- All distances are **round trip** (there and back)

## Tech stack

- **Next.js 15** (App Router)
- **TypeScript**
- **football-data.org** for fixtures
- **postcodes.io** for UK postcode geocoding
- Deployed on **Vercel** (recommended)

## Adding more venues

Edit `lib/venues.ts` to add stadium coordinates for teams not yet included. The key is the team's football-data.org ID.

```ts
9999: { name: "My Stadium", city: "My City", lat: 51.123, lng: -0.456 },
```

To find a team's ID, search for them at `https://api.football-data.org/v4/teams?name=TeamName` with your API key.
