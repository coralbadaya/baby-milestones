import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import ShoppingChecklist from '../components/ShoppingChecklist';
import PremiumGate from '../components/PremiumGate';
import { PREMIUM_FEATURES } from '../constants/premium';
import { usePageMeta } from '../utils/pageMeta';

function Shopping({ checkedItems, toggleCheck, currentMonth }) {
  usePageMeta({
    title: 'Shopping Checklist',
    description: 'A curated, month-by-month baby shopping checklist — investment pieces, not clutter.',
  });
  return (
    <>
      <PageHero
        imageKey="shopping"
        layout="split"
        eyebrow="Curated edit"
        title="Shopping"
        subtitle="Investment pieces by month — quality over clutter."
        size="md"
      />
      <PageSection surface="sand" width="wide" className="page-body--with-mobile-nav shopping-page">
        <ShoppingChecklist
          checkedItems={checkedItems}
          toggleCheck={toggleCheck}
          currentMonth={currentMonth}
        />
        <PremiumGate feature={PREMIUM_FEATURES.shoppingPremiumEdit}>
          <section className="shopping-premium-edit card-accent-top">
            <h2 className="font-display">Premium brand edit</h2>
            <p>Investment nursery pieces worth buying once — organic swaddles, carriers, and sleep essentials we return to every season.</p>
          </section>
        </PremiumGate>
      </PageSection>
    </>
  );
}

export default Shopping;
