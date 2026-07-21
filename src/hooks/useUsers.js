import { useCallback, useEffect, useState } from 'react';
import { getUsers } from '../api/usersApi';

export function useUsers({ limit = 30, skip = 0 } = {}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers({ limit, skip });
        setUsers(data.users);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [limit, skip, reloadKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  return { users, total, loading, error, refetch };
}
