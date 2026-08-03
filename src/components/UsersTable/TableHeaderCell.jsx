import { alignStyle } from '../../constants/columns';
import { ORDER } from '../../constants/sort';
import styles from './TableHeaderCell.module.css';

export function TableHeaderCell({ column, sortBy, order, onSort, onResizeStart, resizingKey }) {
  const style = alignStyle(column.align);

  const resizerClassName =
    column.key === resizingKey ? `${styles.resizer} ${styles.dragging}` : styles.resizer;

  const resizer = onResizeStart ? (
    <span
      className={resizerClassName}
      data-testid={`resizer-${column.key}`}
      onMouseDown={(e) => onResizeStart(column.key, e)}
      aria-hidden="true"
    />
  ) : null;

  if (!column.sortField) {
    return (
      <th style={style}>
        {column.label}
        {resizer}
      </th>
    );
  }

  const active = sortBy === column.sortField;
  const ariaSort = active ? (order === ORDER.ASC ? 'ascending' : 'descending') : 'none';
  const arrow = active ? (order === ORDER.ASC ? '▲' : '▼') : '↕';

  return (
    <th style={style} aria-sort={ariaSort}>
      <button type="button" className={styles.sortButton} onClick={() => onSort(column.sortField)}>
        <span>{column.label}</span>
        <span className={styles.arrow} aria-hidden="true">
          {arrow}
        </span>
      </button>
      {resizer}
    </th>
  );
}
