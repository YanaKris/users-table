import { renderHook, waitFor, act } from '@testing-library/react';
import { useUsers } from './useUsers';
import { getUsers } from '../api/usersApi';

vi.mock('../api/usersApi', () => ({ getUsers: vi.fn() }));

afterEach(() => vi.clearAllMocks());

it('стартует в состоянии загрузки', () => {
  getUsers.mockReturnValue(new Promise(() => {}));
  const { result } = renderHook(() => useUsers({ limit: 30, skip: 0 }));
  expect(result.current.loading).toBe(true);
});

it('успех: отдаёт users и total, loading=false', async () => {
  getUsers.mockResolvedValue({ users: [{ id: 1 }, { id: 2 }], total: 208 });
  const { result } = renderHook(() => useUsers({ limit: 30, skip: 0 }));

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.users).toHaveLength(2);
  expect(result.current.total).toBe(208);
  expect(result.current.error).toBeNull();
});

it('ошибка: отдаёт error и пустой список', async () => {
  getUsers.mockRejectedValue(new Error('Ошибка сети. Проверьте подключение к интернету.'));
  const { result } = renderHook(() => useUsers({ limit: 30, skip: 0 }));

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toMatch(/Ошибка сети/);
  expect(result.current.users).toEqual([]);
});

it('refetch повторно запрашивает данные', async () => {
  getUsers.mockResolvedValue({ users: [{ id: 1 }], total: 1 });
  const { result } = renderHook(() => useUsers({ limit: 30, skip: 0 }));

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(getUsers).toHaveBeenCalledTimes(1);

  act(() => {
    result.current.refetch();
  });

  await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));
});
