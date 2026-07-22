import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

it('drag из содержимого с отпусканием над оверлеем НЕ закрывает окно', () => {
  const onClose = vi.fn();
  render(<Modal onClose={onClose}>x</Modal>);
  const overlay = screen.getByTestId('modal-overlay');

  fireEvent.mouseDown(screen.getByRole('dialog'));
  fireEvent.mouseUp(overlay);
  fireEvent.click(overlay);

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

it('при открытии фокус переходит в диалог', () => {
  render(<Modal onClose={() => {}}>x</Modal>);
  expect(screen.getByRole('dialog')).toHaveFocus();
});

it('Tab циклится внутри модалки и не уходит в фон', async () => {
  render(
    <>
      <button>снаружи</button>
      <Modal onClose={() => {}}>
        <button>внутри</button>
      </Modal>
    </>
  );
  const outside = screen.getByRole('button', { name: 'снаружи' });
  const dialog = screen.getByRole('dialog');

  for (let i = 0; i < 4; i += 1) {
    await userEvent.tab();
    expect(outside).not.toHaveFocus();
    expect(dialog.contains(document.activeElement)).toBe(true);
  }

  await userEvent.tab({ shift: true });
  expect(outside).not.toHaveFocus();
  expect(dialog.contains(document.activeElement)).toBe(true);
});

it('после закрытия фокус возвращается к элементу, сфокусированному до открытия', async () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>открыть</button>
        {open && <Modal onClose={() => setOpen(false)}>x</Modal>}
      </>
    );
  }
  render(<Harness />);
  const opener = screen.getByRole('button', { name: 'открыть' });

  await userEvent.click(opener);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  screen.getByRole('button', { name: 'Закрыть' }).focus();

  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(opener).toHaveFocus();
});
