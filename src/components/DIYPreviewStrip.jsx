import { useState } from 'react';
import { Link } from 'react-router-dom';
import diyActivities from '../data/diyActivities';
import DIYActivityCard from './DIYActivityCard';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';

function DIYPreviewStrip({ month, limit = 3 }) {
  const [openId, setOpenId] = useState(null);
  const monthData = diyActivities.find((d) => d.month === month);
  if (!monthData?.activities?.length) return null;

  const activities = monthData.activities.slice(0, limit);

  return (
    <section className="diy-preview-strip" aria-labelledby={`diy-preview-heading-${month}`}>
      <div className="diy-preview-strip__header">
        <h2 id={`diy-preview-heading-${month}`} className="diy-preview-strip__title font-display">
          DIY activities
        </h2>
        <Link
          to={`${ROUTES.month(month)}#diy`}
          className="diy-preview-strip__all-link"
          onClick={() => interact('tap', 'light')}
        >
          All for month {month} →
        </Link>
      </div>

      <div className="diy-preview-strip__scroll">
        {activities.map((activity) => (
          <div key={activity.id} className="diy-preview-strip__card-wrap">
            <DIYActivityCard
              activity={activity}
              isOpen={openId === activity.id}
              onOpen={setOpenId}
              onClose={() => setOpenId(null)}
              compact
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DIYPreviewStrip;
