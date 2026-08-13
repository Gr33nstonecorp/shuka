import Link from "next/link";

const landscapers = [
  {
    name: "GreenLeaf Lawn Care",
    specialty: "Lawn Mowing & Maintenance",
    rating: 4.9,
    distance: "1.9 miles",
    priceFrom: 85,
  },
  {
    name: "Yard Masters NYC",
    specialty: "Full Service Landscaping",
    rating: 4.7,
    distance: "2.4 miles",
    priceFrom: 110,
  },
  {
    name: "ArborPro Tree Service",
    specialty: "Tree Trimming & Removal",
    rating: 4.8,
    distance: "3.1 miles",
    priceFrom: 350,
  },
  {
    name: "CleanScape Landscaping",
    specialty: "Yard Cleanup & Brush Removal",
    rating: 4.6,
    distance: "2.2 miles",
    priceFrom: 280,
  },
  {
    name: "StoneWorks Design",
    specialty: "Hardscaping & Patios",
    rating: 4.8,
    distance: "4.0 miles",
    priceFrom: 1800,
  },
  {
    name: "Bloom & Grow Gardens",
    specialty: "Garden Design & Planting",
    rating: 4.9,
    distance: "2.7 miles",
    priceFrom: 220,
  },
];

export default function VendorsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black text-yellow-400 mb-4">
            Local Landscapers
          </h1>
          <p className="text-zinc-400 text-lg">
            Browse verified landscaping pros near you
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {landscapers.map((item, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-400/40 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{item.specialty}</p>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-medium">★ {item.rating}</div>
                  <div className="text-zinc-500 text-sm">{item.distance}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-zinc-400 text-sm">
                  From <span className="text-white font-semibold">${item.priceFrom}</span>
                </div>
                <Link
                  href="/assistant"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-zinc-400 mb-6">
            Don’t see what you need? Describe your job and get matched.
          </p>
          <Link
            href="/assistant"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 py-4 rounded-2xl transition"
          >
            Get Free Quotes →
          </Link>
        </div>
      </div>
    </main>
  );
}
