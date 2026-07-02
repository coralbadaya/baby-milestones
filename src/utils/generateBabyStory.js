/**
 * Client-side story generator (MVP). Replace with Edge Function when AI keys are configured.
 * @param {{ month: number, babyName?: string, persona?: string, artStyle?: string, photoUrls?: string[] }} input
 */
export function generateBabyStoryPages(input) {
  const name = input.babyName || 'your baby';
  const month = input.month || 1;
  const persona = input.persona || 'gentle';
  const titles = {
    gentle: 'A Quiet Moment',
    adventurous: 'Small Discoveries',
    whimsical: 'Dreams and Wonders',
    classic: 'A Lullaby Page',
  };

  return [
    {
      page: 1,
      text: `Month ${month} — ${name} is growing in ways that feel both sudden and eternal.`,
      imageHint: input.artStyle || 'watercolor',
    },
    {
      page: 2,
      text: persona === 'whimsical'
        ? 'Tiny fingers reach for light, as if catching stardust between naps.'
        : 'Each smile is a bookmark in a story you will read together for years.',
      imageHint: input.photoUrls?.[0] ? 'photo' : 'illustration',
      imageUrl: input.photoUrls?.[0] || null,
    },
    {
      page: 3,
      text: 'Tonight, this page belongs to you — a keepsake from the art of early motherhood.',
      imageHint: 'glow',
    },
  ];
}

export function buildStoryTitle(month) {
  return `Month ${month} — Their Story So Far`;
}
