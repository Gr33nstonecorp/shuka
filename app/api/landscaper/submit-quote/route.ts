import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  const supabase = adminClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const jobId =
      typeof body.jobId === "string"
        ? body.jobId.trim()
        : "";

    const amount = Number(body.amount);

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing job ID." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid quote amount." },
        { status: 400 }
      );
    }

    const supabase = adminClient();

    const { data: job, error: jobError } =
      await supabase
        .from("landscaping_jobs")
        .select("id, status")
        .eq("id", jobId)
        .maybeSingle();

    if (jobError) {
      throw jobError;
    }

    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    if (
      job.status !== "open" &&
      job.status !== "quoted"
    ) {
      return NextResponse.json(
        { error: "This job is no longer accepting quotes." },
        { status: 400 }
      );
    }

    const { data: quote, error: quoteError } =
      await supabase
        .from("landscaper_quotes")
        .upsert(
          {
            job_id: jobId,
            landscaper_id: user.id,
            amount,
            message,
            status: "submitted",
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "job_id,landscaper_id",
          }
        )
        .select()
        .single();

    if (quoteError) {
      throw quoteError;
    }

    await supabase
      .from("landscaping_jobs")
      .update({
        status: "quoted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Submit quote error:", error);

    return NextResponse.json(
      { error: "Could not submit quote." },
      { status: 500 }
    );
  }
}
