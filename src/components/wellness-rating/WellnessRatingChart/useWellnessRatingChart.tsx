import { useCallback, useMemo } from "react";
import { useWellnessRating } from '@/components/wellness-rating/useWellnessRating.tsx';
import { createdDateStringToDate, formatToGraphDate, parseGraphDate } from "@/utils/dateUtils";
import { useTypologies } from "@/components/typology/useTypologies";
import { Typology } from "@/components/typology/types";
import { LineChartSeries } from "@mantine/charts";
import { WellnessRatingResponse } from "../types";

const SERIES_COLORS = [
  'red.6',
  'pink.6',
  'grape.6',
  'violet.6',
  'indigo.6',
  'blue.6',
  'cyan.6',
  'teal.6',
  'green.6',
  'lime.6',
  'yellow.6',
  'orange.6',
];

type GraphEntry = {
  [key: string]: number;
} & {
  ratingObj: WellnessRatingResponse;
}

const constructMantineGraphDataFromMap = (graphMap: Map<string, GraphEntry[]>) => {
  const graphData = [];
  for (const [date, graphEntries] of graphMap) {
    const map = new Map();
    let dateNode = {
      date,
      map
    };
    for (const graphEntry of graphEntries) {
      dateNode = {...dateNode, ...graphEntry};
      const title = Object.keys(graphEntry).filter(x => x !== 'ratingObj');
      if (title.length > 0) {
        map.set(title[0], graphEntry.ratingObj);
      }
    }
    graphData.push(dateNode);
  }

  return graphData.sort((a, b) => parseGraphDate(a.date) - parseGraphDate(b.date));
}

const constructMantineChartSeries = (typologies?: Typology[]): LineChartSeries[] => {
  const series: LineChartSeries[] = [];
  if (typologies) {
    typologies.forEach((typology, i) => {
      series.push({
        name: typology.typologyType,
        color: SERIES_COLORS[i % SERIES_COLORS.length],
      });
    });
  }

  return series;
}

export const useWellnessRatingChart = () => {
  const { wellnessRatings, getWellnessRatingsWithinThreshold } = useWellnessRating();
  const { typologies, getTypologyById } = useTypologies();

  const createGraphData = useCallback((startDate: Date | null = null, endDate: Date | null = null, showAll = false) => {
    if (!wellnessRatings) {
      return;
    }

    console.log('calculate data', startDate, endDate);

    let filteredWellnessRatings = wellnessRatings;
    const chartMap = new Map();
  
    // If not showing all, filter based on date ranges
    if (!showAll) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6);
    
      // If startDate isn't provided, use one week
      let fromDate = startDate ?? weekAgo;
      const toDate = endDate ?? new Date();

      filteredWellnessRatings = getWellnessRatingsWithinThreshold(fromDate, toDate);
    
      // Populate map with each date within range
      for (let date = new Date(fromDate); date <= toDate; date.setDate(date.getDate() + 1)) {
        chartMap.set(formatToGraphDate(date), []);
      }
  }

  for (const [_, typologyWellnessRatings] of filteredWellnessRatings) {
    for (const wellnessRating of typologyWellnessRatings) {
      const graphDate = formatToGraphDate(createdDateStringToDate(wellnessRating.created));
      const typology = getTypologyById(wellnessRating.typologyID);

      if (!typology) {
        console.log(`Cannot find typology: ${wellnessRating.typologyID}`);
        continue;
      }
  
      const wellnessGraphEntry = {
        [typology.typologyType]: wellnessRating.wellnessScore,
        ratingObj: wellnessRating,
      } as GraphEntry;
      if (chartMap.has(graphDate)) {
        chartMap.get(graphDate).push(wellnessGraphEntry);
      } else {
        chartMap.set(graphDate, [wellnessGraphEntry]);
      }
    }
  }
  
  return {
    data: constructMantineGraphDataFromMap(chartMap),
    series: constructMantineChartSeries(typologies),
  };
  }, [wellnessRatings, typologies]);

  const defaultWellnessRatingChartData = useMemo(
    () => createGraphData(),
    [wellnessRatings, typologies]
  );


  return {
    wellnessRatings,
    createGraphData,
    defaultWellnessRatingChartData
  };
}