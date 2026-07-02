/** Long-haul city metadata — placeholder guide sections until content pass */

export const LONG_HAUL_CITY_IDS = ['london', 'dubai', 'newYork'];

export const longHaulCities = {
  london: {
    id: 'london',
    label: 'London',
    tagline: 'Layering for damp-cool weather and short winter days',
    flightNote: 'Red-eye from the Gulf or overnight from the East Coast',
    icon: 'globe',
    color: '#6B7B8C',
    bg: 'rgba(107, 123, 140, 0.12)',
    gradient: 'linear-gradient(145deg, #8B9AAD 0%, #D6E9F8 45%, #E8E0F0 100%)',
  },
  dubai: {
    id: 'dubai',
    label: 'Dubai',
    tagline: 'Heat-safe transit and mall-to-taxi routines',
    flightNote: 'Direct long-haul hub — plan AC-to-AC transfers',
    icon: '1f308',
    color: '#C9A24B',
    bg: 'rgba(201, 162, 75, 0.14)',
    gradient: 'linear-gradient(145deg, #E8C872 0%, #F5EDE5 50%, #D6E9F8 100%)',
  },
  newYork: {
    id: 'newYork',
    label: 'New York',
    tagline: 'Subway stairs, stroller folds, and seasonal swings',
    flightNote: 'East Coast overnight or transatlantic morning arrivals',
    icon: 'hotel',
    color: '#8B6B61',
    bg: 'rgba(139, 107, 97, 0.12)',
    gradient: 'linear-gradient(145deg, #A88478 0%, #F5EDE5 40%, #E8E0F0 100%)',
  },
};

/** Shared placeholder sections — replace per city in a future content pass */
export const longHaulPlaceholderSections = [
  {
    heading: 'Packing',
    items: [
      'Climate-specific layering lists matched to your baby\'s month',
      'Compact medical kit for international trips',
    ],
  },
  {
    heading: 'In flight',
    items: [
      'Red-eye flight sleep strategies by age',
      'Feeding and pressure routines for takeoff and landing',
    ],
  },
  {
    heading: 'On arrival',
    items: [
      'Jet-lag reset windows for the first 48 hours',
      'Local pediatric contacts and pharmacy essentials',
    ],
  },
];

export function getLongHaulCity(id) {
  return longHaulCities[id] ?? longHaulCities.london;
}

export default longHaulCities;
