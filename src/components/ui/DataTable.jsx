import { useState } from 'react';
import Icon from './Icon';
import EmptyState from './EmptyState';
import './datatable.css';

export default function DataTable({
  columns, rows, pageSize = 10, searchable = false, searchPlaceholder = 'Search…',
  onSearch, emptyTitle = 'Nothing here yet', emptyDesc = 'No records found.',
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = onSearch ? rows : (search ? rows.filter((r) =>
    columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  ) : rows);

  let sorted = [...filtered];
  if (sort) {
    sorted.sort((a, b) => {
      const av = a[sort.key]; const bv = b[sort.key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (col) => {
    if (!col.sortable) return;
    setSort((s) => (s && s.key === col.key && s.dir === 'asc' ? { key: col.key, dir: 'desc' } : { key: col.key, dir: 'asc' }));
  };

  return (
    <div className="dtable">
      {(searchable || onSearch) && (
        <div className="dtable__toolbar">
          <div className="relative">
            <span className="dtable__searchicon"><Icon name="search" size={16} /></span>
            <input
              className="dtable__search"
              placeholder={searchPlaceholder}
              value={onSearch ? search : search}
              onChange={(e) => onSearch ? onSearch(e.target.value) : setSearch(e.target.value)}
            />
          </div>
          <span className="dtable__count">{sorted.length} record{sorted.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      <div className="dtable__scroll">
        <table className="dtable__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'dtable__th--sort' : ''}
                  onClick={() => toggleSort(col)}
                  aria-sort={sort?.key === col.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.label}
                  {sort?.key === col.key && <Icon name={sort.dir === 'asc' ? 'chevronDown' : 'chevronDown'} size={12} className="inline ml-1 rotate-180" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDesc} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="dtable__pagination">
          <button className="dtable__pagebtn" disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span className="dtable__pageinfo">Page {safePage} of {totalPages}</span>
          <button className="dtable__pagebtn" disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}