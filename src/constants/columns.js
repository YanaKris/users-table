import { formatGender } from '../utils/formatters';

export const COLUMNS = [
  { key: 'lastName',   label: 'Фамилия',  sortField: 'lastName',  width: 130, getValue: (u) => u.lastName },
  { key: 'firstName',  label: 'Имя',      sortField: 'firstName', width: 110, getValue: (u) => u.firstName },
  { key: 'maidenName', label: 'Отчество', sortField: 'maidenName', width: 110, getValue: (u) => u.maidenName },
  { key: 'age',        label: 'Возраст',  sortField: 'age',       align: 'center', width: 100, getValue: (u) => u.age },
  { key: 'gender',     label: 'Пол',      sortField: 'gender',    width: 100, getValue: (u) => formatGender(u.gender) },
  { key: 'phone',      label: 'Телефон',  sortField: 'phone',     width: 150, getValue: (u) => u.phone },
  { key: 'email',      label: 'Email',    sortField: null,        width: 240, getValue: (u) => u.email },
  { key: 'country',    label: 'Страна',   sortField: null,        width: 140, getValue: (u) => u.address?.country },
  { key: 'city',       label: 'Город',    sortField: null,        width: 120, getValue: (u) => u.address?.city },
];

export function alignStyle(align) {
  return align ? { textAlign: align } : undefined;
}