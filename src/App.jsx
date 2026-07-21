import { useUsers } from './hooks/useUsers';
import { Loader } from './components/ui/Loader';
import { ErrorMessage } from './components/ui/ErrorMessage';
import './App.css';

function App() {
  const { users, total, loading, error, refetch } = useUsers({ limit: 30, skip: 0 });

  return (
    <div className="app">
      <h1>Пользователи</h1>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && <p>Загружено: {users.length} из {total}</p>}
    </div>
  );
}

export default App;
