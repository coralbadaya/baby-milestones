import PageHero from '../components/PageHero';
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
        eyebrow="Recovery & wellness"
        title="My Care"
        subtitle="Postpartum timeline, self-care, and gentle guidance — because you matter too."
        size="md"
      />
      <div className="mom-care-page page-body page-body--wide page-body--with-mobile-nav">
        <MomCareTips birthDate={birthDate} />
      </div>
    </>
  );
}

export default MomCare;
