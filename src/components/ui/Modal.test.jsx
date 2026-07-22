import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

it('рендерит содержимое внутри диалога', () => {
  render(<Modal onClose={() => {}}>Привет</Modal>);
  expect(screen.getByRole('dialog')).toHaveTextContent('Привет');
});

it('клик по оверлею вызывает onClose', async () => {
  const onClose = vi.fn();
  render(<Modal onClose={onClose}>x</Modal>);
  await userEvent.click(screen.getByTestId('modal-overlay'));
  expect(onClose).toHaveBeenCalled();
});

it('клик по содержимому НЕ закрывает окно', async () => {
  const onClose = vi.fn();
  render(<Modal onClose={onClose}>x</Modal>);
  await userEvent.click(screen.getByRole('dialog'));
  expect(onClose).not.toHaveBeenCalled();
});

it('нажатие Esc вызывает onClose', async () => {
  const onClose = vi.fn();
  render(<Modal onClose={onClose}>x</Modal>);
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

it('кнопка закрытия вызывает onClose', async () => {
  const onClose = vi.fn();
  render(<Modal onClose={onClose}>x</Modal>);
  await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
  expect(onClose).toHaveBeenCalled();
});
