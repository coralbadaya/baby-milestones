/**
 * ElevenLabs TTS for cloned voice narration (Plus).
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voiceId, languageCode } = await req.json();
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');

    if (!apiKey || !voiceId || !text) {
      return new Response(JSON.stringify({
        ok: false,
        message: 'Set ELEVENLABS_API_KEY and provide voiceId + text',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        language_code: languageCode || 'en',
      }),
    });

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      throw new Error(err.slice(0, 200));
    }

    const audio = await ttsRes.arrayBuffer();
    return new Response(audio, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
