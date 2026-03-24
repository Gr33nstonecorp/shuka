import { createClient } from "@supabase/supabase-js";

type VendorSource = {
  id: string;
  name: string | null;
  vendor_type: string | null;
  category: string | null;
  default_ai_score: number | null;
  active: boolean | null;
  search_url_template: string | null;
};

type QuoteOptionInsert = {
  request_id: string;
  vendor_name: string | null;
  unit_price: number;
  shipping_cost: number;
  lead_time_days: number;
  ai_score: number | null;
  recommendation: string;
  status: string;
  product_url: string | null;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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

function buildProductUrl(template: string | null, encodedSearchTerm: string) {
  if (!template) return null;
  if (!template.includes("{searchTerm}")) return template;
  return template.replace("{searchTerm}", encodedSearchTerm);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const requestId =
      typeof body.request_id === "string" ? body.request_id.trim() : "";
    const productName =
      typeof body.product_name === "string" ? body.product_name.trim() : "";
    const qty = Number(body.quantity);

    if (!requestId) {
      return jsonResponse({ error: "Missing request_id" }, 400);
    }

    if (!productName) {
      return jsonResponse({ error: "Missing product_name" }, 400);
    }

    if (!Number.isFinite(qty) || qty < 1) {
      return jsonResponse({ error: "Quantity must be at least 1" }, 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: requestRow, error: requestError } = await supabase
      .from("purchase_requests")
      .select("id")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) {
      return jsonResponse({ error: requestError.message }, 500);
    }

    if (!requestRow) {
      return jsonResponse({ error: "Purchase request not found" }, 404);
    }

    const { data: existingQuotes, error: existingQuotesError } = await supabase
      .from("quote_options")
      .select("id")
      .eq("request_id", requestId)
      .limit(1);

    if (existingQuotesError) {
      return jsonResponse({ error: existingQuotesError.message }, 500);
    }

    if (existingQuotes && existingQuotes.length > 0) {
      return jsonResponse({
        success: true,
        message: "Quotes already exist for this request",
        skipped: true,
        autoApprovedCount: 0,
      });
    }

    const enhanced = enhanceSearch(productName);
    const cleanTerm = enhanced.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const searchTerm = encodeURIComponent(cleanTerm);

    const { data: vendorRows, error: vendorError } = await supabase
      .from("vendor_sources")
      .select("*")
      .eq("active", true)
      .order("default_ai_score", { ascending: false });

    if (vendorError) {
      return jsonResponse({ error: vendorError.message }, 500);
    }

    const vendors = ((vendorRows || []) as VendorSource[]).filter(
      (vendor) => vendor.active
    );

    if (vendors.length === 0) {
      return jsonResponse({ error: "No active vendor sources available" }, 400);
    }

    const quotesToInsert: QuoteOptionInsert[] = vendors.map((vendor) => {
      const pricing = estimateVendorPricing(
        vendor.vendor_type || "",
        vendor.category || "",
        vendor.name || "",
        qty
      );

      const total = pricing.unit_price * qty + pricing.shipping_cost;
      const aiScore = vendor.default_ai_score ?? 0;

      const status =
        total < 500 && aiScore >= 85 ? "approved" : "generated";

      return {
        request_id: requestId,
        vendor_name: vendor.name,
        unit_price: pricing.unit_price,
        shipping_cost: pricing.shipping_cost,
        lead_time_days: pricing.lead_time_days,
        ai_score: vendor.default_ai_score,
        recommendation: `AI searched: "${enhanced}"`,
        status,
        product_url: buildProductUrl(vendor.search_url_template, searchTerm),
      };
    });

    const { data: insertedQuotes, error: quoteError } = await supabase
      .from("quote_options")
      .insert(quotesToInsert)
      .select();

    if (quoteError) {
      return jsonResponse({ error: quoteError.message }, 500);
    }

    const autoApprovedQuotes =
      insertedQuotes?.filter((quote: any) => quote.status === "approved") || [];

    if (autoApprovedQuotes.length > 0) {
      const existingOrderCheck = await supabase
        .from("purchase_orders")
        .select("id, quote_id")
        .in(
          "quote_id",
          autoApprovedQuotes.map((quote: any) => quote.id)
        );

      if (existingOrderCheck.error) {
        return jsonResponse({ error: existingOrderCheck.error.message }, 500);
      }

      const existingQuoteIds = new Set(
        (existingOrderCheck.data || []).map((row: any) => row.quote_id)
      );

      const ordersToInsert = autoApprovedQuotes
        .filter((quote: any) => !existingQuoteIds.has(quote.id))
        .map((quote: any) => ({
          request_id: quote.request_id,
          quote_id: quote.id,
          vendor_name: quote.vendor_name,
          total_amount:
            Number(quote.unit_price || 0) * qty +
            Number(quote.shipping_cost || 0),
          status: "approved",
          shipment_status: "pending",
        }));

      if (ordersToInsert.length > 0) {
        const { error: orderError } = await supabase
          .from("purchase_orders")
          .insert(ordersToInsert);

        if (orderError) {
          return jsonResponse({ error: orderError.message }, 500);
        }
      }
    }

    return jsonResponse({
      success: true,
      message: "Quotes generated successfully",
      enhanced_search: enhanced,
      insertedQuoteCount: insertedQuotes?.length || 0,
      autoApprovedCount: autoApprovedQuotes.length,
    });
  } catch (error) {
    console.error("generate-quotes route error:", error);
    return jsonResponse({ error: "Unexpected server error" }, 500);
  }
}
