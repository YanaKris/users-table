import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

it('рендерит номера всех страниц', () => {
  render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
  expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
});

it('активная страница помечена aria-current', () => {
  render(<Pagination page={2} totalPages={3} onPageChange={() => {}} />);
  expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
});

it('клик по номеру вызывает onPageChange с этим номером', async () => {
  const onPageChange = vi.fn();
  render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
  await userEvent.click(screen.getByRole('button', { name: '3' }));
  expect(onPageChange).toHaveBeenCalledWith(3);
});

it('«Назад» отключена на первой странице', () => {
  render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
  expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
});

it('«Вперёд» отключена на последней странице', () => {
  render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />);
  expect(screen.getByRole('button', { name: 'Вперёд' })).toBeDisabled();
});

it('«Вперёд» переключает на следующую страницу', async () => {
  const onPageChange = vi.fn();
  render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'Вперёд' }));
  expect(onPageChange).toHaveBeenCalledWith(2);
});

it('«Назад» переключает на предыдущую страницу', async () => {
  const onPageChange = vi.fn();
  render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
  expect(onPageChange).toHaveBeenCalledWith(1);
});

it('не рендерится, если страница всего одна', () => {
  const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

it('при большом числе страниц показывает многоточие', () => {
  render(<Pagination page={5} totalPages={20} onPageChange={() => {}} />);
  expect(screen.getAllByText('…').length).toBeGreaterThan(0);
});

it('показывает первую, последнюю, текущую и соседние страницы', () => {
  render(<Pagination page={5} totalPages={20} onPageChange={() => {}} />);
  ['1', '4', '5', '6', '20'].forEach((n) =>
    expect(screen.getByRole('button', { name: n })).toBeInTheDocument()
  );
});

it('не показывает многоточие при малом числе страниц', () => {
  render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />);
  expect(screen.queryByText('…')).toBeNull();
});
