import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { conceptId, matchedPhotoIds, userId } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    let jobId = null;
    if (supabaseUrl && serviceKey && userId) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data } = await supabase.from('book_ideas').insert({
        user_id: userId,
        concept_id: conceptId,
        matched_photo_ids: matchedPhotoIds || [],
        status: 'queued',
      }).select('id').single();
      jobId = data?.id ?? null;
    }

    return new Response(JSON.stringify({
      status: 'queued',
      jobId,
      conceptId,
      matchedPhotoIds,
      previewUrl: null,
      message: `Layout job queued for ${conceptId}`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
