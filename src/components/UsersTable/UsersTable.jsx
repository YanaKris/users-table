import { useEffect, useRef } from 'react';
import { COLUMNS } from '../../constants/columns';
import { useColumnResize } from '../../hooks/useColumnResize';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import styles from './UsersTable.module.css';

export function UsersTable({
  users = [],
  sortBy = null,
  order = null,
  onSort = () => {},
  loading = false,
  onRowClick = () => {},
}) {
  const { widths, startResize, resizing } = useColumnResize(COLUMNS);
  const wrapperRef = useRef(null);
  const guideRef = useRef(null);
  const totalWidth = COLUMNS.reduce((sum, col) => sum + (widths[col.key] || 0), 0);

  useEffect(() => {
    const guide = guideRef.current;
    const wrapper = wrapperRef.current;
    if (!guide || !wrapper) return;
    if (resizing) {
      const rect = wrapper.getBoundingClientRect();
      guide.style.left = `${resizing.clientX - rect.left + wrapper.scrollLeft}px`;
      guide.style.display = 'block';
    } else {
      guide.style.display = 'none';
    }
  }, [resizing]);

  return (
    <div
      ref={wrapperRef}
      className={loading ? `${styles.wrapper} ${styles.loading}` : styles.wrapper}
      aria-busy={loading}
    >
      <div ref={guideRef} className={styles.guide} aria-hidden="true" style={{ display: 'none' }} />
      <table className={styles.table} style={{ width: totalWidth }}>
        <colgroup>
          {COLUMNS.map((col) => (
            <col key={col.key} style={{ width: widths[col.key] }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <TableHeaderCell
                key={col.key}
                column={col}
                sortBy={sortBy}
                order={order}
                onSort={onSort}
                onResizeStart={startResize}
                resizingKey={resizing?.key}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={COLUMNS.length}>
                Ничего не найдено
              </td>
            </tr>
          ) : (
            users.map((user) => <TableRow key={user.id} user={user} onRowClick={onRowClick} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
