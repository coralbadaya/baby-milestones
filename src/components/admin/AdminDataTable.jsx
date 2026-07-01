/**
 * Data table wrapper — sticky header, row hover, optional highlight + mobile cards.
 * @param {{
 *   columns: { key: string, header: string, className?: string, scope?: string }[],
 *   rows: object[],
 *   rowKey: (row: object) => string,
 *   renderCell: (row: object, column: { key: string }) => import('react').ReactNode,
 *   highlightRow?: (row: object) => boolean,
 *   mobileCard?: (row: object) => import('react').ReactNode,
 *   className?: string,
 * }} props
 */
function AdminDataTable({
  columns,
  rows,
  rowKey,
  renderCell,
  highlightRow,
  mobileCard,
  className = '',
}) {
  return (
    <>
      {mobileCard ? (
        <div className="admin-card-list">
          {rows.map((row) => {
            const highlighted = highlightRow?.(row);
            return (
              <div
                key={rowKey(row)}
                className={`admin-card-list-item${highlighted ? ' admin-row--highlight' : ''}`}
              >
                {mobileCard(row)}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className={`admin-table-wrap${mobileCard ? ' admin-table-wrap--mobile-cards' : ''}${className ? ` ${className}` : ''}`}>
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope={col.scope || 'col'} className={col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const highlighted = highlightRow?.(row);
              return (
                <tr
                  key={rowKey(row)}
                  className={highlighted ? 'admin-row--highlight' : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={col.className}>
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDataTable;
