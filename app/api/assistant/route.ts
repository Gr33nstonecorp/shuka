// ... (keep all your types and helper functions: parseInput, enhanceSearch, estimateVendorPricing, buildVendorOptions, cleanJsonText)

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "AI service unavailable" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auth with anon client
    const supabaseUserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser(accessToken);
    if (authError || !user) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    // Admin client for profile + vendors
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check subscription
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, plan, subscription_status, current_period_end")
      .eq("id", user.id)
      .single<ProfileRow>();

    if (!profile || !hasActivePaidPlan(profile)) {
      return Response.json({ error: "Active paid subscription required for AI Assistant" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    let rawInput: string = typeof body?.input === "string" ? body.input.trim() : "";

    if (!rawInput) {
      return Response.json({ error: "Please provide at least one item" }, { status: 400 });
    }

    const items = parseInput(rawInput);
    if (items.length === 0) {
      return Response.json({ error: "No valid items found. Format: Item Name - quantity" }, { status: 400 });
    }

    // Fetch active vendors (consider caching this in production with Redis or Next.js cache)
    const { data: vendors, error: vendorError } = await supabaseAdmin
      .from("vendor_sources")
      .select("id, name, vendor_type, category, default_ai_score, search_url_template, active")
      .eq("active", true)
      .order("default_ai_score", { ascending: false });

    if (vendorError || !vendors?.length) {
      return Response.json({ error: "No vendors available at the moment" }, { status: 500 });
    }

    const vendorCatalog = buildVendorOptions(items, vendors as VendorSource[]);

    const systemPrompt = `
You are ShukAI's intelligent sourcing engine.
Your job is to recommend the single best vendor option for each item from the provided catalog only.

Selection criteria (in order):
1. Lowest total cost (unit price × quantity + shipping)
2. Highest AI score
3. Shortest lead time
4. Best overall fit for the item

Return ONLY valid JSON matching this structure:
{
  "results": [
    {
      "item": "exact item name",
      "quantity": number,
      "best_quote": {
        "vendor_name": "string",
        "total": number,
        "reason": "short clear explanation why this vendor is best",
        "product_url": "string or empty"
      }
    }
  ]
}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" for higher quality if budget allows
      response_format: { type: "json_object" },
      temperature: 0.1, // lower = more deterministic
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            requested_items: items,
            available_vendors: vendorCatalog,
          }, null, 2)
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || "";
    const cleaned = cleanJsonText(content);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    if (!Array.isArray(parsed?.results)) {
      return Response.json({ error: "Invalid response format from AI" }, { status: 500 });
    }

    return Response.json({ results: parsed.results as ModelResult[] });

  } catch (err: any) {
    console.error("Assistant API error:", err);
    return Response.json({ 
      error: "Something went wrong. Please try again." 
    }, { status: 500 });
  }
}
