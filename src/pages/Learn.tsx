import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Code, Palette, LineChart, PenTool, Camera, Globe, 
  BookOpen, Clock, Briefcase, ArrowRight, Star, Users
} from "lucide-react";

const learningPaths = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    icon: Code,
    description: "Master HTML, CSS, and JavaScript. Build responsive websites and land your first web development job.",
    lessons: 24,
    duration: "2 weeks",
    jobs: 156,
    students: "2.3K",
    rating: 4.9,
    color: "bg-accent/10 text-accent",
    skills: ["HTML", "CSS", "JavaScript", "React Basics"],
    featured: true,
  },
  {
    id: 2,
    title: "UI/UX Design Essentials",
    icon: Palette,
    description: "Learn Figma, design principles, and create stunning user interfaces that clients love.",
    lessons: 18,
    duration: "10 days",
    jobs: 89,
    students: "1.8K",
    rating: 4.8,
    color: "bg-success/10 text-success",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    featured: true,
  },
  {
    id: 3,
    title: "Data Analysis Starter",
    icon: LineChart,
    description: "Excel, Google Sheets, and data visualization. Turn raw data into actionable insights.",
    lessons: 16,
    duration: "1 week",
    jobs: 234,
    students: "3.1K",
    rating: 4.7,
    color: "bg-warning/10 text-warning",
    skills: ["Excel", "Google Sheets", "Data Viz", "SQL Basics"],
    featured: false,
  },
  {
    id: 4,
    title: "Content & Copywriting",
    icon: PenTool,
    description: "Write compelling copy that sells. SEO, marketing copy, and content strategy included.",
    lessons: 12,
    duration: "5 days",
    jobs: 178,
    students: "1.5K",
    rating: 4.9,
    color: "bg-accent/10 text-accent",
    skills: ["Copywriting", "SEO Writing", "Email Marketing", "Content Strategy"],
    featured: false,
  },
  {
    id: 5,
    title: "Video Editing & Thumbnails",
    icon: Camera,
    description: "Create engaging video content and eye-catching thumbnails for social media.",
    lessons: 14,
    duration: "1 week",
    jobs: 67,
    students: "890",
    rating: 4.6,
    color: "bg-success/10 text-success",
    skills: ["Premiere Pro", "Canva", "Thumbnail Design", "Video Editing"],
    featured: false,
  },
  {
    id: 6,
    title: "WordPress Development",
    icon: Globe,
    description: "Build and customize WordPress sites. Theme development and plugin basics.",
    lessons: 20,
    duration: "2 weeks",
    jobs: 145,
    students: "1.2K",
    rating: 4.7,
    color: "bg-warning/10 text-warning",
    skills: ["WordPress", "PHP Basics", "Theme Customization", "Elementor"],
    featured: false,
  },
];

const categories = ["All", "Development", "Design", "Writing", "Data", "Marketing"];

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState("All");

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
                <div className="text-2xl md:text-3xl font-bold text-accent">12+</div>
                <div className="text-sm text-muted-foreground">Learning Paths</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-success">500+</div>
                <div className="text-sm text-muted-foreground">Available Jobs</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Students Enrolled</div>
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

            {/* Featured Paths */}
            <h2 className="text-xl font-semibold mb-6">Featured Paths</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {learningPaths
                .filter((path) => path.featured)
                .map((path) => {
                  const Icon = path.icon;
                  return (
                    <Card key={path.id} variant="featured" className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl ${path.color} flex items-center justify-center flex-shrink-0`}>
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
                                {path.rating}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {path.students} students
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <p className="text-muted-foreground mb-4">{path.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {path.skills.map((skill) => (
                            <Badge key={skill} variant="skill">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {path.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {path.duration}
                          </span>
                          <span className="flex items-center gap-1 text-success font-medium">
                            <Briefcase className="h-4 w-4" />
                            {path.jobs} jobs
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
              {learningPaths.map((path) => {
                const Icon = path.icon;
                return (
                  <Card key={path.id} variant="interactive" className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-xl ${path.color} flex items-center justify-center mb-4`}>
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
                          {path.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {path.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="success">{path.jobs} jobs</Badge>
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
      </main>
      <Footer />
    </div>
  );
}
