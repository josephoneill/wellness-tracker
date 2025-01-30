import { apiClient } from '@/api/apiClient';
import { WellnessRatingScore } from '@/components/wellness-rating/types';
import { formatDateForDatabase } from '@/utils/dateUtils';

export async function getWellnessRatings(
) {
  const response = await apiClient.fetchAWS(
    'GET',
    '/wellness-ratings',
    'application/json',
  );

  return response;
}

export async function getWellnessRatingsByLastWeek(
  typologyID: string
) {
  const response = await apiClient.fetchAWS(
    'GET',
    `/wellness-ratings/last-week?typologyID=${encodeURI(typologyID)}`,
    'application/json',
  );

  return response;
}

export async function addWellnessRating(
  typologyID: string,
  wellnessScore: WellnessRatingScore,
  wellnessDescription: string,
  date: Date | null
) {
  if (!typologyID || wellnessScore === undefined) {
    console.warn('Cannot add wellness rating: Insufficient data');
    return;
  }
  const response = await apiClient.fetchAWS(
    'PUT',
    '/wellness-ratings',
    'application/json',
    JSON.stringify({
      typologyID,
      wellnessScore,
      wellnessDescription,
      ...(date && { date: formatDateForDatabase(date) })
    })
  );

  return response;
}