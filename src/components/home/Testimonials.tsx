import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Web Developer",
    earned: "$3,200",
    duration: "2 months",
    avatar: "SK",
    quote: "I learned React in 2 weeks and landed my first paid project within days. SkillLink made it possible to start earning while still learning.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Graphic Designer",
    earned: "$1,800",
    duration: "6 weeks",
    avatar: "MT",
    quote: "The micro-jobs are perfect for building a portfolio. Companies trust the platform, so getting paid is never an issue.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Data Analyst",
    earned: "$2,500",
    duration: "3 months",
    avatar: "PM",
    quote: "Transitioning careers felt impossible until I found SkillLink. The learning paths are practical and the jobs are real.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="accent" className="mb-4">Success Stories</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real People, <span className="text-gradient">Real Earnings</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands who've turned their skills into income
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="elevated" className="relative">
              <CardContent className="pt-8">
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/20" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center font-semibold text-accent">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-success">{testimonial.earned}</div>
                    <div className="text-xs text-muted-foreground">in {testimonial.duration}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
