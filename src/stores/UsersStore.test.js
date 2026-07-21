import { UsersStore } from './UsersStore';
import { getUsers } from '../api/usersApi';

vi.mock('../api/usersApi', () => ({ getUsers: vi.fn() }));

afterEach(() => vi.clearAllMocks());

it('стартует в состоянии загрузки', () => {
  const store = new UsersStore();
  expect(store.loading).toBe(true);
});

it('load: успех — users, total, loading=false, error=null', async () => {
  getUsers.mockResolvedValue({ users: [{ id: 1 }, { id: 2 }], total: 208 });
  const store = new UsersStore();

  await store.load();

  expect(store.users).toHaveLength(2);
  expect(store.total).toBe(208);
  expect(store.loading).toBe(false);
  expect(store.error).toBeNull();
});

it('load: ошибка — error и пустой список', async () => {
  getUsers.mockRejectedValue(new Error('Ошибка сети. Проверьте подключение к интернету.'));
  const store = new UsersStore();

  await store.load();

  expect(store.error).toMatch(/Ошибка сети/);
  expect(store.users).toEqual([]);
  expect(store.loading).toBe(false);
});

it('refetch повторно запрашивает данные', async () => {
  getUsers.mockResolvedValue({ users: [{ id: 1 }], total: 1 });
  const store = new UsersStore();

  await store.load();
  expect(getUsers).toHaveBeenCalledTimes(1);

  await store.refetch();
  expect(getUsers).toHaveBeenCalledTimes(2);
});
