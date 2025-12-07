import { GraduationCap, Target, Briefcase, Wallet, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    title: "Learn Skills",
    description: "Pick from curated learning paths designed for real-world jobs. Short, focused lessons you can complete in days.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Target,
    title: "Apply to Micro-Jobs",
    description: "Browse real tasks from verified companies. Apply with your skills and get matched instantly.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Briefcase,
    title: "Complete & Deliver",
    description: "Work on real projects with clear requirements. Build your portfolio with every completed task.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Wallet,
    title: "Get Paid",
    description: "Receive payment directly after work approval. Build your reputation and unlock higher-paying jobs.",
    color: "bg-accent/10 text-accent",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Learning to Earning in{" "}
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No fluff. No waiting. Start converting your skills into income today.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line - desktop only */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group"
              >
                {/* Step number and icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg relative z-10 bg-background`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center z-20">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow - mobile only */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <ArrowRight className="h-6 w-6 text-border rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
