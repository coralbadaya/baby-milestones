import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
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
        layout="split"
        eyebrow="With baby in tow"
        title="Travel"
        subtitle="Age-aware tips for flights, road trips, and long-haul — London to Dubai and beyond."
        size="md"
      />
      <PageSection surface="mist" width="wide" className="page-body--with-mobile-nav travel-page">
        <TravelTips currentMonth={currentMonth} />
      </PageSection>
    </>
  );
}

export default Travel;
