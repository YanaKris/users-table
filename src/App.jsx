import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { usersStore } from './stores/UsersStore';
import { UsersTable } from './components/UsersTable/UsersTable';
import { Loader } from './components/ui/Loader';
import { ErrorMessage } from './components/ui/ErrorMessage';
import './App.css';

const App = observer(function App() {
  useEffect(() => {
    usersStore.load();
  }, []);

  const { users, loading, error } = usersStore;

  return (
    <div className="app">
      <h1>Пользователи</h1>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={() => usersStore.refetch()} />}
      {!loading && !error && <UsersTable users={users} />}
    </div>
  );
});

export default App;
