import { renderHook, act, fireEvent } from '@testing-library/react';
import { useColumnResize } from './useColumnResize';

const columns = [{ key: 'name' }, { key: 'age' }];

function down(clientX) {
  return { clientX, button: 0, preventDefault() {} };
}

it('инициализирует ширины значением по умолчанию', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  expect(result.current.widths.name).toBe(150);
  expect(result.current.widths.age).toBe(150);
});

it('увеличивает ширину при перетаскивании вправо', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  act(() => { fireEvent.mouseMove(document, { clientX: 160, buttons: 1 }); }); // +60
  expect(result.current.widths.name).toBe(210);
});

it('не позволяет ширину меньше 50px', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  act(() => { fireEvent.mouseMove(document, { clientX: 0, buttons: 1 }); });
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

  act(() => { fireEvent.mouseMove(document, { clientX: 130, buttons: 1 }); });
  expect(result.current.resizing).toEqual({ key: 'name', clientX: 130 });

  act(() => { fireEvent.mouseUp(document); });
  expect(result.current.resizing).toBeNull();
});

it('правая кнопка мыши не начинает ресайз', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', { clientX: 100, button: 2, preventDefault() {} }));
  expect(result.current.resizing).toBeNull();
  act(() => { fireEvent.mouseMove(document, { clientX: 300, buttons: 2 }); });
  expect(result.current.widths.name).toBe(150);
});

it('прекращает ресайз, если кнопка отпущена вне окна (mousemove с buttons=0)', () => {
  const { result } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  act(() => { fireEvent.mouseMove(document, { clientX: 160, buttons: 1 }); });
  expect(result.current.widths.name).toBe(210);

  act(() => { fireEvent.mouseMove(document, { clientX: 400, buttons: 0 }); });
  expect(result.current.resizing).toBeNull();
  act(() => { fireEvent.mouseMove(document, { clientX: 600, buttons: 1 }); });
  expect(result.current.widths.name).toBe(210);
});

it('снимает document-слушатели при размонтировании во время ресайза', () => {
  const removeSpy = vi.spyOn(document, 'removeEventListener');
  const { result, unmount } = renderHook(() => useColumnResize(columns, 150));
  act(() => result.current.startResize('name', down(100)));
  unmount();
  expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
  removeSpy.mockRestore();
});
