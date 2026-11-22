import { DEFAULT_PREMIUM_CURRENCY, PREMIUM_CURRENCIES } from '../../constants/premium';
import { formatPremiumAmount } from '../../utils/premiumPricing';

const PRINT_TIERS = [
  {
    id: 'softcover',
    title: 'Softcover',
    detail: '20 pages · matte',
    priceLabel: 'From ₹2,400',
  },
  {
    id: 'hardcover',
    title: 'Linen hardcover',
    detail: '24 pages · foil title · sealed letter page',
    priceLabel: 'From ₹4,100',
    featured: true,
  },
];

function PrintTierCards({ onSelect }) {
  const bundle = formatPremiumAmount(
    PREMIUM_CURRENCIES[DEFAULT_PREMIUM_CURRENCY].priceBundle,
    DEFAULT_PREMIUM_CURRENCY,
  );

  return (
    <div className="baby-book-print-tiers">
      {PRINT_TIERS.map((tier) => (
        <button
          key={tier.id}
          type="button"
          className={`baby-book-print-tier baby-book-glass${tier.featured ? ' baby-book-print-tier--featured' : ''}`}
          onClick={() => onSelect?.(tier.id)}
        >
          <strong>{tier.title}</strong>
          <p>{tier.detail}</p>
          <span className="baby-book-print-tier__price">{tier.priceLabel}</span>
        </button>
      ))}
      <p className="baby-book-print-tier__note">
        Plus members save 20% · Bundle from {bundle}
      </p>
    </div>
  );
}

export default PrintTierCards;