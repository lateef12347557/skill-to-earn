import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API key
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = Deno.env.get('ADMIN_API_KEY');

    if (!apiKey || apiKey !== expectedApiKey) {
      console.error('Unauthorized: Invalid or missing API key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      console.error('Missing or invalid required field: title');
      return new Response(
        JSON.stringify({ error: 'Title is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      console.error('Missing or invalid required field: description');
      return new Response(
        JSON.stringify({ error: 'Description is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate optional fields
    if (budget_min !== undefined && (typeof budget_min !== 'number' || budget_min < 0)) {
      return new Response(
        JSON.stringify({ error: 'budget_min must be a positive number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (budget_max !== undefined && (typeof budget_max !== 'number' || budget_max < 0)) {
      return new Response(
        JSON.stringify({ error: 'budget_max must be a positive number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title: title.trim(),
        description: description.trim(),
        company_name: company_name?.trim(),
        company_logo,
        employer_id,
        budget_min,
        budget_max,
        duration_days,
        category: category?.trim(),
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
    if (Array.isArray(skills) && skills.length > 0) {
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
