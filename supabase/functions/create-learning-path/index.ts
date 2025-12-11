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
    if (!title) {
      console.error('Missing required field: title');
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert the learning path
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .insert({
        title,
        description,
        image_url,
        difficulty,
        category,
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
    if (lessons.length > 0) {
      const lessonsToInsert = lessons.map((lesson: any, index: number) => ({
        learning_path_id: learningPath.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        video_url: lesson.video_url,
        duration_minutes: lesson.duration_minutes,
        order_index: lesson.order_index ?? index + 1
      }));

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

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
