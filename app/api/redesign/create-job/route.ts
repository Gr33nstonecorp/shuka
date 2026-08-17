import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function makeJobNumber() {
  return `SHUK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const body = await req.json();

    const {
      originalImage,
      redesignedImage,
      style,
      instructions,
      zip,
    } = body ?? {};

    // -----------------------------
    // Validate redesign
    // -----------------------------

    if (
      typeof redesignedImage !== "string" ||
      redesignedImage.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Redesigned image is required.",
        },
        { status: 400 }
      );
    }

    const cleanStyle =
      typeof style === "string" && style.trim()
        ? style.trim()
        : "modern";

    const cleanInstructions =
      typeof instructions === "string"
        ? instructions.trim()
        : "";

    const cleanZip =
      typeof zip === "string"
        ? zip.trim()
        : "";

    const jobNumber = makeJobNumber();

    // -----------------------------
    // Create job
    // -----------------------------
    //
    // IMPORTANT:
    // This uses the existing "jobs" table.
    //
    // We intentionally only insert fields that are
    // likely to already exist in the ShukAI jobs table.
    // If your jobs table uses different column names,
    // Supabase will tell us exactly which one needs
    // adjusting.
    // -----------------------------

    const jobPayload: Record<string, unknown> = {
      problem:
        cleanInstructions ||
        `${cleanStyle} landscaping redesign`,
      zip: cleanZip || null,
      status: "open",
    };

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .insert(jobPayload)
      .select()
      .single();

    if (jobError) {
      console.error("Create redesign job error:", jobError);

      return NextResponse.json(
        {
          error: "Could not create landscaping job.",
          details: jobError.message,
        },
        { status: 500 }
      );
    }

    // -----------------------------
    // Return job information
    // -----------------------------

    return NextResponse.json({
      success: true,

      job: {
        ...job,

        // Frontend-friendly values
        jobNumber,
        redesign: {
          originalImage:
            typeof originalImage === "string"
              ? originalImage
              : null,

          redesignedImage,

          style: cleanStyle,

          instructions: cleanInstructions,
        },
      },

      message:
        "Your redesign has been turned into a landscaping job.",
    });
  } catch (error) {
    console.error("ShukAI create-job error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Could not create landscaping job.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
