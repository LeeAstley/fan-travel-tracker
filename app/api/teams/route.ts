import { NextRequest, NextResponse } from "next/server";
import { searchTeams } from "@/lib/footballData";

export async function GET(req: NextRequest) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY not configured" }, { status: 500 });
  }
  const name = req.nextUrl.searchParams.get("name") ?? "";
  if (name.length < 3) {
    return NextResponse.json({ teams: [] });
  }
  try {
    const teams = await searchTeams(name, apiKey);
    return NextResponse.json({ teams });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
