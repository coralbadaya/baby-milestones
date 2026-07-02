import { useMemo, useState } from 'react';
import { formatTagLabel } from '../../utils/tagFilters';

/** @param {string} raw */
function normalizeTag(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Toggle pill tags for admin forms.
 * @param {{
 *   id: string,
 *   label?: string,
 *   value: string[],
 *   onChange: (tags: string[]) => void,
 *   suggestions?: string[],
 *   hint?: string,
 *   allowCustom?: boolean,
 * }} props
 */
function AdminTagPicker({
  id,
  label = 'Tags',
  value,
  onChange,
  suggestions = [],
  hint,
  allowCustom = true,
}) {
  const [custom, setCustom] = useState('');

  const options = useMemo(() => {
    const merged = new Set([...suggestions, ...value]);
    return [...merged].sort((a, b) => a.localeCompare(b));
  }, [suggestions, value]);

  const toggle = (tag) => {
    onChange(
      value.includes(tag)
        ? value.filter((t) => t !== tag)
        : [...value, tag],
    );
  };

  const addCustom = () => {
    const tag = normalizeTag(custom);
    if (!tag || value.includes(tag)) {
      setCustom('');
      return;
    }
    onChange([...value, tag]);
    setCustom('');
  };

  return (
    <div className="auth-field admin-tag-picker">
      <span id={`${id}-label`}>{label}</span>
      {hint ? <p className="admin-tag-picker-hint">{hint}</p> : null}
      <div
        className="admin-tag-picker-pills"
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {options.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`admin-tag-pill${value.includes(tag) ? ' admin-tag-pill--active' : ''}`}
            aria-pressed={value.includes(tag)}
            onClick={() => toggle(tag)}
          >
            {formatTagLabel(tag)}
          </button>
        ))}
      </div>
      {allowCustom ? (
        <div className="admin-tag-picker-add">
          <input
            id={id}
            type="text"
            value={custom}
            placeholder="Add custom tag…"
            aria-label="Add custom tag"
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={addCustom}
            disabled={!normalizeTag(custom) || value.includes(normalizeTag(custom))}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AdminTagPicker;
