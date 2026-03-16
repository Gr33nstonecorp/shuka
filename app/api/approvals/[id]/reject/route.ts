import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../../lib/supabaseServer";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("quote_options")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/approvals", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
