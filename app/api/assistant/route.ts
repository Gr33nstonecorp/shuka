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
    let possibleCause = "General diagnostic recommended. Recommend professional inspection.";

    if (lower.includes("brake") || lower.includes("squeak")) {
      possibleCause = "Worn brake pads or warped rotors. Common on high-mileage cars.";
      mechanics = [
        { name: "Queens Brake & Auto", price: 280, reason: "Brake pad + rotor replacement", distance: "2.3 miles", website: "https://www.midas.com/", rating: 4.8 },
        { name: "Bayside Auto Service", price: 320, reason: "Full brake inspection & service", distance: "1.8 miles", website: "https://www.firestonecompleteautocare.com/", rating: 4.6 },
      ];
    } else if (lower.includes("engine") || lower.includes("light")) {
      possibleCause = "O2 sensor, spark plugs, or catalytic converter issue. Scan code needed.";
      mechanics = [
        { name: "NYC Auto Diagnostics", price: 450, reason: "Full engine diagnostic + fix", distance: "3.1 miles", website: "https://www.pepboys.com/", rating: 4.7 },
      ];
    } else if (lower.includes("shake") || lower.includes("shaking") || lower.includes("vibration")) {
      possibleCause = "Unbalanced tires, bad wheel bearing, or suspension problem.";
      mechanics = [
        { name: "Local Tire & Alignment", price: 350, reason: "Tire balance + alignment", distance: "2.5 miles", website: "https://www.discounttire.com/", rating: 4.9 },
      ];
    } else {
      possibleCause = "Could be multiple issues. Recommend full diagnostic scan.";
      mechanics = [
        { name: "NY Auto Repair Center", price: 320, reason: "General diagnostic & repair", distance: "2.8 miles", website: "https://www.jiffylube.com/", rating: 4.5 },
      ];
    }

    mechanics.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ mechanics, possibleCause });
  } catch (error) {
    return NextResponse.json({ error: "Failed to find mechanics" }, { status: 500 });
  }
}
