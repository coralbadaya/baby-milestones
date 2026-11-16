import Icon from '../Icon';

/**
 * @param {{ bullets: string[] }} props
 */
function AdminInsightsSummary({ bullets = [] }) {
  if (!bullets.length) return null;

  return (
    <section className="admin-insights-summary" aria-label="Key insights">
      <h2 className="admin-insights-summary__title">
        <Icon name="light-bulb" size={20} />
        Key insights
      </h2>
      <ul className="admin-insights-summary__list">
        {bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}

export default AdminInsightsSummary;