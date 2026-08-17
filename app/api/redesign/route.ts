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
          error: "Uploaded file must be an image.",
        },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Please choose an image smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    /*
      Convert uploaded photo to base64 data URL
    */

    const bytes = await image.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const mimeType =
      image.type || "image/jpeg";

    const base64 =
      buffer.toString("base64");

    const imageDataUrl =
      `data:${mimeType};base64,${base64}`;

    /*
      Landscaping style
    */

    const selectedStyle =
      stylePrompts[style] ||
      stylePrompts.modern;

    /*
      Strong prompt to preserve the actual property
    */

    const prompt = `
You are a professional residential landscape designer.

Redesign the landscaping shown in the uploaded photograph.

IMPORTANT:

This MUST remain the exact same property.

Preserve:
- house
- roof
- windows
- doors
- driveway
- fences
- patios
- retaining walls
- major structures
- terrain
- camera position
- camera angle
- perspective
- property proportions

Do NOT replace the house.

Do NOT invent a different property.

Only redesign the landscaping and reasonable outdoor landscape elements.

DESIGN STYLE:

${selectedStyle}

HOMEOWNER REQUEST:

${
  instructions ||
  "Create a beautiful, realistic and practical landscaping redesign."
}

Create a photorealistic professional landscape visualization showing what this exact property could realistically look like after professional landscaping work.

Use realistic:

- grass
- plants
- shrubs
- trees
- garden beds
- mulch
- stone
- walkways
- landscape lighting where appropriate

Keep everything believable and buildable.

Do not add:
- text
- labels
- arrows
- logos
- watermarks
- diagrams

Return an image showing the redesigned version of this same yard.
`;

    console.log("Starting ShukAI redesign", {
      style,
      imageType: mimeType,
      imageSize: image.size,
    });

    /*
      Responses API

      The uploaded yard photo is included as input_image.

      The image_generation tool then produces the
      redesigned image.
    */

    const response =
      await openai.responses.create({
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
          },
        ],
      });

    /*
      Find the generated image result
    */

    const imageCall =
      response.output.find(
        (item: any) =>
          item.type ===
          "image_generation_call"
      ) as any;

    if (!imageCall) {
      console.error(
        "No image generation result:",
        response.output
      );

      return NextResponse.json(
        {
          error:
            "OpenAI did not generate a redesign image.",
        },
        { status: 500 }
      );
    }

    const generated =
      imageCall.result;

    if (!generated) {
      return NextResponse.json(
        {
          error:
            "Image generation completed but returned no image data.",
        },
        { status: 500 }
      );
    }

    /*
      Return image to frontend
    */

    return NextResponse.json({
      success: true,

      image:
        `data:image/png;base64,${generated}`,
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

    /*
      Friendly error messages
    */

    if (status === 401) {
      message =
        "OpenAI rejected the API key. Check OPENAI_API_KEY in Vercel.";
    }

    if (
      status === 429 ||
      code === "insufficient_quota"
    ) {
      message =
        "OpenAI API credits or rate limit reached. Check your OpenAI API billing.";
    }

    return NextResponse.json(
      {
        error: message,

        debug: {
          status,
          code,
        },
      },

      {
        status:
          status >= 400 &&
          status <= 599
            ? status
            : 500,
      }
    );
  }
}
