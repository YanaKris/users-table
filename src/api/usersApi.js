const BASE_URL = 'https://dummyjson.com/users';

function buildQuery(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value);
    }
  });

  return search.toString();
}

async function request(url) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error('Ошибка сети. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные (код ${response.status}).`);
  }

  return response.json();
}

export function getUsers({ limit, skip, sortBy, order } = {}) {
  const query = buildQuery({ limit, skip, sortBy, order });
  return request(`${BASE_URL}?${query}`);
}

export function searchUsers({ q, limit, skip, sortBy, order } = {}) {
  const query = buildQuery({ q, limit, skip, sortBy, order });
  return request(`${BASE_URL}/search?${query}`);
}

export function filterUsers({ key, value, limit, skip, sortBy, order } = {}) {
  const query = buildQuery({ key, value, limit, skip, sortBy, order });
  return request(`${BASE_URL}/filter?${query}`);
}