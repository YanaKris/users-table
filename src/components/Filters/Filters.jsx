import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Filters.module.css';

export function Filters({ onSearch, delay = 300 }) {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, delay);
  const isFirst = useRef(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    onSearch(debounced);
  }, [debounced, onSearch]);

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.filters}>
      <div className={styles.field}>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="Поиск по пользователям…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={50}
          aria-label="Поиск"
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
