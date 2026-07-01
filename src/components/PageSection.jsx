import useSectionReveal from '../hooks/useSectionReveal';

/**
 * Full-bleed section band with editorial surface tone.
 * @param {'ivory'|'sand'|'white'|'ink'|'lavender'|'mist'} surface
 * @param {'default'|'wide'|'narrow'|'none'} width
 */
function PageSection({
  surface = 'ivory',
  width = 'wide',
  className = '',
  children,
  reveal = true,
  blendEdges = false,
  ariaLabelledby,
}) {
  const { ref, visible } = useSectionReveal(reveal);
  const widthClass = width === 'none' ? '' : `page-section__inner--${width}`;
  const blendClass = blendEdges ? ' page-section--blend' : '';

  return (
    <section
      ref={ref}
      data-scroll-surface={surface}
      className={`page-section page-section--${surface}${visible ? ' is-visible' : ''}${blendClass}${className ? ` ${className}` : ''}`}
      aria-labelledby={ariaLabelledby}
    >
      <div className={`page-section__inner ${widthClass}`.trim()}>
        {children}
      </div>
    </section>
  );
}

export default PageSection;
