import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export function Modal({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} data-testid="modal-overlay">
      <div
        className={styles.content}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
