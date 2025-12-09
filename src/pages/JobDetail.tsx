import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Clock, DollarSign, Building2, CheckCircle2, 
  Calendar, MapPin, Send, Briefcase, Users
} from "lucide-react";

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
  created_at: string;
  job_skills: { skills: { name: string } | null }[];
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      
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
          created_at,
          job_skills (
            skills (
              name
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Job not found",
          description: "The job you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate('/jobs');
        return;
      }

      setJob(data);
      setLoading(false);

      // Check if user has already applied
      if (user) {
        const { data: application } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', id)
          .eq('applicant_id', user.id)
          .maybeSingle();
        
        setHasApplied(!!application);
      }
    }

    fetchJob();
  }, [id, user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a cover letter explaining why you're a good fit.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    const { error } = await supabase
      .from('applications')
      .insert({
        job_id: id,
        applicant_id: user.id,
        cover_letter: coverLetter.trim(),
        proposed_budget: proposedBudget ? parseInt(proposedBudget) : null
      });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Application failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application submitted!",
      description: "Your application has been sent to the employer.",
    });
    
    setHasApplied(true);
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (min && max) return `$${min} - $${max}`;
    if (max) return `Up to $${max}`;
    if (min) return `From $${min}`;
    return "Negotiable";
  };

  const formatDuration = (days: number | null) => {
    if (!days) return "Flexible timeline";
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days === 7) return "1 week";
    return `${Math.ceil(days / 7)} weeks`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-48 w-full" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="level">{job.category || "General"}</Badge>
                  {job.is_verified && (
                    <div className="flex items-center gap-1 text-accent">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified Employer</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-5 w-5" />
                  <span className="text-lg">{job.company_name || "Anonymous Company"}</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-success font-semibold">
                    <DollarSign className="h-4 w-4" />
                    {formatBudget(job.budget_min, job.budget_max)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Budget</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="h-4 w-4 text-accent" />
                    {formatDuration(job.duration_days)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Duration</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(job.created_at)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Posted</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Remote
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Location</p>
                </div>
              </div>

              {/* Skills */}
              {job.job_skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.job_skills.map((js, index) => (
                      js.skills && (
                        <Badge key={index} variant="skill" className="px-3 py-1">
                          {js.skills.name}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Job Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Application form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-accent" />
                    Apply Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasApplied ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Application Submitted</h3>
                      <p className="text-sm text-muted-foreground">
                        You've already applied for this job. Check your dashboard for updates.
                      </p>
                      <Button asChild variant="outline" className="mt-4">
                        <Link to="/dashboard">View Dashboard</Link>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="coverLetter">Cover Letter *</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Explain why you're a great fit for this job..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          rows={6}
                          className="resize-none"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="proposedBudget">Your Proposed Rate ($)</Label>
                        <Input
                          id="proposedBudget"
                          type="number"
                          placeholder="Optional"
                          value={proposedBudget}
                          onChange={(e) => setProposedBudget(e.target.value)}
                          min="1"
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave empty to accept the posted budget
                        </p>
                      </div>

                      {!user && (
                        <p className="text-sm text-muted-foreground">
                          You'll need to{" "}
                          <Link to="/auth" className="text-accent hover:underline">
                            sign in
                          </Link>{" "}
                          to apply.
                        </p>
                      )}

                      <Button 
                        type="submit" 
                        variant="accent" 
                        className="w-full" 
                        disabled={submitting || !user}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}