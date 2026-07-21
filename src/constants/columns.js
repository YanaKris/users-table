import { formatGender } from '../utils/formatters';

export const COLUMNS = [
  { key: 'lastName',   label: 'Фамилия',  sortField: 'lastName',  getValue: (u) => u.lastName },
  { key: 'firstName',  label: 'Имя',      sortField: 'firstName', getValue: (u) => u.firstName },
  { key: 'maidenName', label: 'Отчество', sortField: null,        getValue: (u) => u.maidenName },
  { key: 'age',        label: 'Возраст',  sortField: 'age',       getValue: (u) => u.age },
  { key: 'gender',     label: 'Пол',      sortField: 'gender',    getValue: (u) => formatGender(u.gender) },
  { key: 'phone',      label: 'Телефон',  sortField: 'phone',     getValue: (u) => u.phone },
  { key: 'email',      label: 'Email',    sortField: null,        getValue: (u) => u.email },
  { key: 'country',    label: 'Страна',   sortField: null,        getValue: (u) => u.address?.country },
  { key: 'city',       label: 'Город',    sortField: null,        getValue: (u) => u.address?.city },
];