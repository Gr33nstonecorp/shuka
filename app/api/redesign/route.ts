import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

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

export async function POST(
  req: NextRequest
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const formData =
      await req.formData();

    const image =
      formData.get("image");

    const style =
      String(
        formData.get("style") ||
          "modern"
      );

    const instructions =
      String(
        formData.get(
          "instructions"
        ) || ""
      ).trim();

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Please upload a yard photo.",
        },
        { status: 400 }
      );
    }

    if (
      !image.type.startsWith(
        "image/"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Uploaded file must be an image.",
        },
        { status: 400 }
      );
    }

    if (
      image.size >
      10 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer =
      await image.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    const uploadedImage =
      await toFile(
        buffer,
        image.name ||
          "yard.jpg",
        {
          type:
            image.type ||
            "image/jpeg",
        }
      );

    const selectedStyle =
      stylePrompts[style] ||
      stylePrompts.modern;

    const prompt = `
Redesign the landscaping in this exact residential property photo.

IMPORTANT:
Preserve the original property, house, driveway, fences, patios, structures, camera angle, perspective, terrain, and overall geometry.

Do not replace the house or invent a different property.

Only redesign the landscaping and reasonable outdoor landscape features.

Design style:
${selectedStyle}

Homeowner requests:
${
  instructions ||
  "Create an attractive, practical and realistic landscape redesign."
}

The finished result should look like a photorealistic professional landscaping visualization of what this same property could realistically look like after the work is completed.

Keep existing major structures unless the homeowner specifically requested otherwise.

Use realistic plants, materials, proportions, shadows and lighting.

Do not add text, labels, diagrams, arrows, people, logos or watermarks.
`;

    const result =
      await openai.images.edit({
        model: "gpt-image-2",

        image: uploadedImage,

        prompt,

        size: "1536x1024",

        quality: "medium",
      });

    const generated =
      result.data?.[0]
        ?.b64_json;

    if (!generated) {
      return NextResponse.json(
        {
          error:
            "The image model did not return a redesign.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: `data:image/png;base64,${generated}`,
    });
  } catch (error) {
    console.error(
      "ShukAI redesign error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not generate redesign.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
