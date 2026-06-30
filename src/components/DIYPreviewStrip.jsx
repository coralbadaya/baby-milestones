import { useState } from 'react';
import diyActivities from '../data/diyActivities';
import DIYEditorialCard from './DIYEditorialCard';
import SectionHeader from './SectionHeader';
import { ROUTES } from '../routes';

function DIYPreviewStrip({ month, limit = 3, layout = 'stack' }) {
  const [openId, setOpenId] = useState(null);
  const monthData = diyActivities.find((d) => d.month === month);
  if (!monthData?.activities?.length) return null;

  const activities = monthData.activities.slice(0, limit);
  const isGrid = layout === 'grid';

  return (
    <div className={`diy-preview-strip diy-preview-strip--${layout}`}>
      <SectionHeader
        id={`diy-preview-heading-${month}`}
        eyebrow="Hands-on play"
        title="DIY activities"
        subtitle={`Curated ideas for month ${month} — open a guide or watch on YouTube.`}
        linkTo={`${ROUTES.month(month)}#diy`}
        linkLabel={`All for month ${month} →`}
      />

      <div className={`diy-preview-strip__cards${isGrid ? ' diy-preview-strip__cards--grid' : ''}`}>
        {activities.map((activity, index) => (
          <DIYEditorialCard
            key={activity.id}
            activity={activity}
            variant={isGrid ? 'stack' : 'split'}
            isOpen={openId === activity.id}
            onOpen={setOpenId}
            onClose={() => setOpenId(null)}
            imageLoading={index === 0 ? 'lazy' : 'lazy'}
          />
        ))}
      </div>
    </div>
  );
}

export default DIYPreviewStrip;
