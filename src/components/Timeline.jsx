import { useCallback, useEffect, useRef, useState } from 'react';
import milestones from '../data/milestones';
import { getJourneyCardImage } from '../data/journeyMonthImages';
import {
  MILESTONE_MONTH_COUNT,
  milestonePageEnd,
  milestonePageStart,
  shiftMilestonePage,
} from '../data/milestonePage';
import { useMonthlyAlbum } from '../hooks/useMonthlyAlbum';
import Icon from './Icon';
import { interact } from '../utils/haptics';

function getMonthProgress(month, checkedItems) {
  const data = milestones.find((m) => m.month === month);
  if (!data) return 0;
  const allIds = [...data.physical, ...data.emotional].map((i) => i.id);
  const checked = allIds.filter((id) => checkedItems[id]);
  return allIds.length > 0 ? checked.length / allIds.length : 0;
}

function TimelineMonthCard({ month, title, currentMonth, progress, onSelect, image }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(month);
    }
  };

  return (
    <div
      className={`timeline-card${image ? ' timeline-card--with-image' : ''} ${month === currentMonth ? 'current' : ''} ${progress === 1 ? 'completed' : ''}`}
      onClick={() => onSelect(month)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Month ${month}: ${title}`}
    >
      {progress > 0 && progress < 1 && <div className="progress-dot" style={{ background: '#F5A572' }} />}
      {progress === 1 && <div className="progress-dot" />}
      {image ? (
        <div className="timeline-card__image">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
          <span className="month-num">{month}</span>
        </div>
      ) : (
        <div className="month-num">{month}</div>
      )}
      <div className="month-label">Month</div>
      <div className="month-title">{title}</div>
    </div>
  );
}

function TimelineCarousel({
  months,
  currentMonth,
  checkedItems,
  onSelectMonth,
  albumPhotos,
}) {
  const trackRef = useRef(null);
  const cardRefs = useRef(new Map());
  const scrollRaf = useRef(null);
  const [activeMonth, setActiveMonth] = useState(currentMonth ?? months[0]?.month);

  const handleSelect = (month) => {
    interact('tap', 'light');
    onSelectMonth(month);
  };

  const scrollToMonth = useCallback((month, behavior = 'smooth') => {
    const track = trackRef.current;
    const el = cardRefs.current.get(month);
    if (!track || !el) return;

    const targetLeft = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    track.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScroll)),
      behavior,
    });
    setActiveMonth(month);
  }, []);

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || months.length === 0) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = months[0].month;
    let closestDist = Infinity;

    for (const m of months) {
      const el = cardRefs.current.get(m.month);
      if (!el) continue;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = m.month;
      }
    }

    setActiveMonth(closest);
  }, [months]);

  useEffect(() => {
    if (currentMonth) {
      requestAnimationFrame(() => scrollToMonth(currentMonth, 'auto'));
    }
  }, [currentMonth, scrollToMonth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const onScroll = () => {
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      scrollRaf.current = requestAnimationFrame(updateActiveFromScroll);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, [updateActiveFromScroll]);

  const activeIdx = months.findIndex((m) => m.month === activeMonth);
  const canPrev = activeIdx > 0;
  const canNext = activeIdx >= 0 && activeIdx < months.length - 1;

  const goPrev = () => {
    if (!canPrev) return;
    interact('tap', 'light');
    scrollToMonth(months[activeIdx - 1].month);
  };

  const goNext = () => {
    if (!canNext) return;
    interact('tap', 'light');
    scrollToMonth(months[activeIdx + 1].month);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div className="timeline-carousel">
      <button
        type="button"
        className="timeline-carousel__nav timeline-carousel__nav--prev"
        onClick={goPrev}
        disabled={!canPrev}
        aria-label="Previous month"
      >
        <Icon name="caret-left" size={20} />
      </button>

      <div
        className="timeline-carousel__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Monthly milestone timeline"
        onKeyDown={onKeyDown}
      >
        {months.map((m) => {
          const progress = getMonthProgress(m.month, checkedItems);
          return (
            <div
              key={m.month}
              className="timeline-carousel__card-wrap"
              ref={(el) => {
                if (el) cardRefs.current.set(m.month, el);
                else cardRefs.current.delete(m.month);
              }}
            >
              <TimelineMonthCard
                month={m.month}
                title={m.title}
                currentMonth={currentMonth}
                progress={progress}
                onSelect={handleSelect}
                image={getJourneyCardImage({
                  month: m.month,
                  currentMonth,
                  albumPhotos,
                })}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="timeline-carousel__nav timeline-carousel__nav--next"
        onClick={goNext}
        disabled={!canNext}
        aria-label="Next month"
      >
        <Icon name="caret-right" size={20} />
      </button>

      <div className="timeline-carousel__dots" role="tablist" aria-label="Timeline months">
        {months.map((m) => (
          <button
            key={m.month}
            type="button"
            role="tab"
            className={`timeline-carousel__dot${m.month === activeMonth ? ' timeline-carousel__dot--active' : ''}`}
            aria-label={`Month ${m.month}`}
            aria-selected={m.month === activeMonth}
            onClick={() => {
              interact('tap', 'light');
              scrollToMonth(m.month);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Timeline({
  currentMonth,
  checkedItems,
  onSelectMonth,
  collapsed = false,
  rangeStart = 1,
  rangeEnd = 36,
  hideHeading = false,
  variant = 'grid',
}) {
  const { photos: albumPhotos } = useMonthlyAlbum(currentMonth || 1);
  const paged = variant === 'grid';
  const [pageStart, setPageStart] = useState(() => milestonePageStart(currentMonth));

  useEffect(() => {
    setPageStart(milestonePageStart(currentMonth));
  }, [currentMonth]);

  const handleSelect = (month) => {
    interact('tap', 'light');
    onSelectMonth(month);
  };

  const pageEnd = milestonePageEnd(pageStart);
  const visibleMonths = milestones.filter((m) => {
    if (variant === 'carousel' && collapsed) {
      return m.month >= rangeStart && m.month <= rangeEnd;
    }
    if (paged) return m.month >= pageStart && m.month <= pageEnd;
    return !collapsed || (m.month >= rangeStart && m.month <= rangeEnd);
  });

  const canPrev = paged && pageStart > 1;
  const canNext = paged && pageEnd < MILESTONE_MONTH_COUNT;

  const goPage = (delta) => {
    interact('tap', 'light');
    setPageStart((start) => shiftMilestonePage(start, delta));
  };

  return (
    <section className={`timeline-section${variant === 'carousel' ? ' timeline-section--carousel' : ''}`}>
      {!hideHeading && (
        <>
          <h2>Monthly Milestones</h2>
          <p className="timeline-subtitle">
            {paged
              ? `Months ${pageStart}–${pageEnd} — tap a month to open it`
              : 'Click any month to explore milestones, activities, and tips'}
          </p>
        </>
      )}

      {paged && (
        <div className="timeline-pager">
          <button
            type="button"
            className="timeline-pager__btn"
            onClick={() => goPage(-1)}
            disabled={!canPrev}
            aria-label="Previous months"
          >
            <Icon name="caret-left" size={20} />
            Earlier
          </button>
          <p className="timeline-pager__status" aria-live="polite">
            {pageStart}–{pageEnd} of {MILESTONE_MONTH_COUNT}
          </p>
          <button
            type="button"
            className="timeline-pager__btn"
            onClick={() => goPage(1)}
            disabled={!canNext}
            aria-label="Next months"
          >
            Later
            <Icon name="caret-right" size={20} />
          </button>
        </div>
      )}

      {variant === 'carousel' ? (
        <TimelineCarousel
          months={visibleMonths}
          currentMonth={currentMonth}
          checkedItems={checkedItems}
          onSelectMonth={onSelectMonth}
          albumPhotos={albumPhotos}
        />
      ) : (
        <div className={`timeline-grid${paged ? ' timeline-grid--paged' : ''}`}>
          {visibleMonths.map((m) => {
            const progress = getMonthProgress(m.month, checkedItems);
            return (
              <TimelineMonthCard
                key={m.month}
                month={m.month}
                title={m.title}
                currentMonth={currentMonth}
                progress={progress}
                onSelect={handleSelect}
                image={getJourneyCardImage({
                  month: m.month,
                  currentMonth,
                  albumPhotos,
                })}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Timeline;
