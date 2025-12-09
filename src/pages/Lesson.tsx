import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, ArrowRight, Clock, CheckCircle2, 
  BookOpen, Video, ChevronLeft, ChevronRight
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  learning_path_id: string;
  learning_paths: {
    id: string;
    title: string;
    lessons: { id: string; title: string; order_index: number }[];
  };
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          content,
          video_url,
          duration_minutes,
          order_index,
          learning_path_id,
          learning_paths (
            id,
            title,
            lessons (
              id,
              title,
              order_index
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        // Sort lessons by order_index
        const sortedLessons = data.learning_paths?.lessons.sort((a, b) => a.order_index - b.order_index) || [];
        setLesson({
          ...data,
          learning_paths: {
            ...data.learning_paths!,
            lessons: sortedLessons
          }
        });
      }
      
      setLoading(false);

      // Check completion status
      if (user && data) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('lesson_id', id)
          .maybeSingle();

        setIsCompleted(progress?.completed || false);
      }
    }

    fetchLesson();
  }, [id, user]);

  const handleMarkComplete = async () => {
    if (!user || !lesson) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track your progress.",
        variant: "destructive"
      });
      return;
    }

    setMarking(true);

    // Upsert progress
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        learning_path_id: lesson.learning_path_id,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      });

    setMarking(false);

    if (error) {
      // Try insert instead (might be unique constraint issue)
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          learning_path_id: lesson.learning_path_id,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (insertError) {
        toast({
          title: "Error",
          description: "Could not save progress. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsCompleted(true);
    toast({
      title: "Lesson completed!",
      description: "Great job! Keep up the momentum.",
    });
  };

  const getCurrentIndex = () => {
    if (!lesson) return -1;
    return lesson.learning_paths.lessons.findIndex(l => l.id === lesson.id);
  };

  const getPreviousLesson = () => {
    const index = getCurrentIndex();
    if (index <= 0 || !lesson) return null;
    return lesson.learning_paths.lessons[index - 1];
  };

  const getNextLesson = () => {
    const index = getCurrentIndex();
    if (!lesson || index === -1 || index >= lesson.learning_paths.lessons.length - 1) return null;
    return lesson.learning_paths.lessons[index + 1];
  };

  const getProgressPercentage = () => {
    if (!lesson) return 0;
    const total = lesson.learning_paths.lessons.length;
    const current = getCurrentIndex() + 1;
    return Math.round((current / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-8" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
            <Button asChild>
              <Link to="/learn">Browse Learning Paths</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const prevLesson = getPreviousLesson();
  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/learn" className="hover:text-foreground">Learn</Link>
            <span>/</span>
            <Link 
              to={`/learning-path/${lesson.learning_path_id}`} 
              className="hover:text-foreground"
            >
              {lesson.learning_paths.title}
            </Link>
            <span>/</span>
            <span className="text-foreground">Lesson {getCurrentIndex() + 1}</span>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Lesson {getCurrentIndex() + 1} of {lesson.learning_paths.lessons.length}
              </span>
              <span className="font-medium">{getProgressPercentage()}% complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              {lesson.video_url ? (
                <Badge variant="accent" className="gap-1">
                  <Video className="h-3 w-3" />
                  Video Lesson
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  Reading
                </Badge>
              )}
              {lesson.duration_minutes && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {lesson.duration_minutes} min
                </span>
              )}
              {isCompleted && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-lg text-muted-foreground">{lesson.description}</p>
            )}
          </div>

          {/* Video player placeholder */}
          {lesson.video_url && (
            <Card className="mb-8 overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video content would appear here</p>
                  <p className="text-sm">{lesson.video_url}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Lesson content */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                {lesson.content ? (
                  lesson.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground/90">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Lesson content coming soon...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Complete button */}
          {user && !isCompleted && (
            <div className="flex justify-center mb-8">
              <Button 
                onClick={handleMarkComplete} 
                disabled={marking}
                variant="success"
                size="lg"
                className="gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                {marking ? "Saving..." : "Mark as Complete"}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            {prevLesson ? (
              <Button 
                asChild 
                variant="outline" 
                className="gap-2"
              >
                <Link to={`/lesson/${prevLesson.id}`}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button 
                asChild 
                variant="ghost" 
                className="gap-2"
              >
                <Link to={`/learning-path/${lesson.learning_path_id}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to Path
                </Link>
              </Button>
            )}

            {nextLesson ? (
              <Button 
                asChild 
                variant="accent" 
                className="gap-2"
              >
                <Link to={`/lesson/${nextLesson.id}`}>
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button 
                asChild 
                variant="success" 
                className="gap-2"
              >
                <Link to={`/learning-path/${lesson.learning_path_id}`}>
                  Complete Path
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}