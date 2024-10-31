const API_URL = 'http://localhost:3000/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
  },

  employees: {
    list: () => fetchWithAuth('/employees'),
    create: (data: any) =>
      fetchWithAuth('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  teaRecords: {
    list: () => fetchWithAuth('/tea-records'),
    create: (data: any) =>
      fetchWithAuth('/tea-records', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  salary: {
    list: () => fetchWithAuth('/salary'),
    process: () =>
      fetchWithAuth('/salary/process', {
        method: 'POST',
      }),
  },
};