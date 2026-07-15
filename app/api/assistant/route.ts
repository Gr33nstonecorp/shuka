import { NextRequest, NextResponse } from "next/server";

type Mechanic = {
  name: string;
  price: number;
  reason: string;
  distance: string;
  website: string;
};

export async function POST(req: NextRequest) {
  try {
    const { problem } = await req.json();
    const lower = (problem || "").toLowerCase();

    let mechanics: Mechanic[] = [];

    if (lower.includes("brake") || lower.includes("squeak")) {
      mechanics = [
        { name: "Queens Auto Repair", price: 280, reason: "Brake pad replacement - highly rated", distance: "2.3 miles", website: "https://www.yelp.com/biz/queens-auto-repair" },
        { name: "Bayside Mechanics", price: 320, reason: "Full brake service with warranty", distance: "1.8 miles", website: "https://www.autozone.com/" },
      ];
    } else if (lower.includes("engine") || lower.includes("light")) {
      mechanics = [
        { name: "NYC Auto Care", price: 450, reason: "Diagnostic + check engine light fix", distance: "3.1 miles", website: "https://www.yelp.com/biz/nyc-auto-care" },
      ];
    } else {
      mechanics = [
        { name: "Local Garage", price: 350, reason: "General diagnosis & repair", distance: "2.5 miles", website: "https://www.repairpal.com/" },
      ];
    }

    return NextResponse.json({ mechanics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to find mechanics" }, { status: 500 });
  }
}
