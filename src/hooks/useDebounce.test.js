import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('возвращает начальное значение сразу', () => {
  const { result } = renderHook(() => useDebounce('a', 300));
  expect(result.current).toBe('a');
});

it('обновляет значение только после задержки', () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
    initialProps: { v: 'a' },
  });

  rerender({ v: 'ab' });
  expect(result.current).toBe('a');

  act(() => vi.advanceTimersByTime(300));
  expect(result.current).toBe('ab');
});

it('при быстрых изменениях берёт только последнее значение', () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
    initialProps: { v: 'a' },
  });

  rerender({ v: 'ab' });
  act(() => vi.advanceTimersByTime(200));

  rerender({ v: 'abc' });
  act(() => vi.advanceTimersByTime(200));
  expect(result.current).toBe('a');

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe('abc');
});
