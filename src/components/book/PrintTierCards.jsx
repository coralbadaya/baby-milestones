import { PREMIUM_CURRENCIES } from '../../constants/premium';

const PRINT_TIERS = [
  {
    id: 'softcover',
    title: 'Softcover',
    detail: '20 pages · matte',
    price: 29,
  },
  {
    id: 'hardcover',
    title: 'Linen hardcover',
    detail: '24 pages · foil title · sealed letter page',
    price: 49,
    featured: true,
  },
];

function PrintTierCards({ onSelect }) {
  const currency = PREMIUM_CURRENCIES.USD;

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
          <span className="baby-book-print-tier__price">${tier.price}</span>
        </button>
      ))}
      <p className="baby-book-print-tier__note">
        Plus members save 20% · Bundle from ${currency.priceBundle}
      </p>
    </div>
  );
}

export default PrintTierCards;
