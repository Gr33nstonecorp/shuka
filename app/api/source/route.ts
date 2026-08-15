import { NextRequest, NextResponse } from "next/server";

type GooglePlace = {
  id?: string;

  displayName?: {
    text?: string;
  };

  formattedAddress?: string;

  rating?: number;

  userRatingCount?: number;

  websiteUri?: string;

  googleMapsUri?: string;

  primaryType?: string;

  types?: string[];
};

type SourceResult = {
  name: string;
  type: "service_provider" | "supplier";

  matchScore: number;

  price: number | null;

  reason: string;

  distance: string | null;

  website: string | null;

  googleMapsUrl: string | null;

  rating: number | null;

  reviewCount: number;

  address: string | null;

  placeId: string | null;
};

type ServiceDefinition = {
  category: string;
  query: string;
  scope: string;
  reason: string;
  estimatedPrice: number | null;
  keywords: string[];
};

const GOOGLE_PLACES_URL =
  "https://places.googleapis.com/v1/places:searchText";

/**
 * Determine whether the user's request is primarily
 * for a physical product or a local service.
 */
function detectIntent(problem: string): "product" | "service" {
  const lower = problem.toLowerCase();

  const serviceWords = [
    "repair",
    "fix",
    "install",
    "installation",
    "replace",
    "replacement",
    "clean",
    "cleaning",
    "mow",
    "mowing",
    "lawn",
    "grass",
    "tree",
    "branch",
    "trim",
    "remove",
    "removal",
    "landscaping",
    "landscape",
    "plumbing",
    "plumber",
    "pipe",
    "leak",
    "drain",
    "toilet",
    "hvac",
    "air conditioning",
    "ac",
    "heating",
    "furnace",
    "electrician",
    "electrical",
    "wiring",
    "outlet",
    "roof",
    "roofing",
    "gutter",
    "handyman",
    "painting",
    "paint",
    "flooring",
    "pest",
    "exterminator",
    "garage door",
    "locksmith",
    "moving",
    "cleaner",
    "house cleaning",
  ];

  return serviceWords.some((word) => lower.includes(word))
    ? "service"
    : "product";
}

/**
 * Determine the specific service category.
 */
function detectService(problem: string): ServiceDefinition {
  const lower = problem.toLowerCase();

  // -------------------------
  // LANDSCAPING
  // -------------------------

  if (
    lower.includes("mow") ||
    lower.includes("mowing") ||
    lower.includes("lawn") ||
    lower.includes("grass")
  ) {
    return {
      category: "lawn_care",
      query: "lawn care landscaping",
      scope: "Regular lawn mowing and lawn maintenance.",
      reason: "Specializes in lawn care and routine property maintenance.",
      estimatedPrice: 100,
      keywords: ["lawn", "mowing", "grass", "landscaping"],
    };
  }

  if (
    lower.includes("tree") ||
    lower.includes("branch") ||
    lower.includes("stump") ||
    lower.includes("arborist")
  ) {
    return {
      category: "tree_service",
      query: "tree service arborist",
      scope: "Tree trimming, removal, or stump work.",
      reason:
        "Specializes in residential tree trimming, removal, and related tree work.",
      estimatedPrice: 450,
      keywords: ["tree", "arborist", "trimming", "removal"],
    };
  }

  if (
    lower.includes("brush") ||
    lower.includes("overgrown") ||
    lower.includes("yard cleanup") ||
    lower.includes("yard clean") ||
    lower.includes("debris")
  ) {
    return {
      category: "yard_cleanup",
      query: "yard cleanup landscaping",
      scope: "Yard cleanup and brush/debris removal.",
      reason:
        "Provides property cleanup, brush removal, and landscaping cleanup.",
      estimatedPrice: 320,
      keywords: ["cleanup", "brush", "debris", "landscaping"],
    };
  }

  if (
    lower.includes("hardscap") ||
    lower.includes("patio") ||
    lower.includes("paver") ||
    lower.includes("walkway") ||
    lower.includes("retaining wall") ||
    lower.includes("stone")
  ) {
    return {
      category: "hardscaping",
      query: "hardscaping patio paver contractor",
      scope:
        "Hardscaping project involving a patio, walkway, pavers, stone, or retaining wall.",
      reason:
        "Specializes in hardscape construction and outdoor masonry projects.",
      estimatedPrice: 2800,
      keywords: [
        "hardscape",
        "patio",
        "paver",
        "walkway",
        "stone",
      ],
    };
  }

  // -------------------------
  // PLUMBING
  // -------------------------

  if (
    lower.includes("plumb") ||
    lower.includes("pipe") ||
    lower.includes("leak") ||
    lower.includes("drain") ||
    lower.includes("toilet") ||
    lower.includes("faucet") ||
    lower.includes("water heater")
  ) {
    return {
      category: "plumbing",
      query: "plumber plumbing contractor",
      scope: "Plumbing repair or installation.",
      reason:
        "Provides residential plumbing repair, installation, and troubleshooting.",
      estimatedPrice: 250,
      keywords: [
        "plumber",
        "plumbing",
        "pipe",
        "drain",
        "water",
      ],
    };
  }

  // -------------------------
  // HVAC
  // -------------------------

  if (
    lower.includes("hvac") ||
    lower.includes("air conditioning") ||
    lower.includes("air conditioner") ||
    lower.includes("ac ") ||
    lower.startsWith("ac") ||
    lower.includes("furnace") ||
    lower.includes("heating") ||
    lower.includes("boiler")
  ) {
    return {
      category: "hvac",
      query: "HVAC heating air conditioning contractor",
      scope: "Heating, cooling, or HVAC service.",
      reason:
        "Specializes in residential heating, cooling, and HVAC systems.",
      estimatedPrice: 300,
      keywords: [
        "hvac",
        "heating",
        "cooling",
        "air conditioning",
      ],
    };
  }

  // -------------------------
  // ELECTRICAL
  // -------------------------

  if (
    lower.includes("electric") ||
    lower.includes("wiring") ||
    lower.includes("wire") ||
    lower.includes("outlet") ||
    lower.includes("breaker") ||
    lower.includes("panel") ||
    lower.includes("light switch")
  ) {
    return {
      category: "electrical",
      query: "electrician electrical contractor",
      scope: "Residential electrical repair or installation.",
      reason:
        "Provides residential electrical repair, wiring, and installation.",
      estimatedPrice: 250,
      keywords: [
        "electrician",
        "electrical",
        "wiring",
        "outlet",
      ],
    };
  }

  // -------------------------
  // ROOFING
  // -------------------------

  if (
    lower.includes("roof") ||
    lower.includes("shingle") ||
    lower.includes("flashing") ||
    lower.includes("gutter")
  ) {
    return {
      category: "roofing",
      query: "roofing contractor roofer",
      scope: "Roofing inspection, repair, or installation.",
      reason:
        "Specializes in residential roofing inspection, repair, and replacement.",
      estimatedPrice: 500,
      keywords: [
        "roof",
        "roofing",
        "roofer",
        "shingle",
      ],
    };
  }

  // -------------------------
  // HANDYMAN
  // -------------------------

  if (
    lower.includes("handyman") ||
    lower.includes("handy man") ||
    lower.includes("small repair") ||
    lower.includes("general repair")
  ) {
    return {
      category: "handyman",
      query: "handyman home repair",
      scope: "General residential repair or maintenance.",
      reason:
        "Handles general home repairs and maintenance projects.",
      estimatedPrice: 150,
      keywords: [
        "handyman",
        "home repair",
        "maintenance",
      ],
    };
  }

  // -------------------------
  // CLEANING
  // -------------------------

  if (
    lower.includes("house clean") ||
    lower.includes("home clean") ||
    lower.includes("clean my house") ||
    lower.includes("cleaning service")
  ) {
    return {
      category: "cleaning",
      query: "house cleaning residential cleaning service",
      scope: "Residential cleaning service.",
      reason:
        "Provides residential house cleaning and recurring cleaning services.",
      estimatedPrice: 180,
      keywords: [
        "cleaning",
        "house cleaning",
        "home cleaning",
      ],
    };
  }

  // -------------------------
  // PAINTING
  // -------------------------

  if (
    lower.includes("paint") ||
    lower.includes("painting")
  ) {
    return {
      category: "painting",
      query: "house painter residential painting contractor",
      scope: "Residential painting project.",
      reason:
        "Specializes in residential interior and exterior painting.",
      estimatedPrice: 1200,
      keywords: [
        "painting",
        "painter",
        "residential painting",
      ],
    };
  }

  // -------------------------
  // FLOORING
  // -------------------------

  if (
    lower.includes("floor") ||
    lower.includes("hardwood") ||
    lower.includes("laminate") ||
    lower.includes("vinyl flooring") ||
    lower.includes("tile")
  ) {
    return {
      category: "flooring",
      query: "flooring contractor hardwood tile installation",
      scope: "Residential flooring installation or repair.",
      reason:
        "Provides flooring installation and repair services.",
      estimatedPrice: 1500,
      keywords: [
        "flooring",
        "hardwood",
        "tile",
        "installation",
      ],
    };
  }

  // -------------------------
  // PEST CONTROL
  // -------------------------

  if (
    lower.includes("pest") ||
    lower.includes("roach") ||
    lower.includes("cockroach") ||
    lower.includes("mouse") ||
    lower.includes("mice") ||
    lower.includes("rat") ||
    lower.includes("termite") ||
    lower.includes("exterminator")
  ) {
    return {
      category: "pest_control",
      query: "pest control exterminator",
      scope: "Residential pest-control service.",
      reason:
        "Provides residential pest inspection and treatment.",
      estimatedPrice: 200,
      keywords: [
        "pest",
        "exterminator",
        "termite",
        "rodent",
      ],
    };
  }

  // -------------------------
  // GARAGE DOOR
  // -------------------------

  if (
    lower.includes("garage door") ||
    lower.includes("garage opener")
  ) {
    return {
      category: "garage_door",
      query: "garage door repair installation",
      scope: "Garage door repair or installation.",
      reason:
        "Specializes in garage door repair and installation.",
      estimatedPrice: 250,
      keywords: [
        "garage door",
        "garage",
        "opener",
      ],
    };
  }

  // -------------------------
  // LOCKSMITH
  // -------------------------

  if (
    lower.includes("locksmith") ||
    lower.includes("locked out") ||
    lower.includes("lock") ||
    lower.includes("key")
  ) {
    return {
      category: "locksmith",
      query: "locksmith residential",
      scope: "Locksmith or residential lock service.",
      reason:
        "Provides residential lock, key, and entry services.",
      estimatedPrice: 150,
      keywords: [
        "locksmith",
        "lock",
        "key",
      ],
    };
  }

  // -------------------------
  // MOVING
  // -------------------------

  if (
    lower.includes("move") ||
    lower.includes("moving") ||
    lower.includes("movers")
  ) {
    return {
      category: "moving",
      query: "moving company residential movers",
      scope: "Residential moving service.",
      reason:
        "Provides residential moving and relocation services.",
      estimatedPrice: 800,
      keywords: [
        "moving",
        "movers",
        "relocation",
      ],
    };
  }

  // -------------------------
  // DEFAULT
  // -------------------------

  return {
    category: "general_service",
    query: "home improvement contractor",
    scope: "General home-service work.",
    reason:
      "Local home-service professional that may be able to evaluate the request.",
    estimatedPrice: null,
    keywords: [],
  };
}

/**
 * Calculate a simple Shuka match score.
 *
 * This is intentionally transparent and deterministic.
 * Later we can replace this with an AI ranking model.
 */
function calculateMatchScore(
  place: GooglePlace,
  service: ServiceDefinition
): number {
  let score = 50;

  const rating = place.rating || 0;
  const reviews = place.userRatingCount || 0;

  // Rating
  if (rating >= 4.9) {
    score += 18;
  } else if (rating >= 4.7) {
    score += 15;
  } else if (rating >= 4.5) {
    score += 12;
  } else if (rating >= 4.2) {
    score += 8;
  } else if (rating >= 4.0) {
    score += 4;
  }

  // Review volume
  if (reviews >= 500) {
    score += 10;
  } else if (reviews >= 200) {
    score += 8;
  } else if (reviews >= 100) {
    score += 6;
  } else if (reviews >= 50) {
    score += 4;
  } else if (reviews >= 10) {
    score += 2;
  }

  // Direct website
  if (place.websiteUri) {
    score += 7;
  }

  // Google Maps listing
  if (place.googleMapsUri) {
    score += 3;
  }

  // Try to determine whether Google's category/name
  // is relevant to the requested service.
  const businessText = [
    place.displayName?.text || "",
    place.primaryType || "",
    ...(place.types || []),
  ]
    .join(" ")
    .toLowerCase();

  const matchingKeyword = service.keywords.some((keyword) =>
    businessText.includes(keyword.toLowerCase())
  );

  if (matchingKeyword) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Search Google Places.
 */
async function searchGooglePlaces(
  query: string,
  apiKey: string
): Promise<GooglePlace[]> {
  const response = await fetch(GOOGLE_PLACES_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      "X-Goog-Api-Key": apiKey,

      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.websiteUri",
        "places.googleMapsUri",
        "places.primaryType",
        "places.types",
      ].join(","),
    },

    body: JSON.stringify({
      textQuery: query,

      regionCode: "US",

      pageSize: 10,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Google Places API error:",
      response.status,
      errorText
    );

    throw new Error(
      `Google Places API returned ${response.status}`
    );
  }

  const data = await response.json();

  return data.places || [];
}

/**
 * POST /api/source
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const problem =
      typeof body.problem === "string"
        ? body.problem.trim()
        : "";

    const zip =
      typeof body.zip === "string"
        ? body.zip.trim()
        : "";

    if (!problem) {
      return NextResponse.json(
        {
          error: "Please describe what you need.",
        },
        {
          status: 400,
        }
      );
    }

    if (!zip) {
      return NextResponse.json(
        {
          error: "ZIP code is required for local sourcing.",
        },
        {
          status: 400,
        }
      );
    }

    const googleApiKey =
      process.env.GOOGLE_MAPS_API_KEY;

    if (!googleApiKey) {
      console.error(
        "GOOGLE_MAPS_API_KEY is missing."
      );

      return NextResponse.json(
        {
          error:
            "Google Maps API is not configured on the server.",
        },
        {
          status: 500,
        }
      );
    }

    // --------------------------------
    // STEP 1
    // Determine product vs service
    // --------------------------------

    const intent = detectIntent(problem);

    // --------------------------------
    // STEP 2
    // Determine service/category
    // --------------------------------

    const service = detectService(problem);

    // --------------------------------
    // STEP 3
    // Search local businesses
    // --------------------------------

    let places: GooglePlace[] = [];

    if (intent === "service") {
      const searchQuery =
        `${service.query} near ${zip}`;

      places = await searchGooglePlaces(
        searchQuery,
        googleApiKey
      );
    }

    // --------------------------------
    // STEP 4
    // Convert Google results
    // into Shuka results
    // --------------------------------

    let results: SourceResult[] = places
      .filter((place) => place.displayName?.text)
      .map((place) => {
        const matchScore =
          calculateMatchScore(
            place,
            service
          );

        return {
          name:
            place.displayName?.text ||
            "Local business",

          type: "service_provider",

          matchScore,

          price:
            service.estimatedPrice,

          reason:
            service.reason,

          distance: null,

          /*
           * THIS is the important part.
           *
           * Google returns the actual business
           * website here.
           *
           * No Angi.
           * No HomeAdvisor.
           * No directory URL.
           */
          website:
            place.websiteUri || null,

          googleMapsUrl:
            place.googleMapsUri || null,

          rating:
            place.rating || null,

          reviewCount:
            place.userRatingCount || 0,

          address:
            place.formattedAddress || null,

          placeId:
            place.id || null,
        };
      });

    // --------------------------------
    // STEP 5
    // Rank results
    // --------------------------------

    results.sort((a, b) => {
      // Direct websites first
      if (
        a.website &&
        !b.website
      ) {
        return -1;
      }

      if (
        !a.website &&
        b.website
      ) {
        return 1;
      }

      // Match score
      if (
        b.matchScore !==
        a.matchScore
      ) {
        return (
          b.matchScore -
          a.matchScore
        );
      }

      // Rating
      if (
        (b.rating || 0) !==
        (a.rating || 0)
      ) {
        return (
          (b.rating || 0) -
          (a.rating || 0)
        );
      }

      // Review count
      return (
        b.reviewCount -
        a.reviewCount
      );
    });

    // --------------------------------
    // STEP 6
    // Limit results
    // --------------------------------

    results = results.slice(0, 8);

    // --------------------------------
    // Backwards compatibility
    // --------------------------------

    /*
     * Your existing frontend appears to
     * expect "landscapers".
     *
     * Keeping it here means you can
     * replace the backend without
     * immediately breaking the UI.
     */

    const landscapers =
      intent === "service"
        ? results
        : [];

    return NextResponse.json({
      success: true,

      // Universal sourcing data
      intent,

      request: {
        problem,
        zip,
        category:
          service.category,
        scope:
          service.scope,
      },

      results,

      // Existing frontend compatibility
      landscapers,

      // Old compatibility field
      mechanics: landscapers,

      possibleScope:
        service.scope,

      possibleCause:
        service.scope,

      meta: {
        provider:
          intent === "service"
            ? "Google Places"
            : "none",

        resultCount:
          results.length,

        searchCategory:
          service.category,

        searchQuery:
          intent === "service"
            ? service.query
            : null,
      },
    });
  } catch (error) {
    console.error(
      "Shuka sourcing error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Shuka was unable to complete the search.",
      },
      {
        status: 500,
      }
    );
  }
}
