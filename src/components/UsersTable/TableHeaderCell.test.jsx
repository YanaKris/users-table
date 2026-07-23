import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableHeaderCell } from './TableHeaderCell';

const sortableCol = { key: 'age', label: 'Возраст', sortField: 'age' };
const plainCol = { key: 'email', label: 'Email', sortField: null };

function renderCell(column, props = {}) {
  return render(
    <table>
      <thead>
        <tr>
          <TableHeaderCell
            column={column}
            sortBy={null}
            order={null}
            onSort={() => {}}
            {...props}
          />
        </tr>
      </thead>
    </table>,
  );
}

it('несортируемая колонка — просто заголовок, без кнопки', () => {
  renderCell(plainCol);
  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
});

it('сортируемая колонка — клик вызывает onSort с полем', async () => {
  const onSort = vi.fn();
  renderCell(sortableCol, { onSort });
  await userEvent.click(screen.getByRole('button'));
  expect(onSort).toHaveBeenCalledWith('age');
});

it('активная колонка по возрастанию — aria-sort=ascending', () => {
  renderCell(sortableCol, { sortBy: 'age', order: 'asc' });
  expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
});

it('активная колонка по убыванию — aria-sort=descending', () => {
  renderCell(sortableCol, { sortBy: 'age', order: 'desc' });
  expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
});

it('сортируемая, но неактивная — aria-sort=none', () => {
  renderCell(sortableCol, { sortBy: 'lastName', order: 'asc' });
  expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
});

it('mousedown на ручке ресайза вызывает onResizeStart с ключом колонки', () => {
  const onResizeStart = vi.fn();
  renderCell(sortableCol, { onResizeStart });
  fireEvent.mouseDown(screen.getByTestId('resizer-age'));
  expect(onResizeStart).toHaveBeenCalledWith('age', expect.anything());
});

it('ручка ресайза есть и у несортируемой колонки', () => {
  renderCell(plainCol, { onResizeStart: () => {} });
  expect(screen.getByTestId('resizer-email')).toBeInTheDocument();
});

it('во время ресайза ручка активной колонки помечается классом dragging', () => {
  renderCell(sortableCol, { onResizeStart: () => {}, resizingKey: 'age' });
  expect(screen.getByTestId('resizer-age').className).toMatch(/dragging/);
});
