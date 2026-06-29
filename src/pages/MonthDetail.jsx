import { useState, useEffect, useCallback } from 'react';
import milestones from '../data/milestones';
import sources from '../data/sources';
import { interact, sounds } from '../utils/haptics';
import { useSwipe } from '../utils/gestures';
import DIYSection from '../components/DIYSection';
import CareSection from '../components/CareSection';
import Icon from '../components/Icon';
import { usePageMeta } from '../utils/pageMeta';

function SectionHeading({ icon, children }) {
  return (
    <h3 className="section-heading-with-icon">
      <Icon name={icon} size={22} />
      <span>{children}</span>
    </h3>
  );
}

function MonthDetail({ month, checkedItems, toggleCheck, onBack, onNavigate, currentWeek }) {
  const data = milestones.find(m => m.month === month);
  usePageMeta({
    title: `Month ${month} Milestones`,
    description: `Developmental milestones, activities, and care for your baby in month ${month}.`,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [justChecked, setJustChecked] = useState(null);

  const handleSwipeLeft = useCallback(() => {
    if (month < 36) {
      interact('swoosh', 'light');
      onNavigate(month + 1);
    }
  }, [month, onNavigate]);

  const handleSwipeRight = useCallback(() => {
    if (month > 1) {
      interact('swoosh', 'light');
      onNavigate(month - 1);
    }
  }, [month, onNavigate]);

  useSwipe(handleSwipeLeft, handleSwipeRight);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && month > 1) {
        interact('navigate', 'light');
        onNavigate(month - 1);
      } else if (e.key === 'ArrowRight' && month < 36) {
        interact('navigate', 'light');
        onNavigate(month + 1);
      } else if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [month, onNavigate, onBack]);

  if (!data) return null;

  const allIds = [...data.physical, ...data.emotional].map(i => i.id);
  const checkedCount = allIds.filter(id => checkedItems[id]).length;
  const allDone = checkedCount === allIds.length && allIds.length > 0;

  const handleCheck = (id) => {
    const wasChecked = checkedItems[id];
    toggleCheck(id);

    if (!wasChecked) {
      interact('check', 'success');
      setJustChecked(id);
      setTimeout(() => setJustChecked(null), 600);

      const newCount = checkedCount + 1;
      if (newCount === allIds.length) {
        setTimeout(() => {
          sounds.celebrate();
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2500);
        }, 300);
      }
    } else {
      interact('uncheck', 'light');
    }
  };

  const handlePrint = () => {
    interact('tap', 'light');
    window.print();
  };

  const sourceUrlMap = {
    "WHO Motor Development Study (2006)": "https://www.who.int/publications/i/item/9241563257",
    "WHO MGRS (2006)": "https://www.who.int/tools/child-growth-standards/standards/motor-development-milestones",
    "WHO Motor Development Study": "https://www.who.int/tools/child-growth-standards/standards/motor-development-milestones",
    "CDC Milestone Tracker (2022)": "https://www.cdc.gov/ncbddd/actearly/milestones/index.html",
    "CDC Milestones (2022)": "https://www.cdc.gov/ncbddd/actearly/milestones/index.html",
    "CDC Milestones": "https://www.cdc.gov/ncbddd/actearly/milestones/index.html",
    "AAP Bright Futures Guidelines": "https://www.aap.org/en/practice-management/bright-futures/bright-futures-materials-and-tools/bright-futures-guidelines-and-pocket-guide/",
    "AAP Bright Futures": "https://www.aap.org/en/practice-management/bright-futures/bright-futures-materials-and-tools/bright-futures-guidelines-and-pocket-guide/",
    "AAP Caring for Your Baby": "https://www.healthychildren.org/English/ages-stages/baby/Pages/default.aspx",
    "AAP Guidelines": "https://www.healthychildren.org/English/ages-stages/Pages/default.aspx",
    "IAP Textbook of Pediatrics": "https://www.iapindia.org/guidelines/",
    "IAP Growth Charts": "https://www.iapindia.org/iap-growth-charts/",
    "IAP Developmental Guidelines": "https://www.iapindia.org/guidelines/",
    "IAP Position Paper on Language Development": "https://www.indianpediatrics.net/",
    "IAP Guidelines": "https://www.iapindia.org/guidelines/",
    "Zero to Three": "https://www.zerotothree.org/resource/your-childs-development-age-based-tips-from-birth-to-36-months/",
    "Zero to Three Guidelines": "https://www.zerotothree.org/resource/your-childs-development-age-based-tips-from-birth-to-36-months/",
    "Denver II Screening Test Norms": "https://denverii.com/",
    "Denver II Norms": "https://denverii.com/",
    "DASII Indian Norms": "https://nimhans.ac.in/child-and-adolescent-psychiatry/",
    "NIMHANS Developmental Battery": "https://nimhans.ac.in/child-and-adolescent-psychiatry/",
    "Bayley-III Norms": "https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Developmental-Early-Childhood/Bayley-Scales-of-Infant-and-Toddler-Development/p/100000123.html",
    "Bayley-III Motor Scales": "https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Developmental-Early-Childhood/Bayley-Scales-of-Infant-and-Toddler-Development/p/100000123.html",
    "Bayley-III Social-Emotional Scales": "https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Developmental-Early-Childhood/Bayley-Scales-of-Infant-and-Toddler-Development/p/100000123.html",
    "RBSK Screening Manual": "https://nhm.gov.in/index1.php?lang=1&level=4&sublinkid=1190&lid=583",
    "AIIMS Pediatric Protocols": "https://www.aiims.edu/en/departments/clinical/pediatrics.html",
    "Mayo Clinic Guidelines": "https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048012",
    "UNICEF Nurturing Care Framework": "https://nurturing-care.org/",
    "ICDS ECCE Framework": "https://wcd.nic.in/integrated-child-development-services-icds-scheme"
  };

  const getSourceBadges = (type) => {
    const relevantCitations = sources.citations[type === 'physical' ? 'physical' : 'emotional'];
    const monthNum = data.month;
    return relevantCitations.filter(c => {
      const match = c.milestone.match(/Month (\d+)-?(\d+)?/);
      if (!match) return false;
      const start = parseInt(match[1]);
      const end = match[2] ? parseInt(match[2]) : start;
      return monthNum >= start && monthNum <= end;
    });
  };

  const physicalCites = getSourceBadges('physical');
  const emotionalCites = getSourceBadges('emotional');

  return (
    <div className="month-detail fade-in">
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <Icon name="party" size={64} className="celebration-icon" />
            <h2>All Milestones Complete!</h2>
            <p>Month {data.month} fully achieved! Amazing progress!</p>
          </div>
        </div>
      )}

      <div className="month-header">
        <button className="back-btn" onClick={() => { interact('tap', 'light'); onBack(); }}>
          ← Back to Timeline
        </button>
        <div className="month-num-big">{data.month}</div>
        <h1>Month {data.month}: {data.title}</h1>
        <p>{data.summary}</p>

        <div className="month-progress-inline">
          <div className="progress-bar-inline">
            <div className="progress-fill-inline" style={{ width: `${(checkedCount / allIds.length) * 100}%` }} />
          </div>
          <span className="progress-text-inline">{checkedCount}/{allIds.length} milestones</span>
        </div>

        <div className="month-nav">
          <button disabled={month <= 1} onClick={() => { interact('navigate', 'light'); onNavigate(month - 1); }}>
            ← Previous
          </button>
          <button className="print-btn" onClick={handlePrint}>
            <Icon name="printer" size={18} /> Print
          </button>
          <button disabled={month >= 36} onClick={() => { interact('navigate', 'light'); onNavigate(month + 1); }}>
            Next →
          </button>
        </div>
        <p className="swipe-hint">Swipe left/right or use arrow keys to navigate</p>
      </div>

      <div id="milestones" className="section-grid">
        <div className="detail-section">
          <SectionHeading icon="flexed-bicep">Physical Milestones</SectionHeading>
          {data.physical.map((item) => (
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
                <span className="tip"><Icon name="light-bulb" size={14} /> {item.tip}</span>
              </div>
            </div>
          ))}
          {physicalCites.length > 0 && (
            <div className="inline-citations">
              <span className="cite-label"><Icon name="paperclip" size={14} /> Sources:</span>
              {physicalCites.flatMap((c) => c.sources).filter((v, i, a) => a.indexOf(v) === i).map((s, i) => (
                sourceUrlMap[s]
                  ? <a key={i} href={sourceUrlMap[s]} target="_blank" rel="noopener noreferrer" className="cite-badge cite-link" title={physicalCites.find(c => c.sources.includes(s))?.note}>{s} ↗</a>
                  : <span key={i} className="cite-badge">{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="detail-section">
          <SectionHeading icon="brain">Emotional & Cognitive</SectionHeading>
          {data.emotional.map((item) => (
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
                <span className="tip"><Icon name="light-bulb" size={14} /> {item.tip}</span>
              </div>
            </div>
          ))}
          {emotionalCites.length > 0 && (
            <div className="inline-citations">
              <span className="cite-label"><Icon name="paperclip" size={14} /> Sources:</span>
              {emotionalCites.flatMap((c) => c.sources).filter((v, i, a) => a.indexOf(v) === i).map((s, i) => (
                sourceUrlMap[s]
                  ? <a key={i} href={sourceUrlMap[s]} target="_blank" rel="noopener noreferrer" className="cite-badge cite-link" title={emotionalCites.find(c => c.sources.includes(s))?.note}>{s} ↗</a>
                  : <span key={i} className="cite-badge">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="activities-section">
        <SectionHeading icon="target">Activities to Try</SectionHeading>
        <div className="activity-grid">
          {data.activities.map((activity, i) => (
            <div
              key={i}
              className={`activity-card card-accent-top ${activity.type}`}
              style={{
                '--cat-color':
                  activity.type === 'physical'
                    ? 'var(--baby-blue-dark)'
                    : activity.type === 'emotional'
                      ? 'var(--rose-dark)'
                      : 'var(--lavender-dark)',
              }}
              onClick={() => interact('tap', 'selection')}
            >
              <div className="activity-icon"><Icon name={activity.icon} size={36} /></div>
              <div className="activity-type">{activity.type}</div>
              <h4>{activity.name}</h4>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card watch">
          <SectionHeading icon="warning">Watch For</SectionHeading>
          <ul>
            {data.watchFor.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="info-card pros">
          <SectionHeading icon="check-mark">The Good Stuff</SectionHeading>
          <ul>
            {data.pros.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="info-card cons">
          <SectionHeading icon="1f538">Challenges</SectionHeading>
          <ul>
            {data.cons.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <DIYSection month={month} />

      <CareSection month={month} />

      <div className="weekly-tips">
        <SectionHeading icon="calendar">Weekly Tips</SectionHeading>
        <div className="tips-grid">
          {data.weeklyTips.map((tip, i) => (
            <div key={i} className={`tip-card ${currentWeek === tip.week && month === Math.ceil((new Date() - new Date(localStorage.getItem('babyBirthDate'))) / (1000 * 60 * 60 * 24 * 30.44)) ? 'active' : ''}`}>
              <div className="week-label">Week {tip.week}</div>
              <p>{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sources-badge-bar">
        <span className="sources-bar-label"><Icon name="books" size={16} /> Read more from these sources:</span>
        <div className="source-links-list">
          {sources.monthToLinks(data.month).map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link-badge"
              onClick={(e) => e.stopPropagation()}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MonthDetail;
