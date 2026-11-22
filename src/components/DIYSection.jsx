import { useMemo, useState } from 'react';
import DIYActivityCard from './DIYActivityCard';
import SmartCarousel from './SmartCarousel';
import { diyCategoryConfig } from './diyCategoryConfig';
import { interact } from '../utils/haptics';
import Icon from './Icon';
import { useDiyActivitiesContext } from '../context/DiyActivitiesContext';
import { orderForCarousel } from '../utils/smartCarouselOrder';

function DIYSection({ month }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const { activitiesByMonth } = useDiyActivitiesContext();
  const monthData = activitiesByMonth.find((d) => d.month === month);
  const filtered = useMemo(() => {
    if (!monthData) return [];
    const list = activeFilter === 'all'
      ? monthData.activities
      : monthData.activities.filter((a) => a.category === activeFilter);
    return orderForCarousel(list);
  }, [monthData, activeFilter]);

  if (!monthData) return null;

  const filters = ['all', ...Object.keys(diyCategoryConfig)];

  return (
    <section id="diy" className="month-section diy-section-wrapper">
      <div className="month-section-header">
        <h3>DIY Games & Activities</h3>
        <p className="month-section-sub">
          {filtered.length} hands-on ideas for month {month} — easiest first, mixed so you are not stuck in one type. Swipe or use arrows.
        </p>
      </div>

      <div className="diy-filter-tabs">
        {filters.map((f) => {
          const cat = diyCategoryConfig[f];
          return (
            <button
              key={f}
              type="button"
              className={`diy-filter-btn ${activeFilter === f ? 'active' : ''}`}
              style={activeFilter === f && cat ? { background: cat.bg, color: cat.color, borderColor: cat.color } : {}}
              onClick={() => { setActiveFilter(f); interact('tap', 'selection'); }}
            >
              {cat ? (
                <>
                  <Icon name={cat.icon} size={16} /> {cat.label}
                </>
              ) : (
                <>
                  <Icon name="target" size={16} /> All
                </>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <SmartCarousel
          items={filtered}
          getItemId={(a) => a.id}
          getItemLabel={(a) => a.name}
          resetKey={`${month}-${activeFilter}`}
          ariaLabel={`DIY activities for month ${month}`}
          className="diy-section-carousel"
          renderItem={(activity) => (
            <DIYActivityCard
              activity={activity}
              isOpen={openId === activity.id}
              onOpen={setOpenId}
              onClose={() => setOpenId(null)}
            />
          )}
        />
      ) : (
        <p className="month-section-empty">Nothing in this filter for month {month}.</p>
      )}
    </section>
  );
}

export default DIYSection;
