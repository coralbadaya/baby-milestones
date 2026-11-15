/** One face of the QA book — labels make wrong preparation obvious. */
export default function PlaygroundFace({ slot, face, pageIndex }) {
  if (!slot || slot.role === 'blank' || !slot.page) {
    return (
      <div className="ptq-face ptq-face--blank">
        <span className="ptq-face__tag">{face} · blank</span>
      </div>
    );
  }
  const page = slot.page;
  const solid = page.qaSolid;
  const src = page.src || page.file;
  return (
    <div
      className={`ptq-face ptq-face--${slot.role}`}
      style={solid ? { background: solid } : undefined}
      data-qa-tag={page.qaTag}
    >
      <div className="ptq-face__banner">
        <strong>{face}</strong>
        <span>idx {pageIndex}</span>
        <span>{page.qaTag || slot.role}</span>
      </div>
      {src ? (
        <img className="ptq-face__img" src={src} alt="" />
      ) : (
        <div className="ptq-face__solid" style={{ background: solid || page.qaColor || '#efe6d6' }} />
      )}
      <div className="ptq-face__copy">
        <p className="ptq-face__kicker">{page.monthLabel}</p>
        <h3>{page.title}</h3>
        <p>{page.caption}</p>
      </div>
      {slot.role === 'pair' && slot.extra ? (
        <div className="ptq-face__pair-extra">
          <img className="ptq-face__img" src={slot.extra.src || slot.extra.file} alt="" />
          <span>pair +1</span>
        </div>
      ) : null}
    </div>
  );
}