import { useState } from 'react';
import DIYActivityCard from './DIYActivityCard';
import { diyCategoryConfig } from './diyCategoryConfig';
import { interact } from '../utils/haptics';
import Icon from './Icon';
import { useDiyActivitiesContext } from '../context/DiyActivitiesContext';

function DIYSection({ month }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const { activitiesByMonth } = useDiyActivitiesContext();
  const monthData = activitiesByMonth.find((d) => d.month === month);
  if (!monthData) return null;

  const filters = ['all', ...Object.keys(diyCategoryConfig)];
  const filtered = activeFilter === 'all'
    ? monthData.activities
    : monthData.activities.filter((a) => a.category === activeFilter);

  return (
    <section id="diy" className="month-section diy-section-wrapper">
      <div className="month-section-header">
        <h3>DIY Games & Activities</h3>
        <p className="month-section-sub">
          {filtered.length} hands-on ideas for month {month} — tap <strong>Open guide</strong> for steps and videos.
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

      <div className="content-card-grid">
        {filtered.map((activity) => (
          <DIYActivityCard
            key={activity.id}
            activity={activity}
            isOpen={openId === activity.id}
            onOpen={setOpenId}
            onClose={() => setOpenId(null)}
          />
        ))}
      </div>
    </section>
  );
}

export default DIYSection;
