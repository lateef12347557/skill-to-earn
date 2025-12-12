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
    console.log('Creating learning path with data:', JSON.stringify(body));

    const {
      title,
      description,
      image_url,
      difficulty,
      category,
      duration_hours,
      is_published = false,
      lessons = []
    } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      console.error('Missing or invalid required field: title');
      return new Response(
        JSON.stringify({ error: 'Title is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate difficulty if provided
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return new Response(
        JSON.stringify({ error: `difficulty must be one of: ${validDifficulties.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate duration_hours if provided
    if (duration_hours !== undefined && (typeof duration_hours !== 'number' || duration_hours < 0)) {
      return new Response(
        JSON.stringify({ error: 'duration_hours must be a positive number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert the learning path
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .insert({
        title: title.trim(),
        description: description?.trim(),
        image_url,
        difficulty,
        category: category?.trim(),
        duration_hours,
        is_published
      })
      .select()
      .single();

    if (pathError) {
      console.error('Error creating learning path:', pathError);
      return new Response(
        JSON.stringify({ error: pathError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Learning path created successfully:', learningPath.id);

    // If lessons are provided, create them
    if (Array.isArray(lessons) && lessons.length > 0) {
      const lessonsToInsert = lessons.map((lesson: any, index: number) => {
        if (!lesson.title || typeof lesson.title !== 'string') {
          throw new Error(`Lesson at index ${index} must have a valid title`);
        }
        return {
          learning_path_id: learningPath.id,
          title: lesson.title.trim(),
          description: lesson.description?.trim(),
          content: lesson.content?.trim(),
          video_url: lesson.video_url,
          duration_minutes: lesson.duration_minutes,
          order_index: lesson.order_index ?? index + 1
        };
      });

      const { data: createdLessons, error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessonsToInsert)
        .select();

      if (lessonsError) {
        console.error('Error creating lessons:', lessonsError);
      } else {
        console.log('Lessons created successfully:', createdLessons.length);
        return new Response(
          JSON.stringify({ success: true, learningPath, lessons: createdLessons }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, learningPath }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
