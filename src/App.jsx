import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log('Список пользователей:', data.users);
        console.log(data.users.length, 'из', data.total);
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
