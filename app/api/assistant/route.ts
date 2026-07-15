import { NextRequest, NextResponse } from "next/server";

type Mechanic = {
  name: string;
  price: number;
  reason: string;
  distance: string;
  website: string;
  rating: number;
};

export async function POST(req: NextRequest) {
  try {
    const { problem, zip } = await req.json();
    const lower = (problem || "").toLowerCase();

    let mechanics: Mechanic[] = [];
    let possibleCause = "General diagnostic recommended.";

    // Always return at least one mechanic
    if (lower.includes("brake") || lower.includes("squeak") || lower.includes("screech")) {
      possibleCause = "Worn brake pads or rotors likely.";
      mechanics = [
        { name: "Queens Brake Masters", price: 280, reason: "Brake pad + rotor replacement", distance: "2.3 miles", website: "https://www.midas.com/", rating: 4.8 },
        { name: "Bayside Auto Service", price: 320, reason: "Full brake service with warranty", distance: "1.8 miles", website: "https://www.firestonecompleteautocare.com/", rating: 4.6 },
      ];
    } else if (lower.includes("engine") || lower.includes("light")) {
      possibleCause = "O2 sensor or catalytic converter issue.";
      mechanics = [
        { name: "NYC Auto Diagnostics", price: 450, reason: "Full engine diagnostic + fix", distance: "3.1 miles", website: "https://www.pepboys.com/", rating: 4.9 },
      ];
    } else if (lower.includes("shake") || lower.includes("shaking")) {
      possibleCause = "Tire balance or suspension problem.";
      mechanics = [
        { name: "Local Tire Pros", price: 350, reason: "Wheel alignment & balance", distance: "2.5 miles", website: "https://www.discounttire.com/", rating: 4.8 },
      ];
    } else {
      possibleCause = "Multiple possible issues. Full diagnostic needed.";
      mechanics = [
        { name: "Neighborhood Auto Care", price: 320, reason: "General diagnostic & repair", distance: "2.8 miles", website: "https://www.jiffylube.com/", rating: 4.6 },
      ];
    }

    // Sort by rating (best first)
    mechanics.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ mechanics, possibleCause });
  } catch (error) {
    return NextResponse.json({ error: "Failed to find mechanics" }, { status: 500 });
  }
}
