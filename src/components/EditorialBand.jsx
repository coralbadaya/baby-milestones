import { BRAND_TAGLINE } from '../constants/brand';

function EditorialBand({ tagline = BRAND_TAGLINE, className = '' }) {
  return (
    <aside
      className={`editorial-band ${className}`.trim()}
      aria-label="Brand moment"
    >
      <div className="editorial-band__inner page-body">
        <p className="editorial-band__quote font-display">&ldquo;{tagline}.&rdquo;</p>
      </div>
    </aside>
  );
}

export default EditorialBand;
