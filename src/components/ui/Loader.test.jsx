import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

it('показывает индикатор со статусом', () => {
  render(<Loader />);
  expect(screen.getByRole('status')).toHaveTextContent('Загрузка');
});
