import { useMemo, useState } from 'react';
import DIYEditorialCard from './DIYEditorialCard';
import SmartCarousel from './SmartCarousel';
import SectionHeader from './SectionHeader';
import { ROUTES } from '../routes';
import { useDiyActivitiesContext } from '../context/DiyActivitiesContext';
import { orderForCarousel } from '../utils/smartCarouselOrder';

function DIYPreviewStrip({ month, limit = 3 }) {
  const [openId, setOpenId] = useState(null);
  const { activitiesByMonth } = useDiyActivitiesContext();
  const monthData = activitiesByMonth.find((d) => d.month === month);
  const activities = useMemo(() => {
    if (!monthData?.activities?.length) return [];
    return orderForCarousel(monthData.activities).slice(0, limit);
  }, [monthData, limit]);

  if (!activities.length) return null;

  return (
    <div className="diy-preview-strip diy-preview-strip--carousel">
      <SectionHeader
        id={`diy-preview-heading-${month}`}
        eyebrow="Hands-on play"
        title="DIY activities"
        subtitle={`Easiest first for month ${month} — swipe for a mix of play, then open the full month.`}
        linkTo={`${ROUTES.month(month)}#diy`}
        linkLabel={`All for month ${month} →`}
      />

      <SmartCarousel
        items={activities}
        getItemId={(a) => a.id}
        getItemLabel={(a) => a.name}
        resetKey={`${month}-${limit}`}
        ariaLabel={`DIY activities for month ${month}`}
        renderItem={(activity, index) => (
          <DIYEditorialCard
            activity={activity}
            variant="stack"
            isOpen={openId === activity.id}
            onOpen={setOpenId}
            onClose={() => setOpenId(null)}
            imageLoading={index === 0 ? 'eager' : 'lazy'}
          />
        )}
      />
    </div>
  );
}

export default DIYPreviewStrip;
