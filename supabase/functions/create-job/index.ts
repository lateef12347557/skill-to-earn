import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log('Creating job with data:', JSON.stringify(body));

    const {
      title,
      description,
      company_name,
      company_logo,
      employer_id,
      budget_min,
      budget_max,
      duration_days,
      category,
      status = 'open',
      is_verified = false,
      skills = []
    } = body;

    // Validate required fields
    if (!title || !description) {
      console.error('Missing required fields: title or description');
      return new Response(
        JSON.stringify({ error: 'Title and description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title,
        description,
        company_name,
        company_logo,
        employer_id,
        budget_min,
        budget_max,
        duration_days,
        category,
        status,
        is_verified
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return new Response(
        JSON.stringify({ error: jobError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Job created successfully:', job.id);

    // If skills are provided, link them to the job
    if (skills.length > 0) {
      const jobSkillsToInsert = skills.map((skillId: string) => ({
        job_id: job.id,
        skill_id: skillId
      }));

      const { error: skillsError } = await supabase
        .from('job_skills')
        .insert(jobSkillsToInsert);

      if (skillsError) {
        console.error('Error linking skills:', skillsError);
      } else {
        console.log('Skills linked successfully');
      }
    }

    return new Response(
      JSON.stringify({ success: true, job }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
