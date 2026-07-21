import { render, screen, within } from '@testing-library/react';
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
});
