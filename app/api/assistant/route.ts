import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { problem, zip } = await req.json();
    const lower = (problem || "").toLowerCase();
    const location = zip || "11364";

    let landscapers = [];
    let possibleScope = "General landscaping work recommended.";

    if (lower.includes("mow") || lower.includes("lawn") || lower.includes("grass")) {
      possibleScope = "Regular lawn mowing + edging recommended.";
      landscapers = [
        {
          name: "GreenLeaf Lawn Care",
          price: 85,
          reason: "Weekly mowing + edging for standard lots",
          distance: "1.9 miles",
          website: `https://www.google.com/search?q=GreenLeaf+Lawn+Care+${location}`,
          rating: 4.9,
        },
        {
          name: "Yard Masters NYC",
          price: 110,
          reason: "Premium lawn care with fertilizer option",
          distance: "2.4 miles",
          website: `https://www.google.com/search?q=Yard+Masters+NYC+lawn+care+${location}`,
          rating: 4.7,
        },
      ];
    } else if (lower.includes("tree") || lower.includes("branch") || lower.includes("trim")) {
      possibleScope = "Tree trimming or removal needed.";
      landscapers = [
        {
          name: "ArborPro Tree Service",
          price: 450,
          reason: "Tree trimming and stump grinding",
          distance: "3.1 miles",
          website: `https://www.google.com/search?q=ArborPro+Tree+Service+${location}`,
          rating: 4.8,
        },
      ];
    } else if (lower.includes("cleanup") || lower.includes("overgrown") || lower.includes("brush")) {
      possibleScope = "Full yard cleanup and brush removal recommended.";
      landscapers = [
        {
          name: "CleanScape Landscaping",
          price: 320,
          reason: "Full property cleanup + debris removal",
          distance: "2.2 miles",
          website: `https://www.google.com/search?q=CleanScape+Landscaping+${location}`,
          rating: 4.6,
        },
        {
          name: "GreenLeaf Lawn Care",
          price: 280,
          reason: "Cleanup + first mowing included",
          distance: "1.9 miles",
          website: `https://www.google.com/search?q=GreenLeaf+Lawn+Care+${location}`,
          rating: 4.9,
        },
      ];
    } else if (
      lower.includes("hardscap") ||
      lower.includes("patio") ||
      lower.includes("stone") ||
      lower.includes("walkway")
    ) {
      possibleScope = "Hardscaping project (patio, walkway, or retaining wall).";
      landscapers = [
        {
          name: "StoneWorks Design",
          price: 2800,
          reason: "Patio / walkway installation estimate",
          distance: "4.0 miles",
          website: `https://www.google.com/search?q=StoneWorks+Design+hardscape+${location}`,
          rating: 4.8,
        },
      ];
    } else {
      landscapers = [
        {
          name: "GreenLeaf Lawn Care",
          price: 150,
          reason: "General landscaping consultation + quote",
          distance: "2.1 miles",
          website: `https://www.google.com/search?q=GreenLeaf+Lawn+Care+${location}`,
          rating: 4.8,
        },
        {
          name: "Yard Masters NYC",
          price: 175,
          reason: "On-site assessment and full quote",
          distance: "2.8 miles",
          website: `https://www.google.com/search?q=Yard+Masters+NYC+${location}`,
          rating: 4.7,
        },
      ];
    }

    landscapers.sort((a: any, b: any) => b.rating - a.rating);

    return NextResponse.json({
      landscapers,
      mechanics: landscapers,
      possibleScope,
      possibleCause: possibleScope,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to find landscapers" },
      { status: 500 }
    );
  }
}
