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

describe('сортировка', () => {
  beforeEach(() => getUsers.mockResolvedValue({ users: [], total: 0 }));

  it('setSort по новому полю включает возрастание (asc)', () => {
    const store = new UsersStore();
    store.setSort('age');
    expect(store.sortBy).toBe('age');
    expect(store.order).toBe('asc');
  });

  it('setSort по тому же полю циклит asc → desc → none', () => {
    const store = new UsersStore();
    store.setSort('age'); // asc
    store.setSort('age'); // desc
    expect(store.order).toBe('desc');
    store.setSort('age'); // none
    expect(store.sortBy).toBeNull();
    expect(store.order).toBeNull();
  });

  it('setSort по другому полю начинает заново с asc', () => {
    const store = new UsersStore();
    store.setSort('age');
    store.setSort('lastName');
    expect(store.sortBy).toBe('lastName');
    expect(store.order).toBe('asc');
  });

  it('load передаёт sortBy и order в getUsers', async () => {
    const store = new UsersStore();
    store.sortBy = 'age';
    store.order = 'desc';

    await store.load();

    expect(getUsers).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'age', order: 'desc' })
    );
  });
});

describe('защита от гонки', () => {
  it('поздний ответ не затирает результат более свежего запроса', async () => {
    let resolveSlow;
    const slow = new Promise((resolve) => { resolveSlow = resolve; });
    getUsers
      .mockReturnValueOnce(slow) // первый запрос — «медленный»
      .mockResolvedValueOnce({ users: [{ id: 2 }], total: 2 }); // второй — быстрый

    const store = new UsersStore();

    const firstLoad = store.load();
    await store.load();

    resolveSlow({ users: [{ id: 1 }], total: 1 });
    await firstLoad;

    expect(store.users).toEqual([{ id: 2 }]);
    expect(store.total).toBe(2);
  });
});
