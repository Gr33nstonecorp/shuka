import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
    const playerName =
      typeof body?.playerName === "string" && body.playerName.trim()
        ? body.playerName.trim()
        : "Player";
    const score =
      typeof body?.score === "number" ? Math.max(0, Math.floor(body.score)) : 0;

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: sessionRow, error: sessionError } = await supabase
      .from("arcade_sessions")
      .select("id, status, used_at, player_name")
      .eq("id", sessionId)
      .single();

    if (sessionError || !sessionRow) {
      return Response.json({ error: "Arcade session not found." }, { status: 404 });
    }

    if (sessionRow.status !== "paid") {
      return Response.json({ error: "This arcade session is not paid." }, { status: 403 });
    }

    if (sessionRow.used_at) {
      return Response.json({ error: "This arcade session was already used." }, { status: 403 });
    }

    const { error: scoreError } = await supabase.from("arcade_scores").insert({
      session_id: sessionId,
      player_name: playerName || sessionRow.player_name || "Player",
      score,
    });

    if (scoreError) {
      return Response.json({ error: "Could not save score." }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("arcade_sessions")
      .update({
        status: "used",
        used_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (updateError) {
      return Response.json({ error: "Score saved, but session update failed." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Submit score error:", error);
    return Response.json(
      { error: error?.message || "Could not submit score." },
      { status: 500 }
    );
  }
}
