import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

const benefits = [
  { icon: Zap, text: "Start earning in 30 days or less" },
  { icon: Shield, text: "Verified companies, guaranteed payments" },
  { icon: Clock, text: "Learn at your own pace" },
];

export function CTASection() {
  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Turn Your Skills Into{" "}
            <span className="text-accent">Real Income?</span>
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join SkillLink today. Learn, work on real projects, and start earning. No experience required.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/80">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm">{benefit.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/employers">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto text-primary-foreground">
                I'm Hiring Talent
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            Free to join • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
