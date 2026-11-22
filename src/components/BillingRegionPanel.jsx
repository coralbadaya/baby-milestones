import { Link } from 'react-router-dom';
import { BILLING_PLAN_MATRIX, BILLING_REGIONS, SKU_LABELS } from '../constants/premium';
import { formatPremiumAmount } from '../utils/premiumPricing';
import { ROUTES } from '../routes';

/**
 * @param {{ activeRegion: 'IN' | 'ROW', loading?: boolean }} props
 */
function BillingRegionPanel({ activeRegion, loading = false }) {
  return (
    <section className="billing-region-panel" aria-labelledby="billing-region-heading">
      <h2 id="billing-region-heading" className="billing-region-panel__title font-display">
        Plans by region
      </h2>
      <p className="billing-region-panel__lead">
        {loading
          ? 'Detecting your region…'
          : `You are checking out as ${BILLING_REGIONS[activeRegion]?.label || activeRegion} (${BILLING_REGIONS[activeRegion]?.provider || '—'}).`}
        {' '}
        <Link to={ROUTES.contact}>Wrong region?</Link>
      </p>
      <div className="billing-region-panel__table-wrap">
        <table className="billing-region-panel__table">
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">India · Razorpay</th>
              <th scope="col">International · Stripe</th>
            </tr>
          </thead>
          <tbody>
            {BILLING_PLAN_MATRIX.map((row) => (
              <tr
                key={row.sku}
                className={activeRegion === 'IN' ? 'billing-region-panel__row--in' : 'billing-region-panel__row--row'}
              >
                <th scope="row">{SKU_LABELS[row.sku] || row.label}</th>
                <td className={activeRegion === 'IN' ? 'billing-region-panel__cell--active' : ''}>
                  {formatPremiumAmount(row.inr, 'INR')}
                </td>
                <td className={activeRegion === 'ROW' ? 'billing-region-panel__cell--active' : ''}>
                  {formatPremiumAmount(row.usd, 'USD')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BillingRegionPanel;