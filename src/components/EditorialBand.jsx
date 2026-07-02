import { BRAND_TAGLINE } from '../constants/brand';

function EditorialBand({ tagline = BRAND_TAGLINE, className = '', children }) {
  return (
    <aside
      className={`editorial-band ${className}`.trim()}
      data-scroll-surface="ink"
      aria-label="Brand moment"
    >
      <div className="editorial-band__inner page-body">
        <p className="editorial-band__quote font-display">&ldquo;{tagline}.&rdquo;</p>
        {children ? <div className="editorial-band__slot">{children}</div> : null}
      </div>
    </aside>
  );
}

export default EditorialBand;
