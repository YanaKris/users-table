import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from './ErrorMessage';

it('показывает текст ошибки', () => {
  render(<ErrorMessage message="Что-то пошло не так" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Что-то пошло не так');
});

it('вызывает onRetry по клику «Повторить»', async () => {
  const onRetry = vi.fn();
  render(<ErrorMessage message="Ошибка" onRetry={onRetry} />);
  await userEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  expect(onRetry).toHaveBeenCalledOnce();
});
