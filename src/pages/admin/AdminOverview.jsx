import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { supabase } from '../../utils/supabaseClient';
import { ROUTES } from '../../routes';

function AdminOverview() {
  const [stats, setStats] = useState({
    newContacts: 0,
    activePremium: 0,
    trials: 0,
    promoCodes: 0,
    diyImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [contacts, memberships, promos, diyImages] = await Promise.all([
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('memberships').select('status'),
        supabase.from('promo_codes').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('diy_activity_images').select('activity_id', { count: 'exact', head: true }),
      ]);

      const rows = memberships.data || [];
      setStats({
        newContacts: contacts.count ?? 0,
        activePremium: rows.filter((r) => r.status === 'active' || r.status === 'comp').length,
        trials: rows.filter((r) => r.status === 'trial').length,
        promoCodes: promos.count ?? 0,
        diyImages: diyImages.count ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="admin-loading">Loading overview…</p>;

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Overview"
        description="Nestbean admin control center"
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'Overview' }]}
      />

      <div className="admin-panel">
        <div className="admin-stat-grid">
          <Link to={ROUTES.adminInbox} className="admin-stat-card">
            <span className="admin-stat-value">{stats.newContacts}</span>
            <span className="admin-stat-label">New contact messages</span>
          </Link>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{stats.activePremium}</span>
            <span className="admin-stat-label">Active / founding members</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{stats.trials}</span>
            <span className="admin-stat-label">Trials in progress</span>
          </div>
          <Link to={ROUTES.adminPromos} className="admin-stat-card">
            <span className="admin-stat-value">{stats.promoCodes}</span>
            <span className="admin-stat-label">Active promo codes</span>
          </Link>
          <Link to={ROUTES.adminDiy} className="admin-stat-card">
            <span className="admin-stat-value">{stats.diyImages}</span>
            <span className="admin-stat-label">DIY images configured</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
