import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("arcade_scores")
      .select("id, player_name, score, created_at")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(25);

    if (error) {
      return Response.json(
        { error: "Could not load leaderboard." },
        { status: 500 }
      );
    }

    return Response.json({ scores: data || [] });
  } catch (error: any) {
    console.error("Arcade leaderboard error:", error);
    return Response.json(
      { error: error.message || "Could not load leaderboard." },
      { status: 500 }
    );
  }
}
