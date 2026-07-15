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

    if (lower.includes("brake") || lower.includes("squeak")) {
      possibleCause = "Worn brake pads or rotors likely.";
      mechanics = [
        { name: "Queens Auto Repair", price: 280, reason: "Brake pad replacement", distance: "2.3 miles", website: "https://www.yelp.com/biz/queens-auto-repair", rating: 4.8 },
        { name: "Bayside Mechanics", price: 320, reason: "Full brake service", distance: "1.8 miles", website: "https://www.autozone.com/", rating: 4.5 },
      ];
    } else if (lower.includes("engine") || lower.includes("light")) {
      possibleCause = "Sensor issue or low oil pressure.";
      mechanics = [
        { name: "NYC Auto Care", price: 450, reason: "Diagnostic + fix", distance: "3.1 miles", website: "https://www.yelp.com/biz/nyc-auto-care", rating: 4.9 },
      ];
    } else if (lower.includes("shake") || lower.includes("shaking")) {
      possibleCause = "Tire balance or suspension issue.";
      mechanics = [
        { name: "Local Garage", price: 350, reason: "Wheel alignment & balance", distance: "2.5 miles", website: "https://www.repairpal.com/", rating: 4.7 },
      ];
    } else {
      mechanics = [
        { name: "Local Auto Shop", price: 320, reason: "General diagnostic", distance: "2.8 miles", website: "https://www.yelp.com/", rating: 4.6 },
      ];
    }

    // Sort by rating (best on top)
    mechanics.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ mechanics, possibleCause });
  } catch (error) {
    return NextResponse.json({ error: "Failed to find mechanics" }, { status: 500 });
  }
}
