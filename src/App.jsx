import { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { usersStore } from './stores/UsersStore';
import { UsersTable } from './components/UsersTable/UsersTable';
import { Pagination } from './components/Pagination/Pagination';
import { Filters } from './components/Filters/Filters';
import { UserModal } from './components/UserModal/UserModal';
import { Loader } from './components/ui/Loader';
import { ErrorMessage } from './components/ui/ErrorMessage';
import './App.css';

const App = observer(function App() {
  useEffect(() => {
    usersStore.load();
  }, []);

  const handleSearch = useCallback((query) => usersStore.setSearch(query), []);

  const { users, loading, error, sortBy, order, page, totalPages, isInitialLoading, selectedUser } =
    usersStore;

  return (
    <div className="app">
      <h1>Пользователи</h1>
      {isInitialLoading && <Loader />}
      {!isInitialLoading && (
        <>
          <Filters onSearch={handleSearch} />
          {error && <ErrorMessage message={error} onRetry={() => usersStore.refetch()} />}
          {!error && (
            <>
              <UsersTable
                users={users}
                sortBy={sortBy}
                order={order}
                onSort={(field) => usersStore.setSort(field)}
                onRowClick={(user) => usersStore.selectUser(user)}
                loading={loading}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => usersStore.setPage(p)}
              />
            </>
          )}
        </>
      )}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => usersStore.clearSelection()} />
      )}
    </div>
  );
});

export default App;
