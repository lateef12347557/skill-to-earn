import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Code, Palette, LineChart, PenTool, Database, Globe, 
  BookOpen, Clock, Briefcase, ArrowRight, Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  duration_hours: number | null;
  lesson_count: number;
}

const categories = ["All", "Frontend", "Backend", "Design", "Data", "Full Stack"];

const getCategoryIcon = (category: string | null) => {
  switch (category?.toLowerCase()) {
    case 'frontend': return Code;
    case 'backend': return Database;
    case 'design': return Palette;
    case 'data': return LineChart;
    case 'full stack': return Globe;
    default: return BookOpen;
  }
};

const getCategoryColor = (category: string | null) => {
  switch (category?.toLowerCase()) {
    case 'frontend': return 'bg-accent/10 text-accent';
    case 'backend': return 'bg-success/10 text-success';
    case 'design': return 'bg-warning/10 text-warning';
    case 'data': return 'bg-accent/10 text-accent';
    case 'full stack': return 'bg-success/10 text-success';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearningPaths() {
      setLoading(true);
      
      // Fetch learning paths
      const { data: paths, error } = await supabase
        .from('learning_paths')
        .select('id, title, description, category, difficulty, duration_hours')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && paths) {
        // Fetch lesson counts for each path
        const pathsWithCounts = await Promise.all(
          paths.map(async (path) => {
            const { count } = await supabase
              .from('lessons')
              .select('*', { count: 'exact', head: true })
              .eq('learning_path_id', path.id);
            
            return {
              ...path,
              lesson_count: count || 0
            };
          })
        );
        
        setLearningPaths(pathsWithCounts);
      }
      setLoading(false);
    }

    fetchLearningPaths();
  }, []);

  const filteredPaths = learningPaths.filter((path) => 
    selectedCategory === "All" || 
    path.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  const formatDuration = (hours: number | null) => {
    if (!hours) return "Self-paced";
    if (hours < 24) return `${hours} hours`;
    return `${Math.ceil(hours / 8)} days`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-hero py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="accent" className="mb-4">Learn & Earn</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Skills That <span className="text-accent">Actually Pay</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Short, focused learning paths designed to get you job-ready in days, not months.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-accent">{learningPaths.length}+</div>
                <div className="text-sm text-muted-foreground">Learning Paths</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-success">50+</div>
                <div className="text-sm text-muted-foreground">Lessons Available</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Job-Focused</div>
              </div>
            </div>
          </div>
        </section>

        {/* Paths */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPaths.length > 0 ? (
              <>
                {/* Featured Paths (first 2) */}
                <h2 className="text-xl font-semibold mb-6">Featured Paths</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {filteredPaths.slice(0, 2).map((path) => {
                    const Icon = getCategoryIcon(path.category);
                    const colorClass = getCategoryColor(path.category);
                    return (
                      <Card key={path.id} variant="featured" className="flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-xl">{path.title}</h3>
                                <Badge variant="accent">Featured</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-warning text-warning" />
                                  4.8
                                </span>
                                <span>{path.difficulty || "All levels"}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1">
                          <p className="text-muted-foreground mb-4">{path.description}</p>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {path.lesson_count} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(path.duration_hours)}
                            </span>
                            <span className="flex items-center gap-1 text-success font-medium">
                              <Briefcase className="h-4 w-4" />
                              Jobs available
                            </span>
                          </div>

                          <Button variant="accent" className="w-full gap-2">
                            Start Learning
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* All Paths */}
                <h2 className="text-xl font-semibold mb-6">All Learning Paths</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPaths.map((path) => {
                    const Icon = getCategoryIcon(path.category);
                    const colorClass = getCategoryColor(path.category);
                    return (
                      <Card key={path.id} variant="interactive" className="flex flex-col">
                        <CardHeader className="pb-3">
                          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {path.description}
                          </p>
                        </CardHeader>

                        <CardContent className="flex-1">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {path.lesson_count} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(path.duration_hours)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{path.difficulty || "All levels"}</Badge>
                            <Button size="sm" variant="ghost" className="gap-1 text-accent hover:text-accent">
                              Start
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No learning paths found in this category</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
