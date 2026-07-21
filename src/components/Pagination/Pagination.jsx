import styles from './Pagination.module.css';

export function Pagination({ page, totalPages, onPageChange }) {

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Назад
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? styles.active : undefined}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

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
