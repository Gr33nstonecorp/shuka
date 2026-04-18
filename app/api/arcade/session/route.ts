import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: sessionRow, error } = await supabase
      .from("arcade_sessions")
      .select("id, email, player_name, status, created_at, paid_at, used_at")
      .eq("id", sessionId)
      .single();

    if (error || !sessionRow) {
      return Response.json(
        { error: "Arcade session not found." },
        { status: 404 }
      );
    }

    const canPlay =
      sessionRow.status === "paid" && !sessionRow.used_at;

    return Response.json({
      session: sessionRow,
      canPlay,
    });
  } catch (error: any) {
    console.error("Arcade session fetch error:", error);
    return Response.json(
      { error: error.message || "Could not load arcade session." },
      { status: 500 }
    );
  }
}
