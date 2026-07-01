import { resolvePhosphorIcon } from '../utils/phosphorIconMap';

const BRAND_ICON_NAMES = new Set([
  'youtube',
  'instagram',
  'tiktok',
  'pinterest',
  'facebook',
  'whatsapp',
  'x',
]);

/**
 * Premium monoline icons (Phosphor Light) — replaces Twemoji PNGs in UI chrome.
 * Brand/social logos use fill weight for legibility at small sizes.
 * @param {{ name: string, size?: number, className?: string, label?: string, weight?: 'thin'|'light'|'regular'|'bold'|'fill'|'duotone' }} props
 */
function Icon({ name, size = 20, className = '', label, weight }) {
  const PhosphorIcon = resolvePhosphorIcon(name);
  if (!PhosphorIcon) return null;

  const resolvedWeight = weight ?? (BRAND_ICON_NAMES.has(name) ? 'fill' : 'light');

  return (
    <PhosphorIcon
      size={size}
      weight={resolvedWeight}
      className={`app-icon${className ? ` ${className}` : ''}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      color="currentColor"
    />
  );
}

export default Icon;
