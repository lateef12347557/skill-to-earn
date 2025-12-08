import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, Clock, DollarSign, Building2, CheckCircle2, 
  Filter, ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  description: string;
  company_name: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_days: number | null;
  category: string | null;
  is_verified: boolean;
  job_skills: { skills: { name: string } | null }[];
}

const categories = ["All", "Frontend", "Backend", "Design", "Data", "Full Stack"];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          company_name,
          budget_min,
          budget_max,
          duration_days,
          category,
          is_verified,
          job_skills (
            skills (
              name
            )
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_skills.some((js) => 
        js.skills?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = 
      selectedCategory === "All" || 
      job.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatBudget = (min: number | null, max: number | null) => {
    if (min && max) return `$${min} - $${max}`;
    if (max) return `Up to $${max}`;
    if (min) return `From $${min}`;
    return "Negotiable";
  };

  const formatDuration = (days: number | null) => {
    if (!days) return "Flexible";
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days === 7) return "1 week";
    return `${Math.ceil(days / 7)} weeks`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-hero py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Find <span className="text-accent">Micro-Jobs</span> That Pay
              </h1>
              <p className="text-primary-foreground/80 mb-8">
                Real projects from verified companies. Apply, complete, and get paid.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-background/90 backdrop-blur border-0 shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Jobs */}
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

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs available
              </p>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>

            {/* Job Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-20 mb-2" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <Skeleton className="h-12 w-full mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} variant="interactive" className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="level">{job.category || "General"}</Badge>
                        {job.is_verified && (
                          <div className="flex items-center gap-1 text-accent">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg leading-snug">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {job.company_name || "Anonymous"}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 pb-4">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.job_skills.slice(0, 3).map((js, index) => (
                          js.skills && (
                            <Badge key={index} variant="skill">
                              {js.skills.name}
                            </Badge>
                          )
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-success font-medium">
                          <DollarSign className="h-4 w-4" />
                          {formatBudget(job.budget_min, job.budget_max)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDuration(job.duration_days)}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 border-t border-border">
                      <div className="flex items-center justify-between w-full pt-4">
                        <span className="text-xs text-muted-foreground">
                          Posted recently
                        </span>
                        <Button size="sm" variant="accent" className="gap-1">
                          Apply
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found matching your criteria</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
