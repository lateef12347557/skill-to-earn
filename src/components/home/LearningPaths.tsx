import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Code, Palette, LineChart, PenTool, Clock, BookOpen } from "lucide-react";

const learningPaths = [
  {
    id: 1,
    title: "Web Development Basics",
    icon: Code,
    description: "HTML, CSS, and JavaScript fundamentals for landing real projects",
    lessons: 24,
    duration: "2 weeks",
    jobs: 156,
    color: "bg-accent/10 text-accent",
  },
  {
    id: 2,
    title: "UI/UX Design Essentials",
    icon: Palette,
    description: "Learn Figma, design principles, and create stunning interfaces",
    lessons: 18,
    duration: "10 days",
    jobs: 89,
    color: "bg-success/10 text-success",
  },
  {
    id: 3,
    title: "Data Analysis Starter",
    icon: LineChart,
    description: "Excel, Google Sheets, and basic data visualization skills",
    lessons: 16,
    duration: "1 week",
    jobs: 234,
    color: "bg-warning/10 text-warning",
  },
  {
    id: 4,
    title: "Content & Copywriting",
    icon: PenTool,
    description: "Write compelling copy that sells. SEO and marketing basics included",
    lessons: 12,
    duration: "5 days",
    jobs: 178,
    color: "bg-accent/10 text-accent",
  },
];

export function LearningPaths() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Learn Skills That <span className="text-gradient">Pay</span>
            </h2>
            <p className="text-muted-foreground">
              Short, focused paths designed to get you job-ready fast
            </p>
          </div>
          <Link to="/learn">
            <Button variant="outline" className="gap-2">
              Browse All Paths
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Learning Path Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPaths.map((path) => {
            const Icon = path.icon;
            return (
              <Card key={path.id} variant="interactive" className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl ${path.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg leading-snug mb-2">
                    {path.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {path.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {path.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="success">
                      {path.jobs} jobs available
                    </Badge>
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
      </div>
    </section>
  );
}
