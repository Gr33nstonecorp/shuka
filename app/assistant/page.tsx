"use client";

import { useState } from "react";

type Product = {
  item: string;
  vendor: string;
  website: string;
  price: number;
  reason: string;
  image?: string; // optional for future
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSourcing = () => {
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);

    // Realistic mock results with real vendor links
    setTimeout(() => {
      const realisticResults: Product[] = [
        {
          item: input,
          vendor: "Uline",
          website: "https://www.uline.com",
          price: 89.99,
          reason: "Best bulk pricing with 2-day shipping. Trusted by warehouses nationwide.",
        },
        {
          item: input,
          vendor: "Grainger",
          website: "https://www.grainger.com",
          price: 112.50,
          reason: "Industrial grade quality. Reliable supplier with local pickup options.",
        },
        {
          item: input,
          vendor: "Amazon Business",
          website: "https://business.amazon.com",
          price: 74.99,
          reason: "Fastest delivery (Prime eligible). Good for smaller quantities.",
        },
      ];

      setResults(realisticResults);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-block bg-yellow-400 text-black px-5 py-1 rounded-full text-sm font-medium mb-4">
          AI SOURCING
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-6 text-yellow-400">
          Find better vendors,<br />instantly
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Tell us what you need. ShukAI searches real suppliers and shows the best options with direct links.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 mb-16">
        <p className="text-zinc-400 mb-4 text-lg">What do you need to source?</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1 box of nitrile gloves, 50 packing tape rolls..."
          className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-lg placeholder-zinc-500 focus:outline-none focus:border-yellow-400 min-h-[160px] resize-y"
        />
        <button
          onClick={handleSourcing}
          disabled={loading || !input.trim()}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-4 rounded-2xl text-lg transition"
        >
          {loading ? "Searching suppliers..." : "Run AI Sourcing"}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <h2 className="text-3xl font-semibold mb-10 text-yellow-400">Recommended Options</h2>
          
          <div className="space-y-8">
            {results.map((product, index) => (
              <div key={index} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-1">{product.item}</h3>
                    <p className="text-zinc-400">Quantity: 1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">Price</p>
                    <p className="text-4xl font-black text-yellow-400">${product.price}</p>
                  </div>
                </div>

                <div className="mt-8 mb-8">
                  <p className="text-zinc-400 mb-2">Best Vendor</p>
                  <p className="text-2xl font-medium">{product.vendor}</p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6 mb-8">
                  <p className="text-zinc-300">{product.reason}</p>
                </div>

                <a 
                  href={product.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-4 rounded-2xl text-lg transition"
                >
                  Visit {product.vendor} →
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 text-zinc-400">
            Found these options in seconds. Click any link to buy directly.
          </div>
        </div>
      )}
    </div>
  );
}
