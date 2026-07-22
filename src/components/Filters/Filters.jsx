import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Filters.module.css';

export function Filters({ onSearch, delay = 300 }) {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, delay);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className={styles.filters}>
      <input
        type="search"
        className={styles.input}
        placeholder="Поиск по пользователям…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Поиск"
      />
    </div>
  );
}
