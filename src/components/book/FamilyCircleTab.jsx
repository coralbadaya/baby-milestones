import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBabyProfiles } from '../../hooks/useBabyProfiles';
import { useVoiceProfiles } from '../../hooks/useVoiceProfiles';
import { getTimeCapsuleUnlockYear } from '../../utils/bookReminders';
import { ROUTES } from '../../routes';
import { PLANS } from '../../constants/premium';
import FamilyCirclePanel from './FamilyCirclePanel';
import PrintTierCards from './PrintTierCards';

function TimeCapsulePanel({ birthDate, babyProfileId }) {
  const { capsules, createTimeCapsule } = useBabyProfiles();
  const [letter, setLetter] = useState('');
  const [mode, setMode] = useState('write');
  const [saving, setSaving] = useState(false);

  const unlockYear = getTimeCapsuleUnlockYear(birthDate);
  const existing = capsules[0];

  const handleSave = async () => {
    if (!letter.trim() || !babyProfileId) return;
    setSaving(true);
    try {
      const birth = birthDate ? new Date(birthDate) : new Date();
      const unlockAt = new Date(birth);
      unlockAt.setFullYear(birth.getFullYear() + 18);

      await createTimeCapsule({
        babyProfileId,
        contentText: letter.trim(),
        unlockAt: unlockAt.toISOString(),
        sealedForPrint: true,
      });
      setLetter('');
    } finally {
      setSaving(false);
    }
  };

  if (existing) {
    return (
      <div className="baby-book-capsule baby-book-glass">
        <div className="baby-book-capsule__seal" aria-hidden="true">🔒</div>
        <h3 className="baby-book-section-title baby-book-capsule__title">
          A letter for {unlockYear}
        </h3>
        <p className="baby-book-section-sub baby-book-capsule__sub">
          Sealed until age 18 — included as a sealed page in your printed hardcover.
        </p>
      </div>
    );
  }

  return (
    <div className="baby-book-glass baby-book-capsule-form">
      <h3 className="baby-book-section-title baby-book-capsule__title">
        Time Capsule — A letter for {unlockYear}
      </h3>
      <p className="baby-book-section-sub">
        Write or record it now. It stays sealed — in the app and as a closed page in the printed book — until age 18.
      </p>
      <div className="baby-book-pill-row baby-book-capsule-form__modes">
        <button
          type="button"
          className={`baby-book-pill${mode === 'write' ? ' baby-book-pill--active' : ''}`}
          onClick={() => setMode('write')}
        >
          Write it
        </button>
        <button
          type="button"
          className={`baby-book-pill${mode === 'record' ? ' baby-book-pill--active' : ''}`}
          onClick={() => setMode('record')}
        >
          Record it
        </button>
      </div>
      {mode === 'write' ? (
        <>
          <textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            placeholder="Dear one, on the day you read this…"
            rows={4}
            className="baby-book-capsule-form__textarea"
          />
          <button
            type="button"
            className="baby-book-btn baby-book-btn--primary baby-book-capsule-form__submit"
            onClick={handleSave}
            disabled={saving || !letter.trim()}
          >
            {saving ? 'Sealing…' : 'Seal letter'}
          </button>
        </>
      ) : (
        <p className="baby-book-section-sub">
          Voice recording for time capsule — use the{' '}
          <Link to={ROUTES.babyBookTab('stories')} className="baby-book-studio__link">
            Stories tab
          </Link>
          {' '}voice recorder, then seal from Family settings (coming soon).
        </p>
      )}
    </div>
  );
}

function FamilyCircleTab({ birthDate }) {
  const navigate = useNavigate();
  const { primaryProfile, ensurePrimaryProfile } = useBabyProfiles();
  const { blessings } = useVoiceProfiles();
  const [profileId, setProfileId] = useState(primaryProfile?.id);

  useEffect(() => {
    if (!primaryProfile && birthDate) {
      ensurePrimaryProfile('Baby', birthDate).then((p) => setProfileId(p.id));
    } else if (primaryProfile) {
      setProfileId(primaryProfile.id);
    }
  }, [primaryProfile, birthDate, ensurePrimaryProfile]);

  const activeProfileId = profileId || primaryProfile?.id;

  return (
    <div className="baby-book-family">
      <h2 className="baby-book-section-title">Family Circle</h2>
      <p className="baby-book-section-sub">
        The people who love them most — voice blessings, time capsule, and keepsake print.
      </p>

      <FamilyCirclePanel blessings={blessings} viewerCount={Math.max(1, blessings.length)} />

      <h3 className="baby-book-family__section-label">Time capsule</h3>
      <TimeCapsulePanel birthDate={birthDate} babyProfileId={activeProfileId} />

      <h3 className="baby-book-family__section-label">Keepsake Press</h3>
      <PrintTierCards onSelect={() => navigate(ROUTES.premium)} />

      <div className="baby-book-glass baby-book-family__gift">
        <h3 className="baby-book-section-title baby-book-family__gift-title">Grandparent gift</h3>
        <p className="baby-book-section-sub">
          Give the first year — ${PLANS.plus.priceGift} one-time. View-only feed plus voice blessings.
        </p>
        <Link to={ROUTES.premium} className="baby-book-btn baby-book-btn--primary">
          Gift Nestbean Plus · ${PLANS.plus.priceGift}
        </Link>
      </div>
    </div>
  );
}

export default FamilyCircleTab;
