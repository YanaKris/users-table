import { renderHook, act, fireEvent } from '@testing-library/react';
import { useColumnResize } from './useColumnResize';

const columns = [{ key: 'name' }, { key: 'age' }];

function down(clientX) {
  return { clientX, preventDefault() {} };
}

it('инициализирует ширины значением по умолчанию', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  expect(result.current.widths.name).toBe(150);
  expect(result.current.widths.age).toBe(150);
});

it('увеличивает ширину при перетаскивании вправо', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  act(() => { fireEvent.mouseMove(document, { clientX: 160 }); }); // +60
  expect(result.current.widths.name).toBe(210);
});

it('не позволяет ширину меньше 50px', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  act(() => { fireEvent.mouseMove(document, { clientX: 0 }); });
  expect(result.current.widths.name).toBe(50);
});

it('прекращает изменение после отпускания мыши', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  act(() => { fireEvent.mouseUp(document); });
  act(() => { fireEvent.mouseMove(document, { clientX: 300 }); });
  expect(result.current.widths.name).toBe(150);
});

it('во время перетаскивания отдаёт позицию направляющей, после отпускания — null', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  expect(result.current.resizing).toBeNull();

  act(() => result.current.startResize('name', down(100)));
  expect(result.current.resizing).toEqual({ key: 'name', clientX: 100 });

  act(() => { fireEvent.mouseMove(document, { clientX: 130 }); });
  expect(result.current.resizing).toEqual({ key: 'name', clientX: 130 });

  act(() => { fireEvent.mouseUp(document); });
  expect(result.current.resizing).toBeNull();
});
