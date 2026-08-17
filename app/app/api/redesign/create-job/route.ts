import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function decodeDataUrl(dataUrl: string) {
  const match = dataUrl.match(
    /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/
  );

  if (!match) {
    throw new Error("Invalid generated image.");
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function extensionFromMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const originalImage = formData.get("originalImage");
    const generatedImage = String(
      formData.get("generatedImage") || ""
    );

    const style = String(
      formData.get("style") || "modern"
    );

    const instructions = String(
      formData.get("instructions") || ""
    ).trim();

    const zip = String(
      formData.get("zip") || ""
    ).trim();

    if (!(originalImage instanceof File)) {
      return NextResponse.json(
        {
          error: "Original yard photo is missing.",
        },
        { status: 400 }
      );
    }

    if (!generatedImage) {
      return NextResponse.json(
        {
          error: "AI redesign image is missing.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json(
        {
          error: "Enter a valid 5-digit ZIP code.",
        },
        { status: 400 }
      );
    }

    if (!originalImage.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Original file must be an image.",
        },
        { status: 400 }
      );
    }

    if (originalImage.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Original image must be under 10 MB.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const jobId = crypto.randomUUID();

    // -----------------------------------------
    // ORIGINAL IMAGE
    // -----------------------------------------

    const originalBuffer = Buffer.from(
      await originalImage.arrayBuffer()
    );

    const originalExtension =
      extensionFromMime(originalImage.type);

    const originalPath =
      `${jobId}/original.${originalExtension}`;

    const {
      error: originalUploadError,
    } = await supabase.storage
      .from("redesigns")
      .upload(
        originalPath,
        originalBuffer,
        {
          contentType:
            originalImage.type || "image/jpeg",

          upsert: false,
        }
      );

    if (originalUploadError) {
      console.error(
        "Original upload error:",
        originalUploadError
      );

      return NextResponse.json(
        {
          error:
            "Could not save original yard photo.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // GENERATED IMAGE
    // -----------------------------------------

    const decoded =
      decodeDataUrl(generatedImage);

    const redesignExtension =
      extensionFromMime(decoded.mimeType);

    const redesignPath =
      `${jobId}/redesign.${redesignExtension}`;

    const {
      error: redesignUploadError,
    } = await supabase.storage
      .from("redesigns")
      .upload(
        redesignPath,
        decoded.buffer,
        {
          contentType: decoded.mimeType,
          upsert: false,
        }
      );

    if (redesignUploadError) {
      console.error(
        "Redesign upload error:",
        redesignUploadError
      );

      // Clean up original if second upload fails
      await supabase.storage
        .from("redesigns")
        .remove([originalPath]);

      return NextResponse.json(
        {
          error:
            "Could not save AI redesign.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // CREATE REAL LANDSCAPING JOB
    // -----------------------------------------

    const problem =
      instructions ||
      `Build landscaping based on the attached ${style} AI redesign.`;

    const {
      data: job,
      error: jobError,
    } = await supabase
      .from("landscaping_jobs")
      .insert({
        id: jobId,

        problem,

        zip_code: zip,

        status: "open",

        homeowner_id: null,

        original_image_path:
          originalPath,

        redesign_image_path:
          redesignPath,

        redesign_style:
          style,

        redesign_instructions:
          instructions || null,

        source:
          "ai_redesign",
      })
      .select()
      .single();

    if (jobError) {
      console.error(
        "Redesign job creation error:",
        jobError
      );

      await supabase.storage
        .from("redesigns")
        .remove([
          originalPath,
          redesignPath,
        ]);

      return NextResponse.json(
        {
          error:
            "Could not create landscaping job.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    console.error(
      "Create redesign job error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create job.",
      },
      { status: 500 }
    );
  }
}
