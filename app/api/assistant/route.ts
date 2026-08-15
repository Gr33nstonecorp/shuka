import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const problem =
      typeof body.problem === "string"
        ? body.problem.trim()
        : "";

    const zip =
      typeof body.zip === "string"
        ? body.zip.trim()
        : "";

    if (!problem) {
      return NextResponse.json(
        { error: "Please describe the landscaping job." },
        { status: 400 }
      );
    }

    const location = zip || "11364";

    if (!/^\d{5}$/.test(location)) {
      return NextResponse.json(
        { error: "Please enter a valid 5-digit ZIP code." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // --------------------------------------------------
    // CREATE REAL LANDSCAPING JOB
    // --------------------------------------------------

    const { data: job, error: jobError } = await supabase
      .from("landscaping_jobs")
      .insert({
        problem,
        zip_code: location,
        status: "open",

        // We will connect authenticated homeowner IDs
        // in the next stage.
        homeowner_id: null,
      })
      .select("id, problem, zip_code, status, created_at")
      .single();

    if (jobError) {
      console.error(
        "Failed to create landscaping job:",
        jobError
      );

      return NextResponse.json(
        {
          error: "Could not create landscaping request.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // TEMPORARY SCOPE CLASSIFICATION
    //
    // These results keep your current UI working.
    // Next we replace these placeholders with real
    // landscapers / marketplace quotes.
    // --------------------------------------------------

    const lower = problem.toLowerCase();

    let landscapers = [];
    let possibleScope =
      "General landscaping work recommended.";

    if (
      lower.includes("mow") ||
      lower.includes("lawn") ||
      lower.includes("grass")
    ) {
      possibleScope =
        "Regular lawn mowing and edging recommended.";

      landscapers = [
        {
          name: "Local Lawn Care Pro",
          price: 85,
          reason:
            "Typical starting estimate for mowing and edging.",
          distance: "Local",
          website: "#",
          rating: 4.9,
        },
        {
          name: "Local Landscaping Pro",
          price: 110,
          reason:
            "Typical estimate including additional lawn-care options.",
          distance: "Local",
          website: "#",
          rating: 4.7,
        },
      ];
    } else if (
      lower.includes("tree") ||
      lower.includes("branch") ||
      lower.includes("trim")
    ) {
      possibleScope =
        "Tree trimming or removal assessment recommended.";

      landscapers = [
        {
          name: "Local Tree Service Pro",
          price: 450,
          reason:
            "Typical starting estimate for tree trimming work.",
          distance: "Local",
          website: "#",
          rating: 4.8,
        },
      ];
    } else if (
      lower.includes("cleanup") ||
      lower.includes("overgrown") ||
      lower.includes("brush")
    ) {
      possibleScope =
        "Full yard cleanup and debris removal recommended.";

      landscapers = [
        {
          name: "Local Cleanup Pro",
          price: 320,
          reason:
            "Typical estimate for property cleanup and debris removal.",
          distance: "Local",
          website: "#",
          rating: 4.8,
        },
        {
          name: "Local Lawn & Cleanup Pro",
          price: 280,
          reason:
            "Typical estimate including cleanup and first mowing.",
          distance: "Local",
          website: "#",
          rating: 4.7,
        },
      ];
    } else if (
      lower.includes("hardscap") ||
      lower.includes("patio") ||
      lower.includes("stone") ||
      lower.includes("walkway")
    ) {
      possibleScope =
        "Hardscaping consultation recommended for the project.";

      landscapers = [
        {
          name: "Local Hardscape Pro",
          price: 2800,
          reason:
            "Typical preliminary estimate for patio or walkway work.",
          distance: "Local",
          website: "#",
          rating: 4.8,
        },
      ];
    } else {
      landscapers = [
        {
          name: "Local Landscaping Pro",
          price: 150,
          reason:
            "Typical starting estimate for a landscaping consultation.",
          distance: "Local",
          website: "#",
          rating: 4.8,
        },
      ];
    }

    return NextResponse.json({
      success: true,

      jobId: job.id,

      job,

      possibleScope,

      landscapers,
    });
  } catch (error) {
    console.error("Assistant route error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to create landscaping request. Please try again.",
      },
      { status: 500 }
    );
  }
}
