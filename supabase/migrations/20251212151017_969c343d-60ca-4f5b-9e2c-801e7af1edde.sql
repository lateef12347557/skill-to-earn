-- Create course_likes table
CREATE TABLE public.course_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  learning_path_id uuid NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, learning_path_id)
);

-- Enable RLS
ALTER TABLE public.course_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_likes
CREATE POLICY "Users can view all likes" ON public.course_likes
FOR SELECT USING (true);

CREATE POLICY "Users can like courses" ON public.course_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike courses" ON public.course_likes
FOR DELETE USING (auth.uid() = user_id);

-- Create course_reviews table
CREATE TABLE public.course_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  learning_path_id uuid NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, learning_path_id)
);

-- Enable RLS
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.course_reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.course_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.course_reviews
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.course_reviews
FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_course_reviews_updated_at
BEFORE UPDATE ON public.course_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();