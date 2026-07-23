const DASH = '—';

export function formatGender(gender) {
  if (gender === 'male') return 'Мужской';
  if (gender === 'female') return 'Женский';
  return DASH;
}

export function formatValue(value) {
  if (value === null || value === undefined || value === '') return DASH;
  return String(value);
}
