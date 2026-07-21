import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { getUsers } from './api/usersApi';

vi.mock('./api/usersApi', () => ({ getUsers: vi.fn() }));

describe('App', () => {
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
});
