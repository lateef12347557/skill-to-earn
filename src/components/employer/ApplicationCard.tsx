import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Mail, DollarSign, Calendar } from "lucide-react";

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

interface ApplicationCardProps {
  application: Application;
  onStatusChange: () => void;
}

export function ApplicationCard({ application, onStatusChange }: ApplicationCardProps) {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: "accepted" | "rejected") => {
    setUpdating(true);

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", application.id);

    setUpdating(false);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Application ${newStatus}`,
      description: `The applicant has been notified.`,
    });

    onStatusChange();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const profile = application.profiles;
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Applicant"} />
            <AvatarFallback className="bg-accent/10 text-accent">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold truncate">
                  {profile?.full_name || "Anonymous"}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {profile?.headline || profile?.email || "No details"}
                </p>
              </div>
              {getStatusBadge(application.status)}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              {application.proposed_budget && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${application.proposed_budget}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(application.created_at)}
              </span>
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1 text-accent hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              )}
            </div>

            {application.cover_letter && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {application.cover_letter}
                </p>
              </div>
            )}

            {application.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  className="gap-1"
                  onClick={() => handleStatusUpdate("accepted")}
                  disabled={updating}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={updating}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
