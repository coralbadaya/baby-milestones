import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminStatCard from '../../components/admin/AdminStatCard';
import {
  BILLING_PLAN_MATRIX,
  BILLING_REGIONS,
  SKU_LABELS,
} from '../../constants/premium';
import { useAuth } from '../../context/AuthContext';
import { formatAdminDateTime } from '../../utils/adminFormat';
import { formatPremiumAmount } from '../../utils/premiumPricing';
import { ROUTES } from '../../routes';
import { supabase } from '../../utils/supabaseClient';

const INTEGRATION_ENV = [
  { group: 'Razorpay (India)', vars: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET', 'RAZORPAY_PLAN_PLUS_MONTHLY', 'RAZORPAY_PLAN_PLUS_ANNUAL'] },
  { group: 'Stripe (ROW / USD)', vars: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_PLUS_MONTHLY_USD', 'STRIPE_PRICE_PLUS_ANNUAL_USD'] },
];

const RECENT_COLUMNS = [
  { key: 'name', header: 'Parent' },
  { key: 'status', header: 'Status' },
  { key: 'source', header: 'Provider' },
  { key: 'plan', header: 'Plan' },
  { key: 'updated', header: 'Updated' },
];

function AdminBilling() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('admin_billing_overview');
    if (rpcError) {
      setOverview(null);
      setError(rpcError.message);
    } else {
      setOverview(data || {});
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!isAdmin) {
    return <Navigate to={ROUTES.admin} replace />;
  }

  const webhookHealth = overview?.webhook_health || {};
  const bySource = overview?.membership_by_source || {};
  const recent = overview?.recent_plus || [];

  return (
    <div className="admin-page admin-billing">
      <AdminPageHeader
        title="Billing"
        description="Dual checkout — Razorpay (India, INR) and Stripe (international, USD derived from INR ÷ 100)."
      />

      {loading ? (
        <AdminLoading message="Loading billing overview…" />
      ) : error ? (
        <AdminEmpty message={error} />
      ) : (
        <>
          <div className="admin-stat-grid admin-stat-grid--flat">
            <AdminStatCard
              value={(bySource.stripe ?? 0).toLocaleString()}
              label="Stripe memberships"
            />
            <AdminStatCard
              value={(bySource.razorpay ?? 0).toLocaleString()}
              label="Razorpay memberships"
            />
            <AdminStatCard
              value={formatAdminDateTime(webhookHealth.stripe)}
              label="Last Stripe webhook"
            />
            <AdminStatCard
              value={formatAdminDateTime(webhookHealth.razorpay)}
              label="Last Razorpay webhook"
            />
          </div>

          <AdminPanel>
            <h2 className="admin-panel-title">Plan matrix</h2>
            <p className="admin-hint">Single source: <code>src/constants/premium.js</code> — USD = INR ÷ 100.</p>
            <div className="billing-region-panel__table-wrap">
              <table className="billing-region-panel__table admin-billing__matrix">
                <thead>
                  <tr>
                    <th scope="col">SKU</th>
                    <th scope="col">Label</th>
                    <th scope="col">India · {BILLING_REGIONS.IN.provider}</th>
                    <th scope="col">ROW · {BILLING_REGIONS.ROW.provider}</th>
                  </tr>
                </thead>
                <tbody>
                  {BILLING_PLAN_MATRIX.map((row) => (
                    <tr key={row.sku}>
                      <td className="admin-mono">{row.sku}</td>
                      <td>{SKU_LABELS[row.sku] || row.label}</td>
                      <td>{formatPremiumAmount(row.inr, 'INR')}</td>
                      <td>{formatPremiumAmount(row.usd, 'USD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <AdminPanel>
            <h2 className="admin-panel-title">Integration health</h2>
            <p className="admin-hint">Configure secrets in Vercel — values are never shown here.</p>
            <ul className="admin-checklist">
              {INTEGRATION_ENV.map((block) => (
                <li key={block.group}>
                  <strong>{block.group}</strong>
                  <ul>
                    {block.vars.map((v) => (
                      <li key={v}><code>{v}</code></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </AdminPanel>

          <AdminPanel padding={false}>
            <div className="admin-panel-title-row">
              <h2 className="admin-panel-title">Recent paid Plus</h2>
            </div>
            {recent.length === 0 ? (
              <AdminEmpty message="No Stripe or Razorpay memberships yet." />
            ) : (
              <AdminDataTable
                columns={RECENT_COLUMNS}
                rows={recent}
                rowKey={(row) => `${row.user_id}-${row.updated_at}`}
                renderCell={(row, col) => {
                  switch (col.key) {
                    case 'name':
                      return row.display_name || row.user_id;
                    case 'status':
                      return <AdminBadge variant="neutral">{row.status}</AdminBadge>;
                    case 'source':
                      return row.source;
                    case 'plan':
                      return row.plan;
                    case 'updated':
                      return formatAdminDateTime(row.updated_at);
                    default:
                      return '—';
                  }
                }}
              />
            )}
          </AdminPanel>
        </>
      )}
    </div>
  );
}

export default AdminBilling;