import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Clock, DollarSign, Building2, CheckCircle2, 
  Filter, MapPin, Briefcase, ArrowRight
} from "lucide-react";

const allJobs = [
  {
    id: 1,
    title: "Build a Landing Page",
    company: "TechStart Inc.",
    verified: true,
    budget: "$150",
    duration: "3 days",
    skills: ["HTML", "CSS", "React"],
    level: "Entry",
    applicants: 12,
    location: "Remote",
    description: "Create a responsive landing page for our new SaaS product launch.",
  },
  {
    id: 2,
    title: "Design Social Media Graphics",
    company: "BrandFlow Agency",
    verified: true,
    budget: "$80",
    duration: "2 days",
    skills: ["Figma", "Canva"],
    level: "Entry",
    applicants: 8,
    location: "Remote",
    description: "Design 10 engaging social media posts for Instagram and Twitter.",
  },
  {
    id: 3,
    title: "Data Entry & Analysis",
    company: "DataCorp Solutions",
    verified: true,
    budget: "$120",
    duration: "4 days",
    skills: ["Excel", "Google Sheets"],
    level: "Entry",
    applicants: 23,
    location: "Remote",
    description: "Clean and analyze customer data from multiple sources.",
  },
  {
    id: 4,
    title: "Write Product Descriptions",
    company: "E-Shop Global",
    verified: false,
    budget: "$200",
    duration: "5 days",
    skills: ["Copywriting", "SEO"],
    level: "Intermediate",
    applicants: 15,
    location: "Remote",
    description: "Write compelling product descriptions for 50 e-commerce items.",
  },
  {
    id: 5,
    title: "WordPress Site Update",
    company: "LocalBiz Marketing",
    verified: true,
    budget: "$300",
    duration: "1 week",
    skills: ["WordPress", "CSS", "PHP"],
    level: "Intermediate",
    applicants: 7,
    location: "Remote",
    description: "Update and optimize an existing WordPress website with new features.",
  },
  {
    id: 6,
    title: "Create Video Thumbnails",
    company: "ContentCreators Hub",
    verified: true,
    budget: "$60",
    duration: "1 day",
    skills: ["Photoshop", "Canva"],
    level: "Entry",
    applicants: 31,
    location: "Remote",
    description: "Design 5 eye-catching YouTube video thumbnails.",
  },
];

const categories = ["All", "Development", "Design", "Writing", "Data", "Marketing"];
const levels = ["All Levels", "Entry", "Intermediate", "Expert"];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredJobs = allJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} variant="interactive" className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="level">{job.level}</Badge>
                      {job.verified && (
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
                      {job.company}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="skill">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-success font-medium">
                        <DollarSign className="h-4 w-4" />
                        {job.budget}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {job.duration}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 border-t border-border">
                    <div className="flex items-center justify-between w-full pt-4">
                      <span className="text-xs text-muted-foreground">
                        {job.applicants} applied
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
