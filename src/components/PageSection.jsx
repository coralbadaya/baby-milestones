import useSectionReveal from '../hooks/useSectionReveal';

/**
 * Full-bleed section band with editorial surface tone.
 * @param {'ivory'|'sand'|'white'|'ink'} surface
 * @param {'default'|'wide'|'narrow'|'none'} width
 */
function PageSection({
  surface = 'ivory',
  width = 'wide',
  className = '',
  children,
  reveal = true,
  ariaLabelledby,
}) {
  const { ref, visible } = useSectionReveal(reveal);
  const widthClass = width === 'none' ? '' : `page-section__inner--${width}`;

  return (
    <section
      ref={ref}
      className={`page-section page-section--${surface}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      aria-labelledby={ariaLabelledby}
    >
      <div className={`page-section__inner ${widthClass}`.trim()}>
        {children}
      </div>
    </section>
  );
}

export default PageSection;
