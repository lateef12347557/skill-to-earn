import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ApplicationCard } from "./ApplicationCard";
import { 
  Briefcase, DollarSign, Clock, Users, ChevronDown, 
  ChevronUp, Eye, EyeOff 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  applicant_id: string;
  status: string | null;
  cover_letter: string | null;
  proposed_budget: number | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  company_name: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_days: number | null;
  category: string | null;
  status: string | null;
  created_at: string;
  applications: Application[];
}

interface JobManagementCardProps {
  job: Job;
  onRefresh: () => void;
}

export function JobManagementCard({ job, onRefresh }: JobManagementCardProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const pendingCount = job.applications.filter((a) => a.status === "pending").length;
  const acceptedCount = job.applications.filter((a) => a.status === "accepted").length;

  const formatBudget = (min: number | null, max: number | null) => {
    if (min && max) return `$${min} - $${max}`;
    if (max) return `Up to $${max}`;
    if (min) return `From $${min}`;
    return "Negotiable";
  };

  const formatDuration = (days: number | null) => {
    if (!days) return "Flexible";
    if (days < 7) return `${days}d`;
    return `${Math.ceil(days / 7)}w`;
  };

  const toggleJobStatus = async () => {
    setUpdating(true);
    const newStatus = job.status === "open" ? "closed" : "open";

    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", job.id);

    setUpdating(false);

    if (error) {
      toast({
        title: "Error updating job",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Job ${newStatus === "open" ? "reopened" : "closed"}`,
      description: newStatus === "open" 
        ? "The job is now visible to applicants." 
        : "The job is no longer accepting applications.",
    });

    onRefresh();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={job.status === "open" ? "success" : "secondary"}>
                {job.status === "open" ? "Open" : "Closed"}
              </Badge>
              {job.category && (
                <Badge variant="outline">{job.category}</Badge>
              )}
            </div>
            <CardTitle className="text-lg truncate">{job.title}</CardTitle>
            {job.company_name && (
              <p className="text-sm text-muted-foreground mt-1">
                {job.company_name}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleJobStatus}
            disabled={updating}
            className="flex-shrink-0"
          >
            {job.status === "open" ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Close
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Reopen
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1 text-success">
            <DollarSign className="h-4 w-4" />
            {formatBudget(job.budget_min, job.budget_max)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDuration(job.duration_days)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            {job.applications.length} applicant{job.applications.length !== 1 ? "s" : ""}
          </span>
          {pendingCount > 0 && (
            <Badge variant="warning" className="text-xs">
              {pendingCount} pending
            </Badge>
          )}
          {acceptedCount > 0 && (
            <Badge variant="success" className="text-xs">
              {acceptedCount} accepted
            </Badge>
          )}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between"
              disabled={job.applications.length === 0}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {job.applications.length === 0
                  ? "No applications yet"
                  : `View ${job.applications.length} application${job.applications.length !== 1 ? "s" : ""}`}
              </span>
              {job.applications.length > 0 && (
                isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-4 space-y-3">
            {job.applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusChange={onRefresh}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
