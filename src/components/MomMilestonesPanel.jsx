import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  momMilestonePeriods,
  MOM_MILESTONES_DISCLAIMER,
} from '../data/momMilestones';
import { momCareCategoryConfig } from '../data/momCareTips';
import {
  formatPostpartumAge,
  getOverallMomMilestoneProgress,
  getPeriodProgress,
  isCurrentPeriod,
} from '../utils/momMilestones';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

function MomMilestonesPanel({ birthDate, checkedItems, toggleCheck }) {
  const navigate = useNavigate();
  const [justChecked, setJustChecked] = useState(null);

  const ageLabel = formatPostpartumAge(birthDate);
  const overall = useMemo(
    () => getOverallMomMilestoneProgress(checkedItems),
    [checkedItems]
  );
  const overallPct = overall.total > 0 ? (overall.done / overall.total) * 100 : 0;

  const handleCheck = (id) => {
    const wasChecked = checkedItems[id];
    toggleCheck(id);
    interact('tap', wasChecked ? 'light' : 'success');
    if (!wasChecked) {
      setJustChecked(id);
      setTimeout(() => setJustChecked(null), 400);
    }
  };

  const goToTopic = (topicId) => {
    if (!topicId) return;
    interact('tap', 'selection');
    navigate({ pathname: ROUTES.momCare, hash: topicId });
  };

  const timelineCat = momCareCategoryConfig.timeline;

  return (
    <article
      id="mom-care-panel-timeline"
      role="tabpanel"
      aria-labelledby="mom-care-tab-timeline"
      className="mom-milestones-panel card-accent-top"
      style={{ '--cat-color': timelineCat.color }}
    >
      <div className="mom-milestones-hero">
        {birthDate && ageLabel ? (
          <p className="mom-milestones-age">You are {ageLabel}</p>
        ) : (
          <p className="mom-milestones-birth-banner">
            Set baby birth date on <a href={ROUTES.home}>Home</a> to personalize your timeline.
          </p>
        )}
        <div className="mom-milestones-progress-wrap">
          <div className="mom-milestones-progress-label">
            <span>{overall.done} of {overall.total} milestones tracked</span>
            <span>{Math.round(overallPct)}%</span>
          </div>
          <div className="mom-milestones-progress" aria-hidden="true">
            <div
              className="mom-milestones-progress-fill"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {momMilestonePeriods.map((period) => {
        const current = isCurrentPeriod(period, birthDate);
        const { done, total } = getPeriodProgress(period, checkedItems);
        const topic = period.relatedTopic
          ? momCareCategoryConfig[period.relatedTopic]
          : null;

        return (
          <section
            key={period.id}
            className={`mom-milestones-period${current ? ' is-current' : ''}`}
            aria-labelledby={`mom-period-${period.id}`}
          >
            <header className="mom-milestones-period-header" id={`mom-period-${period.id}`}>
              <div className="mom-milestones-period-meta">
                <span className="mom-milestones-period-label">{period.label}</span>
                {current && <span className="mom-milestones-current-badge">Now</span>}
                <span className="mom-milestones-period-count">{done}/{total}</span>
              </div>
              <h2>{period.title}</h2>
              <p className="mom-milestones-period-summary">{period.summary}</p>
            </header>

            <div className="mom-milestones-items">
              {period.items.map((item) => (
                <div
                  key={item.id}
                  className={`milestone-item ${checkedItems[item.id] ? 'checked-item' : ''} ${justChecked === item.id ? 'just-checked' : ''}`}
                >
                  <div
                    className={`milestone-check ${checkedItems[item.id] ? 'checked' : ''}`}
                    onClick={() => handleCheck(item.id)}
                    role="checkbox"
                    aria-checked={!!checkedItems[item.id]}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck(item.id)}
                  >
                    {checkedItems[item.id] && <Icon name="check" size={14} />}
                  </div>
                  <div className="milestone-text">
                    <p>{item.text}</p>
                    {item.tip && (
                      <span className="tip">
                        <Icon name="light-bulb" size={14} /> {item.tip}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {period.watchFor?.length > 0 && (
              <div className="mom-milestones-watch">
                <h3><Icon name="warning" size={16} /> Watch for</h3>
                <ul>
                  {period.watchFor.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {topic && period.relatedTopic && (
              <button
                type="button"
                className="mom-milestones-learn content-card-cta secondary"
                onClick={() => goToTopic(period.relatedTopic)}
              >
                Learn more: {topic.label} →
              </button>
            )}
          </section>
        );
      })}

      <p className="mom-care-disclaimer-inline">{MOM_MILESTONES_DISCLAIMER}</p>
    </article>
  );
}

export default MomMilestonesPanel;
