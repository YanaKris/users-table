import { render, screen, act, fireEvent } from '@testing-library/react';
import { Filters } from './Filters';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('рендерит поле поиска', () => {
  render(<Filters onSearch={() => {}} />);
  expect(screen.getByRole('searchbox')).toBeInTheDocument();
});

it('ограничивает длину ввода атрибутом maxLength', () => {
  render(<Filters onSearch={() => {}} />);
  expect(screen.getByRole('searchbox')).toHaveAttribute('maxlength', '50');
});

it('не вызывает onSearch при монтировании', () => {
  const onSearch = vi.fn();
  render(<Filters onSearch={onSearch} />);
  act(() => vi.advanceTimersByTime(300));
  expect(onSearch).not.toHaveBeenCalled();
});

it('вызывает onSearch с введённым текстом после задержки', () => {
  const onSearch = vi.fn();
  render(<Filters onSearch={onSearch} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'john' } });
  act(() => vi.advanceTimersByTime(300));
  expect(onSearch).toHaveBeenCalledWith('john');
});

it('быстрый ввод даёт один вызов с финальным значением', () => {
  const onSearch = vi.fn();
  render(<Filters onSearch={onSearch} />);
  const input = screen.getByRole('searchbox');

  fireEvent.change(input, { target: { value: 'jo' } });
  act(() => vi.advanceTimersByTime(150));

  fireEvent.change(input, { target: { value: 'john' } });
  act(() => vi.advanceTimersByTime(300));

  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith('john');
});
