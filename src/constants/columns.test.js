import { COLUMNS, alignStyle } from './columns';

describe('alignStyle', () => {
  it('возвращает объект textAlign для заданного выравнивания', () => {
    expect(alignStyle('right')).toEqual({ textAlign: 'right' });
  });

  it('возвращает undefined, если выравнивание не задано', () => {
    expect(alignStyle(undefined)).toBeUndefined();
    expect(alignStyle(null)).toBeUndefined();
  });
});

describe('COLUMNS', () => {
  it('9 колонок ТЗ в правильном порядке', () => {
    expect(COLUMNS.map((c) => c.label)).toEqual([
      'Фамилия',
      'Имя',
      'Отчество',
      'Возраст',
      'Пол',
      'Телефон',
      'Email',
      'Страна',
      'Город',
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

  it('у каждой колонки задана дефолтная ширина не меньше 50px', () => {
    COLUMNS.forEach((col) => {
      expect(typeof col.width).toBe('number');
      expect(col.width).toBeGreaterThanOrEqual(50);
    });
  });

  it('сумма дефолтных ширин не превышает 1400px — таблица влезает в контейнер без горизонтального скролла', () => {
    const total = COLUMNS.reduce((sum, col) => sum + col.width, 0);
    expect(total).toBeLessThanOrEqual(1400);
  });
});
