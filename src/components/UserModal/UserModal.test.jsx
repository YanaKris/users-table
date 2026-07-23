import { render, screen } from '@testing-library/react';
import { UserModal } from './UserModal';

const user = {
  id: 1,
  firstName: 'Emily',
  lastName: 'Johnson',
  maidenName: 'Smith',
  age: 28,
  height: 165,
  weight: 60,
  phone: '+81 965-431-3024',
  email: 'emily@x.dummyjson.com',
  image: 'https://dummyjson.com/icon/emilys/128',
  address: {
    address: '626 Main St',
    city: 'Phoenix',
    state: 'Mississippi',
    country: 'United States',
  },
};

it('ничего не рендерит без пользователя', () => {
  const { container } = render(<UserModal user={null} onClose={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

it('показывает ФИО, возраст, рост, вес, телефон и email', () => {
  render(<UserModal user={user} onClose={() => {}} />);
  expect(screen.getByRole('dialog')).toHaveTextContent('Johnson Emily Smith');
  expect(screen.getByText('28')).toBeInTheDocument();
  expect(screen.getByText('165 см')).toBeInTheDocument();
  expect(screen.getByText('60 кг')).toBeInTheDocument();
  expect(screen.getByText('+81 965-431-3024')).toBeInTheDocument();
  expect(screen.getByText('emily@x.dummyjson.com')).toBeInTheDocument();
});

it('показывает адрес', () => {
  render(<UserModal user={user} onClose={() => {}} />);
  expect(screen.getByText(/Phoenix/)).toBeInTheDocument();
  expect(screen.getByText(/United States/)).toBeInTheDocument();
});

it('показывает аватар с alt по ФИО', () => {
  render(<UserModal user={user} onClose={() => {}} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', user.image);
  expect(img).toHaveAttribute('alt', 'Johnson Emily Smith');
});
