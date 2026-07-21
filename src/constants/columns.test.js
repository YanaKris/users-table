import { COLUMNS } from './columns';

describe('COLUMNS', () => {
  it('9 колонок ТЗ в правильном порядке', () => {
    expect(COLUMNS.map((c) => c.label)).toEqual([
      'Фамилия', 'Имя', 'Отчество', 'Возраст', 'Пол', 'Телефон', 'Email', 'Страна', 'Город',
    ]);
  });

  it('сортируемые поля — ФИО/возраст/пол/телефон', () => {
    const fields = COLUMNS.filter((c) => c.sortField).map((c) => c.sortField);
    expect(fields).toEqual(['lastName', 'firstName', 'maidenName', 'age', 'gender', 'phone']);
  });

  it('getValue достаёт вложенные поля адреса', () => {
    const u = { address: { country: 'United States', city: 'Phoenix' } };
    expect(COLUMNS.find((c) => c.key === 'country').getValue(u)).toBe('United States');
    expect(COLUMNS.find((c) => c.key === 'city').getValue(u)).toBe('Phoenix');
  });

  it('getValue для пола форматирует в русский', () => {
    expect(COLUMNS.find((c) => c.key === 'gender').getValue({ gender: 'female' })).toBe('Женский');
  });
});
