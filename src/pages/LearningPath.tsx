import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Clock, BookOpen, CheckCircle2, 
  PlayCircle, Lock, Star, Users
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  order_index: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  duration_hours: number | null;
  lessons: Lesson[];
}

export default function LearningPathPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchPath() {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          id,
          title,
          description,
          category,
          difficulty,
          duration_hours,
          lessons (
            id,
            title,
            description,
            duration_minutes,
            order_index
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

      if (!error && data) {
        const sortedLessons = data.lessons.sort((a, b) => a.order_index - b.order_index);
        setPath({ ...data, lessons: sortedLessons });
      }
      
      setLoading(false);

      // Fetch user progress
      if (user && data) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('learning_path_id', id)
          .eq('completed', true);

        if (progress) {
          setCompletedLessons(new Set(progress.map(p => p.lesson_id).filter(Boolean) as string[]));
        }
      }
    }

    fetchPath();
  }, [id, user]);

  const progressPercentage = path?.lessons.length 
    ? Math.round((completedLessons.size / path.lessons.length) * 100)
    : 0;

  const getNextLesson = () => {
    if (!path) return null;
    return path.lessons.find(lesson => !completedLessons.has(lesson.id));
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "~5 min";
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Learning Path Not Found</h1>
            <Button asChild>
              <Link to="/learn">Browse Learning Paths</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Link 
            to="/learn" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="level">{path.category || "General"}</Badge>
              <Badge variant="secondary">{path.difficulty || "All Levels"}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{path.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{path.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {path.lessons.length} lessons
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {path.duration_hours ? `${path.duration_hours} hours` : "Self-paced"}
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-warning text-warning" />
                4.8 rating
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                1.2k enrolled
              </span>
            </div>
          </div>

          {/* Progress bar */}
          {user && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Your Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedLessons.size} of {path.lessons.length} lessons completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3 mb-4" />
                
                {nextLesson && progressPercentage < 100 && (
                  <Button asChild variant="accent" className="gap-2">
                    <Link to={`/lesson/${nextLesson.id}`}>
                      <PlayCircle className="h-4 w-4" />
                      {completedLessons.size === 0 ? "Start Learning" : "Continue Learning"}
                    </Link>
                  </Button>
                )}
                
                {progressPercentage === 100 && (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Path Completed!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card className="mb-8 bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Track your progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign in to save your progress and earn certificates
                    </p>
                  </div>
                  <Button asChild variant="accent">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lessons list */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Course Content</h2>
            
            {path.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              const isLocked = !user && index > 0;
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`transition-all ${isCompleted ? 'bg-success/5 border-success/20' : ''} ${isLocked ? 'opacity-60' : 'hover:border-accent/50'}`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      {/* Lesson number / status */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-success text-success-foreground' 
                          : isLocked 
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-accent/10 text-accent'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      {/* Duration & action */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(lesson.duration_minutes)}
                        </span>
                        
                        {!isLocked && (
                          <Button 
                            asChild 
                            size="sm" 
                            variant={isCompleted ? "outline" : "accent"}
                          >
                            <Link to={`/lesson/${lesson.id}`}>
                              {isCompleted ? "Review" : "Start"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}