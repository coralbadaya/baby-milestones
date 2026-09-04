import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import TravelTips from '../components/TravelTips';
import { usePageMeta } from '../utils/pageMeta';
import { getStaticMeta } from '../seo/routes';
import { ROUTES } from '../routes';

function Travel({ currentMonth }) {
  usePageMeta(getStaticMeta(ROUTES.travel) || {});
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
