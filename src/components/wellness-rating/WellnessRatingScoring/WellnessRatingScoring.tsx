import { Flex, Slider, rem } from '@mantine/core';
import { IconHeart, IconHeartBroken } from '@tabler/icons-react';
import styles from './WellnessRatingScoring.module.css';
import { type WellnessRatingScore } from '@/components/wellness-rating/types';

type Props = {
  value: WellnessRatingScore,
  setValue: React.Dispatch<React.SetStateAction<WellnessRatingScore>>
}

export default function WellnessRating({ value, setValue }: Props) {
  const iconHeart = <IconHeart size="1rem" />;
  const iconBrokenHeart = <IconHeartBroken size="1rem"/>;

  return (
    <Flex>
      <Slider
        className={styles['wellness-scoring-slider']}
        thumbChildren={value > 5 ? iconBrokenHeart : iconHeart }
        color="red"
        marks={[
          { value: 0, label: '0' },
          { value: 5, label: '5' },
          { value: 10, label: '10' },
        ]}
        defaultValue={0}
        min={0}
        max={10}
        thumbSize={22}
        styles={{ thumb: { borderWidth: rem(2), padding: rem(1.5) } }}
        value={value}
        onChange={(value: number) => setValue(value as WellnessRatingScore)}
      />
    </Flex>
  );
}

