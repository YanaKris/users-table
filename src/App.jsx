import { useEffect } from 'react';
import { getUsers } from './api/usersApi';
import './App.css';

function App() {
  useEffect(() => {
    getUsers({ limit: 30, skip: 0 })
      .then((data) => {
        console.log(data);
        console.log('Список пользователей:', data.users);
        console.log(data.users.length, 'из', data.total);
      })
      .catch((error) => {
        console.error('Ошибка загрузки:', error.message);
      });
  }, []);

  return (
    <div className="app">
      <h1>Пользователи</h1>
      <p>Получили данные, вывод в косоль</p>
    </div>
  );
}

export default App;
