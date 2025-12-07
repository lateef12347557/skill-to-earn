import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Mail, Lock, User, ArrowRight, Github, Chrome, CheckCircle2 } from "lucide-react";

const benefits = [
  "Access to 500+ real micro-jobs",
  "Free learning paths to build skills",
  "Build portfolio with every project",
  "Get paid for your work",
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"learner" | "employer">("learner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-md">
            <Zap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Skill<span className="text-accent">Link</span>
          </span>
        </Link>

        <Card variant="elevated">
          <CardHeader className="text-center pb-2">
            <Badge variant="success" className="w-fit mx-auto mb-2">Free Forever</Badge>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start your journey from learning to earning
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Account Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setAccountType("learner")}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  accountType === "learner"
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                I want to earn
              </button>
              <button
                type="button"
                onClick={() => setAccountType("employer")}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  accountType === "employer"
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                I'm hiring
              </button>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="gap-2">
                <Chrome className="h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <Button type="submit" variant="accent" className="w-full gap-2">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Benefits */}
            {accountType === "learner" && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium mb-3">What you get:</p>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="hover:underline">Terms</Link> and{" "}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
