import { useUsers } from './hooks/useUsers';
import './App.css';

function App() {
  const { users, total, loading, error } = useUsers({ limit: 30, skip: 0 });

  return (
    <div className="app">
      <h1>Пользователи</h1>
      {loading && <p>Загрузка…</p>}
      {error && <p>Ошибка: {error}</p>}
      {!loading && !error && <p>Загружено: {users.length} из {total}</p>}
    </div>
  );
}

export default App;
