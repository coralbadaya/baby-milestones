const RENDER_STYLES = [
  { id: 'parallax', label: 'Parallax', description: 'Depth planes with camera drift' },
  { id: 'popup', label: 'Pop-up', description: 'Layered paper diorama rising from the page' },
  { id: 'snowglobe', label: 'Snow-globe', description: 'Each month in a glass orb' },
];

function RenderStyleSelector({ activeStyle, onChange }) {
  return (
    <div className="baby-book-style-selector" role="tablist" aria-label="3D render style">
      {RENDER_STYLES.map((s) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={activeStyle === s.id}
          className={`baby-book-style-btn${activeStyle === s.id ? ' baby-book-style-btn--active' : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export { RENDER_STYLES };
export default RenderStyleSelector;
