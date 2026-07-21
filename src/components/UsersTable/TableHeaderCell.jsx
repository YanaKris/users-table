import styles from './TableHeaderCell.module.css';

export function TableHeaderCell({ column, sortBy, order, onSort }) {
  const style = column.align ? { textAlign: column.align } : undefined;

  if (!column.sortField) {
    return <th style={style}>{column.label}</th>;
  }

  const active = sortBy === column.sortField;
  const ariaSort = active ? (order === 'asc' ? 'ascending' : 'descending') : 'none';
  const arrow = active ? (order === 'asc' ? '▲' : '▼') : '↕';

  return (
    <th style={style} aria-sort={ariaSort}>
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => onSort(column.sortField)}
      >
        <span>{column.label}</span>
        <span className={styles.arrow} aria-hidden="true">{arrow}</span>
      </button>
    </th>
  );
}
