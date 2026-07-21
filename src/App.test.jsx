import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getUsers } from './api/usersApi';
import { usersStore } from './stores/UsersStore';

vi.mock('./api/usersApi', () => ({ getUsers: vi.fn() }));

describe('App', () => {
  beforeEach(() => {
    usersStore.users = [];
    usersStore.error = null;
    usersStore.sortBy = null;
    usersStore.order = null;
  });
  afterEach(() => vi.clearAllMocks());

  it('загрузка → таблица с данными', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());
  });

  it('сбой → сообщение об ошибке', async () => {
    getUsers.mockRejectedValue(new Error('Ошибка сети'));
    render(<App />);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Ошибка сети'));
  });

  it('при пересортировке таблица остаётся видимой, а не заменяется лоадером', async () => {
    getUsers.mockResolvedValueOnce({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());

    // вторая загрузка (клик по сортировке) «зависает» — ловим промежуточное состояние
    let resolveSecond;
    getUsers.mockReturnValueOnce(new Promise((r) => { resolveSecond = r; }));
    await userEvent.click(screen.getByRole('button', { name: /Фамилия/ }));

    // старые данные видны во время подгрузки, полноэкранного лоадера нет
    expect(screen.getByText('Johnson')).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();

    resolveSecond({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));
  });
});
