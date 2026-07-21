import { COLUMNS } from '../../constants/columns';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import styles from './UsersTable.module.css';

export function UsersTable({ users = [], sortBy = null, order = null, onSort = () => {} }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <TableHeaderCell
                key={col.key}
                column={col}
                sortBy={sortBy}
                order={order}
                onSort={onSort}
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
            users.map((user) => <TableRow key={user.id} user={user} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
