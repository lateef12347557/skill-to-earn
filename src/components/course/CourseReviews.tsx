import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface CourseReviewsProps {
  learningPathId: string;
}

export function CourseReviews({ learningPathId }: CourseReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [learningPathId, user]);

  async function fetchReviews() {
    const { data } = await supabase
      .from('course_reviews')
      .select('*')
      .eq('learning_path_id', learningPathId)
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch profiles for reviews
      const userIds = data.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const reviewsWithProfiles = data.map(review => ({
        ...review,
        profile: profileMap.get(review.user_id)
      }));

      // Separate user's review from others
      if (user) {
        const myReview = reviewsWithProfiles.find(r => r.user_id === user.id);
        if (myReview) {
          setUserReview(myReview);
          setRating(myReview.rating);
          setComment(myReview.comment || "");
        }
        setReviews(reviewsWithProfiles.filter(r => r.user_id !== user.id));
      } else {
        setReviews(reviewsWithProfiles);
      }
    }
  }

  async function handleSubmitReview() {
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    setLoading(true);

    if (userReview) {
      // Update existing review
      const { error } = await supabase
        .from('course_reviews')
        .update({ rating, comment, updated_at: new Date().toISOString() })
        .eq('id', userReview.id);

      if (!error) {
        toast.success("Review updated!");
        fetchReviews();
      } else {
        toast.error("Failed to update review");
      }
    } else {
      // Create new review
      const { error } = await supabase
        .from('course_reviews')
        .insert({
          learning_path_id: learningPathId,
          user_id: user.id,
          rating,
          comment: comment || null
        });

      if (!error) {
        toast.success("Review submitted!");
        fetchReviews();
      } else {
        toast.error("Failed to submit review");
      }
    }

    setLoading(false);
  }

  const averageRating = reviews.length > 0
    ? ((reviews.reduce((sum, r) => sum + r.rating, 0) + (userReview?.rating || 0)) / 
       (reviews.length + (userReview ? 1 : 0))).toFixed(1)
    : userReview ? userReview.rating.toFixed(1) : "0.0";

  const totalReviews = reviews.length + (userReview ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-warning text-warning" />
          <span className="font-semibold">{averageRating}</span>
          <span className="text-muted-foreground">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Write/Edit Review */}
      {user && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredStar || rating)
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating} star{rating !== 1 ? "s" : ""}
              </span>
            </div>

            <Textarea
              placeholder="Share your thoughts about this course..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            <Button
              onClick={handleSubmitReview}
              disabled={loading}
              variant="accent"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {userReview ? "Update Review" : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <a href="/auth" className="text-accent hover:underline">Sign in</a> to leave a review
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {userReview && (
          <ReviewCard review={userReview} isOwn />
        )}
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {totalReviews === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, isOwn }: { review: Review; isOwn?: boolean }) {
  const initials = review.profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <Card className={isOwn ? "border-accent/30 bg-accent/5" : ""}>
      <CardContent className="py-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={review.profile?.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">
                {review.profile?.full_name || "Anonymous"}
                {isOwn && <span className="text-accent ml-2 text-sm">(You)</span>}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-warning text-warning"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            {review.comment && (
              <p className="text-muted-foreground">{review.comment}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
