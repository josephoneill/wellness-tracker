import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getWellnessRatings, addWellnessRating } from '@/api/wellnessRatingApi';
import { type WellnessRating, type WellnessRatingResponse } from '@/components/wellness-rating/types';
import { createdDateStringToDate, isCreateDateToday } from "@/utils/dateUtils";
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function sortAndCategorizeRatings(wellnessRatings: WellnessRatingResponse[]) {
  wellnessRatings.sort((a, b) => b.created.localeCompare(a.created));
  const ratingsByTypologyMap = new Map<string, WellnessRatingResponse[]>();

  for (const rating of wellnessRatings) {
    if (ratingsByTypologyMap.has(rating.typologyID)) {
      // !! because we check if the key exists first
      ratingsByTypologyMap.get(rating.typologyID)!!.push(rating);
    } else {
      ratingsByTypologyMap.set(rating.typologyID, [rating]);
    }
  }

  return ratingsByTypologyMap;
}

export const useWellnessRating = () => {
  const queryClient = useQueryClient();

  const { data: wellnessRatings, isLoading: isWellnessRatingsLoading } = useQuery<WellnessRatingResponse[], Error, Map<string, WellnessRatingResponse[]>>({
    queryKey: ['wellnessRatings'],
    queryFn: getWellnessRatings,
    staleTime: 1000 * 60 * 30,
    select: sortAndCategorizeRatings
  });

  const [dailyWellnessRatings, setDailyWellnessRatings] = useState<Map<string, WellnessRating[]>>();

  useEffect(() => {
    if (!wellnessRatings) {
      return;
    }

    const map = new Map();
    for (const [typologyID, wellnessRatingArr] of wellnessRatings) {
      // If array is empty (shouldn't ever be the case)
      if (wellnessRatingArr.length === 0) {
        return;
      }

      let i = 0;
      // Since we're sorted by most recent, we can keep looping from the front
      // to find all of the ratings from today
      while (i < wellnessRatingArr.length && isCreateDateToday(wellnessRatingArr[i].created)) {
        if (map.has(typologyID)) {
          map.get(typologyID).push(wellnessRatingArr[i]);
        } else {
          map.set(typologyID, [wellnessRatingArr[i]]);
        }
        i++;
      }
    }

    setDailyWellnessRatings(map);
  }, [wellnessRatings]);

  // Gets all wellness ratings within last x days
  const getWellnessRatingsWithinThreshold = (startDate: Date, endDate: Date = new Date()): Map<string, WellnessRatingResponse[]> => {
    if (!wellnessRatings) return new Map();
    const wellnessRatingsAsArray = 
      Array.from(wellnessRatings.values())
      .flat()
      .filter((rating) => isWithinDateRange(rating.created, startDate, endDate));

    const filteredWellnessRatings = sortAndCategorizeRatings(wellnessRatingsAsArray);

    return filteredWellnessRatings;
  }

  const isWithinDateRange = (created: string, startDate: Date, endDate: Date = new Date()) => {
    const createdDate = createdDateStringToDate(created);
    return createdDate >= startDate && createdDate <= endDate;
  }

  const submitWellnessRating = async (values: WellnessRating, typologyType: string, date: Date | null = null) => {
    const { typologyID, wellnessScore, wellnessDescription } = values;
    try {
      await addWellnessRating(
        typologyID,
        wellnessScore,
        wellnessDescription,
        date
      );
      onWellnessRatingAdded(typologyType);
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }

  const onWellnessRatingAdded = (typologyType: string) => {
    notifications.show({
      title: 'Success!',
      message: `Your ${typologyType} rating was logged successfully!`,
      color: 'red',
      icon: <IconCheck size={22} />
    });
    queryClient.invalidateQueries({ queryKey: ['wellnessRatings'] });
  };

  return {
    submitWellnessRating,
    wellnessRatings,
    isWellnessRatingsLoading,
    dailyWellnessRatings,
    getWellnessRatingsWithinThreshold
  };
}