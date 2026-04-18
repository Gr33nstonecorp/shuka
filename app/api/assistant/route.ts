import { NextRequest } from "next/server";

type ParsedItem = {
  item: string;
  quantity: number;
};

type ProductResult = {
  item: string;
  vendor: string;
  website: string;
  price: number;
  reason: string;
  delivery: string;
};

function parseInput(input: string): ParsedItem[] {
  return input
    .split("\n")
    .map((line) => {
      const [name, qty] = line.split("-");
      return {
        item: name?.trim() || "",
        quantity: Number(qty?.trim()) || 1,
      };
    })
    .filter((x) => x.item.length > 0);
}

function enhanceSearch(term: string) {
  const t = term.toLowerCase();

  if (t.includes("tape")) return "heavy duty packing tape bulk";
  if (t.includes("gloves")) return "industrial nitrile gloves bulk powder free";
  if (t.includes("box")) return "corrugated shipping boxes bulk";
  if (t.includes("label")) return "thermal shipping labels roll";
  if (t.includes("clean")) return "industrial cleaning supplies bulk";
  if (t.includes("paper towel")) return "paper towels bulk commercial";
  if (t.includes("toilet paper")) return "toilet paper bulk commercial";
  if (t.includes("trash bag")) return "heavy duty trash bags bulk";
  if (t.includes("scanner")) return "barcode scanner handheld commercial";

  return `${term} bulk wholesale`;
}

function chooseBestResult(item: string, quantity: number, shoppingResults: any[]): ProductResult | null {
  if (!Array.isArray(shoppingResults) || shoppingResults.length === 0) return null;

  const normalized = shoppingResults
    .map((r) => {
      const price =
        typeof r.extracted_price === "number"
          ? r.extracted_price
          : typeof r.price === "string"
          ? Number(String(r.price).replace(/[^0-9.]/g, ""))
          : NaN;

      const website =
        r.product_link ||
        r.link ||
        r.serpapi_product_api ||
        "";

      return {
        title: r.title || item,
        vendor: r.source || "Unknown vendor",
        website,
        price,
        delivery:
          Array.isArray(r.extensions) && r.extensions.length > 0
            ? r.extensions.join(" • ")
            : r.delivery || "Delivery details not shown",
        rating: typeof r.rating === "number" ? r.rating : 0,
        reviews: typeof r.reviews === "number" ? r.reviews : 0,
      };
    })
    .filter((r) => Number.isFinite(r.price) && r.price > 0 && r.website);

  if (normalized.length === 0) return null;

  normalized.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const best = normalized[0];

  return {
    item,
    vendor: best.vendor,
    website: best.website,
    price: Number((best.price * Math.max(1, quantity)).toFixed(2)),
    reason: `Lowest live price found from ${best.vendor} for the requested item.`,
    delivery: best.delivery,
  };
}

async function fetchGoogleShopping(query: string) {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing SERPAPI_API_KEY");
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("hl", "en");
  url.searchParams.set("gl", "us");
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SerpApi failed: ${text}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawInput = typeof body?.input === "string" ? body.input : "";
    const items = parseInput(rawInput);

    if (!items.length) {
      return Response.json(
        { error: "No valid items provided" },
        { status: 400 }
      );
    }

    const results: ProductResult[] = [];

    for (const entry of items) {
      const query = enhanceSearch(entry.item);
      const shoppingData = await fetchGoogleShopping(query);
      const best = chooseBestResult(
        entry.item,
        entry.quantity,
        shoppingData.shopping_results || []
      );

      if (best) {
        results.push(best);
      } else {
        results.push({
          item: entry.item,
          vendor: "No live result found",
          website: "",
          price: 0,
          reason: "No reliable live shopping result was found for this item.",
          delivery: "Unavailable",
        });
      }
    }

    return Response.json({ results });
  } catch (error: any) {
    console.error("Assistant route error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
