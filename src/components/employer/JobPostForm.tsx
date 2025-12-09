import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

interface JobPostFormProps {
  userId: string;
  skills: Skill[];
  onJobCreated: () => void;
}

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
  "Marketing",
  "Content Writing",
  "Video Editing",
  "Other",
];

export function JobPostForm({ userId, skills, onJobCreated }: JobPostFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_name: "",
    budget_min: "",
    budget_max: "",
    duration_days: "",
    category: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in job title and description.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    // Create the job
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .insert({
        employer_id: userId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        company_name: formData.company_name.trim() || null,
        budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        category: formData.category || null,
        status: "open",
      })
      .select("id")
      .single();

    if (jobError) {
      toast({
        title: "Error creating job",
        description: jobError.message,
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Add job skills
    if (selectedSkills.length > 0 && job) {
      const { error: skillsError } = await supabase
        .from("job_skills")
        .insert(
          selectedSkills.map((skillId) => ({
            job_id: job.id,
            skill_id: skillId,
          }))
        );

      if (skillsError) {
        console.error("Error adding job skills:", skillsError);
      }
    }

    setSubmitting(false);

    toast({
      title: "Job posted!",
      description: "Your job listing is now live.",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      company_name: "",
      budget_min: "",
      budget_max: "",
      duration_days: "",
      category: "",
    });
    setSelectedSkills([]);
    onJobCreated();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-accent" />
          Post a New Job
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., React Developer for E-commerce Site"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="Your company name"
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the job requirements, expectations, and deliverables..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_min">Min Budget ($)</Label>
              <Input
                id="budget_min"
                type="number"
                placeholder="e.g., 100"
                value={formData.budget_min}
                onChange={(e) => handleChange("budget_min", e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_max">Max Budget ($)</Label>
              <Input
                id="budget_max"
                type="number"
                placeholder="e.g., 500"
                value={formData.budget_max}
                onChange={(e) => handleChange("budget_max", e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_days">Duration (days)</Label>
              <Input
                id="duration_days"
                type="number"
                placeholder="e.g., 7"
                value={formData.duration_days}
                onChange={(e) => handleChange("duration_days", e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md bg-muted/30 min-h-[60px]">
              {selectedSkills.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Click skills below to add them
                </span>
              ) : (
                selectedSkills.map((skillId) => {
                  const skill = skills.find((s) => s.id === skillId);
                  return (
                    <Badge
                      key={skillId}
                      variant="accent"
                      className="gap-1 cursor-pointer"
                      onClick={() => toggleSkill(skillId)}
                    >
                      {skill?.name}
                      <X className="h-3 w-3" />
                    </Badge>
                  );
                })
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills
                .filter((s) => !selectedSkills.includes(s.id))
                .slice(0, 12)
                .map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/10"
                    onClick={() => toggleSkill(skill.id)}
                  >
                    {skill.name}
                  </Badge>
                ))}
            </div>
          </div>

          <Button type="submit" variant="accent" disabled={submitting}>
            {submitting ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
