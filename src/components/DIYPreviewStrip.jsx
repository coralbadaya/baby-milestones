import { useState } from 'react';
import DIYEditorialCard from './DIYEditorialCard';
import SmartCarousel from './SmartCarousel';
import SectionHeader from './SectionHeader';
import { ROUTES } from '../routes';
import { useDiyActivitiesContext } from '../context/DiyActivitiesContext';
import { useMaxWidth } from '../hooks/useMaxWidth';

function DIYPreviewStrip({ month, limit = 3, layout = 'stack' }) {
  const [openId, setOpenId] = useState(null);
  const isMobile = useMaxWidth(639);
  const { activitiesByMonth } = useDiyActivitiesContext();
  const monthData = activitiesByMonth.find((d) => d.month === month);
  if (!monthData?.activities?.length) return null;

  const activities = monthData.activities.slice(0, limit);
  const isGrid = layout === 'grid';
  const useCarousel = isMobile;

  const cardVariant = useCarousel || isGrid ? 'stack' : 'split';

  const renderCard = (activity, index) => (
    <DIYEditorialCard
      activity={activity}
      variant={cardVariant}
      isOpen={openId === activity.id}
      onOpen={setOpenId}
      onClose={() => setOpenId(null)}
      imageLoading={index === 0 ? 'eager' : 'lazy'}
    />
  );

  return (
    <div className={`diy-preview-strip diy-preview-strip--${layout}${useCarousel ? ' diy-preview-strip--carousel' : ''}`}>
      <SectionHeader
        id={`diy-preview-heading-${month}`}
        eyebrow="Hands-on play"
        title="DIY activities"
        subtitle={`Curated ideas for month ${month} — open a guide for step-by-step play.`}
        linkTo={`${ROUTES.month(month)}#diy`}
        linkLabel={`All for month ${month} →`}
      />

      {useCarousel ? (
        <SmartCarousel
          items={activities}
          getItemId={(a) => a.id}
          getItemLabel={(a) => a.name}
          resetKey={month}
          ariaLabel={`DIY activities for month ${month}`}
          renderItem={(activity) => renderCard(activity, activities.findIndex((a) => a.id === activity.id))}
        />
      ) : (
        <div className={`diy-preview-strip__cards${isGrid ? ' diy-preview-strip__cards--grid' : ''}`}>
          {activities.map((activity, index) => (
            <div key={activity.id}>{renderCard(activity, index)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DIYPreviewStrip;
