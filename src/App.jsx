import { useUsers } from './hooks/useUsers';
import { UsersTable } from './components/UsersTable/UsersTable';
import { Loader } from './components/ui/Loader';
import { ErrorMessage } from './components/ui/ErrorMessage';
import './App.css';

function App() {
  const { users, loading, error, refetch } = useUsers({ limit: 30, skip: 0 });

  return (
    <div className="app">
      <h1>Пользователи</h1>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && <UsersTable users={users} />}
    </div>
  );
}

export default App;
