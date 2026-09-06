import { useEffect, useState } from 'react';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { analyticsRange, formatDelta, formatRate } from '../../utils/analyticsAdmin';
import { supabase } from '../../utils/supabaseClient';
import { ROUTES } from '../../routes';

function AdminOverview() {
  const [stats, setStats] = useState({
    newContacts: 0,
    activePremium: 0,
    trials: 0,
    promoCodes: 0,
    diyImages: 0,
    pendingCommunity: 0,
  });
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const range = analyticsRange(7);
      const [contacts, memberships, promos, diyImages, communityPending, overview] = await Promise.all([
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('memberships').select('status'),
        supabase.from('promo_codes').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('diy_activity_images').select('activity_id', { count: 'exact', head: true }),
        supabase.from('community_memories').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.rpc('analytics_overview', { p_from: range.from, p_to: range.to }),
      ]);

      const rows = memberships.data || [];
      setStats({
        newContacts: contacts.count ?? 0,
        activePremium: rows.filter((r) => r.status === 'active' || r.status === 'comp').length,
        trials: rows.filter((r) => r.status === 'trial').length,
        promoCodes: promos.count ?? 0,
        diyImages: diyImages.count ?? 0,
        pendingCommunity: communityPending.count ?? 0,
      });
      setKpis(overview.data || null);
      setLoading(false);
    }
    load();
  }, []);

  const sessions = Number(kpis?.sessions) || 0;
  const prevSessions = Number(kpis?.prev_sessions) || 0;
  const signups = Number(kpis?.signups) || 0;
  const prevSignups = Number(kpis?.prev_signups) || 0;
  const paid = Number(kpis?.paid) || 0;
  const prevPaid = Number(kpis?.prev_paid) || 0;
  const prevSignupRate = prevSessions ? prevSignups / prevSessions : 0;
  const prevPaidRate = prevSignups ? prevPaid / prevSignups : 0;
  const signupRate = sessions ? signups / sessions : 0;
  const paidRate = signups ? paid / signups : 0;

  return (
    <div className="admin-page">
      <AdminPageHeader title="Overview" />

      {loading ? (
        <AdminLoading variant="stat-grid" cols={6} message="Loading overview…" />
      ) : (
        <>
          <div className="admin-stat-grid admin-stat-grid--flat">
            <AdminStatCard
              value={stats.newContacts}
              label="New messages"
              to={ROUTES.adminInbox}
            />
            <AdminStatCard
              value={stats.activePremium}
              label="Active members"
            />
            <AdminStatCard
              value={stats.trials}
              label="Trials"
            />
            <AdminStatCard
              value={stats.promoCodes}
              label="Promo codes"
              to={ROUTES.adminPromos}
            />
            <AdminStatCard
              value={stats.diyImages}
              label="DIY images"
              to={ROUTES.adminDiy}
            />
            <AdminStatCard
              value={stats.pendingCommunity}
              label="Pending posts"
              to={ROUTES.adminCommunity}
            />
          </div>

          <h2 className="admin-section-label">Last 7 days</h2>
          <div className="admin-stat-grid admin-stat-grid--flat">
            <AdminStatCard
              value={sessions.toLocaleString()}
              label="Sessions"
              hint={formatDelta(sessions, prevSessions)}
              to={`${ROUTES.adminInsights}?tab=traffic`}
            />
            <AdminStatCard
              value={formatRate(signups, sessions)}
              label="Signup conversion"
              hint={formatDelta(signupRate, prevSignupRate)}
              to={`${ROUTES.adminInsights}?tab=acquisition`}
            />
            <AdminStatCard
              value={formatRate(paid, signups)}
              label="Paid conversion"
              hint={formatDelta(paidRate, prevPaidRate)}
              to={`${ROUTES.adminInsights}?tab=conversion`}
            />
            <AdminStatCard
              value={kpis?.top_country || '—'}
              label="Top country"
              to={`${ROUTES.adminInsights}?tab=traffic`}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminOverview;
