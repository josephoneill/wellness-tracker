import { WellnessRatingResponse } from "../types";
import { Progress, Text } from "@mantine/core";
import { useMemo } from 'react';
import { formatToReadableDate } from '@/utils/dateUtils';

import styles from './WellnessRatingList.module.scss';


type Props = {
  items: WellnessRatingResponse[];
}

const WellnessRatingList = ({ items }: Props) => {
  // Is useMemo really necessary here?
  const list = useMemo(() => {
    return items.map((val) => (
      <div
        key={`wellness-item-${val.created}`}
        className={styles['list-item']}
      >
        <Text fw={500}>{formatToReadableDate(val.created)}</Text>
        <div className={styles['list-item__progress-container']}>
          <Progress
            className={styles['list-item__progress-bar']}
            color='wellnessRed' 
            value={val.wellnessScore * 10}
          />
          <Text>{val.wellnessScore}/10</Text>
        </div>
        <Text>{val.wellnessDescription}</Text>
      </div>
    ));
  }, [items]);

  return (
    <>
      {list}
    </>
  );
};

export default WellnessRatingList;