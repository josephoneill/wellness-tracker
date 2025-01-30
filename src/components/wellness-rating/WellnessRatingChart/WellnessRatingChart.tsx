import { Card, ColorSwatch, Flex, Loader, Paper, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import styles from './WellnessRatingChart.module.scss';
import { useWellnessRatingChart } from './useWellnessRatingChart';
import { useEffect, useState } from 'react';
import { WellnessRatingResponse } from '../types';
import { DatePickerInput } from '@mantine/dates';
import React from 'react';

interface ChartTooltipProps {
  label: string;
  payload: Record<string, any>[] | undefined;
}

const ChartTooltip =({ label, payload }: ChartTooltipProps) => {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="xs" style={{minWidth: '10rem'}}>
      <Text fw={500} size="lg" mb={5}>
        {label}
      </Text>
      {payload.map((item: any) => (
        <>
        <Flex align="center" justify="space-between">
          <Flex gap="xs" align="center">
            <ColorSwatch
              color={item.color}
              size={16}
              withShadow={false}
              mt={1}
            />
            <Text key={item.name} size="sm" fw={400}>
              {item.name}
            </Text>
          </Flex>
            <Text size="sm">{item.value}</Text>
        </Flex>
        <Text size="xs" c="gray">{item.payload.map.get(item.name).wellnessDescription}</Text>
        </>
      ))}
    </Paper>
  );
}

type WellnessChartSettingsProps = {
  startDate: Date | null | undefined,
  setStartDate: React.Dispatch <React.SetStateAction<Date | null | undefined>>,
  endDate: Date | null | undefined,
  setEndDate: React.Dispatch <React.SetStateAction<Date | null | undefined>>,
}
const WellnessChartSettings = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: WellnessChartSettingsProps) => {
  return (
    <Flex gap="1rem">
      <DatePickerInput
        label="Start date"
        placeholder="Select date"
        value={startDate}
        onChange={setStartDate}
      />
      <DatePickerInput
        label="End date"
        placeholder="Select date"
        value={endDate}
        onChange={setEndDate}
      />
    </Flex>
  )
};

type Props = {
  startDate?: Date | null;
  endDate?: Date | null;
  showAll?: boolean;
  setShowAll?: React.Dispatch<React.SetStateAction<boolean>>,
  showSettings?: boolean;
  title?: string;
}

// useMemo to prevent unnecessary re-rendering of chart?
const WellnessRatingChart = ({
  startDate: initialStartDate,
  endDate: initialEndDate,
  showAll = false,
  setShowAll,
  showSettings = false,
  title = 'Last 7 Days',
}: Props) => {
  const { createGraphData } = useWellnessRatingChart();
  console.log("initial", initialStartDate, initialEndDate);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // If user provided the state for show all
  if (setShowAll) {
    if (!startDate && !endDate) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  }

  console.log('starting with', startDate, endDate);
  const wellnessRatingChartData = createGraphData(startDate, endDate, showAll);

  if (!wellnessRatingChartData) {
    return <Loader />
  }

  const { data, series } = wellnessRatingChartData;

  return (
    <Card
      className={styles['wellness-rating-chart-card']}
      padding='xs'
      radius='md'
      withBorder
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={500}>{title}</Text>
      </Card.Section>
      { showSettings ?
          <WellnessChartSettings
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        :
          null
      }
      <LineChart
        className={styles['wellness-rating-chart']}
        h={250}
        data={data}
        dataKey="date"
        series={series}
        withLegend
        curveType="linear"
        tickLine='x'
        connectNulls={false}
        yAxisProps={{
          ticks: [0,2,4,6,8,10],
          tickSize: 1,
          domain: [0,10],
          width: 20,
        }}
        tooltipProps={{
          content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
        }}
      />
    </Card>
  )
};

export default WellnessRatingChart;