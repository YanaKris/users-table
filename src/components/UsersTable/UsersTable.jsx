import { COLUMNS } from '../../constants/columns';
import { useColumnResize } from '../../hooks/useColumnResize';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import styles from './UsersTable.module.css';

export function UsersTable({ users = [], sortBy = null, order = null, onSort = () => {}, loading = false, onRowClick = () => {} }) {
  const { widths, startResize } = useColumnResize(COLUMNS);

  return (
    <div
      className={loading ? `${styles.wrapper} ${styles.loading}` : styles.wrapper}
      aria-busy={loading}
    >
      <table className={styles.table}>
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
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={COLUMNS.length}>Ничего не найдено</td>
            </tr>
          ) : (
            users.map((user) => <TableRow key={user.id} user={user} onRowClick={onRowClick} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
