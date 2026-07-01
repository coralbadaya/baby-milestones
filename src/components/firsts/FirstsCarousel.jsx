import { useCallback, useEffect, useRef, useState } from 'react';
import { FIRSTS } from '../../data/firsts';
import Icon from '../Icon';
import { interact } from '../../utils/haptics';
import FirstMomentSlot from './FirstMomentSlot';

function FirstsCarousel({
  firstMoments,
  suggestedId,
  onSelectFile,
  onOpenDetail,
}) {
  const trackRef = useRef(null);
  const cardRefs = useRef(new Map());
  const scrollRaf = useRef(null);
  const [activeId, setActiveId] = useState(suggestedId || FIRSTS[0].id);

  const scrollToId = useCallback((id, behavior = 'smooth') => {
    const el = cardRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior });
    }
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (suggestedId) {
      requestAnimationFrame(() => scrollToId(suggestedId, 'auto'));
    }
  }, [suggestedId, scrollToId]);

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = FIRSTS[0].id;
    let closestDist = Infinity;

    for (const first of FIRSTS) {
      const el = cardRefs.current.get(first.id);
      if (!el) continue;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = first.id;
      }
    }

    setActiveId(closest);
  }, []);

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

  const activeIdx = FIRSTS.findIndex((f) => f.id === activeId);
  const canPrev = activeIdx > 0;
  const canNext = activeIdx >= 0 && activeIdx < FIRSTS.length - 1;

  const goPrev = () => {
    if (!canPrev) return;
    interact('tap', 'light');
    scrollToId(FIRSTS[activeIdx - 1].id);
  };

  const goNext = () => {
    if (!canNext) return;
    interact('tap', 'light');
    scrollToId(FIRSTS[activeIdx + 1].id);
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
    <div className="firsts-carousel">
      <button
        type="button"
        className="firsts-carousel__nav firsts-carousel__nav--prev"
        onClick={goPrev}
        disabled={!canPrev}
        aria-label="Previous first"
      >
        <Icon name="caret-left" size={20} />
      </button>

      <div
        className="firsts-carousel__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Life firsts"
        onKeyDown={onKeyDown}
      >
        {FIRSTS.map((first) => (
          <div
            key={first.id}
            className="firsts-carousel__card"
            ref={(el) => {
              if (el) cardRefs.current.set(first.id, el);
              else cardRefs.current.delete(first.id);
            }}
          >
            <FirstMomentSlot
              firstId={first.id}
              label={first.label}
              moment={firstMoments[first.id]}
              size="md"
              onSelectFile={onSelectFile}
              onOpenDetail={onOpenDetail}
            />
            <p className="firsts-carousel__label font-display">{first.label}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="firsts-carousel__nav firsts-carousel__nav--next"
        onClick={goNext}
        disabled={!canNext}
        aria-label="Next first"
      >
        <Icon name="caret-right" size={20} />
      </button>

      <div className="firsts-carousel__dots" role="tablist" aria-label="Life firsts">
        {FIRSTS.map((first) => (
          <button
            key={first.id}
            type="button"
            role="tab"
            className={`firsts-carousel__dot${first.id === activeId ? ' firsts-carousel__dot--active' : ''}`}
            aria-label={first.label}
            aria-selected={first.id === activeId}
            onClick={() => {
              interact('tap', 'light');
              scrollToId(first.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default FirstsCarousel;
