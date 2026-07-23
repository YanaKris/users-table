import { getUsers, searchUsers, filterUsers } from './usersApi';

function mockFetch(data, { ok = true, status = 200 } = {}) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(data),
      }),
    ),
  );
}

describe('usersApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('построение URL', () => {
    beforeEach(() => {
      mockFetch({ users: [], total: 0 });
    });

    it('getUsers подставляет limit, skip, sortBy, order', async () => {
      await getUsers({ limit: 10, skip: 20, sortBy: 'age', order: 'asc' });

      const url = fetch.mock.calls[0][0];
      expect(url).toContain('https://dummyjson.com/users?');
      expect(url).toContain('limit=10');
      expect(url).toContain('skip=20');
      expect(url).toContain('sortBy=age');
      expect(url).toContain('order=asc');
    });

    it('getUsers без sortBy/order не добавляет их в URL', async () => {
      await getUsers({ limit: 10, skip: 0 });

      const url = fetch.mock.calls[0][0];
      expect(url).not.toContain('sortBy');
      expect(url).not.toContain('order');
    });

    it('searchUsers обращается к /search и подставляет q', async () => {
      await searchUsers({ q: 'john', limit: 5, skip: 0 });

      const url = fetch.mock.calls[0][0];
      expect(url).toContain('/users/search?');
      expect(url).toContain('q=john');
    });

    it('filterUsers обращается к /filter и подставляет key и value', async () => {
      await filterUsers({ key: 'gender', value: 'female', limit: 5, skip: 0 });

      const url = fetch.mock.calls[0][0];
      expect(url).toContain('/users/filter?');
      expect(url).toContain('key=gender');
      expect(url).toContain('value=female');
    });
  });

  describe('возврат данных', () => {
    it('getUsers возвращает распарсенный JSON', async () => {
      mockFetch({ users: [{ id: 1 }], total: 1, skip: 0, limit: 30 });

      const data = await getUsers({ limit: 1, skip: 0 });

      expect(data.total).toBe(1);
      expect(data.users).toHaveLength(1);
    });
  });

  describe('обработка ошибок', () => {
    it('бросает ошибку при ответе не-ok (например 500)', async () => {
      mockFetch({}, { ok: false, status: 500 });

      await expect(getUsers({ limit: 1, skip: 0 })).rejects.toThrow('код 500');
    });

    it('бросает ошибку при сетевом сбое (fetch отклонён)', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
      );

      await expect(getUsers({ limit: 1, skip: 0 })).rejects.toThrow('Ошибка сети');
    });
  });

  describe('базовый URL из окружения (VITE_API_URL)', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
      vi.resetModules();
    });

    it('использует VITE_API_URL, если переменная задана', async () => {
      vi.stubEnv('VITE_API_URL', 'https://api.example.test');
      vi.resetModules();
      mockFetch({ users: [], total: 0 });

      const { getUsers: getUsersEnv } = await import('./usersApi');
      await getUsersEnv({ limit: 1, skip: 0 });

      expect(fetch.mock.calls[0][0]).toContain('https://api.example.test/users?');
    });

    it('откатывается на https://dummyjson.com, если VITE_API_URL не задан', async () => {
      vi.stubEnv('VITE_API_URL', undefined);
      vi.resetModules();
      mockFetch({ users: [], total: 0 });

      const { getUsers: getUsersDefault } = await import('./usersApi');
      await getUsersDefault({ limit: 1, skip: 0 });

      expect(fetch.mock.calls[0][0]).toContain('https://dummyjson.com/users?');
    });
  });
});
