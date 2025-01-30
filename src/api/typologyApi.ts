import { apiClient } from '@/api/apiClient';

export async function addTypology(typology: string) {
  const response = await apiClient.fetchAWS(
    'PUT',
    '/typologies',
    'application/json',
    JSON.stringify({
      typology
    })
  );

  return response;
}

export async function getTypologies() {
  const response = await apiClient.fetchAWS(
    'GET',
    '/typologies',
    'application/json'
  );

  return response;
}