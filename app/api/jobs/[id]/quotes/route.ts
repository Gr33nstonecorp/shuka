import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing job ID." },
        { status: 400 }
      );
    }

    const supabase = adminClient();

    const { data: quotes, error } = await supabase
      .from("landscaper_quotes")
      .select(`
        id,
        landscaper_id,
        amount,
        message,
        status,
        created_at
      `)
      .eq("job_id", id)
      .in("status", [
        "submitted",
        "accepted",
        "pending_payment",
        "paid",
      ])
      .order("amount", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    if (!quotes?.length) {
      return NextResponse.json({
        quotes: [],
      });
    }

    const landscaperIds = [
      ...new Set(
        quotes.map((quote) => quote.landscaper_id)
      ),
    ];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", landscaperIds);

    const names = new Map(
      (profiles || []).map((profile: any) => [
        profile.id,
        profile.full_name || "Local Landscaper",
      ])
    );

    const formattedQuotes = quotes.map((quote) => ({
      id: quote.id,
      amount: Number(quote.amount),
      message: quote.message,
      status: quote.status,
      landscaperId: quote.landscaper_id,
      landscaperName:
        names.get(quote.landscaper_id) ||
        "Local Landscaper",
    }));

    return NextResponse.json({
      quotes: formattedQuotes,
    });
  } catch (error) {
    console.error("Get quotes error:", error);

    return NextResponse.json(
      { error: "Could not load quotes." },
      { status: 500 }
    );
  }
}
