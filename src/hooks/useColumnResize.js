import { useCallback, useState } from 'react';

const MIN_WIDTH = 50;

export function useColumnResize(columns, defaultWidth = 150) {
  const [widths, setWidths] = useState(() =>
    Object.fromEntries(columns.map((c) => [c.key, c.width ?? defaultWidth]))
  );

  const startResize = useCallback((key, event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = widths[key];

    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(MIN_WIDTH, startWidth + delta);
      setWidths((prev) => ({ ...prev, [key]: newWidth }));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [widths]);

  return { widths, startResize };
}
