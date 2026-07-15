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
        { name: "Queens Auto Repair", price: 280, reason: "Brake pad replacement - good reviews", distance: "2.3 miles", website: "https://example.com/queens-auto" },
        { name: "Bayside Mechanics", price: 320, reason: "Full brake service", distance: "1.8 miles", website: "https://example.com/bayside" },
      ];
    } else if (lower.includes("engine") || lower.includes("light")) {
      mechanics = [
        { name: "NYC Auto Care", price: 450, reason: "Diagnostic + fix check engine light", distance: "3.1 miles", website: "https://example.com/nyc-auto" },
      ];
    } else {
      mechanics = [
        { name: "Local Garage", price: 350, reason: "General diagnosis & repair", distance: "2.5 miles", website: "https://example.com/local" },
      ];
    }

    return NextResponse.json({ mechanics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to find mechanics" }, { status: 500 });
  }
}
