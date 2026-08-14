import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { problem, zip } = await req.json();
    const lower = (problem || "").toLowerCase();

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
          website: "https://www.angi.com/companylist/us/ny/lawn-care.htm",
          rating: 4.9,
        },
        {
          name: "Yard Masters NYC",
          price: 110,
          reason: "Premium lawn care with fertilizer option",
          distance: "2.4 miles",
          website: "https://www.homeadvisor.com/c.Lawn-Maintenance.Lawn-Care.html",
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
          website: "https://www.angi.com/companylist/us/ny/tree-service.htm",
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
          website: "https://www.homeadvisor.com/c.Yard-Cleanup.html",
          rating: 4.6,
        },
        {
          name: "GreenLeaf Lawn Care",
          price: 280,
          reason: "Cleanup + first mowing included",
          distance
