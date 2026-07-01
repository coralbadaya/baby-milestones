import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import MomCareTips from '../components/MomCareTips';
import { usePageMeta } from '../utils/pageMeta';

function MomCare({ birthDate }) {
  usePageMeta({
    title: 'Mom Care',
    description: 'Postpartum recovery timeline, self-care, and gentle guidance for the modern mother.',
  });
  return (
    <>
      <PageHero
        imageKey="momCare"
        layout="split"
        eyebrow="Recovery & wellness"
        title="My Care"
        subtitle="Postpartum timeline, self-care, and gentle guidance — because you matter too."
        size="md"
      />
      <PageSection surface="lavender" width="wide" className="mom-care-page page-body--with-mobile-nav">
        <MomCareTips birthDate={birthDate} />
      </PageSection>
    </>
  );
}

export default MomCare;
