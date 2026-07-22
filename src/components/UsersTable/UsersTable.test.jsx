import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersTable } from './UsersTable';

const users = [{
  id: 1, lastName: 'Johnson', firstName: 'Emily', maidenName: 'Smith',
  age: 29, gender: 'female', phone: '+81 965-431-3024',
  email: 'emily@x.dummyjson.com', address: { country: 'United States', city: 'Phoenix' },
}];

describe('UsersTable', () => {
  it('рендерит все заголовки колонок', () => {
    render(<UsersTable users={[]} />);
    ['Фамилия','Имя','Отчество','Возраст','Пол','Телефон','Email','Страна','Город']
      .forEach((l) => expect(screen.getByText(l)).toBeInTheDocument());
  });

  it('рендерит строку на пользователя с форматированными данными', () => {
    render(<UsersTable users={users} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(within(rows[1]).getByText('Johnson')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Женский')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Phoenix')).toBeInTheDocument();
  });

  it('показывает «Ничего не найдено» для пустого списка', () => {
    render(<UsersTable users={[]} />);
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('не падает без пропа users — показывает пустое состояние', () => {
    render(<UsersTable />);
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('числовую колонку «Возраст» выравнивает вправо', () => {
    render(<UsersTable users={users} />);
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('29')).toHaveStyle({ textAlign: 'right' });
  });

  it('клик по сортируемому заголовку вызывает onSort с полем', async () => {
    const onSort = vi.fn();
    render(<UsersTable users={users} onSort={onSort} />);
    await userEvent.click(screen.getByRole('button', { name: /Возраст/ }));
    expect(onSort).toHaveBeenCalledWith('age');
  });

  it('колонка «Отчество» сортируемая — клик вызывает onSort с maidenName', async () => {
    const onSort = vi.fn();
    render(<UsersTable users={users} onSort={onSort} />);
    await userEvent.click(screen.getByRole('button', { name: /Отчество/ }));
    expect(onSort).toHaveBeenCalledWith('maidenName');
  });

  it('во время загрузки контейнер помечается aria-busy и данные остаются', () => {
    const { container } = render(<UsersTable users={users} loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.getByText('Johnson')).toBeInTheDocument();
  });

  it('без загрузки контейнер не помечается aria-busy', () => {
    const { container } = render(<UsersTable users={users} />);
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('пробрасывает sortBy/order в заголовки — активная колонка помечена aria-sort', () => {
    render(<UsersTable users={users} sortBy="age" order="asc" />);
    expect(screen.getByRole('columnheader', { name: /Возраст/ }))
      .toHaveAttribute('aria-sort', 'ascending');
  });

  it('без onSort клик по заголовку не роняет компонент', async () => {
    render(<UsersTable users={users} />);
    await userEvent.click(screen.getByRole('button', { name: /Возраст/ }));
    expect(screen.getByText('Johnson')).toBeInTheDocument();
  });

  it('клик по строке вызывает onRowClick с пользователем', async () => {
    const onRowClick = vi.fn();
    render(<UsersTable users={users} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Johnson'));
    expect(onRowClick).toHaveBeenCalledWith(users[0]);
  });

  it('строка доступна с клавиатуры: фокусируется, Enter и Space вызывают onRowClick', async () => {
    const onRowClick = vi.fn();
    render(<UsersTable users={users} onRowClick={onRowClick} />);
    const row = screen.getByText('Johnson').closest('tr');

    row.focus();
    expect(row).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledWith(users[0]);

    await userEvent.keyboard(' ');
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it('клик при активном выделении текста в строке НЕ вызывает onRowClick', () => {
    const onRowClick = vi.fn();
    render(<UsersTable users={users} onRowClick={onRowClick} />);
    const cell = screen.getByText('Johnson');
    const range = document.createRange();
    range.selectNodeContents(cell);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    fireEvent.click(cell);
    expect(onRowClick).not.toHaveBeenCalled();

    window.getSelection().removeAllRanges();
  });

  it('рендерит ручки ресайза для колонок', () => {
    render(<UsersTable users={users} />);
    expect(screen.getByTestId('resizer-lastName')).toBeInTheDocument();
    expect(screen.getByTestId('resizer-email')).toBeInTheDocument();
  });
});
