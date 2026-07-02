import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import PremiumGate from '../PremiumGate';
import { PREMIUM_FEATURES, ENTITLEMENT_LIMITS } from '../../constants/premium';
import { request4kExport } from '../../utils/stripeCheckout';

function PlusExportPanel({ storyId, isPlus }) {
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    if (!storyId || !isPlus) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await request4kExport(storyId);
      setMessage(result.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!isPlus) {
    return (
      <PremiumGate feature={PREMIUM_FEATURES.export4k} compact>
        <span />
      </PremiumGate>
    );
  }

  return (
    <div className="plus-export-panel">
      <button type="button" className="btn-ghost" disabled={busy || !storyId} onClick={onExport}>
        Export 4K
      </button>
      {message && <p className="plus-export-panel__msg" role="status">{message}</p>}
    </div>
  );
}

function ViewerSeatsPanel() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState(null);

  const loadSeats = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('viewer_seats')
      .select('*')
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: false });
    setSeats(data || []);
  };

  useEffect(() => {
    loadSeats();
  }, [user?.id]);

  const invite = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !user) return;
    if (seats.filter((s) => s.status !== 'revoked').length >= ENTITLEMENT_LIMITS.viewerSeats) {
      setError(`Plus includes ${ENTITLEMENT_LIMITS.viewerSeats} viewer seats.`);
      return;
    }
    const { error: insErr } = await supabase.from('viewer_seats').insert({
      owner_user_id: user.id,
      viewer_email: email.trim().toLowerCase(),
    });
    if (insErr) setError(insErr.message);
    else {
      setEmail('');
      loadSeats();
    }
  };

  if (!user) return null;

  return (
    <PremiumGate feature={PREMIUM_FEATURES.viewerSeats}>
      <div className="viewer-seats">
        <h3 className="font-display">Viewer seats</h3>
        <p>Invite grandparents or partners — read-only flip-book access.</p>
        <form onSubmit={invite} className="viewer-seats__form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="viewer@email.com"
            aria-label="Viewer email"
          />
          <button type="submit" className="btn-primary">Invite</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        <ul>
          {seats.map((s) => (
            <li key={s.id}>{s.viewer_email} — {s.status}</li>
          ))}
        </ul>
      </div>
    </PremiumGate>
  );
}

function PrintDiscountBadge({ isPlus }) {
  if (!isPlus) return null;
  return (
    <p className="print-discount-badge">
      Plus: 20% off print orders + free shipping
    </p>
  );
}

export { PlusExportPanel, ViewerSeatsPanel, PrintDiscountBadge };
export default PlusExportPanel;
