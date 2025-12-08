import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
}

interface Application {
  id: string;
  status: string;
  proposed_budget: number | null;
  created_at: string;
  jobs: {
    title: string;
    company_name: string | null;
  } | null;
}

interface LearningProgress {
  id: string;
  completed: boolean;
  learning_paths: {
    title: string;
    category: string | null;
    difficulty: string | null;
  } | null;
  progressPercent: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Stats {
  totalEarned: number;
  pendingEarnings: number;
  totalApplications: number;
  completedLessons: number;
}

export function useDashboardData(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEarned: 0,
    pendingEarnings: 0,
    totalApplications: 0,
    completedLessons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      setLoading(true);
      
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, headline, bio')
          .eq('id', userId)
          .maybeSingle();
        
        setProfile(profileData);

        // Fetch applications with job details
        const { data: applicationsData } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            proposed_budget,
            created_at,
            jobs (
              title,
              company_name
            )
          `)
          .eq('applicant_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        setApplications(applicationsData || []);

        // Fetch learning progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select(`
            id,
            completed,
            learning_path_id,
            learning_paths (
              title,
              category,
              difficulty
            )
          `)
          .eq('user_id', userId);

        // Group progress by learning path and calculate percentage
        const pathProgressMap = new Map<string, { total: number; completed: number; data: typeof progressData extends (infer T)[] ? T : never }>();
        
        (progressData || []).forEach(p => {
          if (!p.learning_path_id) return;
          
          const existing = pathProgressMap.get(p.learning_path_id);
          if (existing) {
            existing.total++;
            if (p.completed) existing.completed++;
          } else {
            pathProgressMap.set(p.learning_path_id, {
              total: 1,
              completed: p.completed ? 1 : 0,
              data: p
            });
          }
        });

        const formattedProgress: LearningProgress[] = Array.from(pathProgressMap.entries()).map(([pathId, info]) => ({
          id: pathId,
          completed: info.completed === info.total && info.total > 0,
          learning_paths: info.data?.learning_paths || null,
          progressPercent: info.total > 0 ? Math.round((info.completed / info.total) * 100) : 0
        }));

        setLearningProgress(formattedProgress);

        // Fetch payments
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('id, amount, status, created_at')
          .eq('payee_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        setPayments(paymentsData || []);

        // Calculate stats
        const completedPayments = (paymentsData || []).filter(p => p.status === 'completed');
        const pendingPayments = (paymentsData || []).filter(p => p.status === 'pending' || p.status === 'processing');
        const completedLessons = (progressData || []).filter(p => p.completed).length;

        setStats({
          totalEarned: completedPayments.reduce((sum, p) => sum + (p.amount / 100), 0),
          pendingEarnings: pendingPayments.reduce((sum, p) => sum + (p.amount / 100), 0),
          totalApplications: applicationsData?.length || 0,
          completedLessons,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [userId]);

  return {
    profile,
    applications,
    learningProgress,
    payments,
    stats,
    loading,
  };
}
