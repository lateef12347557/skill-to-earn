import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, Briefcase, BookOpen, Star, TrendingUp, 
  Clock, CheckCircle2, ArrowRight, Award, Target
} from "lucide-react";

const dashboardData = {
  earnings: {
    total: "$1,250",
    thisMonth: "$450",
    pending: "$200",
  },
  stats: {
    jobsCompleted: 8,
    successRate: 95,
    level: "Rising Talent",
    xp: 2450,
    nextLevel: 3000,
  },
  activeJobs: [
    {
      id: 1,
      title: "Build Contact Form",
      company: "StartupXYZ",
      deadline: "2 days left",
      progress: 65,
      budget: "$80",
    },
    {
      id: 2,
      title: "Logo Redesign",
      company: "BrandCo",
      deadline: "4 days left",
      progress: 30,
      budget: "$120",
    },
  ],
  learningProgress: [
    {
      id: 1,
      title: "Web Development Fundamentals",
      progress: 75,
      currentLesson: "React Basics",
      lessonsLeft: 6,
    },
  ],
  recentActivity: [
    { type: "payment", text: "Received $150 for Landing Page project", time: "2 hours ago" },
    { type: "review", text: "Got 5-star review from TechStart Inc.", time: "1 day ago" },
    { type: "job", text: "Applied to 'Design Dashboard UI'", time: "2 days ago" },
    { type: "lesson", text: "Completed 'CSS Flexbox' lesson", time: "3 days ago" },
  ],
};

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-background border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, Alex! 👋
                </h1>
                <p className="text-muted-foreground">
                  You're making great progress. Keep it up!
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">View Profile</Button>
                <Button variant="accent">Find Jobs</Button>
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
                          <p className="text-2xl font-bold text-success">{dashboardData.earnings.total}</p>
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
                          <p className="text-sm text-muted-foreground">Jobs Completed</p>
                          <p className="text-2xl font-bold">{dashboardData.stats.jobsCompleted}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                          <Star className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-2xl font-bold">{dashboardData.stats.successRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Jobs */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg">Active Jobs</CardTitle>
                    <Button variant="ghost" size="sm" className="text-accent">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardData.activeJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                          </div>
                          <Badge variant="success">{job.budget}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {job.deadline}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Learning Progress */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg">Learning Progress</CardTitle>
                    <Button variant="ghost" size="sm" className="text-accent">
                      Continue Learning
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.learningProgress.map((course) => (
                      <div key={course.id} className="p-4 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Current: {course.currentLesson}
                            </p>
                          </div>
                          <Badge variant="accent">{course.lessonsLeft} lessons left</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <Button variant="accent" size="sm" className="mt-4 gap-2">
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Level Card */}
                <Card variant="featured">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg">{dashboardData.stats.level}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.stats.xp} / {dashboardData.stats.nextLevel} XP
                      </p>
                    </div>
                    <Progress 
                      value={(dashboardData.stats.xp / dashboardData.stats.nextLevel) * 100} 
                      className="h-2 mb-3" 
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      {dashboardData.stats.nextLevel - dashboardData.stats.xp} XP to next level
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
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-semibold text-success">{dashboardData.earnings.thisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-semibold text-warning">{dashboardData.earnings.pending}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">All Time</span>
                      <span className="font-bold text-lg">{dashboardData.earnings.total}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Withdraw Funds
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {activity.type === "payment" && <Wallet className="h-4 w-4 text-success" />}
                            {activity.type === "review" && <Star className="h-4 w-4 text-warning" />}
                            {activity.type === "job" && <Target className="h-4 w-4 text-accent" />}
                            {activity.type === "lesson" && <BookOpen className="h-4 w-4 text-accent" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
