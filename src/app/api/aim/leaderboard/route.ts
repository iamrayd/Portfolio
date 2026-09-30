import { readLeaderboard, readVisitorId } from "@/lib/aim/leaderboard";
import { scoreStore } from "@/lib/aim/store";

export async function GET() {
  if (!scoreStore) {
    return Response.json({ error: "Leaderboard is not configured" }, { status: 503 });
  }

  try {
    const leaderboard = await readLeaderboard(scoreStore, await readVisitorId());
    return Response.json(leaderboard, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to read aim leaderboard", error);
    return Response.json({ error: "Leaderboard is unavailable" }, { status: 502 });
  }
}
