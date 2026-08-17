import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stylePrompts: Record<string, string> = {
  modern:
    "modern contemporary landscaping, clean geometric planting beds, manicured greenery, tasteful stonework, elegant but realistic residential landscaping",

  "low-maintenance":
    "beautiful low-maintenance landscaping using easy-care plants, mulch, decorative stone, simple planting beds and practical residential landscaping",

  luxury:
    "high-end luxury residential landscaping with premium plantings, sophisticated hardscape details, layered greenery and elegant landscape design",

  natural:
    "natural organic landscape design using native-looking plants, soft garden shapes, layered greenery and an environmentally harmonious residential yard",

  minimal:
    "minimalist residential landscaping with restrained planting, clean lines, uncluttered beds, simple greenery and refined modern landscape design",
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing in Vercel.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const image = formData.get("image");

    const style = String(
      formData.get("style") || "modern"
    );

    const instructions = String(
      formData.get("instructions") || ""
    ).trim();

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a yard photo.",
        },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "The uploaded file must be an image.",
        },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Please use an image smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    // Convert uploaded image to base64 data URL
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mimeType =
      image.type || "image/jpeg";

    const base64Image =
      buffer.toString("base64");

    const imageDataUrl =
      `data:${mimeType};base64,${base64Image}`;

    const selectedStyle =
      stylePrompts[style] ||
      stylePrompts.modern;

    const prompt = `
Edit the uploaded photograph to create a realistic landscaping redesign.

This MUST remain the same property shown in the uploaded image.

PRESERVE:
- the house
- building shape
- windows
- doors
- roof
- driveway
- fences
- retaining walls
- patios
- major structures
- terrain
- camera angle
- perspective
- property proportions

Do NOT invent a different house or property.

Only redesign landscaping and reasonable outdoor landscape elements.

DESIGN STYLE:
${selectedStyle}

HOMEOWNER REQUEST:
${
  instructions ||
  "Create a beautiful, practical and realistic landscaping redesign."
}

The output should look like a professional photorealistic landscape visualization showing what this exact yard could realistically look like after professional landscaping work.

Use realistic:
- plants
- shrubs
- trees
- grass
- mulch
- stone
- pathways
- garden beds
- landscape lighting when appropriate

Keep everything structurally believable.

Do not add:
- people
- words
- labels
- arrows
- logos
- watermarks

Return a redesigned version of the uploaded property photo.
`;

    console.log("Starting ShukAI redesign request", {
      imageType: mimeType,
      imageSize: image.size,
      style,
    });

    const response = await openai.responses.create({
      model: "gpt-5.6",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "auto",
            },
          ],
        },
      ],

      tools: [
        {
          type: "image_generation",
          action: "edit",
        },
      ],
    });

    const imageCalls = response.output.filter(
      (output: any) =>
        output.type === "image_generation_call"
    );

    if (!imageCalls.length) {
      console.error(
        "No image generation call returned",
        response.output
      );

      return NextResponse.json(
        {
          error:
            "OpenAI did not return a redesigned image.",
        },
        { status: 500 }
      );
    }

    const generatedImage =
      imageCalls[0]?.result;

    if (!generatedImage) {
      return NextResponse.json(
        {
          error:
            "The redesign completed but no image data was returned.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${generatedImage}`,
    });
  } catch (error: any) {
    console.error(
      "SHUKAI REDESIGN ERROR:",
      error
    );

    const status =
      typeof error?.status === "number"
        ? error.status
        : 500;

    const code =
      error?.code ||
      error?.error?.code ||
      null;

    let message =
      error?.message ||
      "Could not generate redesign.";

    if (status === 401) {
      message =
        "OpenAI rejected the API key. Check OPENAI_API_KEY in Vercel and redeploy.";
    }

    if (status === 429) {
      message =
        "OpenAI API credits or rate limit reached. Check your OpenAI API billing.";
    }

    if (
      code === "insufficient_quota"
    ) {
      message =
        "Your OpenAI API account does not currently have enough API credits.";
    }

    return NextResponse.json(
      {
        error: message,
        debug: {
          status,
          code,
        },
      },
      { status }
    );
  }
}
