import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

type ProfileRow = {
  id: string;
  plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

type ParsedItem = {
  item: string;
  quantity: number;
};

type VendorSource = {
  id: string;
  name: string;
  vendor_type: string | null;
  category: string | null;
  default_ai_score: number | null;
  search_url_template: string | null;
  active: boolean | null;
};

type ModelResult = {
  item: string;
  quantity: number;
  best_quote: {
    vendor_name: string;
    total: number;
    reason: string;
    product_url: string;
  };
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function hasActivePaidPlan(profile: ProfileRow | null) {
  if (!profile) return false;

  const paidPlan = profile.plan === "starter" || profile.plan === "premium";
  const activeStatus =
    profile.subscription_status === "active" ||
    profile.subscription_status === "trialing";

  if (!paidPlan || !activeStatus) return false;

  if (!profile.current_period_end) return activeStatus;

  const end = new Date(profile.current_period_end).getTime();
  return Number.isFinite(end) && end > Date.now();
}

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

function estimateVendorPricing(
  vendorType: string,
  vendorCategory: string,
  vendorName: string,
  quantity: number
) {
  const type = (vendorType || "").toLowerCase();
  const category = (vendorCategory || "").toLowerCase();
  const name = (vendorName || "").toLowerCase();
  const qty = Number(quantity) || 1;

  let unitPrice = 20;
  let shippingCost = 6;
  let leadTimeDays = 3;

  if (type.includes("marketplace")) {
    unitPrice = 17;
    shippingCost = 7;
    leadTimeDays = 4;
  }

  if (type.includes("supplier")) {
    unitPrice = 21;
    shippingCost = 6;
    leadTimeDays = 3;
  }

  if (category.includes("industrial")) {
    unitPrice += 3;
    leadTimeDays = Math.max(2, leadTimeDays - 1);
  }

  if (category.includes("office")) {
    unitPrice += 1;
    shippingCost -= 1;
  }

  if (category.includes("packaging")) {
    unitPrice -= 1;
  }

  if (category.includes("wholesale")) {
    unitPrice -= 2;
    leadTimeDays += 3;
  }

  if (name.includes("amazon")) {
    unitPrice -= 1;
    shippingCost -= 1;
    leadTimeDays = 2;
  }

  if (name.includes("uline")) {
    unitPrice += 1;
    shippingCost += 1;
    leadTimeDays = 3;
  }

  if (name.includes("grainger")) {
    unitPrice += 2;
    leadTimeDays = 2;
  }

  if (name.includes("alibaba")) {
    unitPrice -= 4;
    shippingCost += 8;
    leadTimeDays = 10;
  }

  if (name.includes("global")) {
    unitPrice += 1;
    shippingCost += 1;
    leadTimeDays = 4;
  }

  if (name.includes("staples")) {
    unitPrice += 1;
    shippingCost -= 1;
    leadTimeDays = 2;
  }

  if (name.includes("office depot")) {
    unitPrice += 2;
    leadTimeDays = 3;
  }

  if (name.includes("fastenal")) {
    unitPrice += 3;
    shippingCost += 1;
    leadTimeDays = 2;
  }

  if (name.includes("msc")) {
    unitPrice += 4;
    shippingCost += 1;
    leadTimeDays = 3;
  }

  if (name.includes("walmart")) {
    unitPrice -= 2;
    leadTimeDays = 3;
  }

  let bulkDiscount = 0;
  if (qty >= 500) bulkDiscount = 0.18;
  else if (qty >= 200) bulkDiscount = 0.12;
  else if (qty >= 100) bulkDiscount = 0.08;
  else if (qty >= 50) bulkDiscount = 0.05;
  else if (qty >= 20) bulkDiscount = 0.03;

  unitPrice = unitPrice * (1 - bulkDiscount);

  if (qty >= 100) shippingCost += 4;
  else if (qty >= 50) shippingCost += 2;

  return {
    unit_price: Number(unitPrice.toFixed(2)),
    shipping_cost: Number(Math.max(0, shippingCost).toFixed(2)),
    lead_time_days: leadTimeDays,
  };
}

function buildVendorOptions(items: ParsedItem[], vendors: VendorSource[]) {
  return items.map((item) => {
    const enhanced = enhanceSearch(item.item);

    const options = vendors.map((vendor) => {
      const pricing = estimateVendorPricing(
        vendor.vendor_type || "",
        vendor.category || "",
        vendor.name || "",
        item.quantity
      );

      const total = Number(
        (pricing.unit_price * item.quantity + pricing.shipping_cost).toFixed(2)
      );

      const searchTerm = encodeURIComponent(
        enhanced.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim()
      );

      const productUrl = vendor.search_url_template
        ? vendor.search_url_template.replace("{searchTerm}", searchTerm)
        : "";

      return {
        vendor_name: vendor.name,
        vendor_type: vendor.vendor_type || "",
        category: vendor.category || "",
        ai_score: Number(vendor.default_ai_score || 0),
        estimated_unit_price: pricing.unit_price,
        estimated_shipping_cost: pricing.shipping_cost,
        estimated_lead_time_days: pricing.lead_time_days,
        estimated_total: total,
        product_url: productUrl,
        search_used: enhanced,
      };
    });

    return {
      item: item.item,
      quantity: item.quantity,
      vendor_options: options,
    };
  });
}

function cleanJsonText(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY in environment variables." },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseUserClient.auth.getUser(accessToken);

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, plan, subscription_status, current_period_end")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return Response.json(
        { error: "Profile lookup failed" },
        { status: 500 }
      );
    }

    if (!hasActivePaidPlan(profile)) {
      return Response.json(
        { error: "Active paid subscription required" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const rawInput = typeof body?.input === "string" ? body.input : "";
    const items = parseInput(rawInput);

    if (!items.length) {
      return Response.json(
        { error: "No valid items provided" },
        { status: 400 }
      );
    }

    const { data: vendors, error: vendorError } = await supabaseAdmin
      .from("vendor_sources")
      .select(
        "id, name, vendor_type, category, default_ai_score, search_url_template, active"
      )
      .eq("active", true)
      .order("default_ai_score", { ascending: false });

    if (vendorError) {
      return Response.json(
        { error: "Vendor lookup failed: " + vendorError.message },
        { status: 500 }
      );
    }

    if (!vendors || vendors.length === 0) {
      return Response.json(
        { error: "No active vendor sources found." },
        { status: 500 }
      );
    }

    const vendorCatalog = buildVendorOptions(items, vendors as VendorSource[]);

    const systemPrompt = `
You are the sourcing engine for ShukAI.
You must choose exactly one best vendor option for each requested item.
Use ONLY the provided vendor options. Do not invent vendors, prices, or URLs.

Optimize for:
1. Lowest estimated total cost
2. Higher AI score
3. Faster lead time
4. Reasonable fit for the item category

Return ONLY valid JSON in this exact shape:
{
  "results": [
    {
      "item": "string",
      "quantity": 1,
      "best_quote": {
        "vendor_name": "string",
        "total": 0,
        "reason": "string",
        "product_url": "string"
      }
    }
  ]
}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              requested_items: items,
              vendor_catalog: vendorCatalog,
            },
            null,
            2
          ),
        },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "";
    const parsed = JSON.parse(cleanJsonText(content));

    if (!Array.isArray(parsed?.results)) {
      return Response.json(
        { error: "Model returned invalid response format." },
        { status: 500 }
      );
    }

    return Response.json({
      results: parsed.results as ModelResult[],
    });
  } catch (err) {
    console.error("Assistant route error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
