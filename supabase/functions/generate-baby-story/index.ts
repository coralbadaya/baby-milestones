const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LANGUAGES = [
  { code: 'en', marker: 'the full moon' },
  { code: 'hi', marker: 'chanda mama' },
  { code: 'es', marker: 'la luna llena' },
  { code: 'ta', marker: 'chandiran' },
  { code: 'te', marker: 'chandamama' },
  { code: 'bn', marker: 'chander alo' },
  { code: 'ar', marker: 'qamar' },
  { code: 'zh', marker: 'yueliang' },
  { code: 'pt', marker: 'lua cheia' },
  { code: 'fr', marker: 'la pleine lune' },
  { code: 'de', marker: 'der Vollmond' },
  { code: 'ja', marker: 'mangetsu' },
];

const SCENE_LINES_EN = [
  ['One quiet night, {N} looked up and the stars looked back.', 'The little captain whispered, and the rocket hummed awake.', 'Past the moon, {N} waved at unnamed planets.'],
  ['{N} dipped a brush and the grey wall began to bloom.', 'Every color had a feeling, and {N} knew them all.', 'By morning, the city woke inside {N}\'s painting.'],
  ['With a crayon map, {N} set off where the path got green.', 'A fox bowed, a river giggled, and {N} learned the language of leaves.', 'The whole wide world said hello to {N}.'],
  ['{N} found a song inside an old violin.', 'One note, then a thousand — the room filled with light.', 'Even the moon asked for an encore.'],
];

const SCENE_INDEX: Record<string, number> = {
  astronaut: 0, artist: 1, explorer: 2, musician: 3,
};

function fill(template: string, name: string) {
  return template.split('{N}').join(name);
}

function buildPages(babyName: string, lang: typeof LANGUAGES[0], opts: {
  folkOpening?: Record<string, string> | null;
  sceneId?: string | null;
  persona?: string;
  artStyle?: string;
}) {
  const marker = lang.marker;
  const pages: Array<{ text: string; type: string; culturalCaption?: string }> = [];

  if (opts.folkOpening?.[lang.code]) {
    pages.push({ text: opts.folkOpening[lang.code], type: 'opening' });
  } else if (opts.sceneId && SCENE_INDEX[opts.sceneId] !== undefined) {
    const panels = SCENE_LINES_EN[SCENE_INDEX[opts.sceneId]];
    pages.push({ text: fill(panels[0], babyName), type: 'opening' });
    pages.push({ text: fill(panels[1], babyName), type: 'body', culturalCaption: marker });
    pages.push({ text: fill(panels[2], babyName), type: 'closing' });
    return pages;
  }

  const body = lang.code === 'hi'
    ? `Aaj raat, ${marker} ke neeche, chhote ${babyName} ne dekha ki har chamak mein ek lori chhupi hai.`
    : lang.code === 'es'
      ? `Esta noche, bajo ${marker}, el pequeño ${babyName} descubrió que cada destello guardaba una nana.`
      : `Tonight, under ${marker}, little ${babyName} discovered a secret lullaby in every glimmer.`;

  if (opts.folkOpening?.en) pages.push({ text: opts.folkOpening.en, type: 'opening' });
  pages.push({ text: body, type: 'body', culturalCaption: marker });
  pages.push({ text: 'And so, wrapped in warmth, sleep came softly.', type: 'closing' });
  return pages;
}

async function maybeEnhanceWithLlm(base: Record<string, unknown>, openaiKey: string | undefined) {
  if (!openaiKey) return base;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Improve this children's story title only, keep it under 8 words: ${base.title}`,
        }],
        max_tokens: 30,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      const title = json.choices?.[0]?.message?.content?.trim();
      if (title) return { ...base, title: title.replace(/^["']|["']$/g, '') };
    }
  } catch {
    /* template fallback */
  }
  return base;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const babyName = body.babyName || 'little one';
    const folkOpenings = body.folkOpenings || null;
    const sceneId = body.folkTemplateId ? null : (body.sceneId || 'astronaut');

    const languageVariants: Record<string, unknown> = {};
    for (const lang of LANGUAGES) {
      languageVariants[lang.code] = {
        language: lang.code,
        title: sceneId ? `A story for ${babyName}` : `Month ${body.babyAgeMonths || 6} — A story for ${babyName}`,
        pages: buildPages(babyName, lang, {
          folkOpening: folkOpenings,
          sceneId,
          persona: body.persona,
          artStyle: body.artStyle,
        }),
      };
    }

    let payload = {
      title: languageVariants.en.title as string,
      persona: body.persona || 'gentle',
      artStyle: body.artStyle || 'watercolor',
      sceneId,
      language: body.language || 'en',
      languageVariants,
      pages: (languageVariants.en as { pages: unknown }).pages,
    };

    payload = await maybeEnhanceWithLlm(payload, Deno.env.get('OPENAI_API_KEY'));

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
