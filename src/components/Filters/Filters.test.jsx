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

describe('кнопка очистки', () => {
  it('не отображается, пока поле пустое', () => {
    render(<Filters onSearch={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).toBeNull();
  });

  it('появляется после ввода текста', () => {
    render(<Filters onSearch={() => {}} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'john' } });
    expect(screen.getByRole('button', { name: 'Очистить поиск' })).toBeInTheDocument();
  });

  it('клик очищает поле и снова прячет кнопку', () => {
    render(<Filters onSearch={() => {}} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'john' } });

    fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }));

    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).toBeNull();
  });

  it('очистка вызывает onSearch с пустой строкой после задержки', () => {
    const onSearch = vi.fn();
    render(<Filters onSearch={onSearch} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'john' } });
    act(() => vi.advanceTimersByTime(300));
    onSearch.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }));
    act(() => vi.advanceTimersByTime(300));

    expect(onSearch).toHaveBeenCalledWith('');
  });
});
