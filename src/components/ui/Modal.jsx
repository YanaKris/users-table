import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({ onClose, children }) {
  const pressedOnOverlay = useRef(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    contentRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const content = contentRef.current;
      if (!content) return;
      const focusables = content.querySelectorAll(FOCUSABLE);
      if (focusables.length === 0) {
        e.preventDefault();
        content.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!content.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === content)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || active === content)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlayMouseDown = (e) => {
    pressedOnOverlay.current = e.target === e.currentTarget;
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && pressedOnOverlay.current) onClose();
  };

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={styles.content}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
