import styles from './Pagination.module.css';

// Собирает элементы пагинации: первая, последняя, текущая ± сосед, между ними — «…».
// Если пропущена ровно одна страница — показываем её номер вместо многоточия.
function getPageItems(page, totalPages) {
  const delta = 1;
  const range = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i);
    }
  }

  const items = [];
  let prev = 0;
  for (const i of range) {
    if (i - prev === 2) {
      items.push(prev + 1);
    } else if (i - prev > 2) {
      items.push('…');
    }
    items.push(i);
    prev = i;
  }
  return items;
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Назад
      </button>

      {items.map((item, index) =>
        item === '…' ? (
          <span key={`dots-${index}`} className={styles.dots} aria-hidden="true">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={item === page ? styles.active : undefined}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Вперёд
      </button>
    </nav>
  );
}
