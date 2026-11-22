import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { interact } from '../utils/haptics';

/**
 * Horizontal snap carousel with centered active slide, arrows, and dots.
 *
 * @template T
 * @param {{
 *   items: T[],
 *   getItemId: (item: T) => string,
 *   getItemLabel: (item: T) => string,
 *   initialId?: string | null,
 *   resetKey?: string | number,
 *   ariaLabel: string,
 *   prevLabel?: string,
 *   nextLabel?: string,
 *   className?: string,
 *   renderItem: (item: T, index: number) => import('react').ReactNode,
 * }} props
 */
function SmartCarousel({
  items,
  getItemId,
  getItemLabel,
  initialId = null,
  resetKey,
  ariaLabel,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className = '',
  renderItem,
}) {
  const trackRef = useRef(null);
  const cardRefs = useRef(new Map());
  const scrollRaf = useRef(null);

  const firstId = items.length ? getItemId(items[0]) : null;
  const [activeId, setActiveId] = useState(initialId || firstId);

  const scrollToId = useCallback((id, behavior = 'smooth') => {
    const el = cardRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior });
    }
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const pick = initialId && items.some((item) => getItemId(item) === initialId)
      ? initialId
      : getItemId(items[0]);
    setActiveId(pick);
    requestAnimationFrame(() => scrollToId(pick, 'auto'));
  }, [resetKey, items, initialId, getItemId, scrollToId]);

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !items.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = getItemId(items[0]);
    let closestDist = Infinity;

    for (const item of items) {
      const id = getItemId(item);
      const el = cardRefs.current.get(id);
      if (!el) continue;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = id;
      }
    }

    setActiveId(closest);
  }, [items, getItemId]);

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

  if (!items.length) return null;

  const activeIdx = items.findIndex((item) => getItemId(item) === activeId);
  const canPrev = activeIdx > 0;
  const canNext = activeIdx >= 0 && activeIdx < items.length - 1;

  const goPrev = () => {
    if (!canPrev) return;
    interact('tap', 'light');
    scrollToId(getItemId(items[activeIdx - 1]));
  };

  const goNext = () => {
    if (!canNext) return;
    interact('tap', 'light');
    scrollToId(getItemId(items[activeIdx + 1]));
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
    <div className={`smart-carousel smart-carousel--diy ${className}`.trim()}>
      <button
        type="button"
        className="smart-carousel__nav smart-carousel__nav--prev"
        onClick={goPrev}
        disabled={!canPrev}
        aria-label={prevLabel}
      >
        <Icon name="caret-left" size={20} />
      </button>

      <div
        className="smart-carousel__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const id = getItemId(item);
          return (
            <div
              key={id}
              className="smart-carousel__card-wrap"
              ref={(el) => {
                if (el) cardRefs.current.set(id, el);
                else cardRefs.current.delete(id);
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="smart-carousel__nav smart-carousel__nav--next"
        onClick={goNext}
        disabled={!canNext}
        aria-label={nextLabel}
      >
        <Icon name="caret-right" size={20} />
      </button>

      <div className="smart-carousel__dots" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const id = getItemId(item);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              className={`smart-carousel__dot${id === activeId ? ' smart-carousel__dot--active' : ''}`}
              aria-label={getItemLabel(item)}
              aria-selected={id === activeId}
              onClick={() => {
                interact('tap', 'light');
                scrollToId(id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SmartCarousel;