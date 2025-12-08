import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Mail, Lock, ArrowRight, Github, Chrome, User, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function Auth() {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"learner" | "employer">("learner");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, signInWithGithub, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors[0].message);
        return false;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors[0].message);
        return false;
      }
    }
    
    if (isSignUp && !fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created! Check your email to confirm your account.");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
    }
  };

  const handleGithubSignIn = async () => {
    const { error } = await signInWithGithub();
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
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
            <CardTitle className="text-2xl">
              {isSignUp ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Start your journey to earning" 
                : "Sign in to continue your journey"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="h-4 w-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleGithubSignIn}
                disabled={isLoading}
              >
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
              {isSignUp && (
                <>
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>I want to</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("learner")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          role === "learner"
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <GraduationCap className="h-6 w-6" />
                        <span className="text-sm font-medium">Learn & Earn</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("employer")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          role === "employer"
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <Briefcase className="h-6 w-6" />
                        <span className="text-sm font-medium">Hire Talent</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="accent" 
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <Link to="/auth" className="text-accent font-medium hover:underline">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link to="/auth?mode=signup" className="text-accent font-medium hover:underline">
                    Sign up free
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="hover:underline">Terms</Link> and{" "}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
