import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wallet, Briefcase, BookOpen, Star, TrendingUp, 
  Clock, ArrowRight, Award, Target, User, Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, applications, learningProgress, payments, stats, loading } = useDashboardData(user?.id);

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

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-background border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || "User"} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-accent" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    {profile?.headline || "Ready to learn and earn?"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Link to="/jobs">
                  <Button variant="accent">Find Jobs</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Earned</p>
                          {loading ? (
                            <Skeleton className="h-8 w-20" />
                          ) : (
                            <p className="text-2xl font-bold text-success">${stats.totalEarned}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Applications</p>
                          {loading ? (
                            <Skeleton className="h-8 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{stats.totalApplications}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lessons Done</p>
                          {loading ? (
                            <Skeleton className="h-8 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{stats.completedLessons}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Applications */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg">Your Applications</CardTitle>
                    <Link to="/jobs">
                      <Button variant="ghost" size="sm" className="text-accent">
                        Browse Jobs
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <div
                            key={app.id}
                            className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{app.jobs?.title}</h4>
                                <p className="text-sm text-muted-foreground">{app.jobs?.company_name}</p>
                              </div>
                              <Badge 
                                variant={
                                  app.status === 'accepted' ? 'success' : 
                                  app.status === 'rejected' ? 'destructive' : 
                                  'secondary'
                                }
                              >
                                {app.status}
                              </Badge>
                            </div>
                            {app.proposed_budget && (
                              <p className="text-sm text-muted-foreground">
                                Your bid: <span className="font-medium text-foreground">${app.proposed_budget}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                        <Link to="/jobs">
                          <Button variant="accent" className="gap-2">
                            Find Your First Job
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Learning Progress */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg">Learning Progress</CardTitle>
                    <Link to="/learn">
                      <Button variant="ghost" size="sm" className="text-accent">
                        Browse Courses
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                      </div>
                    ) : learningProgress.length > 0 ? (
                      <div className="space-y-4">
                        {learningProgress.map((progress) => (
                          <div key={progress.id} className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{progress.learning_paths?.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {progress.learning_paths?.category} • {progress.learning_paths?.difficulty}
                                </p>
                              </div>
                              <Badge variant={progress.completed ? "success" : "accent"}>
                                {progress.completed ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{progress.progressPercent}%</span>
                              </div>
                              <Progress value={progress.progressPercent} className="h-2" />
                            </div>
                            <Link to="/learn">
                              <Button variant="accent" size="sm" className="mt-4 gap-2">
                                Continue
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">Start learning to unlock job opportunities</p>
                        <Link to="/learn">
                          <Button variant="accent" className="gap-2">
                            Start Learning
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Profile Card */}
                <Card variant="featured">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {stats.completedLessons >= 10 ? "Rising Star" : 
                         stats.completedLessons >= 5 ? "Active Learner" : "Newcomer"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.completedLessons * 100} XP earned
                      </p>
                    </div>
                    <Progress 
                      value={Math.min((stats.completedLessons / 10) * 100, 100)} 
                      className="h-2 mb-3" 
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      {Math.max(10 - stats.completedLessons, 0)} more lessons to level up
                    </p>
                  </CardContent>
                </Card>

                {/* Earnings Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-success" />
                      Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Completed</span>
                          <span className="font-semibold text-success">${stats.totalEarned}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Pending</span>
                          <span className="font-semibold text-warning">${stats.pendingEarnings}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground">All Time</span>
                          <span className="font-bold text-lg">${stats.totalEarned + stats.pendingEarnings}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to="/jobs" className="block">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Briefcase className="h-4 w-4" />
                        Browse Jobs
                      </Button>
                    </Link>
                    <Link to="/learn" className="block">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <BookOpen className="h-4 w-4" />
                        Continue Learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Payments */}
                {payments.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {payments.slice(0, 3).map((payment) => (
                          <div key={payment.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                              <Wallet className="h-4 w-4 text-success" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">${payment.amount / 100}</p>
                              <p className="text-xs text-muted-foreground">
                                {payment.status} • {new Date(payment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
