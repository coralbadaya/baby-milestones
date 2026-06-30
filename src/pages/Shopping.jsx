import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import ShoppingChecklist from '../components/ShoppingChecklist';
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
      </PageSection>
    </>
  );
}

export default Shopping;
