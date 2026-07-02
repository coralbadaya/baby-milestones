/** First-year chapter copy for baby book spreads (v2 prototype alignment). */

export const BOOK_CHAPTERS = [
  { month: 1, title: 'Hello, world', milestone: 'Lifts head briefly', caption: 'The day everything changed.' },
  { month: 2, title: 'First smiles', milestone: 'Coos & gurgles', caption: 'You smiled, and we melted.' },
  { month: 3, title: 'Reaching out', milestone: 'Holds head steady', caption: 'Tiny hands, big discoveries.' },
  { month: 4, title: 'Rolls & giggles', milestone: 'Rolls over', caption: 'The giggle that started it all.' },
  { month: 5, title: 'Sitting pretty', milestone: 'Sits with support', caption: 'Front-row seat to the world.' },
  { month: 6, title: 'Tastes of everything', milestone: 'Starts solids', caption: 'Avocado: a love story.' },
  { month: 7, title: 'On the move', milestone: 'Crawls', caption: 'No corner is safe now.' },
  { month: 8, title: 'Pull to stand', milestone: 'Pulls to stand', caption: 'Reaching higher every day.' },
  { month: 9, title: 'First words', milestone: 'Says first word', caption: 'And then they said our name.' },
  { month: 10, title: 'Cruising', milestone: 'Cruises furniture', caption: 'One hand, then no hands.' },
  { month: 11, title: 'Almost walking', milestone: 'Stands alone', caption: 'The bravest little steps.' },
  { month: 12, title: 'Happy birthday', milestone: 'First steps & a candle', caption: 'One year of you. Forever for us.' },
];

/**
 * @param {number} month 1–12
 */
export function getBookChapter(month) {
  const idx = Math.max(1, Math.min(12, month)) - 1;
  return BOOK_CHAPTERS[idx];
}

export default BOOK_CHAPTERS;
