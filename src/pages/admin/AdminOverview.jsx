import { useEffect, useState } from 'react';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminStatCard from '../../components/admin/AdminStatCard';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [contacts, memberships, promos, diyImages, communityPending] = await Promise.all([
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('memberships').select('status'),
        supabase.from('promo_codes').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('diy_activity_images').select('activity_id', { count: 'exact', head: true }),
        supabase.from('community_memories').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
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
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Overview"
        description="Nestbean admin control center"
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'Overview' }]}
      />

      <AdminPanel>
        {loading ? (
          <AdminLoading variant="stat-grid" cols={6} message="Loading overview…" />
        ) : (
          <div className="admin-stat-grid">
            <AdminStatCard
              value={stats.newContacts}
              label="New contact messages"
              to={ROUTES.adminInbox}
            />
            <AdminStatCard
              value={stats.activePremium}
              label="Active / founding members"
            />
            <AdminStatCard
              value={stats.trials}
              label="Trials in progress"
            />
            <AdminStatCard
              value={stats.promoCodes}
              label="Active promo codes"
              to={ROUTES.adminPromos}
            />
            <AdminStatCard
              value={stats.diyImages}
              label="DIY images configured"
              to={ROUTES.adminDiy}
            />
            <AdminStatCard
              value={stats.pendingCommunity}
              label="Community posts pending"
              to={ROUTES.adminCommunity}
            />
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

export default AdminOverview;
