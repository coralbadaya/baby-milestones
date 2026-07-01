import { useState, useEffect, useMemo } from 'react';
import { getShoppingListForRange } from '../data/shoppingAndCare';
import ShopItemCard from './ShopItemCard';
import Select from './Select';
import { interact } from '../utils/haptics';

const MONTH_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const m = i + 1;
  return { value: m, label: `Month ${m}` };
});

function ShoppingChecklist({ checkedItems, toggleCheck, currentMonth }) {
  const defaultTo = currentMonth ?? 36;
  const [fromMonth, setFromMonth] = useState(() => {
    const saved = localStorage.getItem('shopRangeFrom');
    return saved ? Math.max(1, Math.min(36, parseInt(saved, 10))) : 1;
  });
  const [toMonth, setToMonth] = useState(() => {
    const saved = localStorage.getItem('shopRangeTo');
    if (saved) return Math.max(1, Math.min(36, parseInt(saved, 10)));
    return defaultTo;
  });

  useEffect(() => {
    localStorage.setItem('shopRangeFrom', String(fromMonth));
    localStorage.setItem('shopRangeTo', String(toMonth));
  }, [fromMonth, toMonth]);

  useEffect(() => {
    if (currentMonth != null && !localStorage.getItem('shopRangeTo')) {
      setToMonth(currentMonth);
    }
  }, [currentMonth]);

  const list = useMemo(
    () => getShoppingListForRange(fromMonth, toMonth),
    [fromMonth, toMonth]
  );

  const purchased = list.all.filter((i) => checkedItems[i.id]).length;
  const total = list.all.length;
  const percent = total > 0 ? (purchased / total) * 100 : 0;

  const toMonthOptions = useMemo(
    () => MONTH_OPTIONS.map((opt) => ({
      ...opt,
      disabled: opt.value < fromMonth,
    })),
    [fromMonth]
  );

  const handleFromChange = (raw) => {
    const v = parseInt(raw, 10);
    setFromMonth(v);
    if (v > toMonth) setToMonth(v);
    interact('tap', 'selection');
  };

  const handleToChange = (raw) => {
    const v = parseInt(raw, 10);
    setToMonth(v);
    if (v < fromMonth) setFromMonth(v);
    interact('tap', 'selection');
  };

  const renderGroup = (label, items) => {
    if (items.length === 0) return null;
    return (
      <section className="shop-product-section" key={label}>
        <h2 className="shop-group-label">
          {label} <span className="shop-group-count">({items.length})</span>
        </h2>
        <div className="shop-product-grid">
          {items.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              introMonth={item.introMonth}
              checked={!!checkedItems[item.id]}
              onToggleCheck={toggleCheck}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="shopping-page-content fade-in">
      <div className="editorial-band-inline editorial-band-inline--sand">
      <p className="shop-recommendation-note shop-recommendation-note--top" role="note">
        <strong>Our recommendations only.</strong> This checklist reflects products and brands we have actually used—not a complete list, medical advice, or endorsement.
      </p>

      <div className="shop-toolbar">
        <div className="shop-range-controls">
          <Select
            id="shop-range-from"
            label="From month"
            value={fromMonth}
            onChange={handleFromChange}
            options={MONTH_OPTIONS}
            className="shop-range-select"
          />
          <Select
            id="shop-range-to"
            label="To month"
            value={toMonth}
            onChange={handleToChange}
            options={toMonthOptions}
            className="shop-range-select"
          />
          <p className="shop-range-summary">
            {total} items · months {fromMonth}–{toMonth}
            {currentMonth != null && ` · baby month ${currentMonth}`}
          </p>
        </div>

        <div className="shop-progress-wrap">
          <div className="shop-progress-bar">
            <div className="shop-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="shop-progress-text">{purchased} / {total} purchased</span>
        </div>
      </div>
      </div>

      <div className="editorial-band-inline editorial-band-inline--white">
      {total === 0 ? (
        <p className="shop-empty">No shopping items in this range. Try widening the month range.</p>
      ) : (
        <div className="shop-checklist-sections">
          {renderGroup('Essential', list.essential)}
          {renderGroup('Optional', list.optional)}
          {renderGroup('For parents', list.forParents)}
        </div>
      )}
      </div>
    </div>
  );
}

export default ShoppingChecklist;
