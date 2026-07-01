import { FIRSTS, countCapturedMoments } from '../../data/firsts';
import FirstMomentSlot from './FirstMomentSlot';

function FirstsJournal({
  firstMoments,
  onSelectFile,
  onOpenDetail,
}) {
  const captured = countCapturedMoments(firstMoments);

  return (
    <div className="firsts-journal">
      <p className="firsts-journal__progress">
        {captured} of {FIRSTS.length} captured
      </p>

      <ol className="firsts-journal__list">
        {FIRSTS.map((first) => (
          <li key={first.id} className="firsts-journal__row">
            <div className="firsts-journal__meta">
              <span className="firsts-journal__num">{first.sort}</span>
              <span className="firsts-journal__label font-display">{first.label}</span>
            </div>
            <FirstMomentSlot
              firstId={first.id}
              label={first.label}
              moment={firstMoments[first.id]}
              size="lg"
              onSelectFile={onSelectFile}
              onOpenDetail={onOpenDetail}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default FirstsJournal;
