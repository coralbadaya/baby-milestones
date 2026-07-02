/** Dream scenes — v2 prototype; culturally retold per language (not translated). */

export const STORY_SCENES = [
  { id: 'astronaut', emoji: '🚀', title: 'Astronaut', sub: 'Among the stars' },
  { id: 'artist', emoji: '🎨', title: 'Artist', sub: 'Painter of worlds' },
  { id: 'explorer', emoji: '🌿', title: 'Explorer', sub: 'Wild & curious' },
  { id: 'musician', emoji: '🎻', title: 'Musician', sub: 'Maker of melodies' },
];

const SCENE_INDEX = { astronaut: 0, artist: 1, explorer: 2, musician: 3 };

/** Three-panel lines per language; {N} = baby name placeholder */
const SCENE_LINES = {
  en: [
    ['One quiet night, {N} looked up and the stars looked back.', '“Buckle up,” whispered the little captain, and the rocket hummed awake.', 'Past the moon, past the rings, {N} waved at planets no one had named yet.'],
    ['{N} dipped a brush and the whole grey wall began to bloom.', 'Every color had a feeling, and {N} knew them all by name.', 'By morning, the city woke up inside a painting — {N}\'s painting.'],
    ['With a map drawn in crayon, {N} set off where the path got green.', 'A fox bowed, a river giggled, and {N} learned the language of leaves.', 'At the top of the hill, the whole wide world said hello to {N}.'],
    ['{N} found a song hiding inside an old wooden violin.', 'One note, then a thousand — the room filled up with light.', 'When {N} took a bow, even the moon asked for an encore.'],
  ],
  hi: [
    ['एक शांत रात, {N} ने ऊपर देखा — और चंदा मामा ने मुस्कुरा कर वापस देखा।', '“चलो उड़ें,” नन्ही कप्तान ने कहा, और रॉकेट गुनगुनाने लगा।', 'चाँद के पार, तारों के पार — {N} ने उन ग्रहों को हाथ हिलाया जिनके नाम अभी रखे ही नहीं गए।'],
    ['{N} ने रंगों में उँगली डुबोई, और सूनी दीवार पर फूल खिल उठे।', 'हर रंग की अपनी कहानी थी, और {N} सबकी सहेली थी।', 'सुबह हुई तो पूरा शहर एक तस्वीर के अंदर जागा — {N} की तस्वीर में।'],
    ['क्रेयॉन से बना नक्शा लेकर, {N} वहाँ चली जहाँ रास्ता हरा हो गया।', 'एक लोमड़ी ने सलाम किया, नदी खिलखिलाई, और {N} ने पत्तों की बोली सीख ली।', 'पहाड़ी की चोटी पर, पूरी दुनिया ने {N} को नमस्ते कहा।'],
    ['एक पुरानी वायलिन के अंदर {N} को एक गीत छिपा मिला।', 'एक सुर, फिर हज़ार — कमरा रोशनी से भर गया।', 'जब {N} ने झुक कर सलाम किया, तो चाँद ने भी कहा — एक बार और!'],
  ],
  es: [
    ['Una noche tranquila, {N} miró hacia arriba y la luna llena le devolvió la mirada.', '—Abróchate el cinturón —susurró la pequeña capitana, y el cohete despertó cantando.', 'Más allá de la luna, {N} saludó a planetas que nadie había nombrado todavía.'],
    ['{N} mojó un pincel y toda la pared gris empezó a florecer.', 'Cada color guardaba un sentimiento, y {N} los conocía a todos por su nombre.', 'Al amanecer, la ciudad despertó dentro de una pintura — la pintura de {N}.'],
    ['Con un mapa de crayones, {N} partió por donde el camino se volvía verde.', 'Un zorro hizo una reverencia, un río soltó una risita, y {N} aprendió el idioma de las hojas.', 'En lo alto de la colina, el mundo entero le dijo hola a {N}.'],
    ['{N} encontró una canción escondida dentro de un viejo violín.', 'Una nota, luego mil — la habitación se llenó de luz.', 'Cuando {N} hizo su reverencia, hasta la luna pidió otra más.'],
  ],
};

export function getStoryScene(id) {
  return STORY_SCENES.find((s) => s.id === id) ?? STORY_SCENES[0];
}

/**
 * @param {string} sceneId
 * @param {string} langCode
 * @param {string} babyName
 * @returns {{ opening: string, body: string, closing: string }}
 */
export function getSceneStoryLines(sceneId, langCode, babyName) {
  const idx = SCENE_INDEX[sceneId] ?? 0;
  const langLines = SCENE_LINES[langCode] || SCENE_LINES.en;
  const panels = langLines[idx] || SCENE_LINES.en[idx];
  const name = babyName || 'little one';
  const fill = (line) => line.split('{N}').join(name);

  return {
    opening: fill(panels[0]),
    body: fill(panels[1]),
    closing: fill(panels[2]),
  };
}

export default STORY_SCENES;
