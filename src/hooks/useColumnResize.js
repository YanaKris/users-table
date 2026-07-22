import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 50;

export function useColumnResize(columns, defaultWidth = 150) {
  const [widths, setWidths] = useState(() =>
    Object.fromEntries(columns.map((c) => [c.key, c.width ?? defaultWidth]))
  );
  const [resizing, setResizing] = useState(null);

  const widthsRef = useRef(widths);
  useEffect(() => {
    widthsRef.current = widths;
  }, [widths]);
  const dragRef = useRef(null);

  const startResize = useCallback((key, event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragRef.current = { key, startX: event.clientX, startWidth: widthsRef.current[key] ?? MIN_WIDTH };
    setResizing({ key, clientX: event.clientX });
  }, []);

  const activeKey = resizing ? resizing.key : null;
  useEffect(() => {
    if (!activeKey) return undefined;

    const onMove = (moveEvent) => {
      if (moveEvent.buttons === 0) {
        setResizing(null);
        return;
      }
      const { key, startX, startWidth } = dragRef.current;
      const newWidth = Math.max(MIN_WIDTH, startWidth + (moveEvent.clientX - startX));
      setWidths((prev) => ({ ...prev, [key]: newWidth }));
      setResizing({ key, clientX: moveEvent.clientX });
    };
    const onUp = () => setResizing(null);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [activeKey]);

  return { widths, startResize, resizing };
}
