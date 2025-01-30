import { type TypologyID } from '@/components/typology/types';

export type WellnessRatingId = `WellnessRating#${string}`;

export type WellnessRating = {
  typologyID: TypologyID;
  wellnessScore: WellnessRatingScore;
  wellnessDescription: string;
  sk?: string;
};

export type WellnessRatingResponse = WellnessRating & DynamoReponse;

export type WellnessRatingScore = 0|1|2|3|4|5|6|7|8|9|10;