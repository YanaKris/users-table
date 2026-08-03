import { formatGender, formatValue } from './formatters';

describe('formatGender', () => {
  it('male → Мужской', () => expect(formatGender('male')).toBe('Мужской'));
  it('female → Женский', () => expect(formatGender('female')).toBe('Женский'));
  it('неизвестное → прочерк', () => expect(formatGender('x')).toBe('—'));
});

describe('formatValue', () => {
  it('число приводит к строке', () => expect(formatValue(29)).toBe('29'));
  it('пустые значения → прочерк', () => {
    expect(formatValue('')).toBe('—');
    expect(formatValue(null)).toBe('—');
    expect(formatValue(undefined)).toBe('—');
  });
});
