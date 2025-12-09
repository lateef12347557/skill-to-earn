import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobPostForm } from "@/components/employer/JobPostForm";
import { JobManagementCard } from "@/components/employer/JobManagementCard";
import { useAuth } from "@/hooks/useAuth";
import { useEmployerData } from "@/hooks/useEmployerData";
import { 
  Briefcase, Users, DollarSign, TrendingUp, 
  Plus, AlertCircle, ArrowRight
} from "lucide-react";

export default function EmployerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { jobs, skills, isEmployer, loading, refreshJobs } = useEmployerData(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not an employer
  if (!isEmployer) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center p-8">
              <AlertCircle className="h-16 w-16 text-warning mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Employer Access Required</h1>
              <p className="text-muted-foreground mb-6">
                You need an employer account to post jobs and manage applications.
                If you're a learner looking for work, check out the jobs page.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/jobs">
                  <Button variant="accent">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate stats
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "open").length;
  const totalApplications = jobs.reduce((acc, j) => acc + j.applications.length, 0);
  const pendingApplications = jobs.reduce(
    (acc, j) => acc + j.applications.filter((a) => a.status === "pending").length,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-background border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Employer Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Post jobs and manage your applications
                </p>
              </div>
              <Link to="/dashboard">
                <Button variant="outline">View Learner Dashboard</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Jobs</p>
                      <p className="text-2xl font-bold">{totalJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Jobs</p>
                      <p className="text-2xl font-bold text-success">{openJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="text-2xl font-bold">{totalApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                      <p className="text-2xl font-bold text-warning">{pendingApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="jobs" className="space-y-6">
              <TabsList>
                <TabsTrigger value="jobs" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  My Jobs
                </TabsTrigger>
                <TabsTrigger value="post" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post Job
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-4">
                {jobs.length === 0 ? (
                  <Card className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Post your first job to start receiving applications
                    </p>
                  </Card>
                ) : (
                  jobs.map((job) => (
                    <JobManagementCard
                      key={job.id}
                      job={job}
                      onRefresh={refreshJobs}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="post">
                <JobPostForm
                  userId={user.id}
                  skills={skills}
                  onJobCreated={refreshJobs}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
