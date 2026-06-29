import PageHero from '../components/PageHero';
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
        eyebrow="Curated edit"
        title="Shopping"
        subtitle="Investment pieces by month — quality over clutter."
        size="md"
      />
      <div className="shopping-page page-body page-body--wide page-body--with-mobile-nav">
        <ShoppingChecklist
          checkedItems={checkedItems}
          toggleCheck={toggleCheck}
          currentMonth={currentMonth}
        />
      </div>
    </>
  );
}

export default Shopping;
