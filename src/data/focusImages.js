/**
 * TodayFocus card image headers — reuses hero photography.
 * See docs/editorial-page-system.md Phase 5
 */
import { pageImages } from './pageImages';

export const focusImages = {
  milestones: {
    src: pageImages.baby.src,
    alt: pageImages.baby.alt,
    fallbackGradient: pageImages.baby.fallbackGradient,
  },
  momCare: {
    src: pageImages.momCare.src,
    alt: pageImages.momCare.alt,
    fallbackGradient: pageImages.momCare.fallbackGradient,
  },
  diy: {
    src: pageImages.baby.src,
    alt: 'Hands-on play and sensory activities with baby',
    fallbackGradient: pageImages.baby.fallbackGradient,
  },
  editorial: {
    src: pageImages.essentials.src,
    alt: pageImages.essentials.alt,
    fallbackGradient: pageImages.essentials.fallbackGradient,
  },
};
