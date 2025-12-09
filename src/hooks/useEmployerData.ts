import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  headline: string | null;
}

interface Application {
  id: string;
  applicant_id: string;
  status: string | null;
  cover_letter: string | null;
  proposed_budget: number | null;
  created_at: string;
  profiles: Profile | null;
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

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export function useEmployerData(userId: string | undefined) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobsWithProfiles = async (employerId: string): Promise<Job[]> => {
    // Fetch jobs with applications
    const { data: jobsData } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        description,
        company_name,
        budget_min,
        budget_max,
        duration_days,
        category,
        status,
        created_at,
        applications (
          id,
          applicant_id,
          status,
          cover_letter,
          proposed_budget,
          created_at
        )
      `)
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (!jobsData) return [];

    // Get all unique applicant IDs
    const applicantIds = new Set<string>();
    jobsData.forEach((job) => {
      job.applications?.forEach((app) => {
        if (app.applicant_id) applicantIds.add(app.applicant_id);
      });
    });

    // Fetch profiles for all applicants
    const profilesMap = new Map<string, Profile>();
    if (applicantIds.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, headline')
        .in('id', Array.from(applicantIds));

      profiles?.forEach((p) => {
        profilesMap.set(p.id, {
          full_name: p.full_name,
          email: p.email,
          avatar_url: p.avatar_url,
          headline: p.headline,
        });
      });
    }

    // Combine jobs with profile data
    return jobsData.map((job) => ({
      ...job,
      applications: (job.applications || []).map((app) => ({
        ...app,
        profiles: profilesMap.get(app.applicant_id) || null,
      })),
    }));
  };

  useEffect(() => {
    async function fetchData() {
      if (!userId) {
        setLoading(false);
        return;
      }

      // Check if user is an employer
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'employer')
        .maybeSingle();

      setIsEmployer(!!roleData);

      if (!roleData) {
        setLoading(false);
        return;
      }

      // Fetch employer's jobs with applications and profiles
      const jobsWithProfiles = await fetchJobsWithProfiles(userId);
      setJobs(jobsWithProfiles);

      // Fetch all skills for job posting
      const { data: skillsData } = await supabase
        .from('skills')
        .select('id, name, category')
        .order('name');

      setSkills(skillsData || []);
      setLoading(false);
    }

    fetchData();
  }, [userId]);

  const refreshJobs = async () => {
    if (!userId) return;
    const jobsWithProfiles = await fetchJobsWithProfiles(userId);
    setJobs(jobsWithProfiles);
  };

  return { jobs, skills, isEmployer, loading, refreshJobs };
}
