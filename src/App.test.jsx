import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getUsers, searchUsers } from './api/usersApi';
import { usersStore } from './stores/UsersStore';

vi.mock('./api/usersApi', () => ({ getUsers: vi.fn(), searchUsers: vi.fn() }));

describe('App', () => {
  beforeEach(() => {
    usersStore.users = [];
    usersStore.error = null;
    usersStore.sortBy = null;
    usersStore.order = null;
    usersStore.page = 1;
    usersStore.total = 0;
    usersStore.search = '';
    usersStore.selectedUser = null;
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

  it('показывает поле поиска над таблицей', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('при ошибке во время поиска поле остаётся на экране с введённым текстом', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 1, lastName: 'Johnson', firstName: 'Emily', address: { city: 'Phoenix' } }],
      total: 1,
    });
    searchUsers.mockRejectedValue(new Error('Ошибка сети'));

    render(<App />);
    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());

    await userEvent.type(screen.getByRole('searchbox'), 'xyz');

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument(), { timeout: 2000 });
    expect(screen.getByRole('searchbox')).toHaveValue('xyz');
  });

  it('клик по строке открывает модалку с деталями пользователя', async () => {
    getUsers.mockResolvedValue({
      users: [{
        id: 1, lastName: 'Johnson', firstName: 'Emily', age: 28,
        height: 165, weight: 60, phone: '+81 965-431-3024',
        email: 'emily@x.dummyjson.com', image: 'https://x/img.png',
        address: { city: 'Phoenix', country: 'United States' },
      }],
      total: 1,
    });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Johnson')).toBeInTheDocument());

    await userEvent.click(screen.getByText('Johnson'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Johnson Emily');
    expect(dialog).toHaveTextContent('emily@x.dummyjson.com');
  });
});
