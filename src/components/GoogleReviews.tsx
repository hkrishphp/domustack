import Image from "next/image";
import type { GoogleReview } from "@/lib/google-places";

type Props = {
  reviews: GoogleReview[];
  rating: number | null;
  totalReviews: number;
  businessName: string;
};

export default function GoogleReviews({
  reviews,
  rating,
  totalReviews,
  businessName,
}: Props) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to work with {businessName}!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-medium">Google Reviews</h2>
        {rating !== null && (
          <div className="flex items-center gap-1.5">
            <span className="text-rating font-semibold text-lg">
              &#9733; {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">
              ({totalReviews} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-card rounded-[var(--radius)] p-4 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {review.authorPhotoUri ? (
                  <Image
                    src={review.authorPhotoUri}
                    alt={review.authorName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary text-xs font-semibold">
                    {review.authorName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {review.authorUri ? (
                    <a
                      href={review.authorUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition"
                    >
                      {review.authorName}
                    </a>
                  ) : (
                    <span className="text-sm font-medium">
                      {review.authorName}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {review.relativePublishTime}
                  </span>
                </div>
                <span className="text-rating font-semibold text-sm">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
            </div>
            {review.text && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Google attribution (required by ToS) */}
      <p className="text-xs text-muted-foreground mt-4">
        Reviews from Google Maps. Showing up to 5 most relevant reviews.
      </p>
    </div>
  );
}
