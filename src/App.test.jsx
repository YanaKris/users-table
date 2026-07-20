import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('отображает заголовок приложения', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Таблица пользователей' }),
    ).toBeInTheDocument()
  })
})
