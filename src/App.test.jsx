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
    usersStore.page = 1;
    usersStore.total = 0;
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

    let resolveSecond;
    getUsers.mockReturnValueOnce(new Promise((r) => { resolveSecond = r; }));
    await userEvent.click(screen.getByRole('button', { name: /Фамилия/ }));

    expect(screen.getByText('Johnson')).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();

    resolveSecond({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));
  });

  it('клик «Повторить» после ошибки перезапрашивает данные', async () => {
    getUsers.mockRejectedValueOnce(new Error('Ошибка сети'));
    render(<App />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    getUsers.mockResolvedValueOnce({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    await userEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());
    expect(getUsers).toHaveBeenCalledTimes(2);
  });

  it('показывает пагинацию, когда страниц больше одной', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 208,
    });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());

    expect(screen.getByRole('navigation', { name: 'Пагинация' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeInTheDocument();
  });
});
