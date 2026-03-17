const handleAsk = async () => {
  setLoading(true);
  setResponse("");

  // 1. check existing quotes
  let { data: quotes } = await supabase
    .from("quote_options")
    .select("*")
    .ilike("recommendation", `%${input}%`);

  // 2. if no quotes → create request + generate quotes
  if (!quotes || quotes.length === 0) {
    // create request
    const { data: request } = await supabase
      .from("purchase_requests")
      .insert({
        product: input,
        quantity: 50,
        category: "general",
      })
      .select()
      .single();

    // call your quote generator API
    await fetch("/api/generate-quotes", {
      method: "POST",
      body: JSON.stringify({
        request_id: request.id,
        product_name: input,
        quantity: 50,
      }),
    });

    // fetch quotes again
    const res = await supabase
      .from("quote_options")
      .select("*")
      .order("ai_score", { ascending: false });

    quotes = res.data;
  }

  if (!quotes || quotes.length === 0) {
    setResponse("Still no quotes found.");
    setLoading(false);
    return;
  }

  // pick best
  const best = quotes.sort((a, b) => b.ai_score - a.ai_score)[0];

  setResponse(
    `Best option: ${best.vendor_name} - $${best.unit_price} (AI score ${best.ai_score})`
  );

  setLoading(false);
};
