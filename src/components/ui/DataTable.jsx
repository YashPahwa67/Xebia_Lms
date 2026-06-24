import { LoadingState } from './Spinner';
import { EmptyState } from './States';
import { ErrorState } from './States';

/**
 * Generic, accessible data table with loading / empty / error states.
 * columns: [{ key, header, render?(row), className? }]
 */
export function DataTable({
  columns,
  rows,
  loading,
  error,
  onRetry,
  emptyMessage = 'No records found',
  rowKey = (row) => row._id || row.id,
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />;
  if (!rows?.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left font-medium text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className={col.className || 'px-4 py-3 text-gray-700'}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
