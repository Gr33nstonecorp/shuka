import { NextRequest, NextResponse } from "next/server";

type MechanicBid = {
  name: string;
  price: number;
  reason: string;
  distance: string;
  website: string;
  rating: number;
  incentive: string;
};

export async function POST(req: NextRequest) {
  try {
    const { problem, zip } = await req.json();
    const lower = (problem || "").toLowerCase();
    const zipCode = zip || "11364"; // default NYC area

    let bids: MechanicBid[] = [];
    let possibleCause = "General diagnostic recommended.";

    // Simulate local shops based on zip
    const isNYC = zipCode.startsWith("11") || zipCode.startsWith("10");

    if (lower.includes("brake") || lower.includes("squeak")) {
      possibleCause = "Worn brake pads or rotors likely.";
      bids = [
        { name: "Queens Brake Masters", price: 280, reason: "Brake pad + rotor replacement", distance: "2.3 miles", website: "https://www.midas.com/locations/queens", rating: 4.8, incentive: "10% off + free inspection" },
        { name: "Bayside Auto Service", price: 320, reason: "Full brake service with warranty", distance: "1.8 miles", website: "https://www.firestonecompleteautocare.com/", rating: 4.6, incentive: "Free tire rotation" },
      ];
    } else if (lower.includes("engine") || lower.includes("light")) {
      possibleCause = "O2 sensor or catalytic converter issue.";
      bids = [
        { name: "NYC Auto Diagnostics", price: 450, reason: "Full engine diagnostic + repair", distance: "3.1 miles", website: "https://www.pepboys.com/", rating: 4.9, incentive: "Free diagnostic with repair" },
      ];
    } else if (lower.includes("shake") || lower.includes("shaking")) {
      possibleCause = "Tire balance or suspension problem.";
      bids = [
        { name: "Local Tire Pros", price: 350, reason: "Wheel alignment & balance", distance: "2.5 miles", website: "https://www.discounttire.com/", rating: 4.8, incentive: "$50 off alignment" },
      ];
    } else {
      possibleCause = "Multiple possible issues. Full diagnostic needed.";
      bids = [
        { name: "Neighborhood Auto Care", price: 320, reason: "General diagnostic & repair", distance: "2.8 miles", website: "https://www.jiffylube.com/", rating: 4.6, incentive: "$30 off first service" },
      ];
    }

    bids.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ bids, possibleCause });
  } catch (error) {
    return NextResponse.json({ error: "Failed to find mechanics" }, { status: 500 });
  }
}
