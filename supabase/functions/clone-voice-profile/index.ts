import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getServiceClient() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { profileId, durationSeconds } = await req.json();
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    const supabase = getServiceClient();

    const { data: profile, error: profileErr } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileErr || !profile) {
      throw new Error(profileErr?.message || 'Profile not found');
    }

    if (!apiKey || !profile.sample_storage_path) {
      return new Response(JSON.stringify({
        ok: true,
        profileId,
        durationSeconds,
        message: apiKey ? 'Voice sample saved — awaiting upload path' : 'Voice sample saved — clone pending ELEVENLABS_API_KEY',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: fileData, error: downloadErr } = await supabase.storage
      .from('voice-notes')
      .download(profile.sample_storage_path);

    if (downloadErr || !fileData) {
      throw new Error(downloadErr?.message || 'Could not download sample');
    }

    const form = new FormData();
    form.append('name', profile.display_name || `yarntrails-${profileId.slice(0, 8)}`);
    form.append('description', `Yarn Trails voice clone for ${profile.role}`);
    form.append('files', fileData, 'sample.webm');

    const cloneRes = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: { 'xi-api-key': apiKey },
      body: form,
    });

    if (!cloneRes.ok) {
      const errText = await cloneRes.text();
      throw new Error(`ElevenLabs: ${errText.slice(0, 200)}`);
    }

    const cloneJson = await cloneRes.json();
    const voiceId = cloneJson.voice_id;

    await supabase
      .from('voice_profiles')
      .update({
        clone_provider_id: voiceId,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    return new Response(JSON.stringify({
      ok: true,
      profileId,
      voiceId,
      durationSeconds,
      message: 'Voice clone created',
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
