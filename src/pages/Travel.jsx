import PageHero from '../components/PageHero';
import TravelTips from '../components/TravelTips';
import { usePageMeta } from '../utils/pageMeta';

function Travel({ currentMonth }) {
  usePageMeta({
    title: 'Travel with Baby',
    description: 'Age-aware travel tips for flights, road trips, and long-haul journeys with your baby.',
  });
  return (
    <>
      <PageHero
        imageKey="travel"
        eyebrow="With baby in tow"
        title="Travel"
        subtitle="Age-aware tips for flights, road trips, and long-haul — London to Dubai and beyond."
        size="md"
      />
      <div className="travel-page page-body page-body--wide page-body--with-mobile-nav">
        <TravelTips currentMonth={currentMonth} />
      </div>
    </>
  );
}

export default Travel;
