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

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const supabase = adminClient();

    const { data: jobs, error } = await supabase
      .from("landscaping_jobs")
      .select(`
        id,
        problem,
        zip_code,
        status,
        created_at
      `)
      .in("status", ["open", "quoted"])
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      jobs: jobs || [],
    });
  } catch (error) {
    console.error("Open jobs error:", error);

    return NextResponse.json(
      { error: "Could not load open jobs." },
      { status: 500 }
    );
  }
}
