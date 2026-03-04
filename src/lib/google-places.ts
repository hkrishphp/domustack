import { createServerSupabaseClient } from "@/lib/supabase-server";

// ============================================================
// Types
// ============================================================

export type GoogleReview = {
  authorName: string;
  authorPhotoUri: string | null;
  authorUri: string | null;
  rating: number;
  text: string;
  relativePublishTime: string;
  publishTime: string;
};

export type GooglePlacesData = {
  placeId: string | null;
  rating: number | null;
  userRatingsTotal: number;
  reviews: GoogleReview[];
  matchedBusinessName: string | null;
  hasMatch: boolean;
};

type CachedPlacesRow = {
  kontraio_contractor_id: string;
  google_place_id: string | null;
  rating: number | null;
  user_ratings_total: number;
  reviews: GoogleReview[];
  matched_business_name: string | null;
  has_match: boolean;
  last_fetched_at: string;
};

// ============================================================
// Constants
// ============================================================

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PLACES_BASE_URL = "https://places.googleapis.com/v1";

// ============================================================
// Google Places API calls
// ============================================================

/**
 * Text Search: find a business by name + location.
 * Returns place_id, rating, userRatingCount.
 */
async function searchPlace(
  businessName: string,
  location: string
): Promise<{
  placeId: string;
  rating: number;
  userRatingsTotal: number;
  displayName: string;
} | null> {
  if (!GOOGLE_API_KEY) return null;

  try {
    const response = await fetch(`${PLACES_BASE_URL}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: `${businessName} ${location}`,
        pageSize: 1,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Google Places Text Search failed:", response.status);
      return null;
    }

    const data = await response.json();
    const place = data.places?.[0];
    if (!place) return null;

    return {
      placeId: place.id,
      rating: place.rating ?? 0,
      userRatingsTotal: place.userRatingCount ?? 0,
      displayName: place.displayName?.text ?? "",
    };
  } catch (error) {
    console.error("Google Places Text Search error:", error);
    return null;
  }
}

/**
 * Place Details: fetch reviews for a known place_id.
 * Only called on contractor profile pages.
 */
async function fetchPlaceReviews(placeId: string): Promise<GoogleReview[]> {
  if (!GOOGLE_API_KEY) return [];

  try {
    const response = await fetch(`${PLACES_BASE_URL}/places/${placeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "reviews",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Google Places Details failed:", response.status);
      return [];
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.reviews || []).map((r: any) => ({
      authorName: r.authorAttribution?.displayName ?? "Anonymous",
      authorPhotoUri: r.authorAttribution?.photoUri ?? null,
      authorUri: r.authorAttribution?.uri ?? null,
      rating: r.rating ?? 0,
      text: r.text?.text ?? "",
      relativePublishTime: r.relativePublishTimeDescription ?? "",
      publishTime: r.publishTime ?? "",
    }));
  } catch (error) {
    console.error("Google Places Details error:", error);
    return [];
  }
}

// ============================================================
// Cache helpers
// ============================================================

function isCacheStale(lastFetchedAt: string): boolean {
  return Date.now() - new Date(lastFetchedAt).getTime() > CACHE_TTL_MS;
}

// ============================================================
// Public API
// ============================================================

/**
 * Get Google rating summary for a contractor (for search cards).
 * Only fetches place_id + rating, NOT full reviews.
 */
export async function getGoogleRatingForContractor(
  contractorId: string,
  businessName: string,
  location: string
): Promise<{ rating: number | null; userRatingsTotal: number }> {
  const supabase = await createServerSupabaseClient();

  // Check cache
  const { data: cached } = await supabase
    .from("google_places_cache")
    .select("rating, user_ratings_total, has_match, last_fetched_at")
    .eq("kontraio_contractor_id", contractorId)
    .single();

  const typedCached = cached as {
    rating: number | null;
    user_ratings_total: number;
    has_match: boolean;
    last_fetched_at: string;
  } | null;

  if (typedCached && !isCacheStale(typedCached.last_fetched_at)) {
    return {
      rating: typedCached.has_match ? typedCached.rating : null,
      userRatingsTotal: typedCached.has_match
        ? typedCached.user_ratings_total
        : 0,
    };
  }

  // Cache miss or stale — call Google Text Search
  const result = await searchPlace(businessName, location);

  if (result) {
    await supabase.from("google_places_cache").upsert(
      {
        kontraio_contractor_id: contractorId,
        google_place_id: result.placeId,
        rating: result.rating,
        user_ratings_total: result.userRatingsTotal,
        matched_business_name: result.displayName,
        has_match: true,
        last_fetched_at: new Date().toISOString(),
      },
      { onConflict: "kontraio_contractor_id" }
    );

    return {
      rating: result.rating,
      userRatingsTotal: result.userRatingsTotal,
    };
  }

  // No match found — cache the miss
  await supabase.from("google_places_cache").upsert(
    {
      kontraio_contractor_id: contractorId,
      has_match: false,
      last_fetched_at: new Date().toISOString(),
    },
    { onConflict: "kontraio_contractor_id" }
  );

  return { rating: null, userRatingsTotal: 0 };
}

/**
 * Get full Google Places data including reviews for a contractor.
 * Used on the contractor profile page.
 */
export async function getGoogleReviewsForContractor(
  contractorId: string,
  businessName: string,
  location: string
): Promise<GooglePlacesData> {
  const supabase = await createServerSupabaseClient();

  // Check cache for full data including reviews
  const { data: cached } = await supabase
    .from("google_places_cache")
    .select("*")
    .eq("kontraio_contractor_id", contractorId)
    .single();

  const typedCached = cached as CachedPlacesRow | null;

  // Return cached data if fresh and has reviews
  if (
    typedCached &&
    !isCacheStale(typedCached.last_fetched_at) &&
    typedCached.reviews.length > 0
  ) {
    return {
      placeId: typedCached.google_place_id,
      rating: typedCached.has_match ? typedCached.rating : null,
      userRatingsTotal: typedCached.has_match
        ? typedCached.user_ratings_total
        : 0,
      reviews: typedCached.reviews,
      matchedBusinessName: typedCached.matched_business_name,
      hasMatch: typedCached.has_match,
    };
  }

  // Need to fetch from Google
  let placeId = typedCached?.google_place_id ?? null;
  let rating = typedCached?.rating ?? null;
  let userRatingsTotal = typedCached?.user_ratings_total ?? 0;
  let matchedName = typedCached?.matched_business_name ?? null;
  let hasMatch = typedCached?.has_match ?? false;

  // Phase 1: Get place_id if we don't have one
  if (!placeId) {
    const searchResult = await searchPlace(businessName, location);
    if (searchResult) {
      placeId = searchResult.placeId;
      rating = searchResult.rating;
      userRatingsTotal = searchResult.userRatingsTotal;
      matchedName = searchResult.displayName;
      hasMatch = true;
    }
  }

  // Phase 2: Get reviews if we have a place_id
  let reviews: GoogleReview[] = [];
  if (placeId) {
    reviews = await fetchPlaceReviews(placeId);
  }

  // Update cache
  await supabase.from("google_places_cache").upsert(
    {
      kontraio_contractor_id: contractorId,
      google_place_id: placeId,
      rating,
      user_ratings_total: userRatingsTotal,
      reviews,
      matched_business_name: matchedName,
      has_match: hasMatch,
      last_fetched_at: new Date().toISOString(),
    },
    { onConflict: "kontraio_contractor_id" }
  );

  return {
    placeId,
    rating: hasMatch ? rating : null,
    userRatingsTotal: hasMatch ? userRatingsTotal : 0,
    reviews,
    matchedBusinessName: matchedName,
    hasMatch,
  };
}
