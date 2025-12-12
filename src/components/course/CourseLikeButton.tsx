import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CourseLikeButtonProps {
  learningPathId: string;
}

export function CourseLikeButton({ learningPathId }: CourseLikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikeData();
  }, [learningPathId, user]);

  async function fetchLikeData() {
    // Get total likes count
    const { count } = await supabase
      .from('course_likes')
      .select('*', { count: 'exact', head: true })
      .eq('learning_path_id', learningPathId);
    
    setLikeCount(count || 0);

    // Check if current user liked
    if (user) {
      const { data } = await supabase
        .from('course_likes')
        .select('id')
        .eq('learning_path_id', learningPathId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setLiked(!!data);
    }
  }

  async function handleToggleLike() {
    if (!user) {
      toast.error("Please sign in to like courses");
      return;
    }

    setLoading(true);

    if (liked) {
      const { error } = await supabase
        .from('course_likes')
        .delete()
        .eq('learning_path_id', learningPathId)
        .eq('user_id', user.id);

      if (!error) {
        setLiked(false);
        setLikeCount(prev => prev - 1);
      }
    } else {
      const { error } = await supabase
        .from('course_likes')
        .insert({ learning_path_id: learningPathId, user_id: user.id });

      if (!error) {
        setLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success("Course added to favorites!");
      }
    }

    setLoading(false);
  }

  return (
    <Button
      variant={liked ? "accent" : "outline"}
      size="sm"
      onClick={handleToggleLike}
      disabled={loading}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {likeCount}
    </Button>
  );
}
