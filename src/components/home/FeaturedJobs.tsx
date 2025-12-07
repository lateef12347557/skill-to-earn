import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

const featuredJobs = [
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
  },
];

export function FeaturedJobs() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Fresh <span className="text-gradient">Opportunities</span>
            </h2>
            <p className="text-muted-foreground">
              Real jobs from real companies. Apply now and start earning.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" className="gap-2">
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Job Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredJobs.map((job) => (
            <Card key={job.id} variant="interactive" className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="level">{job.level}</Badge>
                  {job.verified && (
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
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

              <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">
                    {job.applicants} applied
                  </span>
                  <Button size="sm" variant="accent">
                    Apply Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
