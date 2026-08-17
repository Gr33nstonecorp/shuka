import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function extensionFromMime(
  mime: string
) {
  if (mime === "image/png") {
    return "png";
  }

  if (mime === "image/webp") {
    return "webp";
  }

  return "jpg";
}

export async function POST(
  req: NextRequest
) {
  try {
    /*
      IMPORTANT:

      The frontend sends FormData.

      Therefore this route MUST use
      req.formData(), NOT req.json().
    */

    const formData =
      await req.formData();

    const originalImage =
      formData.get("originalImage");

    const redesignImage =
      formData.get("redesignImage");

    const style =
      String(
        formData.get("style") ||
          "modern"
      ).trim();

    const instructions =
      String(
        formData.get(
          "instructions"
        ) || ""
      ).trim();

    const zip =
      String(
        formData.get("zip") || ""
      ).trim();

    // ---------------------------------
    // VALIDATION
    // ---------------------------------

    if (
      !(originalImage instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "Original yard photo is missing.",
        },
        { status: 400 }
      );
    }

    if (
      !(redesignImage instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "AI redesign image is missing.",
        },
        { status: 400 }
      );
    }

    if (
      !allowedImageTypes.includes(
        originalImage.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Original image must be JPG, PNG, or WEBP.",
        },
        { status: 400 }
      );
    }

    if (
      !allowedImageTypes.includes(
        redesignImage.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Redesign image must be JPG, PNG, or WEBP.",
        },
        { status: 400 }
      );
    }

    if (
      originalImage.size >
      10 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "Original image must be under 10 MB.",
        },
        { status: 400 }
      );
    }

    if (
      redesignImage.size >
      10 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "Redesign image must be under 10 MB.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json(
        {
          error:
            "Enter a valid 5-digit ZIP code.",
        },
        { status: 400 }
      );
    }

    const supabase =
      getSupabaseAdmin();

    /*
      Generate the ID ourselves so the
      image folder and database job use
      the same ID.
    */

    const jobId =
      crypto.randomUUID();

    // ---------------------------------
    // SAVE ORIGINAL PHOTO
    // ---------------------------------

    const originalExtension =
      extensionFromMime(
        originalImage.type
      );

    const originalPath =
      `${jobId}/original.${originalExtension}`;

    const originalBuffer =
      Buffer.from(
        await originalImage.arrayBuffer()
      );

    const {
      error: originalUploadError,
    } =
      await supabase.storage
        .from("redesigns")
        .upload(
          originalPath,
          originalBuffer,
          {
            contentType:
              originalImage.type,

            upsert: false,
          }
        );

    if (originalUploadError) {
      console.error(
        "Original image upload error:",
        originalUploadError
      );

      return NextResponse.json(
        {
          error:
            `Could not save original photo: ${originalUploadError.message}`,
        },
        { status: 500 }
      );
    }

    // ---------------------------------
    // SAVE AI REDESIGN
    // ---------------------------------

    const redesignExtension =
      extensionFromMime(
        redesignImage.type
      );

    const redesignPath =
      `${jobId}/redesign.${redesignExtension}`;

    const redesignBuffer =
      Buffer.from(
        await redesignImage.arrayBuffer()
      );

    const {
      error: redesignUploadError,
    } =
      await supabase.storage
        .from("redesigns")
        .upload(
          redesignPath,
          redesignBuffer,
          {
            contentType:
              redesignImage.type,

            upsert: false,
          }
        );

    if (redesignUploadError) {
      console.error(
        "Redesign upload error:",
        redesignUploadError
      );

      /*
        Don't leave the original photo
        behind if the redesign upload
        fails.
      */

      await supabase.storage
        .from("redesigns")
        .remove([
          originalPath,
        ]);

      return NextResponse.json(
        {
          error:
            `Could not save redesign: ${redesignUploadError.message}`,
        },
        { status: 500 }
      );
    }

    // ---------------------------------
    // CREATE REAL LANDSCAPING JOB
    // ---------------------------------

    const problem =
      instructions ||
      `Build landscaping based on the attached ${style} AI redesign.`;

    const {
      data: job,
      error: jobError,
    } =
      await supabase
        .from(
          "landscaping_jobs"
        )
        .insert({
          id: jobId,

          homeowner_id: null,

          problem,

          zip_code: zip,

          status: "open",

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
        .select("id")
        .single();

    if (jobError) {
      console.error(
        "Landscaping job insert error:",
        jobError
      );

      /*
        Clean up both uploaded images
        if database creation fails.
      */

      await supabase.storage
        .from("redesigns")
        .remove([
          originalPath,
          redesignPath,
        ]);

      return NextResponse.json(
        {
          error:
            `Could not create landscaping job: ${jobError.message}`,
        },
        { status: 500 }
      );
    }

    // ---------------------------------
    // SUCCESS
    // ---------------------------------

    return NextResponse.json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    console.error(
      "CREATE REDESIGN JOB ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create landscaping job.",
      },
      { status: 500 }
    );
  }
}
