import { apiClient } from '@/api/apiClient';

export async function getUser() {
  const response = await apiClient.fetchAWS(
    'GET',
    '/user',
    'application/json'
  );

  return response;
}

export async function addUser(firstName = '', lastName = '') {
  const response = await apiClient.fetchAWS(
    'PUT',
    '/users',
    'application/json',
    JSON.stringify({
      firstName,
      lastName,
    })
  );

  return response;
}