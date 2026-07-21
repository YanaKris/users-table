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

  const { users, loading, error, sortBy, order, isInitialLoading } = usersStore;

  return (
    <div className="app">
      <h1>Пользователи</h1>
      {isInitialLoading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={() => usersStore.refetch()} />}
      {!isInitialLoading && !error && (
        <UsersTable
          users={users}
          sortBy={sortBy}
          order={order}
          onSort={(field) => usersStore.setSort(field)}
          loading={loading}
        />
      )}
    </div>
  );
});

export default App;
