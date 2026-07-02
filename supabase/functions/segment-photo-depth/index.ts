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
    const { photoId, photoUrl, userId } = await req.json();
    const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    let layerCount = 3;
    let replicatePredictionId = null;

    if (replicateToken && photoUrl) {
      const createRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          Authorization: `Token ${replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'depth-anything',
          input: { image: photoUrl },
        }),
      });

      if (createRes.ok) {
        const pred = await createRes.json();
        replicatePredictionId = pred.id;
        layerCount = 4;
      }
    }

    if (supabaseUrl && serviceKey && userId && photoId) {
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase.from('book_page_layers').upsert({
        user_id: userId,
        photo_id: photoId,
        layer_count: layerCount,
        replicate_prediction_id: replicatePredictionId,
        status: replicatePredictionId ? 'processing' : 'stub',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'photo_id' });
    }

    return new Response(JSON.stringify({
      ok: true,
      photoId,
      layerCount,
      replicatePredictionId,
      message: replicateToken ? 'Depth segmentation queued' : 'Stub layers — set REPLICATE_API_TOKEN',
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
