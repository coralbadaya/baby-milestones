import { resolvePhosphorIcon } from '../utils/phosphorIconMap';

/**
 * Premium monoline icons (Phosphor Light) — replaces Twemoji PNGs in UI chrome.
 * @param {{ name: string, size?: number, className?: string, label?: string, weight?: 'thin'|'light'|'regular'|'bold'|'fill'|'duotone' }} props
 */
function Icon({ name, size = 20, className = '', label, weight = 'light' }) {
  const PhosphorIcon = resolvePhosphorIcon(name);
  if (!PhosphorIcon) return null;

  return (
    <PhosphorIcon
      size={size}
      weight={weight}
      className={`app-icon${className ? ` ${className}` : ''}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      color="currentColor"
    />
  );
}

export default Icon;
